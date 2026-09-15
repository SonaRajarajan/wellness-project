import os
import joblib
import numpy as np
import pandas as pd
from typing import Dict, List, Any
from pathlib import Path

MODELS_DIR = Path(__file__).parent.parent.parent / "models_saved"

class KMeansEmployeeSegmentation:
    """
    6. Employee Segmentation: K-Means (Slide 16 / Image 3)
    Segments workforce into 4 distinct persona clusters based on Wearable IoT & Engagement signals:
    1. Peak Performers (High activity, optimal sleep, low stress)
    2. Balanced Achievers (Moderate activity, consistent sleep)
    3. At-Risk Sedentary (Low activity, elevated workload, sedentary)
    4. Burnout Vulnerable (Low activity, severe sleep deprivation, high stress)
    """

    CLUSTER_NAMES = {
        0: "Peak Performers",
        1: "Balanced Achievers",
        2: "At-Risk Sedentary",
        3: "Burnout Vulnerable"
    }

    def __init__(self):
        self.scaler = None
        self.kmeans = None
        self._load_models()

    def _load_models(self):
        scaler_path = MODELS_DIR / "scaler_kmeans.joblib"
        kmeans_path = MODELS_DIR / "segmentation_kmeans.joblib"
        if scaler_path.exists() and kmeans_path.exists():
            try:
                self.scaler = joblib.load(scaler_path)
                self.kmeans = joblib.load(kmeans_path)
                print(f"[KMeansSegmentation] Loaded models from {kmeans_path}")
            except Exception as e:
                print(f"[KMeansSegmentation] Failed to load models: {e}")

    def segment_employees(self, employee_records: List[Dict[str, Any]]) -> Dict[str, Any]:
        if not employee_records:
            return {"employee_segments": [], "cluster_distribution": {}}

        results = []
        cluster_counts = {name: 0 for name in self.CLUSTER_NAMES.values()}

        for emp in employee_records:
            steps = emp.get("daily_steps", 6000)
            sleep = emp.get("sleep_hours", 7.0)
            workouts = emp.get("workout_freq_per_week", 3)
            stress = emp.get("stress_level", 5.0)
            calories = emp.get("calories_burned", 2000)
            engagement = emp.get("engagement_score", 50)

            X_feat = np.array([[steps, sleep, workouts, stress, calories, engagement]])

            if self.scaler is not None and self.kmeans is not None:
                try:
                    X_scaled = self.scaler.transform(X_feat)
                    cluster_idx = int(self.kmeans.predict(X_scaled)[0])
                except Exception:
                    cluster_idx = self._fallback_heuristic(steps, sleep, stress)
            else:
                cluster_idx = self._fallback_heuristic(steps, sleep, stress)

            cluster_name = self.CLUSTER_NAMES.get(cluster_idx, "Balanced Achievers")
            cluster_counts[cluster_name] += 1

            results.append({
                "employee_id": emp.get("employee_id", "EMP-UNKNOWN"),
                "assigned_cluster": cluster_idx,
                "cluster_name": cluster_name,
                "segment_profile": f"{cluster_name}: Steps={steps}, Sleep={sleep}h, Stress={stress}/10"
            })

        return {
            "ml_module": "Employee Segmentation: K-Means (Slide 16 / Image 3)",
            "total_segmented": len(results),
            "employee_segments": results,
            "cluster_distribution": cluster_counts
        }

    def _fallback_heuristic(self, steps: float, sleep: float, stress: float) -> int:
        if steps >= 9000 and sleep >= 7.5 and stress <= 3.5:
            return 0 # Peak Performers
        elif steps >= 6500 and sleep >= 6.8:
            return 1 # Balanced Achievers
        elif stress >= 7.5 or sleep < 5.5:
            return 3 # Burnout Vulnerable
        else:
            return 2 # At-Risk Sedentary
