import httpx
import asyncio
from bs4 import BeautifulSoup
from schemas.job import Job

async def scrape_jobs(keyword: str, location: str, limit: int = 25, offset: int = 0) -> list[Job]:
    """
    Scrapes LinkedIn public job search for real vacancies and their full descriptions.
    """
    # LinkedIn pagination usually works in increments of 25. 
    # We use the offset directly as the 'start' parameter.
    url = f"https://www.linkedin.com/jobs/search?keywords={keyword}&location={location}&start={offset}"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
    }
    
    print(f"DEBUG: Scraping LinkedIn URL: {url}")
    
    async with httpx.AsyncClient(follow_redirects=True) as client:
        response = await client.get(url, headers=headers)
        
    soup = BeautifulSoup(response.text, 'html.parser')
    cards = soup.find_all('div', class_='base-search-card')
    print(f"DEBUG: Scraped {len(cards)} job cards for offset {offset}")
    jobs = []
    
    for card in cards[:limit]:
        title_elem = card.find('h3', class_='base-search-card__title')
        company_elem = card.find('h4', class_='base-search-card__subtitle')
        link_elem = card.find('a', class_='base-card__full-link')
        
        if title_elem and company_elem:
            job_url_orig = link_elem['href'].split('?')[0] if link_elem else ""
            job_id = job_url_orig.split('-')[-1] if '-' in job_url_orig else "unknown_id"
            job_url = f"https://www.linkedin.com/jobs/view/{job_id}"
            
            jobs.append(Job(
                id=job_id,
                title=title_elem.text.strip(),
                company=company_elem.text.strip(),
                url=job_url,
                description="", # Will be populated concurrently below
                required_skills=[]
            ))
            
    # Concurrently fetch full descriptions for all scraped jobs
    async def fetch_desc(job: Job):
        job.description = await scrape_job_description(job.id)
        
    await asyncio.gather(*(fetch_desc(job) for job in jobs))
            
    return jobs

async def scrape_job_description(job_id: str) -> str:
    """
    Fetches the full description for a specific LinkedIn job.
    """
    url = f"https://www.linkedin.com/jobs/view/{job_id}"
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
    
    async with httpx.AsyncClient() as client:
        response = await client.get(url, headers=headers)
        
    soup = BeautifulSoup(response.text, 'html.parser')
    desc_elem = soup.find('div', class_='show-more-less-html__markup')
    
    return desc_elem.text.strip() if desc_elem else f"Job URL: {url}"
