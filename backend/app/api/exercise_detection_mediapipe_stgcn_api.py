from fastapi import APIRouter, HTTPException
from app.models.schemas import ExerciseAnalysisRequest, ExerciseAnalysisResponse
from app.cv.exercise_detection_mediapipe_pose import MediaPipeExercisePoseTracker
from app.cv.exercise_classification_stgcn import STGCNMovementClassifier
from app.db import get_db_connection

router = APIRouter(prefix="/exercise-analysis", tags=["2 & 3. Exercise Detection (MediaPipe Pose & ST-GCN)"])
pose_tracker = MediaPipeExercisePoseTracker()
stgcn_classifier = STGCNMovementClassifier()

@router.post("/analyze", response_model=ExerciseAnalysisResponse)
def analyze_exercise(req: ExerciseAnalysisRequest):
    """
    2. Exercise Detection (MediaPipe Pose) & 3. Exercise Classification (ST-GCN) (Slide 16 / Image 3)
    """
    try:
        ex_type = req.exercise_type.capitalize()
        cv_res = pose_tracker.analyze_squat_sequence(req.landmarks_sequence or [])
        stgcn_res = stgcn_classifier.classify_movement_quality(ex_type, cv_res["form_quality_score"])

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO exercise_sessions 
            (employee_id, exercise_type, reps_completed, form_quality_score, calories_burned, duration_seconds, timestamp)
            VALUES (?, ?, ?, ?, ?, ?, datetime('now'));
        """, (req.employee_id, ex_type, cv_res["reps_detected"], cv_res["form_quality_score"], 
              cv_res["calories_burned_est"], cv_res["reps_detected"] * 3))
        conn.commit()
        conn.close()

        return {
            "exercise_type": ex_type,
            "reps_detected": cv_res["reps_detected"],
            "form_quality_score": cv_res["form_quality_score"],
            "posture_feedback": cv_res["posture_feedback"],
            "calories_burned_est": cv_res["calories_burned_est"],
            "stgcn_movement_quality": stgcn_res["quality_grade"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
