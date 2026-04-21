from pydantic import BaseModel, Field

class CVExtractionResult(BaseModel):
    skills: list[str] = Field(description="List of professional technical and soft skills extracted from the CV")
    summary: str = Field(description="A short 2-sentence professional summary of the candidate")