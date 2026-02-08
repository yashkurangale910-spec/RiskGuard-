import asyncio
import os
import sys

# Add the parent directory to sys.path to allow imports from app
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.config.database import AsyncSessionLocal
from app.models.database_models import User
from app.utils.security import get_password_hash
from sqlalchemy.future import select

async def seed_users():
    async with AsyncSessionLocal() as db:
        # Check if admin exists
        result = await db.execute(select(User).where(User.email == "sarah.jenkins@riskguard.com"))
        user = result.scalars().first()
        
        if not user:
            print("Creating admin user Dr. Sarah Jenkins...")
            admin_user = User(
                email="sarah.jenkins@riskguard.com",
                full_name="Dr. Sarah Jenkins",
                hashed_password=get_password_hash("admin123"),
                role="admin",
                is_active=True
            )
            db.add(admin_user)
            await db.commit()
            print("Admin user created: sarah.jenkins@riskguard.com / admin123")
        else:
            print("Admin user Dr. Sarah Jenkins already exists.")

if __name__ == "__main__":
    asyncio.run(seed_users())
