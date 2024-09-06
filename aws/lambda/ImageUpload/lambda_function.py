import json
import base64
import jwt

def lambda_handler(event, context):
    try:
        # Extract the JWT token from the Authorization header
        token = event['headers'].get('Authorization', '').replace('Bearer ', '')

        if not token:
            return {
                'statusCode': 401,
                'body': json.dumps({'message': 'Authorization token is missing'})
            }

        # Decode the JWT token without verifying the signature
        decoded_token = jwt.decode(token, options={"verify_signature": False})

        # Extract the 'sub' field (user ID)
        user_id = decoded_token.get('sub')

        if not user_id:
            return {
                'statusCode': 400,
                'body': json.dumps({'message': 'User ID not found in token'})
            }

        # Parse the JSON body from the request
        body = json.loads(event['body'])
        
        # Extract and process the base64-encoded image
        image_base64 = body.get('image')

        if not image_base64:
            return {
                'statusCode': 400,
                'body': json.dumps({'message': 'Image is missing'})
            }

        # Decode the base64 image (remove data:image/jpeg;base64, if necessary)
        image_data = base64.b64decode(image_base64.split(",")[1])

        # Now you can process the image_data (save it, analyze it, etc.)
        # For simplicity, we'll just return the user_id and a success message.

        return {
            'statusCode': 200,
            'body': json.dumps({
                'message': 'Image processed successfully',
                'user_id': user_id
            })
        }

    except jwt.DecodeError as e:
        return {
            'statusCode': 403,
            'body': json.dumps({'message': 'Invalid token', 'error': str(e)})
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'message': 'Internal server error', 'error': str(e)})
        }
