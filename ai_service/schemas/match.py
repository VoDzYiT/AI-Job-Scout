from pydantic import BaseModel

class MatchResult(BaseModel):
    match_score: int
    ai_explanation: str
