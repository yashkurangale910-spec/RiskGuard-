
import asyncio
from sqlalchemy import func
from sqlalchemy.future import select
from app.config.database import AsyncSessionLocal
from app.models.database_models import Student, Intervention, RiskHistory

async def debug_database():
    print("\n" + "="*40)
    print("      DATABASE DIAGNOSTIC REPORT")
    print("="*40)
    
    async with AsyncSessionLocal() as db:
        try:
            # Check Students
            student_count = (await db.execute(select(func.count(Student.id)))).scalar()
            print(f"📊 Total Students:      {student_count}")
            
            # Check Interventions
            intervention_count = (await db.execute(select(func.count(Intervention.id)))).scalar()
            print(f"🛠️  Total Interventions: {intervention_count}")
            
            # Check History
            history_count = (await db.execute(select(func.count(RiskHistory.id)))).scalar()
            print(f"📈 Risk History Points: {history_count}")
            
            print("="*40)
            if student_count > 0:
                print("✅ DATA STATUS: OK (Dashboard should populate)")
            else:
                print("❌ DATA STATUS: EMPTY (Run seed script)")
            print("="*40 + "\n")
            
        except Exception as e:
            print(f"❌ DATABASE ERROR: {str(e)}")

if __name__ == "__main__":
    asyncio.run(debug_database())
