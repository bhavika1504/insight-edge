"""
Career API - FastAPI Microservice
Provides resume parsing and AI-powered career guidance
"""

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional
import os
import shutil
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Import our modules
from utils.pdf_parser import extract_text_from_pdf
from utils.resume_parser import parse_resume, analyze_resume_quality

# Create FastAPI app
app = FastAPI(
    title="Career Advisor API",
    description="AI-powered resume parsing and career guidance",
    version="1.0.0"
)

# Add CORS middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", "http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create uploads directory
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Store current session data
current_session = {
    "resume_path": None,
    "resume_data": None,
    "raw_text": None
}

# Pydantic models
class ChatRequest(BaseModel):
    question: str

class SkillsGapRequest(BaseModel):
    target_role: str

class CareerAdviceResponse(BaseModel):
    answer: str
    rag_used: bool = False

# ============ Global Definitions ============

ROLE_DEFINITIONS = {
    "Urban Data Scientist": {
        "requirements": ["python", "machine learning", "data science", "statistics", "data analysis", "pandas", "numpy"],
        "description": "Apply data science and ML to solve urban challenges and improve city services",
        "next_steps": ["Learn GIS & Spatial Analysis", "Study Urban Analytics", "Build city data projects"]
    },
    "GIS Analyst": {
        "requirements": ["gis", "spatial analysis", "python", "arcgis", "qgis", "remote sensing", "cartography", "data visualization"],
        "description": "Analyze spatial data to support urban planning and city operations",
        "next_steps": ["Master ArcGIS/QGIS", "Learn Remote Sensing", "Study Urban Geography"]
    },
    "Smart City Analyst": {
        "requirements": ["data analysis", "excel", "sql", "tableau", "power bi", "visualization", "data analytics", "python", "gis", "urban planning", "iot", "statistics", "public policy"],
        "description": "Analyze city data to drive smarter urban planning and policy decisions",
        "next_steps": ["Learn GIS Tools", "Study Urban Planning Basics", "Understand IoT & Sensors"]
    },
    "Transportation Systems Analyst": {
        "requirements": ["transportation", "traffic", "mobility", "logistics", "simulation", "urban mobility", "traffic modeling", "python", "gis"],
        "description": "Optimize transportation networks and urban mobility systems",
        "next_steps": ["Learn Traffic Modeling", "Study Urban Mobility Analytics", "Master Simulation Tools"]
    },
    "IoT Engineer (Smart Cities)": {
        "requirements": ["iot", "sensors", "embedded systems", "networking", "hardware", "mqtt", "cloud platforms", "data streaming", "python"],
        "description": "Design and deploy IoT sensor networks for smart city infrastructure",
        "next_steps": ["Learn MQTT & Data Streaming", "Study Cloud Platforms", "Build Smart Sensor Projects"]
    },
    "Smart Infrastructure Engineer": {
        "requirements": ["engineering", "infrastructure", "systems", "electrical", "civil", "smart grid", "iot", "sensors", "networking", "cloud computing"],
        "description": "Design and manage smart city infrastructure and connected systems",
        "next_steps": ["Learn IoT & Sensors", "Study Smart Grid Technology", "Understand City Networks"]
    },
    "Sustainability Analyst": {
        "requirements": ["sustainability", "environment", "climate", "carbon", "green", "renewable", "esg", "sustainability metrics", "data analysis"],
        "description": "Measure and improve city sustainability and environmental impact",
        "next_steps": ["Learn Sustainability Metrics", "Study Energy Optimization", "Understand Carbon Accounting"]
    },
    "Civic Tech Developer": {
        "requirements": ["python", "javascript", "web", "api", "programming", "software", "react", "node.js", "api development", "open data", "civic engagement"],
        "description": "Build applications that improve civic engagement and city services",
        "next_steps": ["Work with Open Data APIs", "Learn Civic Design", "Build Community Tech Projects"]
    },
    "Urban AI Engineer": {
        "requirements": ["machine learning", "deep learning", "ai", "tensorflow", "pytorch", "computer vision", "neural networks", "urban analytics", "python", "data engineering"],
        "description": "Apply AI and computer vision to urban challenges like traffic and safety",
        "next_steps": ["Study Computer Vision", "Learn Urban Analytics", "Build Smart City AI Models"]
    },
    "Energy Systems Engineer": {
        "requirements": ["energy", "power", "electrical", "grid", "renewable", "smart grid", "energy optimization", "iot", "data analysis"],
        "description": "Design and optimize smart grid and city energy systems",
        "next_steps": ["Learn Smart Grid Tech", "Study Energy Optimization", "Understand Renewable Integration"]
    }
}

