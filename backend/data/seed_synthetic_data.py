import sqlite3
import random
import numpy as np
from pathlib import Path
import json

DB_PATH = Path(__file__).parent / "wellness.db"
SCHEMA_PATH = Path(__file__).parent / "schema.sql"

def seed_database():
    print("Seeding database with benchmark physiological and HAR sensor datasets...")
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    # Load and execute schema
    with open(SCHEMA_PATH, "r") as f:
        cursor.executescript(f.read())

    # Clear existing tables
    tables = [
        "employees", "physiological_metrics", "sensor_motion_logs",
        "health_risk_records", "segmentation_results", "exercise_sessions",
        "nutrition_logs", "gamification_records", "rag_knowledge_base"
    ]
    for t in tables:
        cursor.execute(f"DELETE FROM {t};")

    # 1. Seed Employees
    departments = ["Engineering", "Data Science", "Product", "Design", "HR", "Sales", "Finance"]
    roles = ["Junior Developer", "Senior Engineer", "Lead Data Scientist", "Product Manager", "HR Specialist", "Account Executive"]
    activity_levels = ["Sedentary", "Lightly Active", "Moderately Active", "Very Active"]

    # 1. Seed Employees (EMP001 to EMP100 and EMP-1001 to EMP-1030)
    departments = ["Alpha IT", "Beta IT", "Engineering", "Operations", "Design", "HR", "Sales", "Finance"]
    roles = ["Lead AI Engineer", "Senior Software Developer", "Data Scientist", "Product Manager", "HR Specialist", "Operations Manager"]
    activity_levels = ["Sedentary", "Lightly Active", "Moderately Active", "Very Active"]
    
    first_names = ["Sona", "Priya", "Kavya", "Raj", "Amit", "Neha", "Vikram", "Ananya", "Rohan", "Pooja", "Rahul", "Divya", "Suresh", "Meera", "Arjun", "Deepika"]
    last_names = ["VR", "Kapoor", "Patel", "Verma", "Sharma", "Gupta", "Singh", "Reddy", "Mehta", "Joshi", "Kumar", "Iyer", "Nair", "Chawla", "Deshmukh", "Bhat"]

    employees = []
    # Seed EMP001 to EMP100 (Kaggle Dataset Employee IDs)
    for i in range(1, 101):
        emp_id = f"EMP{i:03d}"
        fn = first_names[(i - 1) % len(first_names)]
        ln = last_names[(i - 1) % len(last_names)]
        name = f"{fn} {ln}"
        dept = departments[(i - 1) % len(departments)]
        role = roles[(i - 1) % len(roles)]
        age = 22 + (i * 37) % 35
        join_date = f"2023-0{(i % 9) + 1:01d}-15"
        act_lvl = activity_levels[i % 4]
        employees.append((emp_id, name, dept, role, age, join_date, act_lvl))

    # Seed EMP-1001 to EMP-1030
    for i in range(1, 31):
        emp_id = f"EMP-{1000 + i}"
        fn = first_names[(i + 3) % len(first_names)]
        ln = last_names[(i + 5) % len(last_names)]
        name = f"{fn} {ln}"
        dept = departments[(i + 2) % len(departments)]
        role = roles[(i + 1) % len(roles)]
        age = 24 + (i * 29) % 30
        join_date = f"2022-0{(i % 9) + 1:01d}-10"
        act_lvl = activity_levels[i % 4]
        employees.append((emp_id, name, dept, role, age, join_date, act_lvl))

    cursor.executemany("""
        INSERT INTO employees (employee_id, name, department, role, age, join_date, activity_level)
        VALUES (?, ?, ?, ?, ?, ?, ?);
    """, employees)

    # 2. Seed Physiological Metrics (Wearables Time-Series)
    physio_records = []
    for emp_id, _, _, _, _, _, act_lvl in employees:
        base_hr = 65 if act_lvl in ["Moderately Active", "Very Active"] else 78
        base_hrv = 55 if act_lvl in ["Moderately Active", "Very Active"] else 38
        base_sleep = 7.5 if act_lvl in ["Moderately Active", "Very Active"] else 5.8
        
        for d in range(14):
            date_str = f"2026-08-{15 + d:02d}T08:00:00Z"
            hr = float(np.random.normal(base_hr, 5))
            hrv = float(np.random.normal(base_hrv, 6))
            sleep = float(np.clip(np.random.normal(base_sleep, 0.8), 4.0, 9.5))
            sleep_qual = float(np.clip(sleep * 10 + random.randint(-5, 5), 40, 98))
            spo2 = float(np.random.normal(98.2, 0.5))
            steps = int(np.random.normal(8500 if act_lvl == "Very Active" else 4200, 1200))
            calories = float(steps * 0.045 + 1500)
            stress = float(np.clip(10.0 - (hrv / 10.0) + random.uniform(-1, 1), 1.0, 9.5))

            physio_records.append((emp_id, date_str, hr, hrv, sleep, sleep_qual, spo2, steps, calories, stress))

    cursor.executemany("""
        INSERT INTO physiological_metrics 
        (employee_id, timestamp, heart_rate, hrv, sleep_hours, sleep_quality_score, spo2, step_count, calories_burned, stress_level)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    """, physio_records)

    # 3. Seed Motion Sensor Datasets (Slide 17 Datasets: MotionSense HAR & Exercise Recognition)
    datasets_info = [
        ("MotionSense", ["walking", "jogging", "sitting", "standing", "upstairs", "downstairs"], 24),
        ("Exercise_Recognition", ["squat", "pushup", "lunge", "jumping_jack", "bicep_curl"], 20)
    ]

    sensor_logs = []
    for dataset_name, activities, num_subjects in datasets_info:
        for subj in range(1, num_subjects + 1):
            subj_id = f"{dataset_name}-SUBJ-{subj:02d}"
            for act in activities:
                # Generate 10 time-series window samples per activity
                for sample_idx in range(10):
                    is_fall = 1 if "fall" in act.lower() or "stumble" in act.lower() else 0
                    
                    if is_fall:
                        acc_x = float(np.random.normal(3.5, 2.1))
                        acc_y = float(np.random.normal(14.2, 4.5)) # High acceleration spike
                        acc_z = float(np.random.normal(6.1, 3.0))
                        gyro_x = float(np.random.normal(2.5, 1.2))
                        gyro_y = float(np.random.normal(3.1, 1.5))
                        gyro_z = float(np.random.normal(1.8, 0.9))
                    else:
                        acc_x = float(np.random.normal(0.2, 0.4))
                        acc_y = float(np.random.normal(9.81, 0.8)) # Gravity vector
                        acc_z = float(np.random.normal(0.4, 0.5))
                        gyro_x = float(np.random.normal(0.02, 0.1))
                        gyro_y = float(np.random.normal(0.04, 0.1))
                        gyro_z = float(np.random.normal(-0.01, 0.08))

                    timestamp = f"2026-08-20T10:{random.randint(10,59)}:{random.randint(10,59)}Z"
                    sensor_logs.append((subj_id, dataset_name, timestamp, acc_x, acc_y, acc_z, gyro_x, gyro_y, gyro_z, act, is_fall))

    cursor.executemany("""
        INSERT INTO sensor_motion_logs
        (subject_id, dataset_name, timestamp, acc_x, acc_y, acc_z, gyro_x, gyro_y, gyro_z, activity_label, is_fall_event)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    """, sensor_logs)

    # 4. Seed Health Risk Records (Burnout)
    risk_records = []
    for emp_id, _, _, _, _, _, act_lvl in employees:
        workload = float(random.uniform(40, 65))
        leave = random.randint(0, 4)
        perf = float(random.uniform(3.5, 4.9))
        burnout = float(np.clip((workload - 40) / 30.0 + random.uniform(0.1, 0.4), 0.05, 0.95))
        category = "Low" if burnout < 0.3 else ("Moderate" if burnout < 0.6 else ("High" if burnout < 0.85 else "Critical"))
        date_str = "2026-08-28"
        risk_records.append((emp_id, date_str, burnout, category, workload, leave, perf))

    cursor.executemany("""
        INSERT INTO health_risk_records
        (employee_id, date, burnout_score, risk_category, max_workload_hours, leave_days_taken, performance_score)
        VALUES (?, ?, ?, ?, ?, ?, ?);
    """, risk_records)

    # 5. Seed Exercise Sessions
    exercises = ["Squat", "Pushup", "Lunge", "Jumping Jack"]
    ex_records = []
    for emp_id, _, _, _, _, _, _ in employees:
        for _ in range(3):
            ex_type = random.choice(exercises)
            reps = random.randint(12, 35)
            form_score = float(random.uniform(70.0, 98.0))
            cals = float(reps * 0.8 + random.uniform(5, 15))
            duration = reps * 3
            tstamp = f"2026-08-{random.randint(15,28):02d}T17:30:00Z"
            ex_records.append((emp_id, ex_type, reps, form_score, cals, duration, tstamp))

    cursor.executemany("""
        INSERT INTO exercise_sessions
        (employee_id, exercise_type, reps_completed, form_quality_score, calories_burned, duration_seconds, timestamp)
        VALUES (?, ?, ?, ?, ?, ?, ?);
    """, ex_records)

    # 6. Seed Nutrition Logs
    nutrition_data = []
    meals = [
        ("Breakfast", "Oatmeal with Almonds & Berries", 420, 16, 62, 12, 8.8),
        ("Lunch", "Grilled Chicken Salad with Quinoa", 580, 42, 45, 18, 9.2),
        ("Dinner", "Baked Salmon with Steamed Broccoli", 640, 48, 25, 26, 9.5),
        ("Snack", "Greek Yogurt with Honey", 210, 15, 22, 4, 8.5)
    ]
    for emp_id, _, _, _, _, _, _ in employees:
        for meal_type, item, cals, prot, carb, fat, rating in meals:
            nutrition_data.append((emp_id, "2026-08-28", meal_type, item, cals, prot, carb, fat, rating))

    cursor.executemany("""
        INSERT INTO nutrition_logs
        (employee_id, date, meal_type, food_items, total_calories, protein_g, carbs_g, fat_g, health_rating)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
    """, nutrition_data)

    # 7. Seed Gamification
    gamification_data = []
    for emp_id, _, _, _, _, _, act_lvl in employees:
        points = random.randint(250, 4800)
        streak = random.randint(1, 28)
        badge_count = points // 800
        lvl = (points // 1000) + 1
        badges = json.dumps(["Early Riser", "Step Master", "Hydration Hero"][:badge_count])
        gamification_data.append((emp_id, points, streak, badge_count, lvl, badges))

    cursor.executemany("""
        INSERT INTO gamification_records
        (employee_id, total_points, current_streak_days, badge_count, active_level, badges_json)
        VALUES (?, ?, ?, ?, ?, ?);
    """, gamification_data)

    # 8. Seed RAG Knowledge Base
    kb_articles = [
        ("Burnout & Stress", "Managing Workplace Stress", "High workload combined with low HRV indicates elevated sympathetic nerve activity. Recommend 10-minute mindfulness breathing and workload cap at 45 hours.", "stress,burnout,hrv,workload"),
        ("Sleep Hygiene", "Optimizing Deep Sleep Cycles", "Consistent bedtime routines, avoiding blue light 1 hour prior to sleep, and maintaining room temperature around 19C improve sleep quality scores by up to 30%.", "sleep,recovery,circadian"),
        ("Postural Health", "Ergonomic Desk & Movement Breaks", "Prolonged sitting reduces metabolic rate. Taking a 3-minute movement break every 45 minutes reduces spinal compression and risk of musculoskeletal injury.", "posture,ergonomics,movement"),
        ("Nutrition & Energy", "Macronutrient Balance for Focus", "Prioritize complex carbohydrates and lean protein during lunch to prevent afternoon circadian dips and sustain cognitive focus.", "nutrition,macros,energy")
    ]
    cursor.executemany("""
        INSERT INTO rag_knowledge_base (category, title, content, tags)
        VALUES (?, ?, ?, ?);
    """, kb_articles)

    conn.commit()
    conn.close()
    print("Database successfully seeded with realistic dataset records!")

if __name__ == "__main__":
    seed_database()
