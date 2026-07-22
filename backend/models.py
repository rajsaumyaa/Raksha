# pyrefly: ignore [missing-import]
from sqlalchemy import Column, Integer, String, Text, DateTime, JSON
from datetime import datetime
from database import Base

class Incident(Base):
    __tablename__ = "incidents"

    id = Column(Integer, primary_key=True, index=True)
    transcript = Column(Text, nullable=False)
    risk_score = Column(Integer, nullable=False)
    risk_level = Column(String, nullable=False)
    indicators = Column(JSON, nullable=False, default=list)
    claimed_authority = Column(String, nullable=True)
    warning_message = Column(Text, nullable=False)
    phone_numbers = Column(JSON, nullable=False, default=list)
    upi_ids = Column(JSON, nullable=False, default=list)
    created_at = Column(DateTime, default=datetime.utcnow)
