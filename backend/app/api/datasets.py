from fastapi import APIRouter, HTTPException, Query
from typing import Dict, Any, List
from app.utils.har_dataset_loader import HARDatasetLoader

router = APIRouter(prefix="/datasets", tags=["Kaggle Benchmark Motion Datasets"])
loader = HARDatasetLoader()

@router.get("/catalog")
def get_datasets_catalog():
    try:
        datasets_list = [
            {"name": "MotionSense HAR", "type": "6-axis IMU Accelerometer/Gyroscope"},
            {"name": "Indian Food & Nutrition", "type": "Recipe Nutrition Knowledge Graph"},
            {"name": "Wearables Dataset", "type": "Master Employee HRMS Metrics"},
            {"name": "UCI_HAR", "type": "Human Activity Recognition using Smartphones"},
            {"name": "KU_HAR", "type": "Kaggle Motion Dataset"},
            {"name": "Walker_Fall", "type": "Walker Fall Detection Dataset"},
            {"name": "Elderly_Fall_IoT", "type": "Elderly Fall IoT Sensor Dataset"}
        ]
        return {
            "datasets": datasets_list,
            "MotionSense": datasets_list[0],
            "Indian Food & Nutrition": datasets_list[1],
            "Wearables Dataset": datasets_list[2],
            "UCI_HAR": datasets_list[3],
            "KU_HAR": datasets_list[4],
            "Walker_Fall": datasets_list[5],
            "Elderly_Fall_IoT": datasets_list[6]
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
