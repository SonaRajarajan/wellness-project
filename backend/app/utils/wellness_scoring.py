import numpy as np
from typing import Dict, Any

class PixelDashWellnessScorer:
    """
    Composite Wellness Score (WS) Calculation Engine.
    Formula (PDF Report Page 12 & 31):
    WS = 0.35 * StepsScore + 0.25 * SleepScore + 0.20 * ActivityScore + 0.20 * FoodScore
    """
    def __init__(self):
        pass

    def calculate_composite_wellness_score(
        self,
        daily_steps: int = 8000,
        sleep_hours: float = 7.0,
        workout_mins: int = 30,
        intensity_factor: float = 1.0,
        protein_g: float = 50.0,
        fiber_g: float = 15.0,
        fat_g: float = 20.0,
        sugar_g: float = 15.0
    ) -> Dict[str, Any]:

        steps_score = min(1.0, daily_steps / 10000.0) * 10.0
        sleep_score = 10.0 * np.exp(-((sleep_hours - 7.5) ** 2) / (2.0 * (0.75 ** 2)))
        activity_score = min(1.0, (workout_mins * intensity_factor) / 60.0) * 10.0

        protein_pts = min(10.0, (protein_g / 70.0) * 10.0)
        fiber_pts = min(10.0, (fiber_g / 25.0) * 10.0)
        fat_pts = min(10.0, (fat_g / 30.0) * 10.0)
        sugar_pts = min(10.0, (sugar_g / 25.0) * 10.0)
        vit_pts = 8.5

        food_score = 0.40 * protein_pts + 0.25 * fiber_pts - 0.20 * fat_pts - 0.15 * sugar_pts + 0.30 * vit_pts
        food_score = max(0.0, min(10.0, food_score))

        ws_score = 0.35 * steps_score + 0.25 * sleep_score + 0.20 * activity_score + 0.20 * food_score
        ws_score = round(float(ws_score), 2)
        ws_pct = round(ws_score * 10.0, 1)

        return {
            "composite_wellness_score": ws_score,
            "wellness_score_out_of_100": ws_pct,
            "sub_scores": {
                "steps_score": round(float(steps_score), 2),
                "sleep_score": round(float(sleep_score), 2),
                "activity_score": round(float(activity_score), 2),
                "food_score": round(float(food_score), 2)
            }
        }
