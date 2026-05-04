# AI Job Scout

A platform that gathers job offers from LinkedIn, analyzes the user's uploaded PDF resume, and uses an LLM to evaluate how well the candidate fits each job.

## 🚀 How to Run Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/VoDzYiT/AI-Job-Scout.git
   cd AI-Job-Scout
   ```

2. **Set up environment variables:**
   Create a `.env` file in the root directory (or ensure your environment has):
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ```

3. **Start the stack using Docker Compose:**
   ```bash
   docker-compose up --build
   ```

4. **Access the application:**
   - **Frontend:** http://localhost (Port 80)
   - **Gateway API (Service A):** http://localhost/api
   - **Database:** Localhost:5432

## 📖 API Documentation

The project consists of two FastAPI microservices, each with its own Swagger UI:

- **Service A (User & Gateway):** [http://localhost/api/docs](http://localhost/api/docs)
  - Handles authentication, user management, and proxies requests to the AI Service.
- **Service B (AI & Scraper):** Internal only (Accessed via Gateway).
  - Handles PDF parsing, LinkedIn scraping, and LLM matching logic.

## 🏗️ Architecture

- **Microservice A:** FastAPI, PostgreSQL (SQLAlchemy), JWT Auth.
- **Microservice B:** FastAPI, OpenAI GPT-4, BeautifulSoup4.
- **Frontend:** React, Vite, Nginx.
- **Database:** PostgreSQL 15.
