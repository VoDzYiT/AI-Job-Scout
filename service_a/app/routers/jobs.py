from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
import httpx
from sqlalchemy.orm import Session, attributes
from app.config import settings
from app.security import get_current_user
from app.database import get_db
from app.models import User

router = APIRouter(prefix="/jobs", tags=["Jobs"])

@router.get("/search")
async def search_jobs(keyword: str = "Data Scientist", location: str = "Wroclaw", limit: int = 5, offset: int = 0):
    """
    Search for jobs via AI Service (Service B).
    """
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(
                f"{settings.SERVICE_B_URL}/api/v1/jobs/search",
                params={"keyword": keyword, "location": location, "limit": limit, "offset": offset},
                timeout=30.0
            )
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, detail=f"AI Service Error: {e.response.text}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Gateway Error: {str(e)}")

@router.post("/match")
async def match_cv(
    job_id: str = Form(...),
    current_user = Depends(get_current_user)
):
    """
    Match stored CV to a job via AI Service (Service B).
    """
    if current_user.parsed_cv is None:
        raise HTTPException(status_code=400, detail="Please upload and parse your resume first.")

    # Format the stored CV data for the AI service
    cv_data = current_user.parsed_cv
    cv_text = f"Professional Summary: {cv_data.get('summary', '')}\nSkills: {', '.join(cv_data.get('skills', []))}"
    
    # Get user matching rules (preferences)
    matching_rules = current_user.matching_rules or []
    rules_text = "\n".join([f"- {rule}" for rule in matching_rules]) if matching_rules else "No specific rules provided."

    prompt = f"""
    Evaluate the match between this candidate and the job description.
    
    Candidate Resume Data:
    {cv_text}
    
    USER SPECIFIC MATCHING RULES (IMPORTANT):
    {rules_text}
    
    Instructions:
    1. Calculate a match score (0-100) based on how well the candidate fits the job.
    2. Provide a brief explanation.
    3. CRITICAL: If any of the USER SPECIFIC MATCHING RULES are violated (e.g., user wants Remote but the job is on-site), you must significantly lower the score and explain the violation clearly.
    """

    async with httpx.AsyncClient() as client:
        try:
            data = {
                "job_id": job_id,
                "cv_text": cv_text,
                "custom_prompt": prompt
            }
            
            response = await client.post(
                f"{settings.SERVICE_B_URL}/api/v1/cv/match",
                data=data,
                timeout=60.0
            )
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, detail=f"AI Service Error: {e.response.text}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Gateway Error: {str(e)}")


@router.post("/cv/parse")
async def parse_cv(
    file: UploadFile = File(...),
    current_user = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Parse CV via AI Service (Service B). Saves result to user profile.
    """
    print(f"DEBUG: Received CV parse request for file: {file.filename} (Type: {file.content_type}) from user {current_user.id}")
    
    # More flexible check: allow common PDF content types or fallback to extension
    allowed_types = ["application/pdf", "application/x-pdf", "application/octet-stream"]
    is_pdf = file.content_type in allowed_types or file.filename.lower().endswith(".pdf")
    
    if not is_pdf:
        raise HTTPException(status_code=400, detail="Only PDF files are allowed. Please upload a valid .pdf file.")

    async with httpx.AsyncClient() as client:
        try:
            # Ensure we are at the start of the file
            await file.seek(0)
            file_content = await file.read()
            
            if not file_content:
                raise HTTPException(status_code=400, detail="The uploaded file is empty.")

            # Prepare the file for the AI service
            # We explicitly set the content type to application/pdf for Service B
            files = {"file": (file.filename, file_content, "application/pdf")}
            
            print(f"DEBUG: Forwarding {len(file_content)} bytes to AI Service at {settings.SERVICE_B_URL}")
            
            response = await client.post(
                f"{settings.SERVICE_B_URL}/api/v1/cv/parse",
                files=files,
                timeout=60.0
            )
            
            if response.status_code != 200:
                error_detail = response.text
                print(f"DEBUG: AI Service returned error {response.status_code}: {error_detail}")
                raise HTTPException(status_code=response.status_code, detail=f"AI Service Error: {error_detail}")
                
            result = response.json()
            parsed_data = result.get("parsed_data")
            
            if not parsed_data:
                print("DEBUG: AI Service returned success but no parsed_data")
                raise HTTPException(status_code=500, detail="AI Service failed to extract data from this PDF.")

            # Re-fetch user in current session
            db_user = db.query(User).filter(User.id == current_user.id).first()
            if not db_user:
                raise HTTPException(status_code=404, detail="User session lost.")
                
            db_user.parsed_cv = parsed_data
            attributes.flag_modified(db_user, "parsed_cv")
            db.commit()
            db.refresh(db_user)
            
            print(f"DEBUG: Successfully updated profile for user {db_user.id}")
            return result

        except httpx.ConnectError:
            print("DEBUG: Could not connect to AI Service")
            raise HTTPException(status_code=503, detail="AI Service is currently unavailable.")
        except Exception as e:
            print(f"DEBUG: Unexpected error in parse_cv: {str(e)}")
            db.rollback()
            raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

@router.get("/cv/me")
async def get_my_cv(current_user = Depends(get_current_user)):
    """
    Get the saved CV data for the current user.
    """
    has_cv = current_user.parsed_cv is not None
    print(f"DEBUG: Fetching CV for user {current_user.id}. Found: {has_cv}")
    return {"parsed_data": current_user.parsed_cv}
