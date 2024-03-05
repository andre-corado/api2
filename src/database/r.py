from services.db import make_connection, database
from models.user import User
from typing import List
from models.album import Album
from models.image import Image

# Returns None if the user is not found
def get_user_data(username):
    try:                
        connection = make_connection()              
        if isinstance(connection, Exception):
            raise Exception("Error al conectar a la base de datos.")
        cursor = connection.cursor()
        cursor.execute("SELECT * FROM {}.Usuarios WHERE Nickname = '{}'".format(database, username))
        users = cursor.fetchall()
        user = User()
        for u in users:
            user.id = u[0]  # UniqueID
            user.username = u[1]  # Nickname
            user.fullname = u[2]  # NombreCompleto
            user.mail = u[3]  # Correo
            user.password = u[4]  # Password
            user.s3Url = u[5]  # FotoActualUbiBucket
            user.imageB64 = ''
            user.newUsername = None
            break                
        cursor.close()
        connection.close()
        if user.id == None :            
            return None
        return user
    except Exception as e:
        print(e)
        return e
    

def get_albums(user_id):
    try:
        connection = make_connection()
        if isinstance(connection, Exception):
            raise Exception("Error al conectar a la base de datos.")
        cursor = connection.cursor()
        cursor.execute(f"SELECT * FROM {database}.Album WHERE Usuario_UniqueID = '{user_id}'")
        res = cursor.fetchall()
        albums = []
        for album in res:
            albums.append(
                {
                    "id": album[0],
                    "title": album[1],
                    "user_id": album[2]
                }
            )
        cursor.close()
        connection.close()
        return albums
    except Exception as e:
        print(e)        
        return e
    
def get_album_data(album_id):
    try:
        connection = make_connection()
        if isinstance(connection, Exception):
            raise Exception("Error al conectar a la base de datos.")
        cursor = connection.cursor()
        cursor.execute(f"SELECT * FROM {database}.Album WHERE UniqueID = '{album_id}'")
        res = cursor.fetchall()
        album = Album()
        for a in res:
            album.id = a[0]
            album.title = a[1]
            album.user_id = a[2]
            break
        cursor.close()
        connection.close()
        if album.id == None:
            return album
        images = get_images(album.id)
        album.images = images
        return album
    except Exception as e:
        print(e)
        return e
    
def get_images(album_id):
    try:
        connection = make_connection()
        if isinstance(connection, Exception):
            raise Exception("Error al conectar a la base de datos.")
        cursor = connection.cursor()
        cursor.execute(f"SELECT UbicacionBucket from {database}.Foto WHERE Album_UniqueID = '{album_id}'")
        res = cursor.fetchall()
        images = []
        for image in res:
            images.append({
                "original": image,
                "thumbnail": image
            })
        cursor.close()
        connection.close()
        return images
    except Exception as e:
        print(e)
        return e
    

def get_past_photos(user_id):
    try:
        connection = make_connection()
        if isinstance(connection, Exception):
            raise Exception("Error al conectar a la base de datos.")
        cursor = connection.cursor()
        cursor.execute(f"SELECT UbicacionBucket from {database}.FotosPasadasPerfil WHERE Usuarios_UniqueID = '{user_id}'")
        res = cursor.fetchall()
        images = []
        for image in res:
            images.push({
                "original": image,
                "thumbnail": image
            })
        cursor.close()
        connection.close()
        return images
    except Exception as e:
        print(e)
        return e