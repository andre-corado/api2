from fastapi import APIRouter
from fastapi.responses import JSONResponse
from models.album import Album

albumRouter = APIRouter(prefix="/albums")

@albumRouter.put('/newAlbum')
# Put | /albums/newAlbum | crea un nuevo album
async def new_album():
    return JSONResponse(
        status_code=200,
        content={"message": "Album creado exitosamente."}
    )

@albumRouter.post('/getAllAlbums')
# Post | /albums/getAllAlbums | devuelve todos los albums
async def get_all_albums():
    return JSONResponse(
        status_code=200,
        content={"message": "Albums obtenidos exitosamente."}
    )

@albumRouter.get('/getAlbum')
# Get | /albums/getAlbum | devuelve un album por id
async def get_album():
    return JSONResponse(
        status_code=200,
        content={"message": "Album obtenido exitosamente."}
    )

@albumRouter.post('/updateAlbum')
# Post | /albums/updateAlbum | actualiza un album por id
async def update_album():
    return JSONResponse(
        status_code=200,
        content={"message": "Album actualizado exitosamente."}
    )

@albumRouter.delete('/deleteAlbum')
# Delete | /albums/deleteAlbum | elimina un album por id
async def delete_album():
    return JSONResponse(
        status_code=200,
        content={"message": "Album eliminado exitosamente."}
    )

@albumRouter.post('/getAllFotosPasadas')
# Post | /albums/getAllFotosPasadas | devuelve todas las fotos pasadas
async def get_all_fotos_pasadas():
    return JSONResponse(
        status_code=200,
        content={"message": "Fotos pasadas obtenidas exitosamente."}
    )

