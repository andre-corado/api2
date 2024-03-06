import base64
import boto3

# Configurar el nombre del bucket

# Crear un cliente S3
bucket_name = 'faunadexp1'
aws_access_key_id = 'AKIAVRUVRXKCQWV4TE5C'
aws_secret_access_key = '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'
location = 'east-1'
s3 = boto3.client('s3', aws_access_key_id=aws_access_key_id, aws_secret_access_key=aws_secret_access_key)



def upload_file_to_s3(image_b64, filename):
    filename += ".jpg"
    words = image_b64.split(",")
    if len(words) > 1:
        image_b64 = words[1]    
    image_b64 = image_b64.encode('utf-8')   

    #subir imagen a s3
    s3.put_object(Body=base64.b64decode(image_b64), Bucket=bucket_name, Key=filename)
    #get object url
    object_url = "https://%s.s3.amazonaws.com/%s" % (bucket_name, filename)

    return object_url
