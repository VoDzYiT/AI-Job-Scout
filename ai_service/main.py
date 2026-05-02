from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from dotenv import load_dotenv

load_dotenv()

from services.pdf_parser import extract_text_from_pdf
from services.llm_service import extract_info_from_cv, calculate_match_score
from services.job_scraper import scrape_jobs, scrape_job_description

app = FastAPI(
    title="AI & Scraper Service",
    description="Microservice for parsing CVs and matching jobs using LLM",
    version="0.1.0"
)


@app.get("/health", tags=["System"])
async def health_check() -> dict[str, str]:
    return {"status": "ok", "message": "AI Service is up and running"}


@app.get("/api/v1/jobs/search", tags=["Jobs"])
async def search_jobs(keyword: str = "Data Scientist", location: str = "Wroclaw", limit: int = 5):
    jobs = await scrape_jobs(keyword, location, limit)
    return {"jobs": [job.model_dump() for job in jobs]}


@app.post("/api/v1/cv/parse", tags=["CV Processing"])
async def parse_cv(file: UploadFile = File(...)):
    """
    An endpoint for uploading a PDF CV and extracting text/info from it using LLM.
    """
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are allowed. Please upload a valid CV.")

    try:
        content = await file.read()

        raw_text = extract_text_from_pdf(content)

        ai_analysis = extract_info_from_cv(raw_text)

        return {
            "filename": file.filename,
            "parsed_data": ai_analysis.model_dump()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing CV: {str(e)}")


@app.post("/api/v1/cv/match", tags=["Matching Logic"])
async def match_cv_to_job(job_id: str = Form(...), file: UploadFile = File(...)):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are allowed.")

    job_description = await scrape_job_description(job_id)

    try:
        content = await file.read()
        raw_text = extract_text_from_pdf(content)

        match_result = calculate_match_score(raw_text, job_description)

        return {
            "job_id": job_id,
            "filename": file.filename,
            "match_score": match_result.match_score,
            "ai_explanation": match_result.ai_explanation
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error matching CV: {str(e)}")

