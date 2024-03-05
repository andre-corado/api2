import mysql.connector as rds
from dotenv import load_dotenv 
import os


# Load the .env file
load_dotenv()
database=os.getenv("DB_NAME")
        
# Get the value of a variable
def make_connection():
    try:
        return rds.connect(
            host="practica1.crwuii88a698.us-east-1.rds.amazonaws.com",
            user="as",
            password="dbpasspractica1",
            database="database"
        )
    except Exception as e:        
        return e

