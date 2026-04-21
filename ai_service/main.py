from fastapi import FastAPI

app = FastAPI(
    title="AI & Scraper Service",
    description="Microservice for parsing CVs and matching jobs using LLM",
    version="0.1.0"
)

@app.get("/health", tags=["System"])
async def health_check() -> dict[str, str]:

    return {"status": "ok", "message": "AI Service is up and running"}