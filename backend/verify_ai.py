import requests
import json

base_url = "http://localhost:8000/api/students/ST-39"
payload = {
    "attendance_rate": 65,
    "gpa": 1.8
}
headers = {
    "Content-Type": "application/json"
}

try:
    print(f"Sending PUT request to {base_url}...")
    response = requests.put(base_url, data=json.dumps(payload), headers=headers)
    print(f"Status Code: {response.status_code}")
    print("Response Data:")
    print(json.dumps(response.json(), indent=4))
except Exception as e:
    print(f"Error: {e}")
