"""
Verify Data Integrity and Risk Tracking
This script checks:
1. Database has students and interventions (Dashboard verification)
2. Risk history records exist (Risk tracking verification)
"""
import asyncio
import sys
import os
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
from app.config.database import AsyncSessionLocal
from app.models.database_models import Student, RiskHistory, Intervention

async def verify_db_state():
    print("=" * 60)
    print("DATABASE INTEGRITY & RISK TRACKING VERIFICATION")
    print("=" * 60)
    
    async with AsyncSessionLocal() as db:
        # 1. Check Student Counts
        student_count_res = await db.execute(select(func.count(Student.id)))
        student_count = student_count_res.scalar()
        print(f"\n✓ Total Active Students: {student_count}")
        
        # 2. Check Intervention Counts
        intervention_count_res = await db.execute(select(func.count(Intervention.id)))
        intervention_count = intervention_count_res.scalar()
        print(f"✓ Total Interventions: {intervention_count}")
        
        if student_count > 0:
            # Check first student's history
            result = await db.execute(select(Student).where(Student.is_active == True))
            students = result.scalars().all()
            first_student = students[0]
            print(f"\n📊 Sample Student: {first_student.name} ({first_student.student_id})")
            print(f"   Current Risk Score: {first_student.risk_score}")
            
            # Get history
            history_result = await db.execute(
                select(RiskHistory)
                .where(RiskHistory.student_id == first_student.id)
                .order_by(RiskHistory.recorded_at.desc())
            )
            history = history_result.scalars().all()
            print(f"\n✓ Risk History Records for Sample: {len(history)}")
            
            if history:
                print("\n📈 Recent History Entries:")
                for i, h in enumerate(history[:3], 1):
                    print(f"   {i}. Score: {h.risk_score} | Date: {h.recorded_at}")
            else:
                print("\n⚠️  WARNING: No risk history found for this student!")
        else:
            print("\n⚠️  WARNING: No students found in database!")
            print("   Action Suggested: Run 'python -m app.seed_production_data'")
        
        # 3. Final Conclusion
        print("\n" + "=" * 60)
        if student_count > 0 and intervention_count > 0:
            print("✅ DATABASE HAS DATA - Dashboard should be showing records.")
        else:
            print("❌ DATABASE IS EMPTY OR PARTIAL - Run seed script.")
        
        if student_count > 0 and 'history' in locals() and history:
            print("✅ RISK TRACKING IS FUNCTIONAL - History records found.")
        else:
            print("❌ RISK TRACKING MISSING HISTORY - Verify logic or re-save student.")
        print("=" * 60)

if __name__ == "__main__":
    asyncio.run(verify_db_state())
