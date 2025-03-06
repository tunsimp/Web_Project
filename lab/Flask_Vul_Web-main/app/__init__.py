# app/__init__.py

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from datetime import timedelta
import os

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.debug = True
    app.secret_key = os.urandom(24)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.sqlite3'
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.permanent_session_lifetime = timedelta(minutes=5)
    
    db.init_app(app)
    
    with app.app_context():
        from .routes import routes  # Import the Blueprint
        app.register_blueprint(routes)  # Register the Blueprint
        db.create_all()  # Create database tables for our data models
        
        # Check if any users exist; if not, create a default user
        from .models import User
        if not User.query.first():
            default_user = User(username='defaultuser', password='defaultpass')
            db.session.add(default_user)
            db.session.commit()
            print("Default user 'defaultuser' created with password 'defaultpass'.")
    
    return app
