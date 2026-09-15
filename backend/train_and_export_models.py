import os
import joblib
import numpy as np
import pandas as pd
from pathlib import Path
from sklearn.ensemble import IsolationForest, GradientBoostingClassifier
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

MODELS_DIR = Path(__file__).parent / "models_saved"
DATASET_PATH = Path(__file__).parent / "data" / "csv" / "employee_master_dataset.csv"
MODELS_DIR.mkdir(parents=True, exist_ok=True)

def train_all_models():
    print("----------------------------------------------------------------")
    print("Training AI/ML models on employee_master_dataset.csv...")
    print("----------------------------------------------------------------")

    np.random.seed(42)

    # Load master dataset if available
    df = None
    if DATASET_PATH.exists():
        df = pd.read_csv(DATASET_PATH)
        print(f"Loaded master dataset from {DATASET_PATH} ({len(df)} records)")

    # 1. Train Isolation Forest Anomaly Detector
    print("1. Training Isolation Forest Anomaly Detector...")
    normal_motion = np.random.normal(loc=[0.2, 9.81, 0.4, 0.02, 0.04, -0.01, 9.82, 0.05], scale=[0.4, 0.8, 0.5, 0.1, 0.1, 0.08, 0.9, 0.12], size=(2500, 8))
    fall_anomalies = np.random.normal(loc=[3.5, 14.2, 6.1, 2.5, 3.1, 1.8, 16.5, 4.2], scale=[2.1, 4.5, 3.0, 1.2, 1.5, 0.9, 5.0, 2.0], size=(250, 8))
    X_motion = np.vstack([normal_motion, fall_anomalies])

    iso_forest = IsolationForest(n_estimators=100, contamination=0.1, random_state=42)
    iso_forest.fit(X_motion)
    
    anomaly_path = MODELS_DIR / "anomaly_isolation_forest.joblib"
    joblib.dump(iso_forest, anomaly_path)
    print(f"   -> Saved: {anomaly_path}")

    # 2. Train XGBoost (GradientBoosting) Burnout Risk Predictor on Master Dataset
    print("2. Training XGBoost Health Risk Predictor...")
    if df is not None:
        workload = df["workload_hours"].values
        sleep = df["SleepHours"].values if "SleepHours" in df.columns else df["sleep_hours"].values
        hrv = df["HRV_ms"].values if "HRV_ms" in df.columns else df["hrv_ms"].values
        stress = (df["burnout_risk_score"] * 10.0).values
        leave_days = df["leave_days_taken"].values
        
        risk_score = df["burnout_risk_score"].values
        y_risk = np.digitize(risk_score, bins=[0.35, 0.55, 0.75])
        X_risk = np.column_stack([workload, sleep, hrv, stress, leave_days])
    else:
        N_samples = 1500
        workload = np.random.uniform(35, 75, N_samples)
        sleep = np.random.uniform(4.0, 9.0, N_samples)
        hrv = np.random.uniform(25, 75, N_samples)
        stress = np.random.uniform(1.0, 10.0, N_samples)
        leave_days = np.random.randint(0, 8, N_samples)
        risk_score = (workload / 75.0)*0.35 + ((10 - sleep) / 10.0)*0.25 + ((80 - hrv) / 80.0)*0.2 + (stress / 10.0)*0.2
        y_risk = np.digitize(risk_score, bins=[0.35, 0.55, 0.75])
        X_risk = np.column_stack([workload, sleep, hrv, stress, leave_days])

    gb_model = GradientBoostingClassifier(n_estimators=100, learning_rate=0.1, max_depth=4, random_state=42)
    gb_model.fit(X_risk, y_risk)

    burnout_path = MODELS_DIR / "burnout_xgboost.joblib"
    joblib.dump(gb_model, burnout_path)
    print(f"   -> Saved: {burnout_path}")

    # 3. Train K-Means Employee Segmentation Model on Master Dataset
    print("3. Training K-Means Employee Segmentation Model...")
    if df is not None:
        steps = df["TotalSteps"].values if "TotalSteps" in df.columns else df["step_count"].values
        sleep_emp = df["SleepHours"].values if "SleepHours" in df.columns else df["sleep_hours"].values
        workout_freq = np.random.randint(0, 7, len(df))
        stress_emp = (df["burnout_risk_score"] * 10.0).values
        calories = df["Calories"].values if "Calories" in df.columns else df["calories_burned"].values
        engagement = df["points"].values
        X_seg = np.column_stack([steps, sleep_emp, workout_freq, stress_emp, calories, engagement])
    else:
        N_emp = 1200
        steps = np.random.normal(6500, 2500, N_emp)
        sleep_emp = np.random.normal(6.8, 1.2, N_emp)
        workout_freq = np.random.randint(0, 7, N_emp)
        stress_emp = np.random.normal(5.5, 2.0, N_emp)
        calories = steps * 0.045 + 1500 + np.random.normal(0, 100, N_emp)
        engagement = np.random.uniform(20, 100, N_emp)
        X_seg = np.column_stack([steps, sleep_emp, workout_freq, stress_emp, calories, engagement])

    scaler = StandardScaler()
    X_seg_scaled = scaler.fit_transform(X_seg)

    kmeans = KMeans(n_clusters=4, random_state=42, n_init=10)
    kmeans.fit(X_seg_scaled)

    scaler_path = MODELS_DIR / "scaler_kmeans.joblib"
    kmeans_path = MODELS_DIR / "segmentation_kmeans.joblib"
    joblib.dump(scaler, scaler_path)
    joblib.dump(kmeans, kmeans_path)
    print(f"   -> Saved: {scaler_path}")
    print(f"   -> Saved: {kmeans_path}")

    print("----------------------------------------------------------------")
    print("All AI/ML models successfully trained and exported!")
    print("----------------------------------------------------------------")

if __name__ == "__main__":
    train_all_models()
