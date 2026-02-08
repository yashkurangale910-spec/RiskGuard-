import asyncio
from app.config.database import AsyncSessionLocal
from app.models.database_models import User
from sqlalchemy.future import select

async def check_user():
    async with AsyncSessionLocal() as db:
        result = await db.execute(select(User).where(User.email == 'sarah.jenkins@riskguard.com'))
        user = result.scalars().first()
        if user:
            print(f"✓ User found: {user.email}")
            print(f"✓ Full name: {user.full_name}")
            print(f"✓ Role: {user.role}")
            print(f"✓ Active: {user.is_active}")
        else:
            print("✗ User NOT found in database!")
            print("\nChecking all users:")
            all_users = await db.execute(select(User))
            for u in all_users.scalars().all():
                print(f"  - {u.email} ({u.role})")

asyncio.run(check_user())
