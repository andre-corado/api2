import base64
import boto3
import dotenv
import uuid
import os

# Configurar el nombre del bucket

# Crear un cliente S3
bucket_name = 'faunadexp1'
# Leer aws access key y secret key de dotenv
dotenv.load_dotenv()
aws_access_key_id = os.getenv('AWS_ACCESS_KEY_ID')
aws_secret_access_key = os.getenv('AWS_SECRET_ACCESS_KEY')
location = 'east-1'
s3 = boto3.client('s3', aws_access_key_id=aws_access_key_id, aws_secret_access_key=aws_secret_access_key)


def upload_file_to_s3(image_b64, filename, add_uuid=False):
    if add_uuid:
        filename += str(uuid.uuid4())
    filename += ".jpg"
    words = image_b64.split(",")
    if len(words) > 1:
        image_b64 = words[1]    
    image_b64 = image_b64.encode('utf-8')   

    #subir imagen a s3
    s3.put_object(Body=base64.b64decode(image_b64), Bucket=bucket_name, Key=filename)
    #get object url
    object_url = "https://%s.s3.amazonaws.com/%s" % (bucket_name, filename)
    print(object_url)
    return str(object_url)
