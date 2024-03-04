import base64
import boto3
import os
import uuid

# Configurar las credenciales de AWS
os.environ['AWS_ACCESS_KEY_ID'] = 'TU_ACCESS_KEY_ID'
os.environ['AWS_SECRET_ACCESS_KEY'] = 'TU_SECRET_ACCESS_KEY'
os.environ['AWS_DEFAULT_REGION'] = 'us-east-1'

# Crear un cliente S3
s3_client = boto3.client('s3')

def upload_to_s3(image_b64, key, use_uuid):
    key_final = f"{key}.jpg"
    if use_uuid:
        key_final = f"{key}{uuid.uuid4()}.jpg"

    # Convertir base64 a bytes
    image_bytes = base64.b64decode(image_b64.split(',')[1])

    # Subir el objeto a S3
    try:
        s3_client.put_object(
            Bucket=os.environ['BUCKET_NAME'],
            Key=key_final,
            Body=image_bytes,
            ContentType='image/jpeg'
        )
        key_final = f"https://faunadexp1.s3.amazonaws.com/{key_final}"
        return key_final
    except Exception as e:
        print("Error al subir el archivo:", e)
        raise e

# Ejemplo de uso:
# result = upload_file_to_s3("base64_de_la_imagen", "nombre_del_archivo", True)
# print(result)
