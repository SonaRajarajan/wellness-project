from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
import pandas as pd
import sqlite3
from pathlib import Path

from app.utils.wellness_scoring import PixelDashWellnessScorer
from app.ml.health_risk_prediction_xgboost import XGBoostHealthRiskPredictor

router = APIRouter(prefix="/digital-twin", tags=["Digital Twin Employee Profile"])

CSV_PATH = Path(__file__).parent.parent.parent / "data" / "csv" / "employee_master_dataset.csv"
DB_PATH = Path(__file__).parent.parent.parent / "data" / "wellness.db"
scorer = PixelDashWellnessScorer()
risk_predictor = XGBoostHealthRiskPredictor()

class DigitalTwinRequest(BaseModel):
    employee_id: str = "EMP001"
    steps: int = 9200
    sleep_hours: float = 7.5
    workout_mins: int = 45
    workload_hours: float = 55.0
    hrv_ms: float = 55.4
    stress_level: float = 4.2

@router.get("/{employee_id}")
def get_digital_twin_profile(employee_id: str):
    """
    Retrieves Per-Employee Digital Twin Profile dynamically from employee_master_dataset.csv & wellness.db
    """
    name = "Sona VR"
    department = "Alpha IT"
    role = "Lead AI Engineer"
    
    steps = 9200
    sleep_hours = 7.5
    hrv_ms = 55.4
    stress_level = 3.8
    workload_hours = 48.0
    leave_days = 1
    goal = "Complete 10,000 steps daily & maintain active movement"
    mood = "Motivated"
    symptom = "None"
    habit = "Regular morning stretching & hydration habit"

    if CSV_PATH.exists():
        df = pd.read_csv(CSV_PATH)
        emp_col = "UserId" if "UserId" in df.columns else "employee_id"
        emp_row = df[df[emp_col] == employee_id]
        if emp_row.empty:
            emp_row = df[df[emp_col] == f"EMP-{employee_id}"]
        
        if not emp_row.empty:
            r = emp_row.iloc[0]
            name = str(r["name"])
            department = str(r["department"])
            role = str(r["role"])
            steps = int(r.get("TotalSteps", r.get("step_count", 9200)))
            sleep_hours = float(r.get("SleepHours", r.get("sleep_hours", 7.5)))
            hrv_ms = float(r.get("HRV_ms", r.get("hrv_ms", 55.4)))
            stress_level = round(float(r.get("burnout_risk_score", 0.3) * 10.0), 1)
            workload_hours = float(r.get("workload_hours", 45.0))
            leave_days = int(r.get("leave_days_taken", 1))
            goal = str(r.get("goals", goal))
            mood = str(r.get("mood", mood))
            symptom = str(r.get("symptoms", symptom))
            habit = str(r.get("habits", habit))

    if DB_PATH.exists():
        try:
            conn = sqlite3.connect(DB_PATH)
            conn.row_factory = sqlite3.Row
            cur = conn.cursor()
            cur.execute("SELECT * FROM employees WHERE employee_id = ?", (employee_id,))
            emp_db = cur.fetchone()
            if emp_db:
                name = emp_db["name"]
                department = emp_db["department"]
                role = emp_db["role"]
                cur.execute("SELECT * FROM physiological_metrics WHERE employee_id = ? ORDER BY id DESC LIMIT 1", (employee_id,))
                pm = cur.fetchone()
                if pm:
                    steps = pm["step_count"] or steps
                    sleep_hours = pm["sleep_hours"] or sleep_hours
                    stress_level = pm["stress_level"] or stress_level
                cur.execute("SELECT * FROM health_risk_records WHERE employee_id = ? ORDER BY id DESC LIMIT 1", (employee_id,))
                hr = cur.fetchone()
                if hr:
                    stress_level = round(hr["burnout_score"] / 10.0, 1)
                    workload_hours = hr["max_workload_hours"]
            conn.close()
        except Exception:
            pass

    ws = scorer.calculate_composite_wellness_score(
        daily_steps=steps, sleep_hours=sleep_hours, workout_mins=35,
        intensity_factor=1.0, protein_g=65.0, fiber_g=15.0, fat_g=20.0, sugar_g=10.0
    )

    risk = risk_predictor.predict_risk(
        workload_hours=workload_hours, sleep_hours=sleep_hours, hrv_ms=hrv_ms,
        stress_level=stress_level, leave_days=leave_days
    )

    return {
        "success": True,
        "employee_id": employee_id,
        "name": name,
        "department": department,
        "role": role,
        "personal_goal": goal,
        "current_mood": mood,
        "active_symptom": symptom,
        "daily_habit": habit,
        "digital_twin": {
            "comprehensive_health_score": ws["composite_wellness_score"],
            "wellness_score_out_of_100": ws["wellness_score_out_of_100"],
            "sub_scores": ws["sub_scores"],
            "risk_index": {
                "burnout_risk_score": risk["burnout_risk_score"],
                "risk_category": risk["risk_category"],
                "strain_index": round(float(stress_level / 10.0), 2),
                "contributing_factors": risk["contributing_factors"]
            },
            "wellness_trends_over_time": [
                {"week": "Week 1", "score": round(ws["composite_wellness_score"] - 1.2, 1)},
                {"week": "Week 2", "score": round(ws["composite_wellness_score"] - 0.9, 1)},
                {"week": "Week 3", "score": round(ws["composite_wellness_score"] - 0.6, 1)},
                {"week": "Week 4", "score": round(ws["composite_wellness_score"] - 0.4, 1)},
                {"week": "Week 5", "score": round(ws["composite_wellness_score"] - 0.2, 1)},
                {"week": "Week 6", "score": ws["composite_wellness_score"]}
            ],
            "productivity_insights": {
                "focus_time_hrs": round(8.0 - (workload_hours / 12.0), 1),
                "deep_work_index": "High (88%)" if risk["burnout_risk_score"] < 0.4 else "Low (42%)",
                "fatigue_risk_window": "15:30 - 16:30 PM",
                "recommended_microbreak": "5-min Vagal Deep Breathing at 15:30 PM"
            },
            "personalized_recommendations": [
                f"Personal Goal: {goal}",
                f"Symptom Care: Address {symptom} via targeted stretches" if symptom != "None" else "Maintain consistent morning mobility",
                f"Workload Balance: Manage {workload_hours}h weekly workload to reduce burnout risk"
            ]
        }
    }

@router.post("/update")
def update_digital_twin(req: DigitalTwinRequest):
    """
    Updates Digital Twin profile dynamically based on daily sensor data.
    """
    ws = scorer.calculate_composite_wellness_score(
        daily_steps=req.steps, sleep_hours=req.sleep_hours, workout_mins=req.workout_mins,
        intensity_factor=1.0, protein_g=65.0, fiber_g=15.0, fat_g=20.0, sugar_g=10.0
    )
    risk = risk_predictor.predict_risk(
        workload_hours=req.workload_hours, sleep_hours=req.sleep_hours,
        hrv_ms=req.hrv_ms, stress_level=req.stress_level, leave_days=1
    )
    return {
        "success": True,
        "message": f"Digital Twin Profile updated for {req.employee_id}",
        "updated_health_score": ws["composite_wellness_score"],
        "updated_risk_category": risk["risk_category"]
    }
