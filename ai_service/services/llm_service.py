import os
from openai import OpenAI
from schemas.cv import CVExtractionResult
from schemas.match import MatchResult

client = OpenAI()


def extract_info_from_cv(cv_text: str) -> CVExtractionResult:
    """
    Sends the text of the CV to OpenAI and returns a structured object containing the skills.
    """
    system_prompt = (
        "You are an expert HR AI assistant. Your task is to analyze the provided "
        "CV text, extract all relevant professional skills, and write a brief summary."
    )

    completion = client.beta.chat.completions.parse(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"CV Text:\n{cv_text}"}
        ],
        response_format=CVExtractionResult,
    )

    return completion.choices[0].message.parsed


def calculate_match_score(cv_text: str, job_description: str) -> MatchResult:
    """
    Compares the CV text against a job description.
    Returns a match score (0-100) and an explanation.
    """
    system_prompt = (
        "You are an expert HR AI assistant. Evaluate the candidate's CV "
        "against the provided job description. Return a match_score from 0 to 100 "
        "and a brief ai_explanation detailing why they are or aren't a good fit."
    )

    user_prompt = f"Candidate CV:\n{cv_text}\n\nJob Description:\n{job_description}"

    completion = client.beta.chat.completions.parse(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ],
        response_format=MatchResult,
    )

    return completion.choices[0].message.parsed