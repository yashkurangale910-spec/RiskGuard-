import asyncio
import random
from datetime import datetime, timedelta
from app.config.database import AsyncSessionLocal, engine, Base
from app.models.database_models import Student, Intervention, RiskHistory

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

INTERVENTION_TEMPLATES = [
    {
        "title": "Academic Tutoring",
        "descriptions": ["Struggling with Calculus concepts", "Need help with Python basics", "Failing multiple quizzes"],
        "priority": "high"
    },
    {
        "title": "Behavioral Counseling",
        "descriptions": ["Disruptive in class", "Consistently late", "Conflict with peers"],
        "priority": "medium"
    },
    {
        "title": "Attendance Monitoring",
        "descriptions": ["Absent from 3 consecutive labs", "Pattern of Monday absences", "below 75% attendance"],
        "priority": "urgent"
    },
    {
        "title": "Parent Meeting",
        "descriptions": ["Discuss sudden grade drop", "Behavioral concerns requiring guardian input"],
        "priority": "high"
    }
]

async def seed():
    # Recreate tables to clear old data
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as session:
        created_students = []
        for name, grade, seat_no, year in STUDENTS_DATA:
            # Generate risk data
            risk_score = random.randint(10, 95)
            attendance = random.uniform(60, 100)
            gpa = random.uniform(1.5, 4.0)
            
            # Determine primary factor based on random logic
            factors = []
            if risk_score > 70:
                if attendance < 75: factors.append("Attendance")
                if gpa < 2.5: factors.append("Grades")
                if random.random() > 0.7: factors.append("Behavior")
            
            student = Student(
                student_id=f"ST-{seat_no}",
                name=name,
                grade=f"{grade} ({year})",
                avatar_id=name[:2].upper(),
                risk_score=risk_score,
                attendance_rate=round(attendance, 1),
                gpa=round(gpa, 2),
                last_event="Database Seeded",
                improvement_rate=round(random.uniform(-5, 5), 1),
                factors=", ".join(factors)
            )
            session.add(student)
            await session.flush() # Get student id
            
            # 3. Create historical data (3-5 points)
            for i in range(random.randint(3, 6)):
                # Backdate by 7-30 days each step
                recorded_at = datetime.now() - timedelta(days=i*15)
                history = RiskHistory(
                    student_id=student.id,
                    risk_score=max(0, min(100, student.risk_score + random.randint(-20, 20))),
                    recorded_at=recorded_at
                )
                session.add(history)

            created_students.append(student)

        # Create Interventions for High Risk Students
        count_interventions = 0
        for student in created_students:
            if student.risk_score > 60:
                # Add 1-2 interventions
                num_interventions = random.randint(1, 2)
                for _ in range(num_interventions):
                    template = random.choice(INTERVENTION_TEMPLATES)
                    status = random.choice(["pending", "inProgress", "resolved"])
                    progress = random.randint(0, 100) if status != "pending" else 0
                    if status == "resolved": progress = 100

                    intervention = Intervention(
                        student_id=student.id,
                        title=template["title"],
                        description=random.choice(template["descriptions"]),
                        status=status,
                        priority=template["priority"],
                        progress=progress,
                        next_date=(datetime.now() + timedelta(days=random.randint(1, 14))).strftime("%Y-%m-%d"),
                        notes_count=random.randint(0, 5)
                    )
                    session.add(intervention)
                    count_interventions += 1

        await session.commit()
        print(f"Successfully seeded {len(created_students)} students and {count_interventions} interventions.")

if __name__ == "__main__":
    asyncio.run(seed())
