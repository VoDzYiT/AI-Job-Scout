# service_a/Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies if needed (none for now)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Expose port
EXPOSE 8000

# Command is overridden in docker-compose, but we set a default
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]