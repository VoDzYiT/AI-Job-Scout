from pydantic import BaseModel
from typing import List

class Job(BaseModel):
    id: str
    title: str
    company: str
    description: str
    required_skills: List[str]
