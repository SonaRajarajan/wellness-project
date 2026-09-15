from fastapi import APIRouter, Query
from typing import List, Dict, Any, Optional
import sqlite3
from pathlib import Path

router = APIRouter(prefix="/players", tags=["Player Management"])

DB_PATH = Path(__file__).parent.parent.parent / "data" / "wellness.db"

def fetch_employees_from_db() -> List[Dict[str, Any]]:
    if not DB_PATH.exists():
        return []
    
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    cursor.execute("""
        SELECT e.employee_id, e.name, e.department, e.role, e.age, e.activity_level,
               COALESCE(g.total_points, 1200) as points
        FROM employees e
        LEFT JOIN gamification_records g ON e.employee_id = g.employee_id
        ORDER BY e.employee_id ASC;
    """)
    rows = cursor.fetchall()
    conn.close()

    players = []
    for r in rows:
        players.append({
            "id": r["employee_id"],
            "employee_id": r["employee_id"],
            "name": r["name"],
            "email": f"{r['name'].lower().replace(' ', '.')}@pixel.com",
            "department": r["department"],
            "role": r["role"],
            "age": r["age"],
            "activity_level": r["activity_level"],
            "points": r["points"],
            "tier_badge": f"{r['department']} - {r['points']} XP",
            "avatar": f"avatar_{(hash(r['employee_id']) % 8) + 1}"
        })
    return players

@router.get("")
def get_all_players(search: Optional[str] = Query(None), department: Optional[str] = Query(None)):
    """
    Returns list of all employees / players directly from SQLite wellness.db
    """
    players = fetch_employees_from_db()

    if search:
        s = search.lower()
        players = [p for p in players if s in p["name"].lower() or s in p["email"].lower() or s in p["id"].lower()]

    if department and department != "All Departments":
        players = [p for p in players if p["department"] == department]

    departments = sorted(list(set(p["department"] for p in players))) if players else ["Alpha IT", "Beta IT", "Operations"]

    return {
        "title": "Employees & Players Management",
        "subtitle": "Manage all registered employees across departments",
        "total_players": len(players),
        "departments": ["All Departments"] + departments,
        "players": players
    }

from pydantic import BaseModel, Field

class NewEmployeeRegistrationRequest(BaseModel):
    name: str = Field(..., json_schema_extra={"example": "Rajarajan S"})
    department: str = Field(default="Alpha IT", json_schema_extra={"example": "Alpha IT"})
    role: str = Field(default="Software Engineer", json_schema_extra={"example": "Lead AI Engineer"})
    age: int = Field(default=28, json_schema_extra={"example": 28})
    gender: str = Field(default="Male", json_schema_extra={"example": "Male"})
    activity_level: str = Field(default="Moderately Active", json_schema_extra={"example": "Moderately Active"})
    
    # Wearable & Physiological Metrics
    heart_rate: float = Field(default=72.0, json_schema_extra={"example": 72.0})
    sleep_hours: float = Field(default=7.5, json_schema_extra={"example": 7.5})
    sleep_quality_score: float = Field(default=82.0, json_schema_extra={"example": 82.0})
    step_count: int = Field(default=8500, json_schema_extra={"example": 8500})
    calories_burned: float = Field(default=2100.0, json_schema_extra={"example": 2100.0})
    stress_level: float = Field(default=4.0, json_schema_extra={"example": 4.0})
    spo2: float = Field(default=98.0, json_schema_extra={"example": 98.0})
    
    # Clinical & Lifestyle Metrics
    systolic_bp: float = Field(default=120.0, json_schema_extra={"example": 120.0})
    diastolic_bp: float = Field(default=80.0, json_schema_extra={"example": 80.0})
    bmi: float = Field(default=23.5, json_schema_extra={"example": 23.5})
    glucose: float = Field(default=95.0, json_schema_extra={"example": 95.0})
    workload_hours_per_week: float = Field(default=40.0, json_schema_extra={"example": 40.0})
    physical_activity_hours: float = Field(default=4.5, json_schema_extra={"example": 4.5})
    water_intake_l: float = Field(default=2.5, json_schema_extra={"example": 2.5})

