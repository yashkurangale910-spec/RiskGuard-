from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.config.database import get_db
from app.models.database_models import Student as DBStudent, RiskHistory, StudentNote
from app.models.schemas import Student, StudentUpdate, StudentCreate, StudentNoteCreate
from app.logic.risk_engine import calculate_student_risk
from app.logic.ai_service import get_ai_risk_insight
from typing import List
from sqlalchemy.orm import selectinload

router = APIRouter(prefix="/api/students", tags=["students"])

@router.get("/", response_model=List[Student])
async def get_students(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(DBStudent).where(DBStudent.is_active == True))
    students = result.scalars().all()
    return students

@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_student(student: StudentCreate, db: AsyncSession = Depends(get_db)):
    # 1. Calculate Initial Risk
    risk_data = calculate_student_risk(student.attendance_rate, student.gpa)
    
    # 2. Get AI Insight
    student_info = {
        "name": student.name,
        "attendance_rate": student.attendance_rate,
        "gpa": student.gpa,
        "risk_score": risk_data["score"],
        "last_event": f"Initial: {', '.join(risk_data['triggers'])}" if risk_data["triggers"] else "Student Registered"
    }
    
    try:
        ai_insight = await get_ai_risk_insight(student_info)
    except:
        ai_insight = "Initial assessment pending."

    db_student = DBStudent(
        **student.dict(),
        risk_score=risk_data["score"],
        factors=", ".join(risk_data["triggers"]),
        last_event=student_info["last_event"],
        ai_insight=ai_insight
    )
    db.add(db_student)
    await db.commit()
    await db.refresh(db_student)
    
    # Seed initial history
    history = RiskHistory(student_id=db_student.id, risk_score=db_student.risk_score)
    db.add(history)
    await db.commit()
    
    return db_student

@router.post("/{student_id}/notes")
async def add_student_note(student_id: str, note: StudentNoteCreate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(DBStudent).where(DBStudent.student_id == student_id))
    student = result.scalar_one_or_none()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    db_note = StudentNote(
        student_id=student.id,
        content=note.content,
        category=note.category
    )
    db.add(db_note)
    await db.commit()
    return {"message": "Note added successfully"}

@router.get("/{student_id}", response_model=Student)
async def get_student(student_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(DBStudent)
        .options(selectinload(DBStudent.notes), selectinload(DBStudent.history))
        .where(DBStudent.student_id == student_id)
    )
    student = result.scalar_one_or_none()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student

@router.put("/{student_id}")
async def update_student(student_id: str, update: StudentUpdate, db: AsyncSession = Depends(get_db)):
    try:
        query = select(DBStudent).where(DBStudent.student_id == student_id)
        result = await db.execute(query)
        student = result.scalar_one_or_none()
        if not student:
            raise HTTPException(status_code=404, detail="Student not found")
        
        update_data = update.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(student, key, value)
        
        # 1. Recalculate Risk Score
        risk_data = calculate_student_risk(
            attendance=student.attendance_rate,
            gpa=student.gpa
        )
        student.risk_score = risk_data["score"]
        student.factors = ", ".join(risk_data["triggers"])
        student.last_event = f"Updated: {student.factors}" if student.factors else "Profile Updated"
        
        # 2. Generate AI Insight (Async)
        student_info = {
            "name": student.name,
            "attendance_rate": student.attendance_rate,
            "gpa": student.gpa,
            "risk_score": student.risk_score,
            "last_event": student.last_event
        }
        
        try:
            # This is already awaitable in logic/ai_service.py
            student.ai_insight = await get_ai_risk_insight(student_info)
        except Exception as ai_err:
            print(f"AI Insight Generation Error: {ai_err}")
            student.ai_insight = "Insight generation in progress or temporarily unavailable."

        await db.commit()
        return {
            "message": "Student updated successfully",
            "risk_score": student.risk_score,
            "ai_insight": student.ai_insight,
            "factors": student.factors
        }
    except Exception as e:
        print(f"CRITICAL API ERROR: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/{student_id}/archive")
async def archive_student(student_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(DBStudent).where(DBStudent.student_id == student_id))
    student = result.scalar_one_or_none()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    student.is_active = False
    await db.commit()
    return {"message": "Student archived successfully"}
