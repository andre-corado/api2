from services.db import make_connection, database

def delete_user_data(username):
    try:
        connection = make_connection()
        if isinstance(connection, Exception):
            raise Exception("Error al conectar a la base de datos.")
        cursor = connection.cursor()
        cursor.execute("DELETE FROM {}.Usuarios WHERE Nickname = '{}'".format(database, username))
        connection.commit()
        if cursor.rowcount == 0:
            raise Exception("No se encontró el usuario.")
        cursor.close()
        connection.close()        
        return True
    except Exception as e:
        print(e)
        return e
    
def delete_album_data(album_id):
    try:
        connection = make_connection()
        if isinstance(connection, Exception):
            raise Exception("Error al conectar a la base de datos.")
        cursor = connection.cursor()
        cursor.execute(f"DELETE FROM {database}.Foto WHERE Album_UniqueID = {album_id}")
        cursor.execute(f"DELETE FROM {database}.Album WHERE UniqueID = {album_id}")
        connection.commit()
        cursor.close()
        connection.close()        
        return True
    except Exception as e:
        print(e)
        return e