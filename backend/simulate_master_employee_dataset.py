#!/usr/bin/env python3
"""
SIMULATE UNIFIED MASTER EMPLOYEE DATASET
Combines:
1. Kaggle Wearables Dataset (manideepreddy966/wearables-dataset):
   - UserId, ActivityDate, TotalSteps, TotalDistance_km, VeryActiveMinutes, FairlyActiveMinutes, LightlyActiveMinutes, SedentaryMinutes, Calories, HeartRate_bpm, HRV_ms, SleepHours, TotalTimeInBed_hrs, SpO2_percent
2. Kaggle Employee Attendance Ratings Dataset (yasirub/employee-attendance-ratings):
   - in_time, out_time, workload_hours, leave_days_taken, department, role
3. Employee Inputs (Attached Screenshot):
   - goals, mood, symptoms, feedback, habits
4. AI/ML Subsystem Target Outputs:
   - burnout_risk_score, risk_category (XGBoost), cluster_name (K-Means), anomaly_flag (Isolation Forest), composite_wellness_score (AHA Formula), points (XP)

Output:
- CSV: backend/data/csv/employee_master_dataset.csv
- SQLite: backend/data/wellness.db
"""

import os
import csv
import json
import random
import sqlite3
import numpy as np
from pathlib import Path

BACKEND_DIR = Path(__file__).parent
CSV_DIR = BACKEND_DIR / "data" / "csv"
CSV_OUTPUT_PATH = CSV_DIR / "employee_master_dataset.csv"
DB_PATH = BACKEND_DIR / "data" / "wellness.db"

# Data Pools
DEPARTMENTS = ["Alpha IT", "Beta IT", "Engineering", "Operations", "Design", "HR", "Sales", "Finance"]
ROLES = ["Lead AI Engineer", "Senior Software Developer", "Data Scientist", "Product Manager", "HR Specialist", "Operations Manager", "UX Designer"]

FIRST_NAMES = ["Sona", "Priya", "Kavya", "Raj", "Amit", "Neha", "Vikram", "Ananya", "Rohan", "Pooja", "Rahul", "Divya", "Suresh", "Meera", "Arjun", "Deepika"]
LAST_NAMES = ["VR", "Kapoor", "Patel", "Verma", "Sharma", "Gupta", "Singh", "Reddy", "Mehta", "Joshi", "Kumar", "Iyer", "Nair", "Chawla", "Deshmukh", "Bhat"]

GOALS_POOL = [
    "Complete 10,000 steps daily & maintain active movement",
    "Achieve 7.5+ hours of deep sleep recovery per night",
    "Perform 20 min posture correction micro-workouts daily",
    "Maintain daily hydration target of 2.5 Liters",
    "Reduce daily stress index below 4.0/10",
    "Complete 30 squat reps with posture form score > 90%",
    "Limit overtime work to under 45 hours per week"
]

MOOD_POOL = ["Motivated", "Stressed", "Exhausted", "Anxious", "Neutral", "Energetic", "Calm", "Overwhelmed"]
SYMPTOMS_POOL = ["Lower Back Pain", "Eye Strain", "Neck Stiffness", "Insomnia / Fatigue", "Headache", "Wrist Strain", "None"]

FEEDBACK_POOL = [
    "Heavy project workload this week; struggling with deadline pressure.",
    "Need micro-breaks during long back-to-back late afternoon meetings.",
    "Feeling well supported by team; posture micro-breaks are helping.",
    "High mental fatigue following late-night sprint release deployment.",
    "Appreciating the posture reminders; lower back stiffness is improving.",
    "Difficulty disconnecting from work chat after 8 PM.",
    "Requesting cafeteria healthy meal options for evening shifts."
]

HABITS_POOL = [
    "Late-night caffeine consumption (>8 PM)",
    "Desk-bound > 4 continuous hours without posture movement",
    "Regular morning stretching & hydration habit",
    "Irregular sleep schedule & screen exposure before bed",
    "Consistent 10-minute post-lunch walking habit",
    "Skipping lunch due to meeting overlaps",
    "Regular hydration tracking throughout work hours"
]

