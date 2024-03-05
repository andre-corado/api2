from services.db import make_connection, database
from models.user import User
from models.album import Album

def save_updates_user(user:User):
    try:
        connection = make_connection()
        if isinstance(connection, Exception):
            raise Exception("Error al conectar a la base de datos.")
        cursor = connection.cursor()
        script = f"UPDATE {database}.Usuarios SET Nickname = '{user.username}', Correo = '{user.mail}', NombreCompleto = '{user.fullname}', ImagenBase64 = '{user.imageB64}' WHERE UniqueID = '{user.id}'"
        if user.imageB64:
            script += f", FotoActualUbiBucket = '{user.s3Url}'"
        if user.newUsername != user.username:
            script += f", Nickname = '{user.newUsername}'"
        script += f" WHERE UniqueID= '{user.id}'"
        connection.commit()
        cursor.close()
        connection.close()
        print("User created.")
        return 
    except Exception as e:
        print(e)
        return e
    
def update_album_data(album:Album):
    try:
        connection = make_connection()
        if isinstance(connection, Exception):
            raise Exception("Error al conectar a la base de datos.")
        cursor = connection.cursor()
        cursor.execute(f"UPDATE {database}.Album SET Nombre = '{album.title}' WHERE UniqueID = '{album.id}'")
        connection.commit()
        cursor.close()
        connection.close()
        print("Album updated.")
        return 
    except Exception as e:
        print(e)
        return e