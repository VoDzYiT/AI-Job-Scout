from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.database import get_db, engine, Base
from app.routers import auth, jobs
from app.security import get_current_user

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Job Scout - Service A", version="0.1.0")

# Include routers
app.include_router(auth.router)
app.include_router(jobs.router)

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

@app.get("/protected-test")
async def protected_test(current_user = Depends(get_current_user)):
    return {"message": "You have access!", "user_id": current_user.id}