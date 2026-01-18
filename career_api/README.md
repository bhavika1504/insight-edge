# Career API - FastAPI Microservice

A FastAPI microservice providing resume parsing and AI-powered career guidance.

## Features
- Resume PDF upload and parsing
- Skill extraction and analysis
- AI-powered career chat (RAG pipeline)
- Skills gap analysis
- Career path suggestions

## Setup

```bash
# Install dependencies
pip install -r requirements.txt

# Run the server
python main.py
```

Server runs at: http://localhost:8001

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Health check |
| `/upload-resume` | POST | Upload and parse resume PDF |
| `/analyze-resume` | GET | Get parsed resume data |
| `/skills-gap` | POST | Analyze skills gap for target role |
| `/career-paths` | GET | Get career path suggestions |
| `/chat` | POST | AI career advice chat |
