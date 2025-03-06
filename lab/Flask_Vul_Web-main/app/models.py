# app/models.py

from . import db

class User(db.Model):  # It's a convention to use singular and capitalized class names
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    
    def __init__(self, username, password):
        self.username = username
        self.password = password
