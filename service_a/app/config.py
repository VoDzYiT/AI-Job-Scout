from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/ai_job_scout"
    SERVICE_B_URL: str = "http://localhost:8001"

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()