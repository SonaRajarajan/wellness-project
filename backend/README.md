# 🏥 AI Employee Wellness & Motion Analytics Platform — Backend

A robust, production-grade FastAPI backend engine for AI-driven employee wellness monitoring, posture tracking, health risk prediction, and human activity recognition (HAR) anomaly detection.

---

## 📌 Progress to Date & System Architecture

As outlined in the methodology and research roadmap, this backend addresses:
1. **Problem Definition & Architecture**: End-to-end multi-layer modular system linking wearable physiological signals, HRMS records, cafeteria nutrition, exercise computer vision, and Kaggle motion sensor datasets.
2. **AI/ML Model Selection**:
   - **Health Prediction**: Time-series forecast via **LSTM / TFT**
   - **Exercise CV**: **MediaPipe Pose** 3D keypoint tracking & **ST-GCN** movement quality classification
   - **Nutrition Recommendation**: **Collaborative Filtering & Content-Based RAG**
   - **Health Risk / Burnout**: **XGBoost / Gradient Boosting**
   - **Employee Segmentation**: **K-Means** clustering
   - **Anomaly & Fall Detection**: **Isolation Forest** across 5 Kaggle motion datasets
   - **GenAI Wellness Coach**: **LLM + RAG + Knowledge Graph**
3. **Gamification Framework**: Real-time point tracking, activity streaks, level progression, badges, and department leaderboards.

---

## 📊 Kaggle Benchmark Datasets Integrated

The proposed analytical framework integrates 5 publicly available Kaggle wearable sensor datasets containing multi-dimensional accelerometer and gyroscope time-series signals (`AccX`, `AccY`, `AccZ`, `GyroX`, `GyroY`, `GyroZ`):

| Dataset Name | Description | Size & Sampling | Usage in Project |
| :--- | :--- | :--- | :--- |
| **MotionSense HAR** | Smartphone inertial data for daily activities | ~24 subjects, 50 Hz, 2–5 sec windows | Activity recognition & feature extraction |
| **UCI HAR** | Benchmark HAR dataset with labeled activities | 30 subjects, 10,299 samples, 50 Hz | Baseline ML vs DL comparison |
| **KU-HAR** | Multi-activity wearable sensor dataset | 20+ subjects, ~50 Hz | Model generalization across users |
| **Walker Fall Detection** | Inertial data for mobility-aid users | Time-series, fixed sampling | Fall & anomaly detection |
| **Elderly Fall Detection IoT** | Multimodal elderly monitoring dataset | Large-scale, time-series | Safety monitoring & risk analysis |

---

## 📁 Directory Structure (`backend 4`)

```
backend 4/
├── app/
│   ├── main.py                 # FastAPI Application & Lifespan Router Setup
│   ├── config.py               # Pydantic Settings & Environment Variables
│   ├── db.py                   # SQLite Connection & Schema Initializer
│   ├── api/
│   │   ├── health_prediction.py# LSTM / TFT Time-Series Forecast Route
│   │   ├── exercise_cv.py      # MediaPipe Pose & ST-GCN Exercise Analysis Route
│   │   ├── nutrition.py        # RAG Nutrition & Meal Recommendation Route
│   │   ├── health_risk.py      # XGBoost Burnout & Risk Scoring Route
│   │   ├── segmentation.py     # K-Means Employee Segmentation Route
│   │   ├── anomaly_detection.py# Isolation Forest HAR/Fall Detection Route
│   │   ├── genai_coach.py      # LLM + RAG + Knowledge Graph Advisor Route
│   │   ├── gamification.py     # Points, Streaks, Badges & Leaderboard Route
│   │   └── datasets.py         # Kaggle Motion Dataset Metadata & Samples Route
│   ├── cv/
│   │   ├── pose_tracker.py     # MediaPipe Pose Rep Counter & Form Evaluator
│   │   └── stgcn_classifier.py # ST-GCN Biomechanical Quality Classifier
│   ├── ml/
│   │   ├── lstm_health_predictor.py
│   │   ├── xgboost_risk_predictor.py
│   │   ├── kmeans_segmentation.py
│   │   ├── isolation_forest_anomaly.py
│   │   └── har_dataset_loader.py
│   ├── rag/
│   │   ├── wellness_rag_engine.py
│   │   └── knowledge_graph.py
│   └── models/
│       └── schemas.py          # Pydantic Request & Response Validation Schemas
├── data/
│   ├── csv/                    # Sample CSV files for the 5 Kaggle datasets
│   ├── schema.sql              # Database DDL Table Definitions
│   ├── seed_synthetic_data.py  # Realistic Multi-Subject Data Seeder
│   └── wellness.db             # Generated SQLite Production Database
├── models_saved/
│   ├── anomaly_isolation_forest.joblib
│   ├── burnout_xgboost.joblib
│   ├── scaler_kmeans.joblib
│   └── segmentation_kmeans.joblib
├── tests/
│   └── test_api.py             # PyTest Test Suite
├── train_and_export_models.py  # Model Training & Export Script
├── .env
├── .env.example
└── requirements.txt
```

---

## ⚙️ Quickstart & Setup Guide

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Seed Database & Train AI/ML Models
Run the seeder and training scripts:
```bash
python data/seed_synthetic_data.py
python train_and_export_models.py
```

### 3. Run FastAPI Server
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Interactive API documentation available at:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

### 4. Run Automated Test Suite
```bash
pytest tests/test_api.py -v
```

---

## 🛠️ Core API Endpoints

- `GET /` — API Health status & model inventory
- `POST /api/v1/health-prediction/predict` — LSTM physiological forecasting
- `POST /api/v1/exercise-analysis/analyze` — MediaPipe Pose & ST-GCN exercise posture quality
- `POST /api/v1/nutrition/recommend` — RAG + Collaborative Filtering meal recommendations
- `POST /api/v1/health-risk/predict` — XGBoost burnout risk category & score
- `GET /api/v1/segmentation/employees` — K-Means employee wellness clustering
- `POST /api/v1/anomaly-detection/evaluate` — Isolation Forest motion anomaly & fall detection
- `GET /api/v1/anomaly-detection/dataset-logs` — Run anomaly evaluation directly on Kaggle sensor logs
- `POST /api/v1/genai-coach/ask` — GenAI RAG + Knowledge Graph wellness coach
- `GET /api/v1/gamification/user/{employee_id}` — User points, streak, and badges
- `GET /api/v1/gamification/leaderboard` — Company-wide wellness leaderboard
- `GET /api/v1/datasets/catalog` — Metadata & usage guide for the 5 Kaggle HAR datasets
