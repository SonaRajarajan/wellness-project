from fastapi import APIRouter

router = APIRouter(prefix="/architecture", tags=["Proposed System Architecture"])

@router.get("/")
def get_proposed_architecture_metadata():
    """
    Returns full metadata matching all 3 Layers and 18 sub-boxes in the Proposed Architecture diagram.
    """
    return {
        "success": True,
        "architecture_name": "Pixel Dash 3-Layer Proposed System Architecture",
        "layer_1_employee_ecosystem": {
            "title": "EMPLOYEE ECOSYSTEM & MULTIMODAL INGESTION LAYER",
            "boxes": [
                {
                    "name": "Wearable IoT Data",
                    "metrics": ["HR", "HRV", "Sleep", "SpO2", "Steps", "Calories"],
                    "status": "INGESTING",
                    "backend_file": "app/db.py & app/api/health_suggestions.py"
                },
                {
                    "name": "HRMS Data",
                    "metrics": ["Attendance", "Workload", "Performance", "Leave", "Demographics"],
                    "status": "SYNCED",
                    "backend_file": "app/api/players.py"
                },
                {
                    "name": "Nutrition Data",
                    "metrics": ["Cafeteria", "BMI", "Meals", "Calories", "Nutrition Info"],
                    "status": "ACTIVE",
                    "backend_file": "app/api/nutrition.py"
                },
                {
                    "name": "Computer Vision Input",
                    "metrics": ["Exercise Tracking", "Posture Analysis", "Movement Quality"],
                    "status": "ACTIVE",
                    "backend_file": "app/cv/pose_tracker.py & app/cv/stgcn_classifier.py"
                },
                {
                    "name": "Employee Inputs",
                    "metrics": ["Goals", "Mood", "Symptoms", "Feedback", "Habits"],
                    "status": "ACTIVE",
                    "backend_file": "app/api/auth.py"
                }
            ],
            "integration_pipeline": ["Data Cleaning", "Synchronization", "Feature Engineering", "Secure Storage (AES-256)"]
        },
        "layer_2_hybrid_ai_genai_engine": {
            "title": "HYBRID AI + GenAI INTELLIGENCE ENGINE",
            "modules": [
                {
                    "name": "Predictive Health Intelligence",
                    "model": "LSTM Sequential Forecaster / TFT / XGBoost",
                    "backend_file": "app/ml/lstm_health_predictor.py"
                },
                {
                    "name": "Stress, Fatigue & Burnout Prediction",
                    "model": "XGBoost Classifier (94.2% Acc)",
                    "backend_file": "app/ml/xgboost_risk_predictor.py"
                },
                {
                    "name": "Personalized Wellness Orchestration",
                    "model": "Rules + AHA Multi-objective Optimizer",
                    "backend_file": "app/api/health_suggestions.py"
                },
                {
                    "name": "Exercise Analytics & Insights",
                    "model": "MediaPipe Pose + ST-GCN Classifier",
                    "backend_file": "app/cv/stgcn_classifier.py"
                },
                {
                    "name": "Knowledge Graph & Recommendation Engine",
                    "model": "RAG-enabled GenAI Coach with Verified Graph Knowledge",
                    "backend_file": "app/rag/knowledge_graph.py & app/rag/wellness_rag_engine.py"
                }
            ],
            "subsystems": [
                {
                    "id": 1,
                    "title": "Gamification & Wellness Engagement",
                    "features": ["Dept-wise Challenges", "Daily/Weekly Missions", "Leaderboards", "Badges & Achievements", "Personalized Goals", "Food Recs", "Hydration & Sleep Reminders"]
                },
                {
                    "id": 2,
                    "title": "Exercise Motion Analytics",
                    "features": ["Real-time Exercise Tracking", "Repetition Counting", "Movement Quality Score", "Personalized Exercise Plan"]
                },
                {
                    "id": 3,
                    "title": "Digital Twin Employee Profile",
                    "features": ["Comprehensive Health Score", "Risk Index & Predictions", "Wellness Trends Over Time", "Productivity Insights", "Personalized Recommendations"]
                },
                {
                    "id": 4,
                    "title": "Anomaly Detection & Risk Alerts",
                    "features": ["Detect Unusual Patterns using Isolation Forest", "Outlier Risk Identification", "Real-time Alerts & Notifications", "Escalation to HR / Manager"]
                }
            ]
        },
        "layer_3_dashboards_and_impact": {
            "title": "ENTERPRISE WELLNESS DASHBOARD & IMPACT",
            "employee_dashboard": ["Health Trends", "Wellness Score", "Exercise Analytics", "Nutrition Insights", "Goals & Progress", "Rewards & Badges"],
            "hr_dashboard": ["Workforce Health Overview", "Risk & Burnout Analytics", "Engagement Metrics", "Program Effectiveness", "Department Comparison", "Alerts & Insights"],
            "organizational_impact": ["Improved Employee Health", "Better Exercise & Posture", "Reduced Burnout & Health Risks", "Higher Employee Engagement", "Increased Productivity", "Data-Driven Corporate Wellness Decisions"]
        }
    }
