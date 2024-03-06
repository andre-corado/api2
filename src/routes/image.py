from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from controllers.image import is_valid_image
from database.c import save_image
from models.image import Image
from services.s3 import upload_file_to_s3

imageRouter = APIRouter(prefix="/images")

@imageRouter.put('/newImage')
# Put | /images/newImage | crea una nueva imagen
async def new_image(request: Request):
    try:
        res = await request.json()
        if not is_valid_image(res):
            raise Exception("Datos de imagen incorrectos.")
        
        img = Image(
            id = 0,
            album_id= res.get("idAlbum"),
            name = res.get("nombreFoto"),
            imageB64= res.get("imagenBase64"),
            s3Url=''
        )

        # Guarda en s3
        s3Url = upload_file_to_s3(img.imageB64, "Fotos_Publicadas/"+img.name, False)        
        img.s3Url = s3Url
        i = save_image(img)  
        if isinstance(i, Exception):
            raise Exception(e)
        return JSONResponse(
            status_code=200,
            content={"status": 201, "message": "Imagen creada exitosamente."}
        )
    except Exception as e:
        print(e)
        return e
    
