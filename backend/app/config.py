import os

try:
    from pydantic_settings import BaseSettings, SettingsConfigDict
except ImportError:
    from pydantic import BaseModel as BaseSettings
    SettingsConfigDict = None

class Settings(BaseSettings):
    """
    Application Configuration Settings for AI Employee Wellness Platform.
    Includes fallback for pydantic_settings.
    """
    APP_NAME: str = "AI Employee Wellness & Motion Analytics Platform"
    APP_ENV: str = "development"
    DEBUG: bool = True
    API_V1_STR: str = "/api/v1"
    
    # Database
    DATABASE_URL: str = "sqlite:///./data/wellness.db"
    
    # Pre-trained Model Paths
    MODELS_DIR: str = "./models_saved"
    ANOMALY_MODEL_PATH: str = "./models_saved/anomaly_isolation_forest.joblib"
    BURNOUT_MODEL_PATH: str = "./models_saved/burnout_xgboost.joblib"
    SEGMENTATION_MODEL_PATH: str = "./models_saved/segmentation_kmeans.joblib"
    SCALER_KMEANS_PATH: str = "./models_saved/scaler_kmeans.joblib"
    
    # RAG & LLM Engine Settings
    LLM_PROVIDER: str = "mock_local"
    OPENAI_API_KEY: str = "sk-demo-wellness-key"
    
    # Kaggle Datasets Directory
    HAR_DATASETS_DIR: str = "./data/csv"

    if SettingsConfigDict is not None:
        model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
