from fastapi import FastAPI, File, UploadFile, HTTPException
from services.pdf_parser import extract_text_from_pdf

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
    An endpoint for uploading a PDF CV and extracting text from it.
    """
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are allowed. Please upload a valid CV.")

    try:
        content = await file.read()

        text = extract_text_from_pdf(content)

        return {
            "filename": file.filename,
            "extracted_text": text
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error parsing PDF: {str(e)}")