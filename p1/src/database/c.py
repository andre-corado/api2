from services.db import make_connection, database
from models.user import User
from models.album import Album
from models.image import Image

def create_user(user : User):
    try:
        connection = make_connection()
        if isinstance(connection, Exception):
            raise Exception("Error al conectar a la base de datos.")
        cursor = connection.cursor()
        cursor.execute(f"INSERT INTO {database}.Usuarios (Nickname, NombreCompleto, Correo, Password, FotoActualUbiBucket) VALUES ('{user.username}', '{user.fullname}', '{user.mail}', '{user.password}', '{user.s3Url}')")
        connection.commit()
        cursor.close()
        connection.close()
        print("User created.")
        return 
    except Exception as e:
        print(TypeError(e))
        return e
    
def saveProfilePic(user : User):
    try:
        connection = make_connection()
        if isinstance(connection, Exception):
            raise Exception("Error al conectar a la base de datos.")
        cursor = connection.cursor()
        cursor.execute("INSERT INTO {}.FotosPasadasPerfil (UbicacionBucket, Usuarios_UniqueID) VALUES ('{}', '{}')".format(database, user.s3Url, user.id))
        connection.commit()
        cursor.close()
        connection.close()
        print("Profile picture saved.")
    except Exception as e:
        return e
    
def create_album(album : Album):
    try:
        connection = make_connection()
        if isinstance(connection, Exception):
            raise Exception("Error al conectar a la base de datos.")
        cursor = connection.cursor()
        cursor.execute(f"INSERT INTO {database}.Album (Nombre, Usuario_UniqueID) VALUES ('{album.title}', '{album.user_id}')")
        connection.commit()
        cursor.close()
        connection.close()
        print("Album created.")
        return 
    except Exception as e:
        print(e)
        return e
    
def save_image(image:Image):
    try:
        connection = make_connection()
        cursor = connection.cursor()
        if isinstance(connection, Exception):
            raise Exception("Error al conectar a la base de datos.")
        cursor.execute(f"INSERT INTO {database}.Foto (UbicacionBucket, Album_UniqueID, Nombre) VALUES ('{image.s3Url}', '{image.album_id}', '{image.name}')")
        cursor.execute(f"SELECT * FROM {database}.Foto WHERE UbicacionBucket = '{image.s3Url}'")
        res = cursor.fetchall()
        image.id = res[0][0]
        connection.commit()
        cursor.close()
        connection.close()
        print("Image saved.")
        return image
    except Exception as e:
        print(e)
        return e
    
def get_images(album_id):
    try:
        connection = make_connection()
        if isinstance(connection, Exception):
            raise Exception("Error al conectar a la base de datos.")
        cursor = connection.cursor()
        cursor.execute(f"SELECT UbicationBucket from {database}.Foto WHERE Album_UniqueID = '{album_id}'")
        res = cursor.fetchall()
        images = []
        for image in res:
            images.append(Image(image[0], image[1], image[2], image[3]))
        cursor.close()
        connection.close()
        return images
    except Exception as e:
        print(e)
        return e
    
