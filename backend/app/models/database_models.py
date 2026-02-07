from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.config.database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    full_name = Column(String)
    hashed_password = Column(String)
    role = Column(String, default="counselor")
    is_active = Column(Boolean, default=True)

class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(String, unique=True, index=True)
    name = Column(String)
    grade = Column(String)
    avatar_id = Column(String)
    risk_score = Column(Integer, default=0)
    attendance_rate = Column(Float, default=100.0)
    gpa = Column(Float, default=4.0)
    last_event = Column(String)
    improvement_rate = Column(Float, default=0.0)
    factors = Column(String, default="") # Comma-separated triggers
    ai_insight = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    
    notes = relationship("StudentNote", back_populates="student")
    history = relationship("RiskHistory", back_populates="student")

class StudentNote(Base):
    __tablename__ = "student_notes"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    content = Column(String)
    category = Column(String) # e.g., 'behavioral', 'personal', 'academic'
    created_at = Column(DateTime, default=datetime.utcnow)
    
    student = relationship("Student", back_populates="notes")

class RiskHistory(Base):
    __tablename__ = "risk_history"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    risk_score = Column(Integer)
    recorded_at = Column(DateTime, default=datetime.utcnow)
    
    student = relationship("Student", back_populates="history")

class Intervention(Base):
    __tablename__ = "interventions"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    title = Column(String)
    description = Column(String)
    status = Column(String, default="pending") # pending, inProgress, resolved
    priority = Column(String, default="medium")
    progress = Column(Integer, default=0)
    next_date = Column(String)
    notes_count = Column(Integer, default=0)
    
    student = relationship("Student")
