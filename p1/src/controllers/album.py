def is_valid_album(data):
    if data.get("title") == "" or data.get("idUser") == 0:
        return False        
    return True