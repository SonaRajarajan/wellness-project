from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_register_new_employee_endpoint():
    payload = {
        "name": "Rajarajan S",
        "department": "Alpha IT",
        "role": "Lead AI Engineer",
        "age": 28,
        "gender": "Male",
        "activity_level": "Moderately Active",
        "heart_rate": 72.0,
        "sleep_hours": 7.5,
        "sleep_quality_score": 85.0,
        "step_count": 9200,
        "calories_burned": 2200.0,
        "stress_level": 3.5,
        "spo2": 98.5,
        "systolic_bp": 118.0,
        "diastolic_bp": 78.0,
        "bmi": 23.2,
        "glucose": 92.0,
        "workload_hours_per_week": 40.0,
        "physical_activity_hours": 5.0,
        "water_intake_l": 2.8
    }

    response = client.post("/api/v1/players/register-employee", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "employee" in data
    assert data["employee"]["name"] == "Rajarajan S"
    assert "ai_outputs" in data
    assert "risk_category" in data["ai_outputs"]
    assert "cluster_name" in data["ai_outputs"]
