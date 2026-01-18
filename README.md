# InsightEdge 

> **AI-Powered Career Navigator for the Smart City Ecosystem**

InsightEdge is a premium career guidance platform specifically designed for professionals and students entering the **Smart Cities & Urban Technology** domain. It combines advanced resume intelligence, global market analysis, and peer networking to provide a holistic career growth experience.

---

## Key Features

- **📄 AI Resume Intelligence**: Upload **PDF Resumes** or link **LinkedIn Profiles** to extract skills, projects, and receive instant quality feedback.
- **🎯 Smart Career Match**: Discover 10+ specialized Smart City roles (e.g., *Urban Data Scientist, GIS Analyst*) with deterministic relevancy scoring.
- **📊 Global Skill Arbitrage**: Analyze your "market value" across different global regions (e.g., Singapore, Dubai, Austin) based on your specific skill stack.
- **👥 Peer Learning Network**: Find mentors and peers with complementary skills using our bilateral matching algorithm.
- **📉 Skill Gap Analysis**: High-fidelity visualization of your current skills against industry-standard requirements, with curated course recommendations.
- **📰 Real-Time Industry Feed**: Live updates aggregated from *Smart Cities Dive* and *PIB India* to keep you industry-relevant.
- **🤖 AI Career Chatbot**: Context-aware career advice engine that understands your specific resume context.

---

## Tech Stack

### Frontend (Client)
- **Framework**: React 18 (Vite) + TypeScript
- **UI System**: Tailwind CSS + Shadcn UI + Framer Motion
- **Visualization**: Recharts (Radar/Progress Charts)
- **State/Auth**: Firebase Auth, React Context API

### Backend (Server)
- **Core API**: Python (FastAPI)
- **Architecture**: Microservice handling parsing, matching, and chat logic
- **AI/ML**: PyMuPDF (PDF Extraction), NLTK (NLP), Rule-based Matching Engine
- **External APIs**: RSS2JSON (News), Firebase (Auth)

---

## Setup & Local Development

Follow these steps to get the full platform running on your machine.

### 1. Clone & Install Dependencies
```bash
# Clone the repository
git clone https://github.com/BhavikaSainani/insightEdge.git
cd insightEdge

# Install Frontend dependencies
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory for Firebase and API configuration:
```env
# Gemini API Key (for ChatBot)
GEMINI_API_KEY=AIzaSyCmHHEFcueKK_OTL87MjG-jP_T8YTpEzLs

# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyBoXQcgKqeLZ2d1S1fwrLClTp2aDArXPzA
VITE_FIREBASE_AUTH_DOMAIN=insightedge-d10ac.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=insightedge-d10ac
VITE_FIREBASE_STORAGE_BUCKET=insightedge-d10ac.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=172755694429
VITE_FIREBASE_APP_ID=1:172755694429:web:ef2cbca2efc6666d31eeb4
VITE_FIREBASE_MEASUREMENT_ID=G-9LYT9WZVY6

# NewsAPI Key (for live news)
VITE_NEWSAPI_KEY=b196ecf403174c82857f0b691c6c119c

```

### 3. Start the Backend Server (Python)
The core logic resides in the Python `career_api`:
```bash
cd career_api
# It is recommended to use a virtual environment
pip install -r requirements.txt
python main.py
```
*Server runs on port **8001** (Proxied via Vite)*

### 4. Start the Frontend
```bash
# From the project root
npm run dev
```
Open [http://localhost:8080](http://localhost:8080) to view the app!

---

## Application Structure

- **`/src`**: React Frontend source
  - **`/components`**: Reusable UI components (Shadcn)
  - **`/pages`**: Main application views (Dashboard, PeerNetwork, GlobalOpportunities)
  - **`/services`**: API Integration layer (`careerService.ts`, `newsService.ts`)
- **`/career_api`**: Python FastAPI Backend
  - **`main.py`**: Core application entry point and endpoints
  - **`/utils`**: PDF parsers and Resume logic

---

##  Troubleshooting

| Issue | Solution |
| :--- | :--- |
| **"Failed to upload resume"** | Ensure the Python server is running on port **8001**. |
| **"Network Error" on Chat** | Check if the backend is reachable at `http://localhost:8001/docs`. |
| **News not loading** | The RSS feed service might be rate-limited; check your network connection. |

---

##  Security & Privacy
- **Local Processing**: Resume parsing happens temporarily on the server session.
- **No Persistence**: Currently operates with in-memory sessions for maximum privacy during demos.
- **Environment Safety**: API keys are managed via `.env` and never committed.
