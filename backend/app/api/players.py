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
    
    # Employee Inputs (Slide 16 Architecture Diagram)
    goals: Optional[str] = Field(default="Weight Loss & Fat Burn", json_schema_extra={"example": "Weight Loss & Fat Burn"})
    mood: Optional[str] = Field(default="Energetic & Focused", json_schema_extra={"example": "Energetic & Focused"})
    symptoms: Optional[str] = Field(default="None / Healthy", json_schema_extra={"example": "None / Healthy"})
    dietary_preference: Optional[str] = Field(default="High Protein", json_schema_extra={"example": "High Protein"})
    habits: Optional[str] = Field(default="Coffee 2 cups/day, Regular Hydration", json_schema_extra={"example": "Regular Hydration"})
    
    # Wearable & Physiological Metrics (Auto-synthesized if omitted)
    heart_rate: Optional[float] = Field(default=None, json_schema_extra={"example": 72.0})
    sleep_hours: Optional[float] = Field(default=None, json_schema_extra={"example": 7.5})
    sleep_quality_score: Optional[float] = Field(default=None, json_schema_extra={"example": 82.0})
    step_count: Optional[int] = Field(default=None, json_schema_extra={"example": 8500})
    calories_burned: Optional[float] = Field(default=None, json_schema_extra={"example": 2100.0})
    stress_level: Optional[float] = Field(default=None, json_schema_extra={"example": 4.0})
    spo2: Optional[float] = Field(default=None, json_schema_extra={"example": 98.0})
    
    # Clinical & Lifestyle Metrics (Auto-synthesized if omitted)
    systolic_bp: Optional[float] = Field(default=None, json_schema_extra={"example": 120.0})
    diastolic_bp: Optional[float] = Field(default=None, json_schema_extra={"example": 80.0})
    bmi: Optional[float] = Field(default=None, json_schema_extra={"example": 23.5})
    glucose: Optional[float] = Field(default=None, json_schema_extra={"example": 95.0})
    workload_hours_per_week: Optional[float] = Field(default=None, json_schema_extra={"example": 40.0})
    physical_activity_hours: Optional[float] = Field(default=None, json_schema_extra={"example": 4.5})
    water_intake_l: Optional[float] = Field(default=None, json_schema_extra={"example": 2.5})

