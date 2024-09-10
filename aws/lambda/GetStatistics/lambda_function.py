import json
import boto3
from boto3.dynamodb.conditions import Key

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('ImageCategorizerImages')

headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Access-Control-Allow-Methods": "OPTIONS,GET"
}

def get_statistics_for_user(user_id):
    response = table.query(
        KeyConditionExpression=Key('CognitoUserId').eq(user_id)
    )
    
    correct_count = 0
    incorrect_count = 0
    
    for item in response['Items']:
        if 'Correct' in item:
            if item['Correct']:
                correct_count += 1
            else:
                incorrect_count += 1

    return {
        'correct': correct_count,
        'incorrect': incorrect_count
    }

def get_overall_statistics():
    response = table.scan()
    
    correct_count = 0
    incorrect_count = 0
    
    for item in response['Items']:
        if 'Correct' in item:
            if item['Correct']:
                correct_count += 1
            else:
                incorrect_count += 1

    return {
        'correct': correct_count,
        'incorrect': incorrect_count
    }

def lambda_handler(event, context):
    user_id = event['pathParameters']['userId']
    
    user_stats = get_statistics_for_user(user_id)
    overall_stats = get_overall_statistics()
    result = {
        'overall': overall_stats,
        'user': user_stats
    }
    
    return {
        'statusCode': 200,
        'headers': headers,
        'body': json.dumps(result)
    }
