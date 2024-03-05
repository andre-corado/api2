from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from models.album import Album
from controllers.album import is_valid_album
from database.c import create_album
from database.r import get_albums, get_album_data, get_past_photos
from database.u import update_album_data
from database.d import delete_album_data

albumRouter = APIRouter(prefix="/albums")

@albumRouter.put('/newAlbum')
# Put | /albums/newAlbum | crea un nuevo album
async def new_album(request: Request):
    try:
        res = await request.json()
        if not is_valid_album(res):
            raise Exception("Datos de album incorrectos.")
        e = create_album(Album(res.get("id"), res.get("title"), res.get("idUser")))
        if isinstance(e, Exception):
            raise Exception(e)
        return JSONResponse(
            status_code=200,
            content={"status": 201, "message": "Album creado exitosamente."}
        )
    except Exception as e:
        return JSONResponse(
            status_code=400,
            content={"status": 400, "message": str(e)}
        )
        

@albumRouter.post('/getAllAlbums')
# Post | /albums/getAllAlbums | devuelve todos los albums
async def get_all_albums(request: Request):
    try:
        res = await request.json()
        if not res.get("idUser"):
            raise Exception("Datos de album incorrectos.")
        e = get_albums(res.get("idUser"))
        if not isinstance(e, list):
            raise Exception(e)
        return JSONResponse(
            status_code=200,
            content={"status": 200, "message": "Albums obtenidos exitosamente.", "albumData": e}
        )

    except Exception as e:
        return JSONResponse(
            status_code=400,
            content={"status": 400, "message": str(e)}
        )
    
@albumRouter.get('/getAlbum/{id}')
# Get | /albums/getAlbum | devuelve un album por id
async def get_album(request: Request, id: str):
    try:
        try:
            id = int(id)
        except:
            raise Exception("Id inválido, tipo str.")
        alb = get_album_data(id)
        if not isinstance(alb, Album):
            raise Exception(alb)
        if alb.id == None:
            raise Exception("Album no encontrado.")
        return JSONResponse(
            status_code=200,
            content={"status": 200, "message": "Album obtenido exitosamente.", "albumData": alb.to_dict()}
        )
            
    
    except Exception as e:
        
        return JSONResponse(
            status_code=400,
            content={"status": 400, "message": str(e)}
        )

@albumRouter.post('/updateAlbum')
# Post | /albums/updateAlbum | actualiza un album por id
async def update_album(request: Request):
    try:
        res = await request.json()
        if not is_valid_album(res):
            raise Exception("Datos de album incorrectos.")
        e = update_album_data(Album(res.get("id"), res.get("title"), res.get("idUser")))
        if isinstance(e, Exception):
            raise Exception(e)
        return JSONResponse(
            status_code=200,
            content={"status": 200, "message": "Album actualizado exitosamente."}
        )
    except Exception as e:
        return JSONResponse(
            status_code=400,
            content={"status": 400, "message": str(e)}
        )
    

@albumRouter.delete('/deleteAlbum')
# Delete | /albums/deleteAlbum | elimina un album por id
async def delete_album(request:Request):
    try:
        res = await request.json()
        album= get_album_data(res.get("id"))
        if isinstance(album, Exception):
            raise Exception(album)
        if album.id == None:
            raise Exception("Album no encontrado.")
        e = delete_album_data(album.id)
        return JSONResponse(
            status_code=200,
            content={"status": 200, "message": "Album eliminado exitosamente."}
        )
    except Exception as e:
        return JSONResponse(
            status_code=400,
            content={"status": 400, "message": str(e)}
        )
    

@albumRouter.post('/getAllFotosPasadas')
# Post | /albums/getAllFotosPasadas | devuelve todas las fotos pasadas
async def get_all_fotos_pasadas(request: Request):
    try:
        res = await request.json()
        if not res.get("idUser"):
            raise Exception("Datos de album incorrectos.")
        fotos = get_past_photos(res.get("idUser"))
        if not isinstance(fotos, list):
            raise Exception(fotos)
        return JSONResponse(
            status_code=200,
            content={"status": 200, "message": "Fotos pasadas obtenidas exitosamente.", "albumData": fotos}
        )
    except Exception as e:
        return JSONResponse(
            status_code=400,
            content={"status": 400, "message": str(e)}
        )

