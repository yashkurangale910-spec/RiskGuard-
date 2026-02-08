import requests
import random
import json

BASE_URL = "http://localhost:8000/api/students/"

students_data = [
    {"name": "Raj Mundhe", "seat_no": 39},
    {"name": "Aryan Patil", "seat_no": 40},
    {"name": "Parth Mhatre", "seat_no": 37},
    {"name": "Sanika Mokal", "seat_no": 38},
    {"name": "Shruti Pawar", "seat_no": 36},
    {"name": "Sakshi Mhatre", "seat_no": 41},
    {"name": "Tejaswini Bisure", "seat_no": 42},
    {"name": "Omkar Jadhav", "seat_no": 43},
    {"name": "Om Bhoir", "seat_no": 44},
    {"name": "Prem Patil", "seat_no": 45},
    {"name": "Srushti Gondhali", "seat_no": 46},
    {"name": "Kedar Dere", "seat_no": 47},
    {"name": "Vedant Kamble", "seat_no": 48},
    {"name": "Diksha Badhe", "seat_no": 49},
    {"name": "Shantanu Shinde", "seat_no": 50},
    {"name": "Shreya Pawar", "seat_no": 51},
    {"name": "Rupali Anande", "seat_no": 52},
    {"name": "Amisha Bhoir", "seat_no": 53},
    {"name": "Manthan Bhayade", "seat_no": 54},
    {"name": "Ayush Chalke", "seat_no": 55},
    {"name": "Aditi Chavarkar", "seat_no": 56},
    {"name": "Sanchita Chogale", "seat_no": 57},
    {"name": "Viraj Deshmukh", "seat_no": 58},
    {"name": "Tarun Sabale", "seat_no": 59},
    {"name": "Neha Deshmukh", "seat_no": 60},
    {"name": "Yash Chavan", "seat_no": 61},
    {"name": "Pratiksha Bhoir", "seat_no": 62},
    {"name": "Vidhi Ghelot", "seat_no": 63},
    {"name": "Darshan Pingale", "seat_no": 64},
    {"name": "Atharv Ingale", "seat_no": 65},
    {"name": "Vedika Jagtap", "seat_no": 66},
    {"name": "Jay Karawale", "seat_no": 67},
    {"name": "Sujal Mhase", "seat_no": 68},
    {"name": "Purva Patil", "seat_no": 69},
    {"name": "Prachi Patil", "seat_no": 70},
    {"name": "Pooja Juikar", "seat_no": 71},
    {"name": "Nil Tamboli", "seat_no": 72},
    {"name": "Soham Patil", "seat_no": 73},
    {"name": "Sibaraj Lenka", "seat_no": 74}
]

# Risk Profiles to ensure distribution
# 0: Low Risk (High Attendance, High GPA)
# 1: Moderate Risk (Mixed)
# 2: High Risk (Low Attendance, Low GPA)
RISK_PROFILES = [
    {"attendance_range": (90, 100), "gpa_range": (3.5, 4.0)}, # Low Risk - Star Students
    {"attendance_range": (85, 95), "gpa_range": (3.0, 3.8)},  # Low Risk - Good Students
    {"attendance_range": (75, 85), "gpa_range": (2.5, 3.2)},  # Moderate Risk - Average
    {"attendance_range": (60, 75), "gpa_range": (2.0, 2.8)},  # Moderate Risk - Struggling
    {"attendance_range": (40, 60), "gpa_range": (1.5, 2.2)},  # High Risk - At Risk
]

print(f"Starting seed process for {len(students_data)} students...")
print("-" * 60)
print(f"{'Name':<20} | {'ID':<15} | {'Risk':<10} | {'Score':<5} | {'Insight'}")
print("-" * 60)

for student in students_data:
    # Assign a random risk profile
    profile = random.choice(RISK_PROFILES)
    
    attendance = round(random.uniform(*profile["attendance_range"]), 1)
    gpa = round(random.uniform(*profile["gpa_range"]), 2)
    
    # Generate Payload
    payload = {
        "student_id": f"SYBscIT-A-{student['seat_no']}",
        "name": student["name"],
        "grade": "SYBsc.IT A",
        "avatar_id": f"avatar_{random.randint(1, 10)}",
        "attendance_rate": attendance,
        "gpa": gpa
    }
    
    try:
        response = requests.post(BASE_URL, json=payload)
        if response.status_code == 201:
            data = response.json()
            print(f"{data['name']:<20} | {data['student_id']:<15} | {data['risk_score']:<5} | {data['ai_insight'][:50]}...")
        else:
            print(f"Failed to add {student['name']}: {response.text}")
    except Exception as e:
        print(f"Error connecting to API: {e}")

print("-" * 60)
print("Seeding Complete.")
