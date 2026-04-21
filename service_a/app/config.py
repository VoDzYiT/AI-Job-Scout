# service_a/app/config.py
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/ai_job_scout"
    
    class Config:
        env_file = ".env" 
settings = Settings()