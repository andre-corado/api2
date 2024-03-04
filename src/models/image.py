class Image():
    def __init__(self, id=None,  album_id=None, name=None, imageB64=None, s3Url=None):
        self.id = id
        self.name = name
        self.s3Url = s3Url
        self.album_id = album_id
        self.imageB64 = imageB64