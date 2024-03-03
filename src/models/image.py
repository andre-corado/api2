class Image():
    def __init__(self, id=None, s3Url=None, album_id=None, username=None, imageB64=None):
        self.id = id
        self.s3Url = s3Url
        self.album_id = album_id
        self.username = username
        self.imageB64 = imageB64