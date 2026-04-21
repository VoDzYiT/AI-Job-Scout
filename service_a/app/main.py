from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.database import get_db

app = FastAPI(title="AI Job Scout - Service A", version="0.1.0")

@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "service-a"}

@app.get("/")
async def root():
    return {"message": "Welcome to Service A (User & Gateway)"}

@app.get("/db-check")
async def check_database(db: Session = Depends(get_db)):
    try:
        result = db.execute(text("SELECT 1")).scalar()
        user_count = db.execute(text("SELECT COUNT(*) FROM users")).scalar()
        return {
            "database": "connected",
            "test_query_result": result,
            "user_count": user_count
        }
    except Exception as e:
        return {"error": str(e)}