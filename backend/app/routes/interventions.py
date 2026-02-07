from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.config.database import get_db
from app.models.database_models import Intervention as DBIntervention, Student as DBStudent
from app.models.schemas import InterventionCard, InterventionColumn, InterventionUpdate, InterventionCreate, InterventionCreate
from typing import Dict, List
from sqlalchemy.orm import joinedload

router = APIRouter(prefix="/api/interventions", tags=["interventions"])

@router.get("/")
async def get_interventions(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(DBIntervention).options(joinedload(DBIntervention.student))
    )
    interventions = result.scalars().all()
    
    columns = {
        "pending": {"title": "Pending Action", "count": 0, "color": "orange", "cards": []},
        "inProgress": {"title": "In Progress", "count": 0, "color": "blue", "cards": []},
        "resolved": {"title": "Resolved", "count": 0, "color": "green", "cards": []}
    }
    
    for inter in interventions:
        if not inter.student:
            continue
            
        card = {
            "id": inter.id,
            "name": inter.student.name,
            "studentId": inter.student.student_id,
            "avatar": inter.student.avatar_id,
            "trigger": inter.description,
            "riskScore": inter.student.risk_score,
            "tag": inter.title,
            "goalProgress": inter.progress,
            "nextDate": inter.next_date,
            "notes": inter.notes_count
        }
        
        status = inter.status
        if status in columns:
            columns[status]["cards"].append(card)
            columns[status]["count"] += 1
            
    return columns

@router.post("/")
async def add_intervention(data: InterventionCreate, db: AsyncSession = Depends(get_db)):
    # Find student by student_id string
    result = await db.execute(select(DBStudent).where(DBStudent.student_id == data.student_id))
    student = result.scalar_one_or_none()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
        
    db_inter = DBIntervention(
        student_id=student.id,
        title=data.title,
        description=data.description,
        status=data.status,
        priority=data.priority,
        next_date=data.next_date
    )
    db.add(db_inter)
    await db.commit()
    return {"message": "Intervention created successfully"}

@router.post("/{card_id}/move")
async def move_card(card_id: int, update: InterventionUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(DBIntervention).where(DBIntervention.id == card_id))
    intervention = result.scalar_one_or_none()
    if not intervention:
        raise HTTPException(status_code=404, detail="Intervention not found")
    
    intervention.status = update.status
    intervention.progress = update.progress
    await db.commit()
    return {"message": f"Intervention {card_id} moved to {update.status}"}
