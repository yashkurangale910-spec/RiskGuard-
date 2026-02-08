"""
Verify Data Integrity and Risk Tracking (Silent)
"""
import asyncio
import logging
from sqlalchemy.future import select
from sqlalchemy import func
from app.config.database import AsyncSessionLocal
from app.models.database_models import Student, RiskHistory, Intervention

# Suppress SQLAlchemy logging
logging.getLogger('sqlalchemy.engine').setLevel(logging.WARNING)

async def verify_db_state():
    print("-" * 40)
    print("DATABASE STATE REPORT")
    print("-" * 40)
    
    async with AsyncSessionLocal() as db:
        # 1. Count Students
        s_count = (await db.execute(select(func.count(Student.id)))).scalar()
        print(f"Students: {s_count}")
        
        # 2. Count Interventions
        i_count = (await db.execute(select(func.count(Intervention.id)))).scalar()
        print(f"Interventions: {i_count}")
        
        # 3. Count Total Risk History
        h_count = (await db.execute(select(func.count(RiskHistory.id)))).scalar()
        print(f"Risk History Records: {h_count}")
        
        if s_count > 0:
            res = await db.execute(select(Student).limit(1))
            student = res.scalar()
            print(f"Sample Student: {student.name} (Risk: {student.risk_score}%)")
            
            h_res = await db.execute(select(RiskHistory).where(RiskHistory.student_id == student.id))
            h = h_res.scalars().all()
            print(f"History Entries for Sample: {len(h)}")
        
        print("-" * 40)
        if s_count == 0:
            print("STATUS: EMPTY - RUN SEED")
        else:
            print("STATUS: DATA PRESENT")
        print("-" * 40)

if __name__ == "__main__":
    asyncio.run(verify_db_state())
