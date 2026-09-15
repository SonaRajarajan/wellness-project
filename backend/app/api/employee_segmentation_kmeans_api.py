from fastapi import APIRouter, HTTPException
from app.ml.employee_segmentation_kmeans import KMeansEmployeeSegmentation
from app.db import get_db_connection

router = APIRouter(prefix="/segmentation", tags=["6. Employee Segmentation (K-Means)"])
segmentation_engine = KMeansEmployeeSegmentation()

@router.get("/employees")
def segment_all_employees():
    """
    6. Employee Segmentation: K-Means (Slide 16 / Image 3)
    """
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("""
            SELECT e.employee_id, e.name, e.department, 
                   AVG(p.step_count) as daily_steps, 
                   AVG(p.sleep_hours) as sleep_hours, 
                   AVG(p.stress_level) as stress_level,
                   AVG(p.calories_burned) as calories_burned
            FROM employees e
            LEFT JOIN physiological_metrics p ON e.employee_id = p.employee_id
            GROUP BY e.employee_id;
        """)
        rows = cursor.fetchall()
        conn.close()

        employee_data = []
        for r in rows:
            employee_data.append({
                "employee_id": r["employee_id"],
                "name": r["name"],
                "department": r["department"],
                "daily_steps": r["daily_steps"] or 5000,
                "sleep_hours": r["sleep_hours"] or 6.5,
                "workout_freq_per_week": 3 if (r["daily_steps"] or 0) > 7000 else 1,
                "stress_level": r["stress_level"] or 5.0,
                "calories_burned": r["calories_burned"] or 1800,
                "engagement_score": 75.0
            })

        res = segmentation_engine.segment_employees(employee_data)
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
