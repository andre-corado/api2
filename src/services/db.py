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
            host=os.getenv("DB_HOST"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
            database=database
        )
    except Exception as e:        
        return e
