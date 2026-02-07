import asyncio
import random
from app.config.database import AsyncSessionLocal, engine, Base
from app.models.database_models import Student, Intervention

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

async def seed():
    async with AsyncSessionLocal() as session:
        for name, grade, seat_no, year in STUDENTS_DATA:
            # Generate some random risk data for demonstration
            risk_score = random.randint(10, 95)
            attendance = random.uniform(60, 100)
            gpa = random.uniform(1.5, 4.0)
            
            student = Student(
                student_id=f"ST-{seat_no}",
                name=name,
                grade=f"{grade} ({year})",
                avatar_id=name[:2].upper(),
                risk_score=risk_score,
                attendance_rate=round(attendance, 1),
                gpa=round(gpa, 2),
                last_event="Database Seeded",
                improvement_rate=round(random.uniform(-5, 5), 1)
            )
            session.add(student)
        
        await session.commit()
        print(f"Successfully seeded {len(STUDENTS_DATA)} students.")

if __name__ == "__main__":
    asyncio.run(seed())
