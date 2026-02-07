import os
from groq import AsyncGroq
from dotenv import load_dotenv
from pathlib import Path

# Get the path to the backend directory (.env location)
BASE_DIR = Path(__file__).resolve().parent.parent.parent
dotenv_path = BASE_DIR / ".env"
load_dotenv(dotenv_path=dotenv_path)

api_key = os.getenv("GROQ_API_KEY")
if not api_key:
    # Fallback for local testing if env loading fails
    api_key = os.getenv("GROQ_API_KEY")

client = AsyncGroq(api_key=api_key)

async def get_ai_risk_insight(student_data: dict) -> str:
    """
    Generate a qualitative risk summary using Groq AI.
    """
    try:
        prompt = f"""
        Analyze the following student data and provide a concise (1-2 sentence) risk insight.
        The system has already calculated a risk score and identified triggers.
        Your job is to provide a "human-like" clinical observation.
        
        Data:
        - Name: {student_data.get('name')}
        - Attendance: {student_data.get('attendance_rate')}%
        - GPA: {student_data.get('gpa')}
        - Risk Score: {student_data.get('risk_score')}
        - Current Status: {student_data.get('last_event')}
        
        Format: Return only the text of the insight.
        """
        
        response = await client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "You are an expert academic counselor specializing in student retention and success."
                },
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            model="mixtral-8x7b-32768",
            temperature=0.7,
            max_tokens=150,
        )
        
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"Error calling Groq: {e}")
        return "Insight currently unavailable. The student shows patterns requiring standard counselor review."
