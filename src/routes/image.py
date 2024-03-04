from fastapi import APIRouter
from fastapi.responses import JSONResponse

imageRouter = APIRouter(prefix="/images")

@imageRouter.put('/newImage')
# Put | /images/newImage | crea una nueva imagen
async def new_image():
    return JSONResponse(
        status_code=200,
        content={"message": "Imagen creada exitosamente."}
    )
