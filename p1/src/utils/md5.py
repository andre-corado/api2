import hashlib

def encrypt(string):
    md5_hash = hashlib.md5()
    md5_hash.update(string.encode('utf-8'))
    encrypted_string = md5_hash.hexdigest()
    return encrypted_string