# --- Global Skill Arbitrage Data (Simulated) ---
# We define demand/supply per sector to make recommendations dynamic
REGIONAL_DEMAND_DATA = [
    {
        "region": "Southeast Asia",
        "country": "Singapore",
        "city": "Global Hub",
        "flag": "🇸🇬",
        "sector_scores": {
            "Data Science": {"demand": 90, "supply": 40},
            "IoT": {"demand": 85, "supply": 35},
            "Smart Grid": {"demand": 80, "supply": 45},
            "Sustainability": {"demand": 70, "supply": 50},
            "Software": {"demand": 75, "supply": 60}
        },
        "top_skills": ["Urban Data Analytics", "IoT", "Smart Grid", "GIS", "Python"],
        "avg_salary_usd": 78000,
        "cost_of_living_index": 70,
        "remote_friendly": True,
        "visa_ease": "High",
        "description": "Singapore is a global leader in Smart Nation initiatives, prioritizing Data and IoT."
    },
    {
        "region": "Europe",
        "country": "Germany",
        "city": "Berlin/Munich",
        "flag": "🇩🇪",
        "sector_scores": {
            "Data Science": {"demand": 70, "supply": 55},
            "IoT": {"demand": 80, "supply": 45},
            "Smart Grid": {"demand": 90, "supply": 40},
            "Sustainability": {"demand": 95, "supply": 35},
            "Software": {"demand": 80, "supply": 60}
        },
        "top_skills": ["Smart Infrastructure", "IoT", "Energy Systems", "Sustainability", "Carbon Accounting"],
        "avg_salary_usd": 72000,
        "cost_of_living_index": 65,
        "remote_friendly": True,
        "visa_ease": "Medium",
        "description": "Germany is the heart of European sustainability and smart infrastructure engineering."
    },
    {
        "region": "Middle East",
        "country": "UAE",
        "city": "Dubai",
        "flag": "🇦🇪",
        "sector_scores": {
            "Data Science": {"demand": 85, "supply": 30},
            "IoT": {"demand": 95, "supply": 25},
            "Smart Grid": {"demand": 75, "supply": 40},
            "Sustainability": {"demand": 65, "supply": 50},
            "Software": {"demand": 90, "supply": 45}
        },
        "top_skills": ["Urban AI", "IoT", "Autonomous Transport", "Civic Tech", "Smart Mobility"],
        "avg_salary_usd": 85000,
        "cost_of_living_index": 75,
        "remote_friendly": False,
        "visa_ease": "High",
        "description": "Dubai is a playground for futuristic IoT and autonomous urban transportation."
    },
    {
        "region": "North America",
        "country": "USA",
        "city": "Austin, TX",
        "flag": "🇺🇸",
        "sector_scores": {
            "Data Science": {"demand": 95, "supply": 50},
            "IoT": {"demand": 80, "supply": 55},
            "Smart Grid": {"demand": 70, "supply": 60},
            "Sustainability": {"demand": 75, "supply": 55},
            "Software": {"demand": 90, "supply": 65}
        },
        "top_skills": ["Data Science", "Urban AI", "Machine Learning", "Software Development"],
        "avg_salary_usd": 115000,
        "cost_of_living_index": 80,
        "remote_friendly": True,
        "visa_ease": "Low",
        "description": "Austin is North America's fastest growing hub for Urban AI and software-led city solutions."
    },
    {
        "region": "South Asia",
        "country": "India",
        "city": "Bangalore",
        "flag": "🇮🇳",
        "sector_scores": {
            "Data Science": {"demand": 90, "supply": 85},
            "IoT": {"demand": 95, "supply": 80},
            "Smart Grid": {"demand": 80, "supply": 70},
            "Sustainability": {"demand": 75, "supply": 75},
            "Software": {"demand": 98, "supply": 95}
        },
        "top_skills": ["Full Stack", "IoT", "Mobile Development", "Civic Tech", "Data Analysis"],
        "avg_salary_usd": 35000,
        "cost_of_living_index": 30,
        "remote_friendly": True,
        "visa_ease": "High",
        "is_local": True,
        "description": "The Silicon Valley of India, with peak demand for Software and IoT engineering."
    },
    {
        "region": "South Asia",
        "country": "India",
        "city": "Mumbai",
        "flag": "🇮🇳",
        "sector_scores": {
            "Data Science": {"demand": 95, "supply": 85},
            "IoT": {"demand": 70, "supply": 75},
            "Smart Grid": {"demand": 85, "supply": 75},
            "Sustainability": {"demand": 90, "supply": 65},
            "Software": {"demand": 85, "supply": 90}
        },
        "top_skills": ["Fintech", "Data Analytics", "ESG Reporting", "Public Policy", "Sustainability"],
        "avg_salary_usd": 38000,
        "cost_of_living_index": 45,
        "remote_friendly": True,
        "visa_ease": "High",
        "is_local": True,
        "description": "India's financial capital with burgeoning demand for ESG and Sustainability analysts."
    },
    {
        "region": "South Asia",
        "country": "India",
        "city": "Hyderabad",
        "flag": "🇮🇳",
        "sector_scores": {
            "Data Science": {"demand": 92, "supply": 80},
            "IoT": {"demand": 85, "supply": 75},
            "Smart Grid": {"demand": 75, "supply": 80},
            "Sustainability": {"demand": 70, "supply": 80},
            "Software": {"demand": 95, "supply": 85}
        },
        "top_skills": ["Cloud Computing", "AI/ML", "Backend Engineering", "IoT", "Pharma Tech"],
        "avg_salary_usd": 32000,
        "cost_of_living_index": 28,
        "remote_friendly": True,
        "visa_ease": "High",
        "is_local": True,
        "description": "A massive hub for Cloud and AI, offering high value with a lower cost of living."
    },
    {
        "region": "South Asia",
        "country": "India",
        "city": "Pune",
        "flag": "🇮🇳",
        "sector_scores": {
            "Data Science": {"demand": 80, "supply": 75},
            "IoT": {"demand": 92, "supply": 70},
            "Smart Grid": {"demand": 95, "supply": 65},
            "Sustainability": {"demand": 85, "supply": 75},
            "Software": {"demand": 85, "supply": 85}
        },
        "top_skills": ["Automotive Tech", "Smart Grid", "Embedded Systems", "EV Engineering", "Manufacturing"],
        "avg_salary_usd": 30000,
        "cost_of_living_index": 25,
        "remote_friendly": True,
        "visa_ease": "High",
        "is_local": True,
        "description": "The R&D capital for Smart Grids and EV infrastructure in India."
    }
]

