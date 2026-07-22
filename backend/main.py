# pyrefly: ignore [missing-import]
from fastapi import FastAPI, Depends, HTTPException
# pyrefly: ignore [missing-import]
from fastapi.middleware.cors import CORSMiddleware
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import Session
# pyrefly: ignore [missing-import]
from pydantic import BaseModel
from typing import List, Optional
from contextlib import asynccontextmanager

from database import engine, Base, get_db
from models import Incident
from analyzer import analyze_transcript
from clustering import build_fraud_graph
from seed import seed_database

@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    db = next(get_db())
    try:
        seed_database(db)
    finally:
        db.close()
    yield

app = FastAPI(title="Raksha Digital Public Safety API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalyzeRequest(BaseModel):
    transcript: str

class IncidentResponse(BaseModel):
    id: int
    transcript: str
    risk_score: int
    risk_level: str
    indicators: List[str]
    claimed_authority: Optional[str] = None
    warning_message: str
    phone_numbers: List[str]
    upi_ids: List[str]

@app.get("/")
def root():
    return {
        "status": "online",
        "service": "Raksha Digital Public Safety API",
        "health": "/api/health",
        "docs": "/docs"
    }

@app.get("/api/health")
def health_check():
    return {"status": "ok", "service": "Raksha API"}

@app.post("/api/analyze", response_model=IncidentResponse)
def analyze_and_store_incident(payload: AnalyzeRequest, db: Session = Depends(get_db)):
    if not payload.transcript or not payload.transcript.strip():
        raise HTTPException(status_code=400, detail="Transcript text cannot be empty")
        
    analysis = analyze_transcript(payload.transcript)
    
    inc = Incident(
        transcript=payload.transcript,
        risk_score=analysis["risk_score"],
        risk_level=analysis["risk_level"],
        indicators=analysis["indicators"],
        claimed_authority=analysis["claimed_authority"],
        warning_message=analysis["warning_message"],
        phone_numbers=analysis["phone_numbers"],
        upi_ids=analysis["upi_ids"]
    )
    
    db.add(inc)
    db.commit()
    db.refresh(inc)
    
    return inc

@app.get("/api/incidents", response_model=List[IncidentResponse])
def get_flagged_incidents(db: Session = Depends(get_db)):
    incidents = db.query(Incident).filter(Incident.risk_level.in_(["medium", "high"])).all()
    return incidents

@app.get("/api/graph")
def get_fraud_network_graph(db: Session = Depends(get_db)):
    incidents = db.query(Incident).filter(Incident.risk_level.in_(["medium", "high"])).all()
    graph_data = build_fraud_graph(incidents)
    return graph_data