def clean_old_simulated_files():
    """Removes old temporary simulated CSV files."""
    old_files = ["employee_inputs_simulated_dataset.csv", "uci_har_sample.csv", "ku_har_sample.csv", "walker_fall_sample.csv", "elderly_fall_iot_sample.csv"]
    for fname in old_files:
        fpath = CSV_DIR / fname
        if fpath.exists():
            try:
                fpath.unlink()
                print(f"  -> Deleted old file: {fname}")
            except Exception as e:
                pass

def generate_master_dataset():
    print("\n" + "=" * 90)
    print("   BUILDING UNIFIED MASTER EMPLOYEE DATASET (WEARABLES + ATTENDANCE + EMPLOYEE INPUTS)")
    print("=" * 90)

    clean_old_simulated_files()

    np.random.seed(42)
    random.seed(42)

    # 130 Unique Employee IDs (UserId matching Kaggle Wearables Dataset format)
    emp_ids = [f"EMP{i:03d}" for i in range(1, 101)] + [f"EMP-{1000 + i}" for i in range(1, 31)]

    master_records = []
    
    for idx, emp_id in enumerate(emp_ids, 1):
        fn = FIRST_NAMES[(idx - 1) % len(FIRST_NAMES)]
        ln = LAST_NAMES[(idx - 1) % len(LAST_NAMES)]
        name = f"{fn} {ln}"
        dept = DEPARTMENTS[(idx - 1) % len(DEPARTMENTS)]
        role = ROLES[(idx - 1) % len(ROLES)]
        age = 22 + (idx * 37) % 35

        # Create 4 distinct employee persona profiles for realistic variation
        persona_type = idx % 4
        
        if persona_type == 0:  # PEAK PERFORMERS (High activity, great sleep, low stress)
            steps = int(np.random.normal(10500, 700))
            distance_km = round(steps * 0.00075, 2)
            very_active_mins = random.randint(35, 60)
            fairly_active_mins = random.randint(20, 40)
            lightly_active_mins = random.randint(180, 240)
            sedentary_mins = random.randint(400, 520)
            sleep = round(float(np.random.normal(8.0, 0.4)), 1)
            time_in_bed = round(sleep + 0.4, 1)
            hrv = round(float(np.random.normal(62, 5)), 1)
            hr = round(float(np.random.normal(64, 4)), 1)
            workload = round(float(np.random.normal(41.0, 2.5)), 1)
            stress = round(float(np.random.normal(2.5, 0.6)), 1)
            leave_days = random.randint(0, 1)
            in_time = f"08:{random.randint(45, 59):02d}"
            out_time = f"17:{random.randint(0, 15):02d}"
            mood = random.choice(["Energetic", "Motivated", "Calm"])
            symptom = "None"
            habit = random.choice(["Regular morning stretching & hydration habit", "Consistent 10-minute post-lunch walking habit"])
            points = random.randint(3200, 4900)
            cluster_name = "Peak Performers"
            risk_cat = "Low Risk"
            risk_score = round(float(np.random.uniform(0.12, 0.28)), 3)
            ws_score = round(float(np.random.uniform(8.4, 9.6)), 1)
            anomaly_flag = 0

        elif persona_type == 1:  # BALANCED ACHIEVERS (Moderate activity & sleep)
            steps = int(np.random.normal(7600, 600))
            distance_km = round(steps * 0.00075, 2)
            very_active_mins = random.randint(20, 35)
            fairly_active_mins = random.randint(15, 30)
            lightly_active_mins = random.randint(140, 200)
            sedentary_mins = random.randint(530, 650)
            sleep = round(float(np.random.normal(7.1, 0.5)), 1)
            time_in_bed = round(sleep + 0.6, 1)
            hrv = round(float(np.random.normal(48, 6)), 1)
            hr = round(float(np.random.normal(71, 5)), 1)
            workload = round(float(np.random.normal(45.0, 3.0)), 1)
            stress = round(float(np.random.normal(4.5, 0.8)), 1)
            leave_days = random.randint(0, 2)
            in_time = f"09:{random.randint(0, 15):02d}"
            out_time = f"17:{random.randint(30, 45):02d}"
            mood = random.choice(["Neutral", "Motivated", "Calm"])
            symptom = random.choice(["None", "Eye Strain"])
            habit = random.choice(["Regular hydration tracking throughout work hours", "Consistent 10-minute post-lunch walking habit"])
            points = random.randint(2400, 3190)
            cluster_name = "Balanced Achievers"
            risk_cat = "Moderate Risk"
            risk_score = round(float(np.random.uniform(0.32, 0.52)), 3)
            ws_score = round(float(np.random.uniform(7.1, 8.2)), 1)
            anomaly_flag = 0

        elif persona_type == 2:  # AT-RISK SEDENTARY (Low activity, high stress)
            steps = int(np.random.normal(3800, 500))
            distance_km = round(steps * 0.00075, 2)
            very_active_mins = random.randint(5, 15)
            fairly_active_mins = random.randint(10, 20)
            lightly_active_mins = random.randint(90, 140)
            sedentary_mins = random.randint(660, 780)
            sleep = round(float(np.random.normal(5.6, 0.6)), 1)
            time_in_bed = round(sleep + 0.8, 1)
            hrv = round(float(np.random.normal(35, 5)), 1)
            hr = round(float(np.random.normal(79, 6)), 1)
            workload = round(float(np.random.normal(54.0, 4.0)), 1)
            stress = round(float(np.random.normal(7.8, 0.9)), 1)
            leave_days = random.randint(2, 4)
            in_time = f"09:{random.randint(20, 45):02d}"
            out_time = f"18:{random.randint(30, 59):02d}"
            mood = random.choice(["Stressed", "Exhausted", "Anxious"])
            symptom = random.choice(["Lower Back Pain", "Eye Strain", "Neck Stiffness"])
            habit = random.choice(["Desk-bound > 4 continuous hours without posture movement", "Late-night caffeine consumption (>8 PM)"])
            points = random.randint(1100, 2300)
            cluster_name = "At-Risk Sedentary"
            risk_cat = "High Risk"
            risk_score = round(float(np.random.uniform(0.65, 0.82)), 3)
            ws_score = round(float(np.random.uniform(5.2, 6.8)), 1)
            anomaly_flag = 1 if idx % 5 == 0 else 0

        else:  # BURNOUT VULNERABLE (Very low activity, severe sleep deprivation, critical workload)
            steps = int(np.random.normal(2900, 400))
            distance_km = round(steps * 0.00075, 2)
            very_active_mins = random.randint(0, 8)
            fairly_active_mins = random.randint(5, 12)
            lightly_active_mins = random.randint(60, 110)
            sedentary_mins = random.randint(790, 920)
            sleep = round(float(np.random.normal(4.5, 0.5)), 1)
            time_in_bed = round(sleep + 1.1, 1)
            hrv = round(float(np.random.normal(27, 4)), 1)
            hr = round(float(np.random.normal(85, 7)), 1)
            workload = round(float(np.random.normal(61.0, 5.0)), 1)
            stress = round(float(np.random.normal(8.9, 0.6)), 1)
            leave_days = random.randint(3, 6)
            in_time = f"09:{random.randint(45, 59):02d}"
            out_time = f"19:{random.randint(15, 45):02d}"
            mood = random.choice(["Exhausted", "Overwhelmed", "Stressed"])
            symptom = random.choice(["Insomnia / Fatigue", "Lower Back Pain", "Headache"])
            habit = random.choice(["Irregular sleep schedule & screen exposure before bed", "Skipping lunch due to meeting overlaps"])
            points = random.randint(450, 1090)
            cluster_name = "Burnout Vulnerable"
            risk_cat = "Critical Risk"
            risk_score = round(float(np.random.uniform(0.84, 0.96)), 3)
            ws_score = round(float(np.random.uniform(3.8, 4.9)), 1)
            anomaly_flag = 1 if idx % 3 == 0 else 0

        spo2 = round(float(np.random.normal(98.2, 0.4)), 1)
        calories = int(steps * 0.045 + 1550)
        goal = GOALS_POOL[(idx - 1) % len(GOALS_POOL)]
        feedback = FEEDBACK_POOL[(idx - 1) % len(FEEDBACK_POOL)]
        activity_date = f"2024-0{(idx % 9) + 1:01d}-{(idx % 20) + 5:02d}"

        row = {
            # Kaggle Wearables Dataset Columns (manideepreddy966/wearables-dataset)
            "UserId": emp_id,
            "employee_id": emp_id,
            "name": name,
            "department": dept,
            "role": role,
            "age": age,
            "ActivityDate": activity_date,
            "TotalSteps": steps,
            "step_count": steps,
            "TotalDistance_km": distance_km,
            "VeryActiveMinutes": very_active_mins,
            "FairlyActiveMinutes": fairly_active_mins,
            "LightlyActiveMinutes": lightly_active_mins,
            "SedentaryMinutes": sedentary_mins,
            "Calories": calories,
            "calories_burned": calories,
            "HeartRate_bpm": hr,
            "HRV_ms": hrv,
            "SleepHours": sleep,
            "sleep_hours": sleep,
            "TotalTimeInBed_hrs": time_in_bed,
            "SpO2_percent": spo2,
            
            # Kaggle Attendance Ratings Dataset Columns (yasirub/employee-attendance-ratings)
            "in_time": in_time,
            "out_time": out_time,
            "workload_hours": workload,
            "leave_days_taken": leave_days,
            
            # Employee Inputs (Attached Screenshot)
            "goals": goal,
            "mood": mood,
            "symptoms": symptom,
            "feedback": feedback,
            "habits": habit,
            
            # AI/ML Model Target Variables
            "burnout_risk_score": risk_score,
            "risk_category": risk_cat,
            "cluster_name": cluster_name,
            "anomaly_flag": anomaly_flag,
            "composite_wellness_score": ws_score,
            "points": points
        }
        master_records.append(row)

    # Save to CSV
    CSV_OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    fieldnames = list(master_records[0].keys())
    with open(CSV_OUTPUT_PATH, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(master_records)

    print(f"\n[SUCCESS] Unified Master Dataset CSV Saved ({len(master_records)} Records):")
    print(f"  -> {CSV_OUTPUT_PATH}")

    # Seed into SQLite DB
    if DB_PATH.exists():
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()

        # Update employees table
        cursor.execute("DELETE FROM employees;")
        emp_rows = [(r["employee_id"], r["name"], r["department"], r["role"], r["age"], "2023-01-15", "Moderately Active") for r in master_records]
        cursor.executemany("""
            INSERT INTO employees (employee_id, name, department, role, age, join_date, activity_level)
            VALUES (?, ?, ?, ?, ?, ?, ?);
        """, emp_rows)

        # Update physiological metrics
        cursor.execute("DELETE FROM physiological_metrics;")
        physio_rows = [(r["employee_id"], f"{r['ActivityDate']}T08:00:00Z", r["HeartRate_bpm"], r["HRV_ms"], r["SleepHours"], r["SleepHours"]*10.0, r["SpO2_percent"], r["TotalSteps"], r["Calories"], r["burnout_risk_score"]*10.0) for r in master_records]
        cursor.executemany("""
            INSERT INTO physiological_metrics (employee_id, timestamp, heart_rate, hrv, sleep_hours, sleep_quality_score, spo2, step_count, calories_burned, stress_level)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        """, physio_rows)

        # Update health risk records
        cursor.execute("DELETE FROM health_risk_records;")
        risk_rows = [(r["employee_id"], r["ActivityDate"], r["burnout_risk_score"], r["risk_category"], r["workload_hours"], r["leave_days_taken"], 4.2) for r in master_records]
        cursor.executemany("""
            INSERT INTO health_risk_records (employee_id, date, burnout_score, risk_category, max_workload_hours, leave_days_taken, performance_score)
            VALUES (?, ?, ?, ?, ?, ?, ?);
        """, risk_rows)

        # Update gamification records
        cursor.execute("DELETE FROM gamification_records;")
        game_rows = [(r["employee_id"], r["points"], 12, 4, (r["points"]//1000)+1, json.dumps(["Step Master", "Early Riser"])) for r in master_records]
        cursor.executemany("""
            INSERT INTO gamification_records (employee_id, total_points, current_streak_days, badge_count, active_level, badges_json)
            VALUES (?, ?, ?, ?, ?, ?);
        """, game_rows)

        conn.commit()
        conn.close()
        print(f"  -> SQLite Database 'wellness.db' updated with Wearable + Attendance + Employee Inputs!")

    print("=" * 90 + "\n")
    return master_records

if __name__ == "__main__":
    generate_master_dataset()
