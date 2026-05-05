from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://postgres:postgres@db:5432/ai_job_scout"
    SERVICE_B_URL: str = "http://ai-service:8001"

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()