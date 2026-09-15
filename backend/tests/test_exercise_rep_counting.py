import numpy as np
import pytest
from app.cv.exercise_detection_mediapipe_pose import MediaPipeExercisePoseTracker

def test_squat_rep_counting_4_reps():
    tracker = MediaPipeExercisePoseTracker()
    
    # Generate 450 frames (~15s @ 30fps) with 4 distinct squat dips
    fps = 30.0
    t = np.linspace(0, 15, 450)
    # 4 squat dips: standing at 170 deg, dipping to ~95 deg
    angles = 170.0 - 75.0 * np.maximum(0, np.sin(2 * np.pi * 4 * t / 15))
    
    reps = tracker._count_reps_with_hysteresis(angles.tolist(), exercise_type="Squat", fps=fps)
    assert reps == 4, f"Expected 4 reps, got {reps}"

def test_squat_sequence_analysis():
    tracker = MediaPipeExercisePoseTracker()
    res = tracker.analyze_squat_sequence([])
    assert "reps_detected" in res
    assert "form_quality_score" in res
    assert "ml_module" in res
