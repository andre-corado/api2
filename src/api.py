# Import FastAPI 


from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from routes.login import login as login_router

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Agregar rutas
app.include_router(login_router)

# Ruta raíz "/
@app.get("/")
def root(): 
    return JSONResponse(
        content={"message": "Hello, you are in the root of the server made with FastAPI & Py!",
                 "developer" : "@andre-corado"},
        status_code=200
    )
  
# Iniciar servidor con uvicorn
if __name__ == '__main__':
    from database.r import get_user_data
    from database.d import delete_user
    print(get_user_data('andre-corado'))
    uvicorn.run(app='api:app', reload=True)    
    print(get_user_data('andre-corado'))

