import json
import boto3

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('ImageCategorizerImages')

headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Access-Control-Allow-Methods": "OPTIONS,PUT"
}

def lambda_handler(event, context):
    try:
        user_id = event['pathParameters']['userId']
        image_id = event['pathParameters']['imageId']
        combined_key = f"{user_id}/{image_id}"
        
        body = json.loads(event['body'])
        correct = body.get('correct')
        
        response = table.update_item(
            Key={
                'CognitoUserId': user_id,
                'S3Url': combined_key
            },
            UpdateExpression="SET Correct = :val",
            ExpressionAttributeValues={
                ':val': correct
            },
            ReturnValues="UPDATED_NEW"
        )
        
        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({
                'message': 'Item updated successfully',
                'updatedAttributes': response['Attributes']
            })
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps(f'Error: {str(e)}')
        }