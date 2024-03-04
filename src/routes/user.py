from fastapi import Request, APIRouter
from fastapi.responses import JSONResponse
from models.user import User
from controllers.user import is_valid_user
from database.c import create_user
from utils.md5 import encrypt

userRouter = APIRouter(prefix="/users")


@userRouter.post(path='/newUser')
# Post | /users/newUser | crea un nuevo usuario
async def new_user(request: Request):
    return JSONResponse(
        status_code=200,
        content={"message": "Usuario creado exitosamente."}
    )
    try:
        data = await request.json()
        # Tratar de crear el usuario en tabla de RDS 
        if is_valid_user(data) != True:
            return is_valid_user(data)        
        else:
            user = User(
                username=data.get('username'),
                password=encrypt(data.get('password')),
                mail=data.get('mail'),
                fullname=data.get('fullname'),
                imageB64=data.get('imageB64')
            )
            if not create_user(user):
                raise Exception("Error al crear el usuario.")       
                
        # Si no hay errores
        return JSONResponse(
            status_code=201,
            content={"message": "Usuario creado exitosamente.",
                     "username": data.get('username'),
                     "mail": data.get('mail'),
                     "fullname": data.get('fullname'),
                     "imageB64": data.get('imageB64')}
        )       
    
    except Exception as e:  
        return JSONResponse(
            status_code=400,
            content={"error": str(e)}
        )
        



@userRouter.post('/login')
# Post | /users/login | devuelve toda la información del usuario que se loguea
async def login_user():
    return JSONResponse(
        status_code=200,
        content={"message": "Usuario logueado exitosamente."}
    )


@userRouter.put('/update')
# Put | /users/update | actualiza la información del usuario
async def update_user():
    return JSONResponse(
        status_code=200,
        content={"message": "Usuario actualizado exitosamente."}
    )