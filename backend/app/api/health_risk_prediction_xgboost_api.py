from fastapi import APIRouter, HTTPException
from app.models.schemas import HealthRiskRequest, HealthRiskResponse
from app.ml.health_risk_prediction_xgboost import XGBoostHealthRiskPredictor
from app.db import get_db_connection

router = APIRouter(prefix="/health-risk", tags=["5. Health Risk Prediction (XGBoost)"])
risk_predictor = XGBoostHealthRiskPredictor()

@router.post("/predict")
def predict_burnout_risk(req: HealthRiskRequest):
    """
    5. Health Risk Prediction: XGBoost (Slide 16 / Image 3)
    """
    try:
        res = risk_predictor.predict_risk(
            workload_hours=req.workload_hours_per_week,
            sleep_hours=req.sleep_avg_hours,
            hrv_ms=req.hrv_ms,
            stress_level=req.stress_level_1_to_10,
            leave_days=req.leave_days_taken
        )

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO health_risk_records 
            (employee_id, date, burnout_score, risk_category, max_workload_hours, leave_days_taken, performance_score)
            VALUES (?, date('now'), ?, ?, ?, ?, 4.5);
        """, (req.employee_id, res["burnout_risk_score"], res["risk_category"], 
              req.workload_hours_per_week, req.leave_days_taken))
        conn.commit()
        conn.close()

        return {
            "employee_id": req.employee_id,
            "burnout_risk_score": res["burnout_risk_score"],
            "risk_category": res["risk_category"],
            "contributing_factors": res["contributing_factors"],
            "ml_module": res["ml_module"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
