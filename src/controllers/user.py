from fastapi.responses import JSONResponse
from database.r import get_user_data


def is_valid_user(data):
    # Validar que los campos no estén vacíos
    if len(data.get('username')) == 0 or len(data.get('password')) == 0 or len(data.get('mail')) == 0 or len(data.get('fullname')) == 0 or len(data.get('imageB64')) == 0:
        return JSONResponse(
            status_code=400,
            content={"error": "Faltan campos en el request."}
        )

    if get_user_data(data.get('username')) != None:
        return JSONResponse(
            status_code=400,
            content={"error": "El usuario ya existe."}
        )
    return True