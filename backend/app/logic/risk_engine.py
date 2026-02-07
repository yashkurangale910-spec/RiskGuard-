def calculate_student_risk(attendance: float, gpa: float, behavior_score: int = 100) -> dict:
    """
    Smart Risk Scoring Algorithm
    Weights: 
    - Attendance: 40%
    - GPA: 40%
    - Behavior: 20%
    """
    
    # Normalize values to 0-100 scale where higher = higher risk
    attendance_risk = 100 - attendance
    
    # GPA Risk (Assuming scale 0-4.0)
    # 4.0 = 0 risk, 2.0 = 50 risk, 0 = 100 risk
    gpa_risk = (4.0 - gpa) * 25
    gpa_risk = max(0, min(100, gpa_risk))
    
    behavior_risk = 100 - behavior_score
    
    total_score = (attendance_risk * 0.4) + (gpa_risk * 0.4) + (behavior_risk * 0.2)
    
    # Determine risk level
    level = "LOW"
    if total_score >= 70:
        level = "HIGH"
    elif total_score >= 40:
        level = "MODERATE"
        
    # Identify triggers
    triggers = []
    if attendance < 85:
        triggers = ["Chronic Absence"]
    if gpa < 2.5:
        triggers.append("Academic Drop")
    if behavior_score < 70:
        triggers.append("Behavioral Issues")
        
    return {
        "score": int(total_score),
        "level": level,
        "triggers": triggers
    }
