import mysql.connector as rds

database = "Practica1"


# Get the value of a variable
def make_connection():
    try:
        return rds.connect(
            host="practica1.crwuii88a698.us-east-1.rds.amazonaws.com",
            user="admin",
            password="dbpasspractica1",
            database="Practica1"
        )
    except Exception as e:        
        return e

