class User():
    def __init__(self, id=None, username=None, password=None, fullname=None, mail=None, s3Url='', imageB64=None, newUsername=None):
        self.id = id
        self.username = username
        self.password = password
        self.fullname = fullname
        self.mail = mail
        self.s3Url = s3Url
        self.imageB64 = imageB64
        self.newUsername = newUsername

    def __str__(self):
        return "User:\t" + str(self.toDict()) + "\n"

    def toDict(self):
        return {     
            "id": int(self.id),       
            "username": self.username,
            "fullname": self.fullname,
            "mail": self.mail,
            "password": self.password,
            "s3Url": self.s3Url,
            "imageB64": self.imageB64,
            "newUsername": self.newUsername
        }
    