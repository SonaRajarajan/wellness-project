-- Schema for AI Employee Wellness & Motion Analytics Platform
-- SQLite Compatible Schema

CREATE TABLE IF NOT EXISTS employees (
    employee_id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    department TEXT NOT NULL,
    role TEXT NOT NULL,
    age INTEGER NOT NULL,
    join_date TEXT NOT NULL,
    activity_level TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS physiological_metrics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    heart_rate REAL NOT NULL,
    hrv REAL NOT NULL,
    sleep_hours REAL NOT NULL,
    sleep_quality_score REAL NOT NULL,
    spo2 REAL NOT NULL,
    step_count INTEGER NOT NULL,
    calories_burned REAL NOT NULL,
    stress_level REAL NOT NULL,
    FOREIGN KEY(employee_id) REFERENCES employees(employee_id)
);

CREATE TABLE IF NOT EXISTS sensor_motion_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subject_id TEXT NOT NULL,
    dataset_name TEXT NOT NULL, -- MotionSense, UCI_HAR, KU_HAR, Walker_Fall, Elderly_Fall_IoT
    timestamp TEXT NOT NULL,
    acc_x REAL NOT NULL,
    acc_y REAL NOT NULL,
    acc_z REAL NOT NULL,
    gyro_x REAL NOT NULL,
    gyro_y REAL NOT NULL,
    gyro_z REAL NOT NULL,
    activity_label TEXT NOT NULL,
    is_fall_event INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS health_risk_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id TEXT NOT NULL,
    date TEXT NOT NULL,
    burnout_score REAL NOT NULL,
    risk_category TEXT NOT NULL, -- Low, Moderate, High, Critical
    max_workload_hours REAL NOT NULL,
    leave_days_taken INTEGER NOT NULL,
    performance_score REAL NOT NULL,
    FOREIGN KEY(employee_id) REFERENCES employees(employee_id)
);

CREATE TABLE IF NOT EXISTS segmentation_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id TEXT UNIQUE NOT NULL,
    cluster_id INTEGER NOT NULL,
    cluster_name TEXT NOT NULL, -- Peak Performers, Balanced Achievers, At-Risk Sedentary, Burnout Vulnerable
    feature_vector_json TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY(employee_id) REFERENCES employees(employee_id)
);

CREATE TABLE IF NOT EXISTS exercise_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id TEXT NOT NULL,
    exercise_type TEXT NOT NULL, -- Squat, Pushup, Lunge, Jumping Jack
    reps_completed INTEGER NOT NULL,
    form_quality_score REAL NOT NULL, -- 0-100%
    calories_burned REAL NOT NULL,
    duration_seconds INTEGER NOT NULL,
    timestamp TEXT NOT NULL,
    FOREIGN KEY(employee_id) REFERENCES employees(employee_id)
);

CREATE TABLE IF NOT EXISTS nutrition_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id TEXT NOT NULL,
    date TEXT NOT NULL,
    meal_type TEXT NOT NULL, -- Breakfast, Lunch, Dinner, Snack
    food_items TEXT NOT NULL,
    total_calories REAL NOT NULL,
    protein_g REAL NOT NULL,
    carbs_g REAL NOT NULL,
    fat_g REAL NOT NULL,
    health_rating REAL NOT NULL,
    FOREIGN KEY(employee_id) REFERENCES employees(employee_id)
);

CREATE TABLE IF NOT EXISTS gamification_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    employee_id TEXT UNIQUE NOT NULL,
    total_points INTEGER DEFAULT 0,
    current_streak_days INTEGER DEFAULT 0,
    badge_count INTEGER DEFAULT 0,
    active_level INTEGER DEFAULT 1,
    badges_json TEXT NOT NULL,
    FOREIGN KEY(employee_id) REFERENCES employees(employee_id)
);

CREATE TABLE IF NOT EXISTS rag_knowledge_base (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    tags TEXT NOT NULL
);
