import os
import pandas as pd
import numpy as np
from typing import Dict, Any, List
from pathlib import Path

CSV_DIR = Path(__file__).parent.parent.parent / "data" / "csv"

class HARDatasetLoader:
    def __init__(self):
        pass

    def load_sample_data(self, dataset_name: str = "MotionSense", limit: int = 50) -> List[Dict[str, Any]]:
        csv_file = CSV_DIR / f"{dataset_name.lower().replace(' ', '_')}_sample.csv"
        if not csv_file.exists():
            csv_file = CSV_DIR / "motionsense_sample.csv"
        
        if csv_file.exists():
            df = pd.read_csv(csv_file)
            return df.head(limit).to_dict(orient="records")
        return []
