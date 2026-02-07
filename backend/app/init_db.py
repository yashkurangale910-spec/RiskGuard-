import asyncio
from app.config.database import engine, Base, AsyncSessionLocal
from app.models.database_models import Student, Intervention, User, StudentNote, RiskHistory
import random
from datetime import datetime, timedelta

# EXACT DATA PROVIDED BY USER
STUDENTS_DATA = [
    ("Raj Mundhe", "SYBsc.IT A", "39", "2025-26"),
    ("Aryan Patil", "SYBsc.IT A", "40", "2025-26"),
    ("Parth Mhatre", "SYBsc.IT A", "37", "2025-26"),
    ("Sanika Mokal", "SYBsc.IT A", "38", "2025-26"),
    ("Shruti Pawar", "SYBsc.IT A", "36", "2025-26"),
    ("Sakshi Mhatre", "SYBsc.IT A", "41", "2025-26"),
    ("Tejaswini Bisure", "SYBsc.IT A", "42", "2025-26"),
    ("Omkar Jadhav", "SYBsc.IT A", "43", "2025-26"),
    ("Om Bhoir", "SYBsc.IT A", "44", "2025-26"),
    ("Prem Patil", "SYBsc.IT A", "45", "2025-26"),
    ("Srushti Gondhali", "SYBsc.IT A", "46", "2025-26"),
    ("Kedar Dere", "SYBsc.IT A", "47", "2025-26"),
    ("Vedant Kamble", "SYBsc.IT A", "48", "2025-26"),
    ("Diksha Badhe", "SYBsc.IT A", "49", "2025-26"),
    ("Shantanu Shinde", "SYBsc.IT A", "50", "2025-26"),
    ("Shreya Pawar", "SYBsc.IT A", "51", "2025-26"),
    ("Rupali Anande", "SYBsc.IT A", "52", "2025-26"),
    ("Amisha Bhoir", "SYBsc.IT A", "53", "2025-26"),
    ("Manthan Bhayade", "SYBsc.IT A", "54", "2025-26"),
    ("Ayush Chalke", "SYBsc.IT A", "55", "2025-26"),
    ("Aditi Chavarkar", "SYBsc.IT A", "56", "2025-26"),
    ("Sanchita Chogale", "SYBsc.IT A", "57", "2025-26"),
    ("Viraj Deshmukh", "SYBsc.IT A", "58", "2025-26"),
    ("Tarun Sabale", "SYBsc.IT A", "59", "2025-26"),
    ("Neha Deshmukh", "SYBsc.IT A", "60", "2025-26"),
    ("Yash Chavan", "SYBsc.IT A", "61", "2025-26"),
    ("Pratiksha Bhoir", "SYBsc.IT A", "62", "2025-26"),
    ("Vidhi Ghelot", "SYBsc.IT A", "63", "2025-26"),
    ("Darshan Pingale", "SYBsc.IT A", "64", "2025-26"),
    ("Atharv Ingale", "SYBsc.IT A", "65", "2025-26"),
    ("Vedika Jagtap", "SYBsc.IT A", "66", "2025-26"),
    ("Jay Karawale", "SYBsc.IT A", "67", "2025-26"),
    ("Sujal Mhase", "SYBsc.IT A", "68", "2025-26"),
    ("Purva Patil", "SYBsc.IT A", "69", "2025-26"),
    ("Prachi Patil", "SYBsc.IT A", "70", "2025-26"),
    ("Pooja Juikar", "SYBsc.IT A", "71", "2025-26"),
    ("Nil Tamboli", "SYBsc.IT A", "72", "2025-26"),
    ("Soham Patil", "SYBsc.IT A", "73", "2025-26"),
    ("Sibaraj Lenka", "SYBsc.IT A", "74", "2025-26"),
]

async def init_db():
    print("Initializing Database with Production Data...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    
    async with AsyncSessionLocal() as session:
        for name, grade_base, seat_no, year in STUDENTS_DATA:
            # Deterministic Risk logic for "Analysis"
            # Logic: Patils are lower risk (mock example), others randomized but stable for demo
            random.seed(name) 
            risk = 15 if "Patil" in name else random.randint(20, 85)
            
            # Format ID and Grade
            student_id = f"ST-{seat_no}"
            grade = f"{grade_base} ({year})"
            
            s = Student(
                student_id=student_id,
                name=name,
                grade=grade,
                avatar_id=name[:2].upper(),
                risk_score=risk,
                attendance_rate=random.uniform(70, 99),
                gpa=random.uniform(2.0, 3.8),
                last_event="Database Initialized",
                improvement_rate=random.uniform(-5, 5),
                factors="Attendance Drop" if risk > 70 else "Late Submission" if risk > 40 else "On Track"
            )
            session.add(s)
            
            # Flush to generate ID for relations
            await session.flush()
            
            # Seed History (Last 6 months) for Charts
            for i in range(6):
                history_risk = max(10, min(100, risk + random.randint(-15, 15)))
                history = RiskHistory(
                    student_id=s.id,
                    risk_score=history_risk,
                    recorded_at=datetime.utcnow() - timedelta(days=30 * i)
                )
                session.add(history)
            
            # Seed a qualitative note for everyone
            note = StudentNote(
                student_id=s.id,
                content=f"Initial risk assessment for {name} completed. Academic performance is stable.",
                category="academic"
            )
            session.add(note)
        
        await session.commit()
    print(f"Database successfully seeded with {len(STUDENTS_DATA)} students and their history.")

if __name__ == "__main__":
    asyncio.run(init_db())
