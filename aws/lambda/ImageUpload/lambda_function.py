import base64
import boto3
import json
import uuid

s3_client = boto3.client('s3')

BUCKET_NAME = 'image-categorizer-images'

headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Access-Control-Allow-Methods": "OPTIONS,POST"
}

def lambda_handler(event, context):
    body = json.loads(event['body'])
    user_id = body.get('user')
    base64_image = body.get('image')

    if not user_id or not base64_image:
        return {
            'statusCode': 400,
            'headers': headers,
            'body': json.dumps('Missing user ID or image data.')
        }

    # Decode the base64 image
    try:
        image_data = base64.b64decode(base64_image.split(",")[1])
    except base64.binascii.Error:
        return {
            'statusCode': 400,
            'headers': headers,
            'body': json.dumps('Invalid base64 image format.')
        }

    # Generate a unique file name using user ID and UUID
    file_name = f'{user_id}/{str(uuid.uuid4())}.png'

    try:
        # Upload the image to S3
        s3_client.put_object(
            Bucket=BUCKET_NAME,
            Key=file_name,
            Body=image_data,
            ContentType='image/png'  # Adjust the content type if necessary
        )

        return {
            'statusCode': 200,
            'headers': headers,
            'body': json.dumps({
                'message': 'Image uploaded successfully!',
                's3Key': file_name  # You can return the S3 key for further reference
            })
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps(f'Error uploading image to S3: {str(e)}')
        }