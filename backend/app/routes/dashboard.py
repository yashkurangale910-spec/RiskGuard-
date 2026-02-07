from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
from app.config.database import get_db
from app.models.database_models import Student as DBStudent, Intervention as DBIntervention
from app.models.schemas import StudentStats, DropoutTrend
from typing import List

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])

@router.get("/stats", response_model=StudentStats)
async def get_stats(db: AsyncSession = Depends(get_db)):
    # Total Students
    total_result = await db.execute(select(func.count(DBStudent.id)).where(DBStudent.is_active == True))
    total_students = total_result.scalar() or 0
    
    # High Risk (Risk Score > 70)
    high_risk_result = await db.execute(select(func.count(DBStudent.id)).where(DBStudent.risk_score > 70, DBStudent.is_active == True))
    high_risk_students = high_risk_result.scalar() or 0
    
    # Active Interventions for active students
    inter_result = await db.execute(
        select(func.count(DBIntervention.id))
        .join(DBStudent)
        .where(DBIntervention.status != "resolved", DBStudent.is_active == True)
    )
    active_interventions = inter_result.scalar() or 0
    
    # Improvement Rate (Mocked or calculated from historical data if available)
    improvement_rate = 12.5
    
    return {
        "total_students": total_students,
        "high_risk_students": high_risk_students,
        "active_interventions": active_interventions,
        "improvement_rate": improvement_rate
    }

@router.get("/trends", response_model=List[DropoutTrend])
async def get_trends(db: AsyncSession = Depends(get_db)):
    # In a real app, this would query a 'trends' or 'history' table
    # For now, we return mock trends as historical data is not yet recorded
    return [
        {"month": "SEP", "value": 45},
        {"month": "OCT", "value": 52},
        {"month": "NOV", "value": 58},
        {"month": "DEC", "value": 67},
        {"month": "JAN", "value": 71},
        {"month": "FEB", "value": 74}
    ]