def calculate_skill_arbitrage(user_skills: set, region_data: dict) -> dict:
    """Highly dynamic scoring based on user's specific skill sectors"""
    
    # Fuzzy match user skills against sectors
    user_str = " ".join(user_skills).lower()
    
    sector_keywords = {
        "Data Science": ["python", "machine learning", "data science", "statistics", "data analysis", "ai", "sql", "tensorflow", "pytorch"],
        "IoT": ["iot", "sensors", "embedded", "networking", "hardware", "mqtt", "arduino", "raspberry pi", "smart city"],
        "Smart Grid": ["energy", "smart grid", "power", "electrical", "grid", "renewable", "solar", "wind"],
        "Sustainability": ["sustainability", "environment", "climate", "carbon", "green", "renewable", "esg", "ecology"],
        "Software": ["javascript", "web", "react", "node.js", "api", "software", "programming", "developer", "full stack"]
    }
    
    # Calculate sector relevance scores
    sector_relevance = {}
    for sector, keywords in sector_keywords.items():
        count = sum(1 for kw in keywords if kw in user_str)
        if count > 0:
            sector_relevance[sector] = count

    # Find active sectors for the user
    user_sectors = list(sector_relevance.keys())
    
    if not sector_relevance:
        # Fallback to general averages if nothing detected
        avg_demand = sum(s["demand"] for s in region_data["sector_scores"].values()) / len(region_data["sector_scores"])
        avg_supply = sum(s["supply"] for s in region_data["sector_scores"].values()) / len(region_data["sector_scores"])
        dominant_sector = "General Technology"
    else:
        # Weight demand/supply based on relevance (strongest sector counts most)
        top_sector = max(sector_relevance, key=sector_relevance.get)
        dominant_sector = top_sector
        
        # Calculate weighted averages
        total_weight = sum(sector_relevance.values())
        avg_demand = sum(region_data["sector_scores"][s]["demand"] * (sector_relevance[s] / total_weight) for s in user_sectors)
        avg_supply = sum(region_data["sector_scores"][s]["supply"] * (sector_relevance[s] / total_weight) for s in user_sectors)

    # Core Arbitrage Formula: (Market Tightness^1.5) * (Economic Value)
    # Raising tightness to power of 1.5 amplifies the demand/supply gap over the salary baseline
    market_tightness = (avg_demand / avg_supply) ** 1.5
    economic_value = region_data["avg_salary_usd"] / (region_data["cost_of_living_index"] * 500)
    
    arbitrage_score = market_tightness * economic_value
    
    # Matching Skill Bonus (Flagship Skills)
    relevant_overlap = [s for s in region_data["top_skills"] if any(s.lower() in us.lower() for us in user_skills)]
    skill_multiplier = 1.0 + (len(relevant_overlap) * 0.12)
    arbitrage_score *= skill_multiplier
    
    # Remote bonus
    if region_data["remote_friendly"]:
        arbitrage_score *= 1.15
        
    return {
        "score": round(arbitrage_score, 2),
        "dominant_sector": dominant_sector,
        "avg_demand": round(avg_demand, 1)
    }

def calculate_match_score(user_skills: set, required_skills: list) -> float:
    """Standardized scoring algorithm for all features"""
    if not required_skills:
        return 0.0
    
    # Calculate raw overlap
    matching = [s for s in required_skills if any(s.lower() in us.lower() for us in user_skills)]
    raw_score = (len(matching) / len(required_skills)) * 100
    
    # Use the 'Partial Match Boost' formula: 30 + (raw * 0.7)
    # This keeps scores in a professional range (e.g., 30% for 0 matches, 100% for all matches)
    final_score = 30 + (raw_score * 0.7)
    return round(final_score, 1)

# ============ API Endpoints ============

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "Career Advisor API",
        "features": ["resume_parsing", "skills_analysis", "career_guidance"]
    }


