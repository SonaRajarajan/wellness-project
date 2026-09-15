import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "ai_ml_modules" in data
    assert "kaggle_datasets" in data

def test_health_prediction():
    payload = {
        "employee_id": "EMP-1001",
        "historical_days": 7,
        "predict_days": 3
    }
    response = client.post("/api/v1/health-prediction/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["employee_id"] == "EMP-1001"
    assert len(data["predicted_metrics"]) == 3

def test_exercise_analysis():
    payload = {
        "employee_id": "EMP-1001",
        "exercise_type": "Squat"
    }
    response = client.post("/api/v1/exercise-analysis/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["exercise_type"] == "Squat"
    assert "form_quality_score" in data
    assert "stgcn_movement_quality" in data

def test_health_risk():
    payload = {
        "employee_id": "EMP-1001",
        "workload_hours_per_week": 55.0,
        "sleep_avg_hours": 5.5,
        "hrv_ms": 35.0,
        "stress_level_1_to_10": 8.0,
        "leave_days_taken": 1
    }
    response = client.post("/api/v1/health-risk/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "burnout_risk_score" in data
    assert "risk_category" in data

def test_anomaly_detection():
    payload = {
        "sensor_logs": [
            {
                "subject_id": "SUBJ-01",
                "dataset_name": "MotionSense",
                "acc_x": 0.2, "acc_y": 9.81, "acc_z": 0.4,
                "gyro_x": 0.01, "gyro_y": 0.02, "gyro_z": 0.01
            },
            {
                "subject_id": "SUBJ-02",
                "dataset_name": "Walker_Fall",
                "acc_x": 4.5, "acc_y": 16.2, "acc_z": 7.8,
                "gyro_x": 3.1, "gyro_y": 4.2, "gyro_z": 2.1
            }
        ]
    }
    response = client.post("/api/v1/anomaly-detection/evaluate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["total_samples"] == 2
    assert "fall_events_predicted" in data

def test_datasets_catalog():
    response = client.get("/api/v1/datasets/catalog")
    assert response.status_code == 200
    data = response.json()
    assert "MotionSense" in data
    assert "UCI_HAR" in data
    assert "KU_HAR" in data
    assert "Walker_Fall" in data
    assert "Elderly_Fall_IoT" in data
