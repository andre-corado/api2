from fastapi import Request, APIRouter
from fastapi.responses import JSONResponse
from models.user import User
from controllers.user import is_valid_user, is_valid_logindata, is_valid_updatedata
from database.c import create_user, saveProfilePic
from database.r import get_user_data
from database.u import save_updates_user
from utils.md5 import encrypt
from services.s3 import upload_file_to_s3

userRouter = APIRouter(prefix="/users")


@userRouter.put(path='/newUser')
# Post | /users/newUser | crea un nuevo usuario
async def new_user(request: Request):    
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
            url = upload_file_to_s3(user.imageB64, "Fotos_Perfil/")
            user.imageB64 = url
            e = create_user(user)
            if e is not None:
                raise Exception(e)     
            userData = get_user_data(user.username)
            if userData.id == 0:
                raise Exception("Correo o nombre de usuario ya existen.")
            saveProfilePic(userData)

            # Si no hay errores
            return JSONResponse(
                status_code=201,
                content={ "status": 201,
                        "message": "Usuario creado exitosamente.",
                        "username": data.get('username'),
                        "mail": data.get('mail'),
                        "fullname": data.get('fullname'),
                        "imageB64": data.get('imageB64')}
            )       
    
    except Exception as e:  
        return JSONResponse(
            status_code=400,
            content={"status": 400, "message": str(e)}
        )
        

@userRouter.post('/login')
# Post | /users/login | devuelve toda la información del usuario que se loguea
async def login_user(request: Request):
    try:
        res = await request.json()
        username = res.get('username')
        password = res.get('password')
        if not is_valid_logindata(username, password):
            raise Exception("Datos de login incorrectos.")
        user = get_user_data(username)
        if user is None:
            raise Exception("Usuario no encontrado.")
        if user.password != encrypt(password):
            raise Exception("Contraseña incorrecta.")
        user.password = None ## No devolver la contraseña
        return JSONResponse(
            status_code=200,
            content={
                "status": 200,
                "message": "Usuario logueado exitosamente.",
                "userData": user.toDict()}
        )
        
    except Exception as e:
        return JSONResponse(
            status_code=401,
            content={"status": "401", "message": str(e)}
        )


@userRouter.post('/update')
# Put | /users/update | actualiza la información del usuario
async def update_user(request: Request):
    try:
        data = await request.json()
        user = User(
            username=data.get('username'),
            fullname=data.get('fullname'),
            password=data.get('password'),
            mail=data.get('mail'),
            imageB64=data.get('imageB64'),
            newUsername=data.get('newUsername'),
        )
        userDB = get_user_data(user.username)
        if userDB is None:
            raise Exception("Usuario no encontrado.")
        if is_valid_updatedata(data) != True:
            raise is_valid_updatedata(data)
        if user.newUsername != user.username:
            if get_user_data(data.get('newUsername')) != None:
                return Exception("El nuevo nombre de usuario ya existe.")
        
        if encrypt(user.password) != userDB.password:
            raise Exception("Contraseña incorrecta.")

        user.id = userDB.id
        if (user.imageB64):
            user.s3Url = userDB.s3Url
            
        if save_updates_user(user):
            raise Exception("Error al actualizar el usuario.")
        return JSONResponse(
            status_code=200,
            content={"status": 201, "message": "Usuario actualizado exitosamente."}
        )
    except Exception as e:
        return JSONResponse(
            status_code=400,
            content={"status": 400, "message": str(e)}
        )