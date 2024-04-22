def is_valid_image(data):
    if not data.get("idAlbum") or not data.get("nombreFoto") or not data.get("imagenBase64"):
        return False
    if not isinstance(data.get("idAlbum"), int) or not isinstance(data.get("nombreFoto"), str) or not isinstance(data.get("imagenBase64"), str):
        return False
    if data.get("idAlbum") < 0 or len(data.get("nombreFoto")) < 1 or len(data.get("imagenBase64")) < 1:
        return False
    return True