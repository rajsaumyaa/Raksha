# Raksha - AI-Powered Digital Public Safety Platform

> **"The second opinion scammers can't isolate you from."**

Raksha is a real-time digital safety platform built for the **ET AI Hackathon 2026** (Problem Statement 6: *AI for Digital Public Safety: Defeating Counterfeiting, Fraud & Digital Arrest Scams*). It targets the epidemic of **Digital Arrest** and government impersonation scams (CBI, ED, Customs, TRAI) which have defrauded citizens of over Rs 1,776 crore.

---

## Key Features

1. **RakshaCall (Citizen Protection View - `/shield`)**
   - Real-time AI analysis of suspicious calls, SMS warnings, or video call transcripts.
   - Powered by **Groq API (`llama-3.3-70b-versatile`)** in JSON mode.
   - Returns instant risk score (0-100), risk level (High/Medium/Low), detected indicators, claimed entity, and actionable protective guidance.
   - Built-in one-click demo presets.

2. **RakshaGraph (Investigator Dashboard - `/graph`)**
   - Python **NetworkX connected components engine** clusters isolated citizen complaints into organized fraud networks based on shared phone numbers, UPI accounts, claimed authorities, and script patterns.
   - Interactive force-directed network graph color-coded by syndicate ring.
   - Detailed side-panel displaying shared phone numbers, shared UPI accounts, and linked complaints.

---

## Tech Stack

- **Backend**: FastAPI (Python), SQLite via SQLAlchemy, NetworkX, Groq SDK / OpenAI compatible client.
- **Frontend**: Next.js 15 (App Router), Tailwind CSS, Lucide Icons, `vis-network` for interactive graph visualization.
- **LLM Model**: `llama-3.3-70b-versatile` via Groq (`https://api.groq.com/openai/v1`).

---

## Quick Setup & Running Instructions

### 1. Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### 2. Backend Setup
```bash
# Navigate to backend folder
cd backend

# Install dependencies
pip install -r requirements.txt

# (Optional) Set your Groq API Key obtained from https://console.groq.com
# Windows PowerShell:
$env:GROQ_API_KEY="your_groq_api_key_here"
# Linux/macOS:
export GROQ_API_KEY="your_groq_api_key_here"

# Run FastAPI backend server (Runs on http://127.0.0.1:8000)
python -m uvicorn main:app --reload --port 8000
```
*Note: The backend automatically populates 28 realistic synthetic Digital Arrest scam incidents across 3 fraud rings on first startup so the graph visualization works immediately.*

### 3. Frontend Setup
```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Run Next.js development server (Runs on http://localhost:3000)
npm run dev
```

---

## 3-Minute Live Hackathon Demo Walkthrough

1. **Open `http://localhost:3000`** (Citizen View).
2. **Select Preset 1** (*Customs & FedEx Drug Parcel Threat*) or **Preset 2** (*CBI HQ 42-Crore Digital Arrest Warrant*).
3. **Click "Analyze Call for Scam Indicators"**: Watch Groq AI evaluate scam vectors, assign a High Risk rating (95+), list detected indicators, and display protective action guidance.
4. **Switch to "Investigator Graph" via top Navbar toggle** (`/graph`): Observe how the call you just analyzed connects into an active, color-coded **Fraud Ring Syndicate**.
5. **Interact with the Graph**: Click syndicate filter tabs and select nodes to view shared phone numbers (`+919876543210`), shared UPI IDs (`mumbai.customs@icici`), and linked victim complaints.
