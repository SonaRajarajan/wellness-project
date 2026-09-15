from fastapi import APIRouter, HTTPException, Query
from app.models.schemas import HealthPredictionRequest, HealthPredictionResponse
from app.ml.health_prediction_lstm import LSTMHealthPredictor
from app.db import get_db_connection

router = APIRouter(prefix="/health-prediction", tags=["1. Health Prediction (LSTM)"])
predictor = LSTMHealthPredictor()

@router.post("/predict", response_model=HealthPredictionResponse)
def predict_health(req: HealthPredictionRequest):
    """
    1. Health Prediction: LSTM (Slide 16 / Image 3)
    Executes LSTM time-series health trend prediction on MotionSense HAR Dataset.
    """
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT timestamp, heart_rate, hrv, sleep_hours, stress_level 
            FROM physiological_metrics 
            WHERE employee_id = ? 
            ORDER BY timestamp DESC LIMIT ?;
        """, (req.employee_id, req.historical_days))
        rows = cursor.fetchall()
        conn.close()

        historical = [dict(r) for r in rows] if rows else []
        res = predictor.predict_health_trends(req.employee_id, historical, req.predict_days)
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