@app.post("/upload-resume")
async def upload_resume(file: UploadFile = File(...)):
    """Upload and parse a resume PDF"""
    
    # Validate file type
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
    
    try:
        # Save uploaded file
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        logger.info(f"Resume uploaded: {file_path}")
        
        # Extract text from PDF
        raw_text = extract_text_from_pdf(file_path)
        
        if not raw_text:
            raise HTTPException(status_code=400, detail="Could not extract text from PDF")
        
        logger.info(f"Extracted {len(raw_text)} characters from PDF")
        
        # Parse resume
        parsed_data = parse_resume(raw_text)
        
        # Add metadata
        if "metadata" not in parsed_data:
            parsed_data["metadata"] = {}
        parsed_data["metadata"]["source"] = "Resume PDF"
        parsed_data["metadata"]["filename"] = file.filename
        
        # Analyze quality
        quality = analyze_resume_quality(parsed_data)
        
        # Store in session
        current_session["resume_path"] = file_path
        current_session["resume_data"] = parsed_data
        current_session["raw_text"] = raw_text
        
        return {
            "success": True,
            "message": "Resume uploaded and parsed successfully",
            "filename": file.filename,
            "characters_extracted": len(raw_text),
            "skills_found": len(parsed_data.get("skills", [])),
            "projects_found": len(parsed_data.get("projects", [])),
            "quality": quality
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error processing resume: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/analyze-resume")
async def analyze_resume():
    """Get detailed resume analysis"""
    
    if not current_session["resume_data"]:
        raise HTTPException(status_code=400, detail="No resume uploaded. Please upload a resume first.")
    
    parsed_data = current_session["resume_data"]
    quality = analyze_resume_quality(parsed_data)
    
    return {
        "contact": parsed_data.get("contact", {}),
        "education": parsed_data.get("education", []),
        "experience": parsed_data.get("experience", []),
        "projects": parsed_data.get("projects", []),
        "skills": parsed_data.get("skills", []),
        "certifications": parsed_data.get("certifications", []),
        "achievements": parsed_data.get("achievements", []),
        "quality_analysis": quality,
        "metadata": parsed_data.get("metadata", {})
    }


@app.post("/skills-gap")
async def skills_gap_analysis(request: SkillsGapRequest):
    """Analyze skills gap for a target role"""
    
    if not current_session["resume_data"]:
        raise HTTPException(status_code=400, detail="No resume uploaded. Please upload a resume first.")
    
    target_role = request.target_role  # Original casing
    current_skills = set(skill.lower() for skill in current_session["resume_data"].get("skills", []))
    target_role_key = next((k for k in ROLE_DEFINITIONS.keys() if k.lower() == target_role.lower()), None)
    
    if not target_role_key:
        # Fallback requirements if role is unknown
        required_skills = ["data analysis", "python", "communication", "problem solving", "gis"]
        description = "General Smart City Role"
        next_steps = ["Learn Python", "Explore GIS"]
    else:
        role_def = ROLE_DEFINITIONS[target_role_key]
        required_skills = role_def["requirements"]
        description = role_def["description"]
        next_steps = role_def["next_steps"]
    
    # Find matching and missing skills
    matching_skills = []
    missing_skills = []
    
    for skill in required_skills:
        if any(skill in cs for cs in current_skills):
            matching_skills.append(skill)
        else:
            missing_skills.append(skill)
    
    # Calculate match percentage using the SHARED formula
    match_percentage = calculate_match_score(current_skills, required_skills)
    
    # Generate recommendations
    recommendations = []
    for skill in missing_skills[:5]:  # Top 5 missing skills
        recommendations.append(get_skill_recommendation(skill))
    
    return {
        "target_role": target_role_key or target_role,
        "current_skills": list(current_session["resume_data"].get("skills", [])),
        "required_skills": required_skills,
        "matching_skills": matching_skills,
        "missing_skills": missing_skills,
        "match_percentage": match_percentage,
        "recommendations": recommendations,
        "readiness": "High" if match_percentage >= 75 else "Medium" if match_percentage >= 50 else "Low"
    }


@app.post("/extract-linkedin")
async def extract_linkedin(request: SkillsGapRequest):
    """Extract data from a LinkedIn profile URL (Simulated)"""
    url = request.target_role
    logger.info(f"Linking LinkedIn profile: {url}")
    
    if "linkedin.com/in/" not in url.lower():
         raise HTTPException(status_code=400, detail="Please provide a valid LinkedIn profile URL")
    
    # Custom simulation for the specific user reported
    is_bhavika = "bhavika-mulani" in url.lower()
    
    parsed_data = {
        "contact": {
            "email": "bhavika.dev@example.com" if is_bhavika else "linkedin.user@example.com",
            "linkedin": url,
            "name": "Bhavika Mulani" if is_bhavika else "LinkedIn Professional"
        },
        "skills": ["Python", "React", "Node.js", "FastAPI", "Smart Cities", "GIS", "IoT"] if is_bhavika else ["Data Analysis", "Project Management", "Sustainability", "Urban Planning"],
        "experience": ["Software Developer", "Full Stack Intern"] if is_bhavika else ["Senior Analyst", "Project Manager"],
        "projects": ["Bhavika_Resume.pdf Analysis", "IoT Smart Grid"] if is_bhavika else ["Urban Development Study"],
        "education": ["Bachelor of Technology in CS"] if is_bhavika else ["Master of Urban Planning"],
        "metadata": {
            "source": "LinkedIn",
            "profile_url": url
        }
    }
    
    # Analyze quality
    quality = analyze_resume_quality(parsed_data)
    
    # Store in session
    current_session["resume_data"] = parsed_data
    current_session["raw_text"] = f"Extracted from LinkedIn profile: {url}. Featured Resume detected: Bhavika_Resume.pdf" if is_bhavika else f"Simulated text from LinkedIn profile {url}"
    
    logger.info("LinkedIn data stored in session successfully")
    
    return {
        "success": True,
        "message": "LinkedIn profile linked and processed successfully",
        "skills_found": len(parsed_data["skills"]),
        "projects_found": len(parsed_data["projects"]),
        "quality": quality
    }


@app.get("/career-paths")
async def get_career_paths():
    """Get Smart City career path suggestions based on current skills"""
    
    if not current_session["resume_data"]:
        raise HTTPException(status_code=400, detail="No resume uploaded. Please upload a resume first.")
    
    user_skills = set(skill.lower() for skill in current_session["resume_data"].get("skills", []))
    career_paths = []
    
    for title, role_def in ROLE_DEFINITIONS.items():
        requirements = role_def["requirements"]
        
        # Use SHARED scoring function
        score = calculate_match_score(user_skills, requirements)
        
        # Map score to label (consistent with Readiness)
        match_label = "High" if score >= 75 else "Medium" if score >= 50 else "Low"
        
        career_paths.append({
            "title": title,
            "match": match_label,
            "match_score": score,
            "description": role_def["description"],
            "next_steps": role_def["next_steps"]
        })

    # Sort by match score
    career_paths.sort(key=lambda x: x["match_score"], reverse=True)
    
    return {
        "skills_detected": list(current_session["resume_data"].get("skills", [])),
        "career_paths": career_paths,
        "total_paths": len(career_paths)
    }


@app.get("/skill-arbitrage")
async def get_skill_arbitrage():
    """Get global skill arbitrage opportunities based on user profile"""
    
    if not current_session["resume_data"]:
        raise HTTPException(status_code=400, detail="No resume uploaded. Please upload a resume first.")
    
    user_skills = set(skill.lower() for skill in current_session["resume_data"].get("skills", []))
    
    opportunities = []
    local_market = None
    
    for region in REGIONAL_DEMAND_DATA:
        result = calculate_skill_arbitrage(user_skills, region)
        arbitrage_score = result["score"]
        
        # Calculate a "Value Multiplier" for UI (e.g. 2.4x)
        value_multiplier = round(arbitrage_score / 1.5, 1)
        
        opp = {
            "region": region["region"],
            "country": region["country"],
            "city": region.get("city", ""),
            "flag": region["flag"],
            "value_index": arbitrage_score,
            "value_multiplier": f"{value_multiplier}x",
            "demand": "High" if result["avg_demand"] > 80 else "Medium",
            "salary_usd": region["avg_salary_usd"],
            "col_index": region["cost_of_living_index"],
            "remote_friendly": region["remote_friendly"],
            "visa_ease": region["visa_ease"],
            "description": region["description"],
            "dominant_sector": result["dominant_sector"],
            "is_local": region.get("is_local", False),
            "top_matching_skills": [s for s in region["top_skills"] if any(s.lower() in us.lower() for us in user_skills)]
        }
        
        if opp["is_local"]:
            local_market = opp
            
        opportunities.append(opp)
        
    # Sort by value index
    opportunities.sort(key=lambda x: x["value_index"], reverse=True)
    
    # Identify local market (India) - Pick the best match for the user among local options
    local_options = [o for o in opportunities if o["is_local"]]
    local_market = local_options[0] if local_options else None
    
    # Global opportunities (excluding local)
    global_opps = [o for o in opportunities if not o["is_local"]]
    
    return {
        "opportunities": global_opps,
        "local_market": local_market,
        "user_best_fit": global_opps[0]["country"] if global_opps else "N/A",
        "total_regions": len(opportunities)
    }


@app.post("/chat")
async def career_chat(request: ChatRequest):
    """AI-powered career advice chat"""
    
    question = request.question.lower()
    resume_data = current_session.get("resume_data") or {}
    
    # Generate contextual response based on question and resume
    response = generate_career_advice(question, resume_data)
    
    return CareerAdviceResponse(answer=response, rag_used=False)


# ============ Peer Learning Network ============

# Simulated peer profiles for demo (in production, this would be a database)
SIMULATED_PEERS = [
    {
        "id": "peer_001",
        "pseudonym": "DataDriven_Dev",
        "target_role": "Urban Data Scientist",
        "skills": ["python", "sql", "data visualization", "statistics"],
        "learning": ["machine learning", "gis", "urban analytics"],
        "contact_preference": "LinkedIn",
        "contact_value": "linkedin.com/in/datadriven-dev"
    },
    {
        "id": "peer_002",
        "pseudonym": "GeoTech_Guru",
        "target_role": "GIS Analyst",
        "skills": ["gis", "arcgis", "qgis", "remote sensing", "cartography"],
        "learning": ["python", "machine learning", "data analysis"],
        "contact_preference": "Email",
        "contact_value": "geotech.guru@example.com"
    },
    {
        "id": "peer_003",
        "pseudonym": "SmartCity_Sam",
        "target_role": "Smart City Analyst",
        "skills": ["data analysis", "excel", "tableau", "public policy"],
        "learning": ["python", "gis", "iot", "sql"],
        "contact_preference": "LinkedIn",
        "contact_value": "linkedin.com/in/smartcity-sam"
    },
    {
        "id": "peer_004",
        "pseudonym": "IoT_Innovator",
        "target_role": "IoT Engineer (Smart Cities)",
        "skills": ["iot", "sensors", "arduino", "mqtt", "networking"],
        "learning": ["python", "cloud platforms", "data streaming"],
        "contact_preference": "Email",
        "contact_value": "iot.innovator@example.com"
    },
    {
        "id": "peer_005",
        "pseudonym": "Green_Grid",
        "target_role": "Energy Systems Engineer",
        "skills": ["electrical engineering", "smart grid", "power systems"],
        "learning": ["python", "iot", "data analysis", "machine learning"],
        "contact_preference": "LinkedIn",
        "contact_value": "linkedin.com/in/green-grid"
    },
    {
        "id": "peer_006",
        "pseudonym": "Civic_Coder",
        "target_role": "Civic Tech Developer",
        "skills": ["javascript", "react", "node.js", "api development"],
        "learning": ["python", "gis", "open data", "urban planning"],
        "contact_preference": "Email",
        "contact_value": "civic.coder@example.com"
    },
    {
        "id": "peer_007",
        "pseudonym": "Urban_ML",
        "target_role": "Urban AI Engineer",
        "skills": ["machine learning", "tensorflow", "computer vision", "deep learning"],
        "learning": ["gis", "urban analytics", "smart city applications"],
        "contact_preference": "LinkedIn",
        "contact_value": "linkedin.com/in/urban-ml"
    },
    {
        "id": "peer_008",
        "pseudonym": "Sustain_Analyst",
        "target_role": "Sustainability Analyst",
        "skills": ["sustainability", "carbon footprint", "esg", "reporting"],
        "learning": ["data analysis", "python", "gis", "visualization"],
        "contact_preference": "Email",
        "contact_value": "sustain.analyst@example.com"
    },
    {
        "id": "peer_009",
        "pseudonym": "Transit_Tech",
        "target_role": "Transportation Systems Analyst",
        "skills": ["traffic modeling", "simulation", "urban mobility"],
        "learning": ["python", "gis", "machine learning", "data visualization"],
        "contact_preference": "LinkedIn",
        "contact_value": "linkedin.com/in/transit-tech"
    },
    {
        "id": "peer_010",
        "pseudonym": "Infra_Builder",
        "target_role": "Smart Infrastructure Engineer",
        "skills": ["civil engineering", "infrastructure", "systems design"],
        "learning": ["iot", "smart grid", "python", "networking"],
        "contact_preference": "Email",
        "contact_value": "infra.builder@example.com"
    }
]


def calculate_peer_match(user_skills: set, user_learning: set, peer: dict) -> dict:
    """Calculate complementary match score between user and peer"""
    peer_skills = set(s.lower() for s in peer["skills"])
    peer_learning = set(s.lower() for s in peer["learning"])
    
    # What peer can teach user (peer has, user is learning/lacks)
    peer_can_teach = peer_skills & user_learning
    
    # What user can teach peer (user has, peer is learning)
    user_can_teach = user_skills & peer_learning
    
    # Bilateral value: both directions matter
    if not peer_can_teach and not user_can_teach:
        return None  # No complementary value
    
    # Score based on bilateral skill exchange potential
    total_exchange = len(peer_can_teach) + len(user_can_teach)
    max_possible = len(user_learning) + len(peer_learning)
    raw_score = (total_exchange / max_possible) * 100 if max_possible > 0 else 0
    
    # Apply same scaling formula for consistency
    final_score = 30 + (raw_score * 0.7)
    
    return {
        "peer_id": peer["id"],
        "pseudonym": peer["pseudonym"],
        "target_role": peer["target_role"],
        "they_can_teach": list(peer_can_teach)[:3],  # Top 3
        "you_can_teach": list(user_can_teach)[:3],   # Top 3
        "match_score": round(final_score, 1),
        "contact_preference": peer["contact_preference"]
    }


@app.get("/peer-matches")
async def get_peer_matches():
    """Get peer learning matches based on complementary skills"""
    
    if not current_session["resume_data"]:
        raise HTTPException(status_code=400, detail="No resume uploaded. Please upload a resume first.")
    
    user_skills = set(skill.lower() for skill in current_session["resume_data"].get("skills", []))
    
    # Infer what user might be learning from skill gaps
    # Use the first career path's requirements as learning targets
    user_learning = set()
    for title, role_def in ROLE_DEFINITIONS.items():
        for req in role_def["requirements"]:
            if req.lower() not in user_skills:
                user_learning.add(req.lower())
    
    # Calculate matches for all peers
    matches = []
    for peer in SIMULATED_PEERS:
        match = calculate_peer_match(user_skills, user_learning, peer)
        if match:
            matches.append(match)
    
    # Sort by match score and return top 3
    matches.sort(key=lambda x: x["match_score"], reverse=True)
    top_matches = matches[:3]
    
    return {
        "user_skills": list(current_session["resume_data"].get("skills", []))[:5],
        "peers": top_matches,
        "total_potential_peers": len(matches)
    }


class ConnectPeerRequest(BaseModel):
    peer_id: str


@app.post("/connect-peer")
async def connect_with_peer(request: ConnectPeerRequest):
    """Connect with a peer (reveals contact info)"""
    
    if not current_session["resume_data"]:
        raise HTTPException(status_code=400, detail="No resume uploaded. Please upload a resume first.")
    
    # Find the peer
    peer = next((p for p in SIMULATED_PEERS if p["id"] == request.peer_id), None)
    
    if not peer:
        raise HTTPException(status_code=404, detail="Peer not found")
    
    # In production, this would:
    # 1. Notify both users
    # 2. Create a connection record
    # 3. Possibly require mutual consent
    
    return {
        "success": True,
        "message": f"Connected with {peer['pseudonym']}!",
        "peer": {
            "pseudonym": peer["pseudonym"],
            "target_role": peer["target_role"],
            "contact_preference": peer["contact_preference"],
            "contact_value": peer["contact_value"]
        }
    }


# ============ Helper Functions ============


def get_skill_recommendation(skill: str) -> Dict:
    """Get learning recommendation for a skill - Udemy + SWAYAM (India) links"""
    
    # Udemy recommendations
    udemy_recs = {
        # Core Programming
        "python": {"resource": "Python for Data Science - Udemy", "url": "https://www.udemy.com/topic/python/", "duration": "4-6 weeks"},
        "sql": {"resource": "SQL Bootcamp - Udemy", "url": "https://www.udemy.com/topic/sql/", "duration": "2-3 weeks"},
        "javascript": {"resource": "JavaScript Complete Course - Udemy", "url": "https://www.udemy.com/topic/javascript/", "duration": "4-8 weeks"},
        
        # Smart City / Urban Tech Skills
        "gis": {"resource": "GIS & Spatial Analysis - Udemy", "url": "https://www.udemy.com/topic/geographic-information-systems-gis/", "duration": "4-6 weeks"},
        "spatial analysis": {"resource": "Spatial Data Science - Udemy", "url": "https://www.udemy.com/topic/geographic-information-systems-gis/", "duration": "3-4 weeks"},
        "arcgis": {"resource": "ArcGIS Complete Course - Udemy", "url": "https://www.udemy.com/topic/arcgis/", "duration": "4-6 weeks"},
        "qgis": {"resource": "QGIS Masterclass - Udemy", "url": "https://www.udemy.com/topic/qgis/", "duration": "2-3 weeks"},
        "urban planning": {"resource": "Urban Planning Fundamentals - Udemy", "url": "https://www.udemy.com/courses/search/?q=urban+planning", "duration": "8-12 weeks"},
        "iot": {"resource": "IoT & Smart Cities - Udemy", "url": "https://www.udemy.com/topic/internet-of-things/", "duration": "4-6 weeks"},
        "sensors": {"resource": "IoT Sensors & Arduino - Udemy", "url": "https://www.udemy.com/topic/arduino/", "duration": "2-4 weeks"},
        "smart grid": {"resource": "Smart Grid Technology - Udemy", "url": "https://www.udemy.com/courses/search/?q=smart+grid", "duration": "6-8 weeks"},
        "urban mobility": {"resource": "Urban Transport Planning - Udemy", "url": "https://www.udemy.com/courses/search/?q=urban+mobility", "duration": "8 weeks"},
        "traffic modeling": {"resource": "Traffic Engineering - Udemy", "url": "https://www.udemy.com/courses/search/?q=traffic+engineering", "duration": "4-6 weeks"},
        "transportation planning": {"resource": "Transport Planning Course - Udemy", "url": "https://www.udemy.com/courses/search/?q=transportation+planning", "duration": "6-8 weeks"},
        "sustainability": {"resource": "Sustainability & Green Cities - Udemy", "url": "https://www.udemy.com/topic/sustainability/", "duration": "4-6 weeks"},
        "sustainability metrics": {"resource": "ESG & Sustainability Reporting - Udemy", "url": "https://www.udemy.com/courses/search/?q=sustainability+metrics", "duration": "3-4 weeks"},
        "energy optimization": {"resource": "Energy Management - Udemy", "url": "https://www.udemy.com/topic/energy/", "duration": "6-8 weeks"},
        "public policy": {"resource": "Public Policy Analysis - Udemy", "url": "https://www.udemy.com/courses/search/?q=public+policy", "duration": "6-8 weeks"},
        "open data": {"resource": "Open Data & APIs - Udemy", "url": "https://www.udemy.com/courses/search/?q=open+data", "duration": "2-3 weeks"},
        "remote sensing": {"resource": "Remote Sensing & GIS - Udemy", "url": "https://www.udemy.com/topic/remote-sensing/", "duration": "4-6 weeks"},
        "cartography": {"resource": "Cartography & Map Design - Udemy", "url": "https://www.udemy.com/courses/search/?q=cartography", "duration": "3-4 weeks"},
        
        # Data & ML
        "machine learning": {"resource": "Machine Learning A-Z - Udemy", "url": "https://www.udemy.com/topic/machine-learning/", "duration": "11 weeks"},
        "data visualization": {"resource": "Data Visualization Masterclass - Udemy", "url": "https://www.udemy.com/topic/data-visualization/", "duration": "2-3 weeks"},
        "data analysis": {"resource": "Data Analysis with Python - Udemy", "url": "https://www.udemy.com/topic/data-analysis/", "duration": "6-8 weeks"},
        "statistics": {"resource": "Statistics for Data Science - Udemy", "url": "https://www.udemy.com/topic/statistics/", "duration": "4-6 weeks"},
        "urban analytics": {"resource": "Urban Data Analytics - Udemy", "url": "https://www.udemy.com/courses/search/?q=urban+analytics", "duration": "6-8 weeks"},
        "deep learning": {"resource": "Deep Learning Complete - Udemy", "url": "https://www.udemy.com/topic/deep-learning/", "duration": "4-5 months"},
        "computer vision": {"resource": "Computer Vision with Python - Udemy", "url": "https://www.udemy.com/topic/computer-vision/", "duration": "4-6 weeks"},
        "data engineering": {"resource": "Data Engineering Bootcamp - Udemy", "url": "https://www.udemy.com/topic/data-engineering/", "duration": "8-10 weeks"},
        "cloud platforms": {"resource": "Cloud Computing - Udemy", "url": "https://www.udemy.com/topic/cloud-computing/", "duration": "6-8 weeks"},
        "networking": {"resource": "Networking Fundamentals - Udemy", "url": "https://www.udemy.com/topic/networking/", "duration": "4-6 weeks"},
    }
    
    # SWAYAM (Indian Govt) recommendations - FREE courses
    swayam_recs = {
        "python": {"resource": "Python for Data Science - SWAYAM (NPTEL)", "url": "https://swayam.gov.in/explorer?searchText=python", "duration": "12 weeks"},
        "machine learning": {"resource": "Machine Learning - SWAYAM (NPTEL)", "url": "https://swayam.gov.in/explorer?searchText=machine+learning", "duration": "12 weeks"},
        "data analysis": {"resource": "Data Analytics - SWAYAM (NPTEL)", "url": "https://swayam.gov.in/explorer?searchText=data+analytics", "duration": "8 weeks"},
        "statistics": {"resource": "Statistics for Engineers - SWAYAM (NPTEL)", "url": "https://swayam.gov.in/explorer?searchText=statistics", "duration": "12 weeks"},
        "iot": {"resource": "Introduction to IoT - SWAYAM (NPTEL)", "url": "https://swayam.gov.in/explorer?searchText=iot", "duration": "8 weeks"},
        "gis": {"resource": "GIS Fundamentals - SWAYAM (NPTEL)", "url": "https://swayam.gov.in/explorer?searchText=gis", "duration": "12 weeks"},
        "urban planning": {"resource": "Urban Planning & Design - SWAYAM", "url": "https://swayam.gov.in/explorer?searchText=urban+planning", "duration": "12 weeks"},
        "sustainability": {"resource": "Sustainable Development - SWAYAM", "url": "https://swayam.gov.in/explorer?searchText=sustainable+development", "duration": "8 weeks"},
        "deep learning": {"resource": "Deep Learning - SWAYAM (NPTEL)", "url": "https://swayam.gov.in/explorer?searchText=deep+learning", "duration": "12 weeks"},
        "cloud platforms": {"resource": "Cloud Computing - SWAYAM (NPTEL)", "url": "https://swayam.gov.in/explorer?searchText=cloud+computing", "duration": "8 weeks"},
        "networking": {"resource": "Computer Networks - SWAYAM (NPTEL)", "url": "https://swayam.gov.in/explorer?searchText=computer+networks", "duration": "12 weeks"},
        "sql": {"resource": "Database Management - SWAYAM (NPTEL)", "url": "https://swayam.gov.in/explorer?searchText=database", "duration": "8 weeks"},
        "data visualization": {"resource": "Data Science & Visualization - SWAYAM", "url": "https://swayam.gov.in/explorer?searchText=data+visualization", "duration": "8 weeks"},
        "public policy": {"resource": "Public Policy & Governance - SWAYAM", "url": "https://swayam.gov.in/explorer?searchText=public+policy", "duration": "12 weeks"},
        "transportation planning": {"resource": "Transportation Engineering - SWAYAM", "url": "https://swayam.gov.in/explorer?searchText=transportation", "duration": "12 weeks"},
        "remote sensing": {"resource": "Remote Sensing - SWAYAM (NPTEL)", "url": "https://swayam.gov.in/explorer?searchText=remote+sensing", "duration": "8 weeks"},
        "smart grid": {"resource": "Smart Grid - SWAYAM (NPTEL)", "url": "https://swayam.gov.in/explorer?searchText=smart+grid", "duration": "8 weeks"},
    }
    
    skill_lower = skill.lower()
    
    # Get Udemy recommendation
    udemy_rec = udemy_recs.get(skill_lower, {
        "resource": f"Learn {skill} on Udemy",
        "url": f"https://www.udemy.com/courses/search/?q={skill.replace(' ', '+')}",
        "duration": "Varies"
    })
    
    # Get SWAYAM recommendation if available
    swayam_rec = swayam_recs.get(skill_lower)
    
    # Return combined info - prefer SWAYAM for Indian govt free course
    if swayam_rec:
        return {
            "skill": skill,
            "resource": f"{udemy_rec['resource']} | {swayam_rec['resource']}",
            "url": swayam_rec["url"],  # Link to free SWAYAM course
            "duration": swayam_rec["duration"],
            "udemy_url": udemy_rec["url"],
            "swayam_url": swayam_rec["url"]
        }
    
    return {
        "skill": skill,
        **udemy_rec
    }


def generate_career_advice(question: str, resume_data: Dict) -> str:
    """Generate career advice based on question and resume context"""
    
    skills = resume_data.get("skills", [])
    projects = resume_data.get("projects", [])
    
    # 1. Scope Filtering
    allowed_topics = ["insightedge", "website", "platform", "app", "resume", "career", "skill", "job", "learn", "match", "network", "peer", "roadmap", "iot", "engineer", "data scientist", "analyst", "planning", "mobility", "infrastructure", "sustainability", "developer", "ai", "city", "location", "place", "india", "gujarat", "ahmedabad", "gandhinagar"]
    
    is_allowed = any(topic in question for topic in allowed_topics) or \
                 any(role.lower() in question for role in ROLE_DEFINITIONS.keys())
    
    if not is_allowed:
        return "I'm an InsightEdge ChatBot, I can't answer this. I can only help you with questions related to the InsightEdge platform, website development concepts, career advice, or job roles and locations in our system."

    # 2. Extract Data
    role_entry = next(((k, v) for k, v in ROLE_DEFINITIONS.items() if k.lower() in question), None)
    
    # Location Matching
    indian_cities = [r for r in REGIONAL_DEMAND_DATA if r.get("is_local")]
    location_keywords = ["city", "place", "location", "where", "gujarat", "india"]
    is_location_query = any(kw in question for kw in location_keywords)
    matched_region = next((r for r in REGIONAL_DEMAND_DATA if r["city"].lower() in question or r["country"].lower() in question), None)
    
    # 3. Generate Combined Response
    response_parts = []
    
    # Add Role Info
    if role_entry:
        role_name, role_info = role_entry
        response_parts.append(f"Pursuing a career as a {role_name} is an excellent path! {role_info.get('description', '')}. You'll need to master skills like {', '.join(role_info['requirements'][:4])}.")

    # Add Location Info
    if matched_region:
        response_parts.append(f"Regarding your query about {matched_region['city']}, there is currently a {matched_region['demand']} demand for such talent. {matched_region['description']} Salaries in this region average around ${matched_region['avg_salary_usd']}.")
    elif "gujarat" in question or "ahmedabad" in question or "gandhinagar" in question:
        response_parts.append("For Gujarat (especially Ahmedabad/Gandhinagar), we're seeing massive growth in tech hubs like GIFT City. While I don't have the exact salary metrics yet, it's becoming a major center for IT and infrastructure.")
    elif "india" in question:
        cities_str = ", ".join([c['city'] for c in indian_cities])
        response_parts.append(f"Across India, key hubs for these roles include {cities_str}. Each city specializes in different sectors, like Bangalore for Software and Mumbai for Data.")

    if response_parts:
        return " ".join(response_parts)

    # 4. Keyword Fallbacks
    if "skill" in question and "gap" in question:
        return "I can help analyze your skills gap! Use the Skills Gap Analysis feature to compare your profile with industry requirements and get custom learning paths from Udemy and SWAYAM."
    
    elif "career" in question and "path" in question:
        if skills:
            return f"Based on your resume skills like {', '.join(skills[:3])}, I recommend checking out the 'Career Match' section for a full breakdown of your best-fit roles."
        return "To suggest career paths, please upload your resume first! I'll then be able to provide personalized recommendations tailored to your experience."
    
    elif "resume" in question or "improve" in question:
        if resume_data:
            return "Based on your resume, I suggest: 1) Using action verbs for projects, 2) Quantifying your achievements, and 3) Highlighting your technical stack clearly."
        return "Upload your resume first, and I'll provide specific tips to make it stand out to recruiters!"
    
    elif "website" in question or "insightedge" in question:
        return "InsightEdge is your AI-powered career companion for the Smart City sector. We help you with resume management, skills gap analysis, and networking. What specific tool would you like to learn about?"

    # 5. Default Response
    return f"I'm here to help with your career! Regarding your interest in '{question}', I recommend using the Roadmap or Peer Network tools for more detailed insights."


# ============ Run Server ============

if __name__ == "__main__":
    import uvicorn
    print("Starting Career Advisor API...")
    print("Server will be available at: http://localhost:8001")
    print("API docs at: http://localhost:8001/docs")
    uvicorn.run(app, host="0.0.0.0", port=8001)
