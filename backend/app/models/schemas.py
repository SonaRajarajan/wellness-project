from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

# Health Prediction Schemas (LSTM / TFT)
class HealthPredictionRequest(BaseModel):
    employee_id: str = Field(..., json_schema_extra={"example": "EMP-1001"})
    historical_days: int = Field(default=7, json_schema_extra={"example": 7})
    predict_days: int = Field(default=3, json_schema_extra={"example": 3})

class HealthPredictionResponse(BaseModel):
    employee_id: str
    predicted_metrics: List[Dict[str, Any]]
    confidence_interval: Dict[str, float]
    overall_health_trend: str

# Exercise CV Schemas (MediaPipe Pose & ST-GCN)
class ExerciseAnalysisRequest(BaseModel):
    employee_id: str = Field(..., json_schema_extra={"example": "EMP-1001"})
    exercise_type: str = Field(..., json_schema_extra={"example": "Squat"})
    landmarks_sequence: Optional[List[List[Dict[str, float]]]] = None
    frame_base64: Optional[str] = None

class ExerciseAnalysisResponse(BaseModel):
    exercise_type: str
    reps_detected: int
    form_quality_score: float
    posture_feedback: List[str]
    calories_burned_est: float
    stgcn_movement_quality: str

# Nutrition Recommendation Schemas (Collaborative Filtering / Content-Based RAG)
class NutritionRecommendationRequest(BaseModel):
    employee_id: str = Field(..., json_schema_extra={"example": "EMP-1001"})
    target_calories: Optional[float] = Field(default=2000.0, json_schema_extra={"example": 2200.0})
    dietary_preference: Optional[str] = Field(default="Balanced", json_schema_extra={"example": "High Protein"})

class NutritionRecommendationResponse(BaseModel):
    employee_id: str
    recommended_meals: List[Dict[str, Any]]
    macro_breakdown: Dict[str, float]
    personalized_rag_advice: str

# Health Risk Schemas (XGBoost Burnout & Risk)
class HealthRiskRequest(BaseModel):
    employee_id: str = Field(..., json_schema_extra={"example": "EMP-1001"})
    workload_hours_per_week: float = Field(..., json_schema_extra={"example": 55.0})
    sleep_avg_hours: float = Field(..., json_schema_extra={"example": 5.2})
    hrv_ms: float = Field(..., json_schema_extra={"example": 32.0})
    stress_level_1_to_10: float = Field(..., json_schema_extra={"example": 8.5})
    leave_days_taken: int = Field(..., json_schema_extra={"example": 1})

class HealthRiskResponse(BaseModel):
    employee_id: str
    burnout_risk_score: float
    risk_category: str
    contributing_factors: List[str]
    actionable_mitigations: List[str]

# Employee Segmentation Schemas (K-Means)
class SegmentationRequest(BaseModel):
    employee_id: Optional[str] = None

class SegmentationResponse(BaseModel):
    total_employees_segmented: int
    cluster_distribution: Dict[str, int]
    employee_segments: List[Dict[str, Any]]

# Anomaly Detection Schemas (Isolation Forest on MotionSense, UCI HAR, KU-HAR, Walker Fall, Elderly Fall IoT)
class MotionSensorData(BaseModel):
    subject_id: str = Field(..., json_schema_extra={"example": "SUBJ-01"})
    dataset_name: str = Field(default="MotionSense", json_schema_extra={"example": "MotionSense"})
    acc_x: float = Field(..., json_schema_extra={"example": 0.12})
    acc_y: float = Field(..., json_schema_extra={"example": 9.81})
    acc_z: float = Field(..., json_schema_extra={"example": 0.45})
    gyro_x: float = Field(..., json_schema_extra={"example": 0.01})
    gyro_y: float = Field(..., json_schema_extra={"example": 0.03})
    gyro_z: float = Field(..., json_schema_extra={"example": -0.02})

class AnomalyDetectionRequest(BaseModel):
    sensor_logs: List[MotionSensorData]

class AnomalyDetectionResponse(BaseModel):
    total_samples: int
    anomalies_detected: int
    fall_events_predicted: int
    anomaly_scores: List[float]
    sample_evaluations: List[Dict[str, Any]]

# GenAI Wellness Coach Schemas (LLM + RAG + Knowledge Graph)
class GenAICoachRequest(BaseModel):
    employee_id: str = Field(..., json_schema_extra={"example": "EMP-1001"})
    user_query: str = Field(..., json_schema_extra={"example": "How can I lower my work stress and improve sleep recovery?"})

class GenAICoachResponse(BaseModel):
    employee_id: str
    user_query: str
    generated_advice: str
    rag_retrieved_documents: List[Dict[str, str]]
    knowledge_graph_entities: List[str]

# Gamification Schemas
class GamificationResponse(BaseModel):
    employee_id: str
    total_points: int
    current_streak_days: int
    badge_count: int
    active_level: int
    unlocked_badges: List[str]
    leaderboard_rank: int
