from fastapi import APIRouter, HTTPException, Query
from typing import Dict, Any, List
from app.utils.har_dataset_loader import HARDatasetLoader

router = APIRouter(prefix="/datasets", tags=["Kaggle Benchmark Motion Datasets"])
loader = HARDatasetLoader()

@router.get("/catalog")
def get_datasets_catalog():
    try:
        return {
            "datasets": [
                {"name": "MotionSense HAR", "type": "6-axis IMU Accelerometer/Gyroscope"},
                {"name": "Indian Food & Nutrition", "type": "Recipe Nutrition Knowledge Graph"},
                {"name": "Wearables Dataset", "type": "Master Employee HRMS Metrics"}
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{dataset_name}/sample")
def get_dataset_sample(dataset_name: str, limit: int = Query(default=50, le=200)):
    try:
        records = loader.load_sample_data(dataset_name, limit)
        return {
            "dataset_name": dataset_name,
            "sample_count": len(records),
            "records": records
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