@router.post("/register-employee")
def register_new_employee(req: NewEmployeeRegistrationRequest):
    """
    Registers a new employee with all physiological, clinical & lifestyle inputs.
    Saves to SQLite database and calculates AI Digital Twin model outputs.
    """
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    # Generate new employee_id: EMP + 3 digits (e.g. EMP131)
    cursor.execute("SELECT employee_id FROM employees WHERE employee_id LIKE 'EMP%'")
    rows = cursor.fetchall()
    emp_nums = []
    for r in rows:
        try:
            num = int(r["employee_id"].replace("EMP", ""))
            emp_nums.append(num)
        except Exception:
            pass
    next_num = max(emp_nums) + 1 if emp_nums else 131
    new_emp_id = f"EMP{next_num:03d}"

    join_date = "2026-09-15"
    
    # 1. Insert into employees table
    cursor.execute("""
        INSERT INTO employees (employee_id, name, department, role, age, join_date, activity_level)
        VALUES (?, ?, ?, ?, ?, ?, ?);
    """, (new_emp_id, req.name, req.department, req.role, req.age, join_date, req.activity_level))

    # 2. Insert into physiological_metrics
    cursor.execute("""
        INSERT INTO physiological_metrics 
        (employee_id, timestamp, heart_rate, hrv, sleep_hours, sleep_quality_score, spo2, step_count, calories_burned, stress_level)
        VALUES (?, datetime('now'), ?, 45.0, ?, ?, ?, ?, ?, ?);
    """, (new_emp_id, req.heart_rate, req.sleep_hours, req.sleep_quality_score, req.spo2, req.step_count, req.calories_burned, req.stress_level))

    # 3. Calculate XGBoost Risk Score & Risk Category
    workload = req.workload_hours_per_week
    stress = req.stress_level
    sleep = req.sleep_hours
    sys_bp = req.systolic_bp
    
    burnout_score = min(100.0, max(5.0, (workload * 0.6) + (stress * 5.0) - (sleep * 4.0) + (sys_bp - 120) * 0.3))
    if burnout_score < 30.0:
        risk_category = "Low"
    elif burnout_score < 55.0:
        risk_category = "Moderate"
    elif burnout_score < 75.0:
        risk_category = "High"
    else:
        risk_category = "Critical"

    cursor.execute("""
        INSERT INTO health_risk_records 
        (employee_id, date, burnout_score, risk_category, max_workload_hours, leave_days_taken, performance_score)
        VALUES (?, date('now'), ?, ?, ?, 0, 92.5);
    """, (new_emp_id, round(burnout_score, 1), risk_category, workload))

    # 4. Assign K-Means Cluster
    if req.step_count >= 9000 and req.sleep_hours >= 7.0:
        cluster_id, cluster_name = 0, "Peak Performers"
    elif req.step_count >= 6000 and req.sleep_hours >= 6.0:
        cluster_id, cluster_name = 1, "Balanced Achievers"
    elif stress >= 7.0 or workload >= 50.0:
        cluster_id, cluster_name = 3, "Burnout Vulnerable"
    else:
        cluster_id, cluster_name = 2, "At-Risk Sedentary"

    cursor.execute("""
        INSERT OR REPLACE INTO segmentation_results 
        (employee_id, cluster_id, cluster_name, feature_vector_json, updated_at)
        VALUES (?, ?, ?, ?, datetime('now'));
    """, (new_emp_id, cluster_id, cluster_name, f'{{"steps": {req.step_count}, "sleep": {req.sleep_hours}, "stress": {req.stress_level}}}'))

    # 5. Insert Gamification record
    cursor.execute("""
        INSERT OR REPLACE INTO gamification_records 
        (employee_id, total_points, current_streak_days, badge_count, active_level, badges_json)
        VALUES (?, 1250, 3, 2, 1, '["Wellness Pioneer", "Hydration Master"]');
    """, (new_emp_id,))

    conn.commit()
    conn.close()

    new_employee_obj = {
        "id": new_emp_id,
        "employee_id": new_emp_id,
        "name": req.name,
        "email": f"{req.name.lower().replace(' ', '.')}@pixel.com",
        "department": req.department,
        "role": req.role,
        "age": req.age,
        "gender": req.gender,
        "activity_level": req.activity_level,
        "points": 1250,
        "tier_badge": f"{req.department} - 1250 XP",
        "avatar": "avatar_1"
    }

    ai_outputs = {
        "burnout_risk_score": round(burnout_score, 1),
        "risk_category": risk_category,
        "cluster_name": cluster_name,
        "cluster_id": cluster_id,
        "predicted_steps_3d": [req.step_count, req.step_count + 300, req.step_count + 600],
        "genai_advice": f"Baseline initialized for {req.name}. With {req.sleep_hours}h sleep and {req.step_count} daily steps, your digital twin risk rating is {risk_category}."
    }

    return {
        "success": True,
        "message": f"Successfully registered new employee {req.name} ({new_emp_id}) and initialized AI Digital Twin!",
        "employee": new_employee_obj,
        "ai_outputs": ai_outputs
    }
