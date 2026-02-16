import os

class Config:
    # Railway provides DATABASE_URL environment variable
    database_url = os.getenv('DATABASE_URL', 'postgresql://postgres:postgres@localhost:5432/dwellhub')
    
    # Railway uses 'postgres://' but SQLAlchemy needs 'postgresql://'
    # This fixes the compatibility issue
    if database_url.startswith("postgres://"):
        database_url = database_url.replace("postgres://", "postgresql://", 1)
    
    SQLALCHEMY_DATABASE_URI = database_url
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Use environment variables for secrets (set these in Railway dashboard)
    SECRET_KEY = os.getenv('SECRET_KEY', 'dwellhub-secret-key-2024')
    JWT_SECRET = os.getenv('JWT_SECRET', 'jwt-secret-key-2024')