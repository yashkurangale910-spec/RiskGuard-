import requests
import json

BASE_URL = "http://localhost:8000/api/students/"

def get_risk_emoji(level):
    if level == "HIGH":
        return "🔴"
    elif level == "MODERATE":
        return "🟡"
    else:
        return "🟢"

try:
    response = requests.get(BASE_URL)
    if response.status_code == 200:
        students = response.json()
        
        # Sort by Seat No (extracted from ID)
        def get_seat_no(student):
            try:
                return int(student['student_id'].split('-')[-1])
            except:
                return 999
        
        students.sort(key=get_seat_no)

        print(f"| Seat No | Name | Risk Level | Score | AI Insight |")
        print(f"| :--- | :--- | :--- | :--- | :--- |")
        
        for s in students:
            seat_no = s['student_id'].split('-')[-1]
            risk_emoji = get_risk_emoji(s.get('risk_level', 'LOW')) # Assuming risk_level is computed/returned or inferred
            # The API returns 'risk_score' but maybe not 'risk_level' explicitly in the root, 
            # let's infer it if needed or check the schema. 
            # Schema says: risk_score, factors, last_event. calculate_student_risk returns 'level'. 
            # But the Student model might not store 'level' directly ?? 
            # Looking at database_models.py, 'risk_score' is stored. 'level' is not a column.
            # But wait, looking at the seeding script output, it printed headers... 
            # efficient to just re-calculate level for display or use score.
            
            score = s['risk_score']
            level = "LOW"
            if score >= 70: level = "HIGH"
            elif score >= 40: level = "MODERATE"
            
            emoji = get_risk_emoji(level)
            
            insight = s.get('ai_insight', 'N/A')
            if insight:
                insight = insight.replace('\n', ' ').replace('|', '-')[:100] + "..." if len(insight) > 100 else insight
            
            print(f"| {seat_no} | {s['name']} | {emoji} {level} | {score} | {insight} |")
            
    else:
        print(f"Error: {response.status_code} - {response.text}")
except Exception as e:
    print(f"Error: {e}")
