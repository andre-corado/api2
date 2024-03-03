class Album():
    def __init__(self, id=None, title=None, user_id=None):
        self.id = id
        self.title = title
        self.user_id = user_id
        self.images = []
    