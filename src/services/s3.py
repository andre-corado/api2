import base64
import boto3
import dotenv
import uuid

# Configurar el nombre del bucket

# Crear un cliente S3
bucket_name = 'faunadexp1'
# Leer aws access key y secret key de dotenv
dotenv.load_dotenv()
print(dotenv.dotenv_values())
aws_access_key_id = dotenv.get_key('./.env', 'AWS_ACCESS_KEY_ID')
aws_secret_access_key = dotenv.get_key('./.env', 'AWS_SECRET_ACCESS_KEY')
print(aws_secret_access_key)

print(aws_access_key_id)

location = 'east-1'
s3 = boto3.client('s3', aws_access_key_id=aws_access_key_id, aws_secret_access_key=aws_secret_access_key)



def upload_file_to_s3(image_b64, filename, uuid):
    if uuid:
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

    return str(object_url)
