from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.config import settings
from app.db import init_db
from app.api.auth import router as auth_router
from app.api.gamification import router as gamification_router
from app.api.nutrition_recommendation_collaborative_filtering_rag_api import router as nutrition_router
from app.api.health_suggestions import router as health_suggestions_router
from app.api.players import router as players_router
from app.api.health_prediction_lstm_api import router as health_prediction_router
from app.api.exercise_detection_mediapipe_stgcn_api import router as exercise_cv_router
from app.api.health_risk_prediction_xgboost_api import router as health_risk_router
from app.api.anomaly_detection_isolation_forest_api import router as anomaly_detection_router
from app.api.employee_segmentation_kmeans_api import router as segmentation_router
from app.api.genai_wellness_coach_llm_rag_graph_api import router as genai_coach_router
from app.api.datasets import router as datasets_router
from app.api.digital_twin import router as digital_twin_router
from app.api.hr_dashboard import router as hr_dashboard_router
from app.api.architecture import router as architecture_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    print(f"Starting {settings.APP_NAME} with all 8 Slide 16 AI/ML Feature API Modules...")
    init_db()
    yield
    print(f"Shutting down {settings.APP_NAME}...")

app = FastAPI(
    title=settings.APP_NAME,
    description="Backend API Engine for Pixel Dash Workforce Wellness Platform (Slide 16 / Image 3 AI/ML Modules)",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration for React frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers with Feature & Model Names
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(gamification_router, prefix=settings.API_V1_STR)
app.include_router(nutrition_router, prefix=settings.API_V1_STR)
app.include_router(health_suggestions_router, prefix=settings.API_V1_STR)
app.include_router(players_router, prefix=settings.API_V1_STR)
app.include_router(health_prediction_router, prefix=settings.API_V1_STR)
app.include_router(exercise_cv_router, prefix=settings.API_V1_STR)
app.include_router(health_risk_router, prefix=settings.API_V1_STR)
app.include_router(anomaly_detection_router, prefix=settings.API_V1_STR)
app.include_router(segmentation_router, prefix=settings.API_V1_STR)
app.include_router(genai_coach_router, prefix=settings.API_V1_STR)
app.include_router(datasets_router, prefix=settings.API_V1_STR)
app.include_router(digital_twin_router, prefix=settings.API_V1_STR)
app.include_router(hr_dashboard_router, prefix=settings.API_V1_STR)
app.include_router(architecture_router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    modules = [
        "1. Health Prediction: LSTM (app/ml/health_prediction_lstm.py)",
        "2. Exercise Detection: MediaPipe Pose (app/cv/exercise_detection_mediapipe_pose.py)",
        "3. Exercise Classification: ST-GCN (app/cv/exercise_classification_stgcn.py)",
        "4. Nutrition Recommendation: Collaborative Filtering (app/ml/nutrition_recommendation_collaborative_filtering.py)",
        "5. Health Risk Prediction: XGBoost (app/ml/health_risk_prediction_xgboost.py)",
        "6. Employee Segmentation: K-Means (app/ml/employee_segmentation_kmeans.py)",
        "7. Anomaly Detection: Isolation Forest (app/ml/anomaly_detection_isolation_forest.py)",
        "8. GenAI Wellness Coach: LLM + RAG + Knowledge Graph (app/rag/genai_wellness_coach_llm_rag_graph.py)"
    ]
    return {
        "status": "healthy",
        "app_name": settings.APP_NAME,
        "docs_url": "/docs",
        "api_v1": settings.API_V1_STR,
        "ai_ml_modules": modules,
        "slide_16_ai_ml_modules": modules,
        "kaggle_datasets": [
            "MotionSense HAR Dataset",
            "Indian Food & Nutrition Dataset",
            "Wearables Master Employee Dataset",
            "Exercise Recognition MediaPipe Dataset"
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
