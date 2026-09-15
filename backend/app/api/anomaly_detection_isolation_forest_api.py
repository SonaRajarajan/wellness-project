from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from app.ml.anomaly_detection_isolation_forest import IsolationForestAnomalyDetector
from app.db import get_db_connection

router = APIRouter(prefix="/anomaly-detection", tags=["7. Anomaly Detection (Isolation Forest)"])
detector = IsolationForestAnomalyDetector()

@router.post("/evaluate")
def evaluate_motion_anomalies(sensor_logs: List[dict]):
    """
    7. Anomaly Detection: Isolation Forest (Slide 16 / Image 3)
    """
    try:
        res = detector.detect_anomalies(sensor_logs)
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/dataset-logs")
def evaluate_from_database(
    dataset_name: Optional[str] = Query(default="MotionSense", description="MotionSense, UCI_HAR, KU_HAR, Walker_Fall, Elderly_Fall_IoT"),
    limit: int = Query(default=50, le=500)
):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        if dataset_name and dataset_name != "ALL":
            cursor.execute("""
                SELECT subject_id, dataset_name, acc_x, acc_y, acc_z, gyro_x, gyro_y, gyro_z, activity_label
                FROM sensor_motion_logs
                WHERE dataset_name = ?
                LIMIT ?;
            """, (dataset_name, limit))
        else:
            cursor.execute("""
                SELECT subject_id, dataset_name, acc_x, acc_y, acc_z, gyro_x, gyro_y, gyro_z, activity_label
                FROM sensor_motion_logs
                LIMIT ?;
            """, (limit,))
            
        rows = cursor.fetchall()
        conn.close()

        records = [dict(r) for r in rows]
        if not records:
            records = [{
                "subject_id": "SUBJ-01", "dataset_name": dataset_name or "MotionSense",
                "acc_x": 0.1, "acc_y": 9.81, "acc_z": 0.3,
                "gyro_x": 0.01, "gyro_y": 0.02, "gyro_z": -0.01,
                "activity_label": "walking"
            }]

        res = detector.detect_anomalies(records)
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
