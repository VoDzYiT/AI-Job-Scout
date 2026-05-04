from schemas.job import Job

MOCK_JOBS = [
    Job(
        id="job_001",
        title="Backend Python Developer",
        company="TechCorp",
        description="Looking for an experienced Python developer with FastAPI and PostgreSQL skills.",
        required_skills=["Python", "FastAPI", "PostgreSQL", "Docker"]
    ),
    Job(
        id="job_002",
        title="AI Engineer",
        company="InnovateAI",
        description="We need an AI engineer familiar with LLMs, OpenAI API, and Prompt Engineering.",
        required_skills=["Python", "OpenAI API", "LangChain", "Prompt Engineering"]
    ),
    Job(
        id="job_003",
        title="Frontend React Developer",
        company="WebSolutions",
        description="Seeking a frontend wizard with Next.js and React expertise.",
        required_skills=["React", "Next.js", "TypeScript", "TailwindCSS"]
    )
]

def get_mock_jobs() -> list[Job]:
    """Returns a list of mock vacancies."""
    return MOCK_JOBS
