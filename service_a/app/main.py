# service_a/app/main.py
from fastapi import FastAPI
from app.config import settings

app = FastAPI(title="AI Job Scout - Service A", version="0.1.0")

@app.get("/health")
async def health_check():
    """Health check endpoint for service A."""
    return {"status": "ok", "service": "service-a"}

@app.get("/")
async def root():
    return {"message": "Welcome to Service A (User & Gateway)"}