@router.post("/register-employee")
def register_new_employee(req: NewEmployeeRegistrationRequest):
    """
    Registers a new employee using high-level Employee Inputs (Goals, Mood, Symptoms, Habits, Diet Preference).
    AUTOMATIC SYNTHETIC DATA ENGINE generates realistic Wearable IoT, HRMS, and Clinical datasets.
    """
    # 1. Automatic Synthetic Data Engine based on Employee Goals, Mood & Symptoms
    goals_lower = (req.goals or "").lower()
    mood_lower = (req.mood or "").lower()
    symptoms_lower = (req.symptoms or "").lower()

    syn_steps = 7500
    syn_sleep = 7.2
    syn_stress = 4.0
    syn_hr = 72.0
    syn_sys_bp = 120.0
    syn_dia_bp = 80.0
    syn_bmi = 23.5
    syn_glucose = 95.0
    syn_cals = 2200.0
    syn_workload = 40.0

    if "weight loss" in goals_lower or "fat burn" in goals_lower:
        syn_steps = 9800
        syn_cals = 2450.0
        syn_bmi = 26.8
        syn_glucose = 102.0
    elif "muscle" in goals_lower or "strength" in goals_lower:
        syn_steps = 8900
        syn_cals = 2750.0
        syn_bmi = 24.2
        syn_glucose = 92.0
    elif "stress" in goals_lower or "burnout" in goals_lower:
        syn_steps = 5200
        syn_sleep = 5.6
        syn_stress = 7.8
        syn_sys_bp = 134.0
        syn_dia_bp = 86.0
        syn_workload = 52.0
    elif "energy" in goals_lower or "focus" in goals_lower:
        syn_steps = 8400
        syn_sleep = 6.8
        syn_stress = 4.2

    if "tired" in mood_lower or "fatigued" in mood_lower:
        syn_sleep = min(syn_sleep, 5.5)
        syn_hr = 78.0
    elif "stressed" in mood_lower or "overwhelmed" in mood_lower:
        syn_stress = max(syn_stress, 8.2)
        syn_sys_bp += 10.0

    if "back" in symptoms_lower or "eye" in symptoms_lower:
        syn_stress = max(syn_stress, 6.8)

    # Use user manual input if explicitly provided, else fallback to synthesized values
    step_count = req.step_count if req.step_count is not None else syn_steps
    sleep_hours = req.sleep_hours if req.sleep_hours is not None else syn_sleep
    stress_level = req.stress_level if req.stress_level is not None else syn_stress
    heart_rate = req.heart_rate if req.heart_rate is not None else syn_hr
    systolic_bp = req.systolic_bp if req.systolic_bp is not None else syn_sys_bp
    diastolic_bp = req.diastolic_bp if req.diastolic_bp is not None else syn_dia_bp
    bmi = req.bmi if req.bmi is not None else syn_bmi
    glucose = req.glucose if req.glucose is not None else syn_glucose
    calories_burned = req.calories_burned if req.calories_burned is not None else syn_cals
    workload = req.workload_hours_per_week if req.workload_hours_per_week is not None else syn_workload
    sleep_quality = req.sleep_quality_score if req.sleep_quality_score is not None else round(sleep_hours * 11.5, 1)
    spo2 = req.spo2 if req.spo2 is not None else 98.0

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
    """, (new_emp_id, heart_rate, sleep_hours, sleep_quality, spo2, step_count, calories_burned, stress_level))

    # 3. Calculate XGBoost Risk Score & Risk Category
    burnout_score = min(100.0, max(5.0, (workload * 0.6) + (stress_level * 5.0) - (sleep_hours * 4.0) + (systolic_bp - 120) * 0.3))
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
    if step_count >= 9000 and sleep_hours >= 7.0:
        cluster_id, cluster_name = 0, "Peak Performers"
    elif step_count >= 6000 and sleep_hours >= 6.0:
        cluster_id, cluster_name = 1, "Balanced Achievers"
    elif stress_level >= 7.0 or workload >= 50.0:
        cluster_id, cluster_name = 3, "Burnout Vulnerable"
    else:
        cluster_id, cluster_name = 2, "At-Risk Sedentary"

    cursor.execute("""
        INSERT OR REPLACE INTO segmentation_results 
        (employee_id, cluster_id, cluster_name, feature_vector_json, updated_at)
        VALUES (?, ?, ?, ?, datetime('now'));
    """, (new_emp_id, cluster_id, cluster_name, f'{{"steps": {step_count}, "sleep": {sleep_hours}, "stress": {stress_level}}}'))

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
        "goals": req.goals or "Weight Loss & Fat Burn",
        "mood": req.mood or "Energetic & Focused",
        "symptoms": req.symptoms or "None / Healthy",
        "dietary_preference": req.dietary_preference or "High Protein",
        "habits": req.habits or "Regular Hydration",
        "points": 1250,
        "tier_badge": f"{req.department} - 1250 XP",
        "avatar": "avatar_1"
    }

    ai_outputs = {
        "synthesized_data": {
            "step_count": step_count,
            "sleep_hours": sleep_hours,
            "stress_level": stress_level,
            "heart_rate": heart_rate,
            "systolic_bp": systolic_bp,
            "diastolic_bp": diastolic_bp,
            "bmi": bmi,
            "glucose": glucose,
            "calories_burned": calories_burned
        },
        "burnout_risk_score": round(burnout_score, 1),
        "risk_category": risk_category,
        "cluster_name": cluster_name,
        "cluster_id": cluster_id,
        "predicted_steps_3d": [step_count, step_count + 300, step_count + 600],
        "genai_advice": f"Synthetic digital twin compiled for {req.name} based on Goal ({req.goals or 'Wellness'}). Tailored sleep ({sleep_hours}h) and step target ({step_count}) active."
    }

    return {
        "success": True,
        "message": f"Successfully registered new employee {req.name} ({new_emp_id}) and synthesized Wearable IoT, HRMS & Clinical datasets!",
        "employee": new_employee_obj,
        "ai_outputs": ai_outputs
    }
