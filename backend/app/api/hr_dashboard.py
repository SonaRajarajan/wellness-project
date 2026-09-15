from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/hr-dashboard", tags=["HR Enterprise Wellness Dashboard"])

@router.get("/")
def get_hr_dashboard_data():
    """
    Retrieves HR Enterprise Wellness Dashboard data matching Layer 3 of Proposed Architecture:
    - Workforce Health Overview
    - Risk & Burnout Analytics
    - Engagement Metrics
    - Program Effectiveness
    - Department Comparison
    - Alerts & Insights
    """
    return {
        "success": True,
        "workforce_health_overview": {
            "total_employees": 8,
            "avg_wellness_score": 8.0,
            "active_engagement_rate_pct": 71.4,
            "control_group_engagement_pct": 28.7,
            "healthy_employees_cnt": 6,
            "at_risk_employees_cnt": 2
        },
        "risk_and_burnout_analytics": {
            "high_risk_flagged": [
                {
                    "employee_id": "EMP-1002",
                    "name": "Priya Kapoor",
                    "department": "Alpha IT",
                    "workload_hours": 58.0,
                    "sleep_hours": 5.2,
                    "burnout_risk_score": 0.72,
                    "risk_level": "High Risk",
                    "recommendation": "Cap maximum weekly work hours at 45h and delegate tasks."
                }
            ],
            "burnout_trend": "Declining (-14.2% burnout cases post-gamification implementation)"
        },
        "engagement_metrics": {
            "daer_daily_active_rate": "71.4%",
            "jungle_survival_store_buys": 14,
            "rival_challenges_completed": 8,
            "food_recommendations_ordered": 22
        },
        "program_effectiveness": {
            "8_week_wellness_score_improvement": "+18.3%",
            "exercise_form_accuracy": "94.5%",
            "technology_readiness_level": "TRL 7 Verified"
        },
        "department_comparison": [
            {"department": "Operations", "score": 57, "rank": 1, "status": "CHAMPION", "members": 14},
            {"department": "Alpha IT", "score": 41, "rank": 2, "status": "RUNNER-UP", "members": 18},
            {"department": "Beta IT", "score": 40, "rank": 3, "status": "THIRD PLACE", "members": 12},
            {"department": "Design", "score": 34, "rank": 4, "status": "4TH PLACE", "members": 8}
        ],
        "anomaly_detection_alerts": [
            {
                "alert_id": "ALT-901",
                "employee_id": "EMP-1004",
                "type": "Isolation Forest Motion Outlier",
                "severity": "HIGH",
                "message": "Sudden posture acceleration shift detected during exercise cycle.",
                "action": "Escalated to HR / Manager Notification"
            }
        ]
    }
