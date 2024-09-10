import boto3
from botocore.exceptions import ClientError
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import json

def get_secret():
    secret_name = "GMAIL_PASSWORD"
    region_name = "us-east-1"

    session = boto3.session.Session()
    client = session.client(
        service_name='secretsmanager',
        region_name=region_name
    )

    try:
        get_secret_value_response = client.get_secret_value(
            SecretId=secret_name
        )
    except ClientError as e:
        raise e
    
    return json.loads(get_secret_value_response['SecretString'])['GMAIL_PASSWORD']

# Gmail SMTP setup
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
GMAIL_USER = "livio.testsmtp@gmail.com" 
GMAIL_PASSWORD = get_secret() 

def send_email(to_email, subject, body):
    msg = MIMEMultipart()
    msg['From'] = GMAIL_USER
    msg['To'] = to_email
    msg['Subject'] = subject
    
    msg.attach(MIMEText(body, 'plain'))
    
    server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
    server.starttls()
    
    print(GMAIL_PASSWORD, GMAIL_USER)
    server.login(GMAIL_USER, GMAIL_PASSWORD)
    
    server.sendmail(GMAIL_USER, to_email, msg.as_string())
    server.quit()

def lambda_handler(event, context):
    dynamodb = boto3.client('dynamodb')
    lambda_client = boto3.client('lambda')
    
    response = dynamodb.scan(TableName='ImageCategorizerUsers')
    users = response['Items']
    
    for user in users:
        user_id = user['CognitoUserId']['S']
        email = user['email']['S']
        
        payload = {
            "pathParameters": {
                "userId": user_id
            }
        }
        
        stats_response = lambda_client.invoke(
            FunctionName='ImageCategorizer_GetStatistics',
            InvocationType='RequestResponse',
            Payload=json.dumps(payload)
        )
        
        stats = json.loads(stats_response['Payload'].read())

        if 'body' in stats:
            stats_body = json.loads(stats['body'])
            if 'overall' in stats_body and 'user' in stats_body:
                overall = stats_body['overall']
                user_specific = stats_body['user']
                
                subject = "Your Daily Statistics"
                body = (
                    f"Hello,\n\n"
                    f"Here are your daily statistics:\n\n"
                    f"Overall Performance:\n"
                    f"  - Correct: {overall['correct']}\n"
                    f"  - Incorrect: {overall['incorrect']}\n\n"
                    f"Your Performance:\n"
                    f"  - Correct: {user_specific['correct']}\n"
                    f"  - Incorrect: {user_specific['incorrect']}\n\n"
                    f"Thank you for using our service!\n"
                )
                
                send_email(email, subject, body)
            else:
                print(f"KeyError: 'overall' or 'user' key not found in stats body for user {user_id}")
        else:
            print(f"KeyError: 'body' key not found in stats response for user {user_id}")
    
    return {
        'statusCode': 200,
        'body': json.dumps('Emails sent!')
    }
