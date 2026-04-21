import os
from openai import OpenAI
from schemas.cv import CVExtractionResult

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