import json
import boto3
from botocore.exceptions import ClientError

# Initialize DynamoDB
dynamodb = boto3.resource('dynamodb')

def lambda_handler(event, context):
    # Get the DynamoDB table
    table = dynamodb.Table('ImageCategorizerUsers')

    # Extract user details from the Cognito event
    user_id = event['request']['userAttributes']['sub']  # Cognito User ID (UUID)
    email = event['request']['userAttributes']['email']   # Email from the sign-up process
    

    # Create item to store in DynamoDB
    item = {
        'CognitoUserId': user_id,    # Partition key
        'email': email,
        'createdAt': event['request']['userAttributes']['email_verified'],
    }

    try:
        # Write to DynamoDB
        table.put_item(Item=item)
        print(f"User {user_id} successfully written to DynamoDB")
    except ClientError as e:
        print(f"Error saving user to DynamoDB: {e.response['Error']['Message']}")
        raise

    # Return event back to Cognito
    return event