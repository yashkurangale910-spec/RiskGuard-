from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime

# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: str = "counselor"

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: str
    is_active: bool = True

    class Config:
        from_attributes = True

# Student Schemas
class RiskIndicator(BaseModel):
    category: str
    value: str
    impact_score: int

class StudentBase(BaseModel):
    name: str
    grade: str
    student_id: str
    avatar_id: str

class StudentCreate(StudentBase):
    attendance_rate: float
    gpa: float

class StudentUpdate(BaseModel):
    attendance_rate: Optional[int] = None
    gpa: Optional[float] = None
    risk_score: Optional[int] = None

class StudentNoteBase(BaseModel):
    content: str
    category: str

class StudentNoteCreate(StudentNoteBase):
    pass

class StudentNote(StudentNoteBase):
    id: int
    student_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class RiskHistory(BaseModel):
    id: int
    student_id: int
    risk_score: int
    recorded_at: datetime

    class Config:
        from_attributes = True

class Student(StudentBase):
    id: str
    risk_score: int = 0
    factors: str = ""
    last_event: str
    improvement_rate: float = 0.0
    ai_insight: Optional[str] = None
    is_active: bool = True
    notes: List[StudentNote] = []
    history: List[RiskHistory] = []

    class Config:
        from_attributes = True

# Intervention Schemas
class InterventionCreate(BaseModel):
    student_id: str
    title: str
    description: str
    status: str = "pending"
    priority: str = "medium"
    next_date: Optional[str] = None

class InterventionCard(BaseModel):
    id: int
    name: str
    studentId: str
    avatar: str
    trigger: Optional[str] = None
    riskScore: Optional[int] = None
    tag: Optional[str] = None
    goalProgress: Optional[int] = None
    nextDate: Optional[str] = None
    notes: Optional[int] = None
    success: Optional[bool] = None

class InterventionColumn(BaseModel):
    title: str
    count: int
    color: str
    cards: List[InterventionCard]

class InterventionUpdate(BaseModel):
    status: str
    progress: int

# Dashboard Schemas
class StudentStats(BaseModel):
    total_students: int
    high_risk_students: int
    active_interventions: int
    improvement_rate: float

class DropoutTrend(BaseModel):
    month: str
    value: int
