import sqlite3
import pandas as pd

# Connect to the database
try:
    conn = sqlite3.connect('d:/RAJ PROJECT/riskguard_temp_backend.db')
    cursor = conn.cursor()
    
    # Query all students
    cursor.execute("SELECT student_id, name, risk_score, ai_insight FROM students WHERE is_active = 1")
    rows = cursor.fetchall()
    
    # Sort key extraction
    def get_seat_no(row):
        try:
            return int(row[0].split('-')[-1])
        except:
            return 999

    rows.sort(key=get_seat_no)

    print(f"| Seat No | Name | Risk Level | Score | AI Insight |")
    print(f"| :--- | :--- | :--- | :--- | :--- |")
    
    for row in rows:
        student_id, name, score, insight = row
        seat_no = student_id.split('-')[-1]
        
        level = "LOW"
        if score >= 70: level = "HIGH"
        elif score >= 40: level = "MODERATE"
        
        emoji = "🟢"
        if level == "HIGH": emoji = "🔴"
        elif level == "MODERATE": emoji = "🟡"
        
        insight_text = insight if insight else "N/A"
        insight_text = insight_text.replace('\n', ' ').replace('|', '-')[:100] + "..." if len(insight_text) > 100 else insight_text
        
        print(f"| {seat_no} | {name} | {emoji} {level} | {score} | {insight_text} |")

except Exception as e:
    print(f"Error reading DB: {e}")
finally:
    if 'conn' in locals():
        conn.close()
