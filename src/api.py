# Import FastAPI 


from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from services.db import make_connection

from routes.user import userRouter
from routes.album import albumRouter
from routes.image import imageRouter


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Agregar rutas
app.include_router(userRouter)
app.include_router(albumRouter)
app.include_router(imageRouter)

# Ruta raíz "/
@app.get("/")
def root(): 
    msg = make_connection()
    return JSONResponse(
        content={"message": "Hello, you are in the root of the server made with FastAPI & Py!" ,
                 "developer" : "@andre-corado",
                 "database" : str(msg)},
        status_code=200
    )
  
# Iniciar servidor con uvicorn
if __name__ == '__main__':
    '''
    from database.r import get_user_data
    from database.d import delete_user
    print(get_user_data('andre-corado'))       
    print(get_user_data('andre-corado'))
    '''
    uvicorn.run(app='api:app', reload=True, port=3000, host='0.0.0.0') 
    

