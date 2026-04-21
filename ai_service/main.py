from fastapi import FastAPI, File, UploadFile, HTTPException
from dotenv import load_dotenv

load_dotenv()

from services.pdf_parser import extract_text_from_pdf
from services.llm_service import extract_info_from_cv

app = FastAPI(
    title="AI & Scraper Service",
    description="Microservice for parsing CVs and matching jobs using LLM",
    version="0.1.0"
)


@app.get("/health", tags=["System"])
async def health_check() -> dict[str, str]:
    return {"status": "ok", "message": "AI Service is up and running"}


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
