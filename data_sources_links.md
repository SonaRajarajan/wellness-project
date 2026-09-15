# PIXEL DASH PLATFORM: OFFICIAL BENCHMARK DATASETS & SOURCES

This document outlines the **5 official Kaggle benchmark datasets** integrated into the **Pixel Dash Workforce Wellness Platform** (Slide 16 & Slide 17 Methodology).

---

### 📊 OFFICIAL DATASETS TABULAR MATRIX:

| # | Dataset Name | Kaggle Dataset Link | Key Simulated / Extracted Features | Target AI/ML Module & Usage |
|---|---|---|---|---|
| **1** | **Kaggle Wearables Dataset** | [manideepreddy966/wearables-dataset](https://www.kaggle.com/datasets/manideepreddy966/wearables-dataset) | `UserId`, `TotalSteps`, `TotalDistance_km`, `VeryActiveMinutes`, `Calories`, `HeartRate_bpm`, `HRV_ms`, `SleepHours`, `SpO2_percent` | **Master Employee Telemetry**: Serves as the primary key (`UserId`) for employee profile matching, Composite Wellness Scoring ($WS$), and XGBoost Burnout Risk Prediction. |
| **2** | **MotionSense HAR Dataset** | [malekzadeh/motionsense-dataset](https://www.kaggle.com/datasets/malekzadeh/motionsense-dataset) | `attitude`, `userAcceleration` (x, y, z), `rotationRate` (50 Hz 6-axis IMU) | **Health Prediction (LSTM)** & **Anomaly Detection (Isolation Forest)**: Time-series physical motion sensor signals and fall event detection. |
| **3** | **Employee Attendance Ratings** | [yasirub/employee-attendance-ratings](https://www.kaggle.com/datasets/yasirub/employee-attendance-ratings) | `in_time`, `out_time`, `workload_hours`, `leave_days_taken`, `attendance_status` | **Health Risk Prediction (XGBoost)** & **HR Dashboard**: Workload strain metrics, absenteeism tracking, and corporate burnout risk analysis. |
| **4** | **Indian Food Nutrition Dataset** | [batthulavinay/indian-food-nutrition](https://www.kaggle.com/datasets/batthulavinay/indian-food-nutrition) | `recipe_name`, `course`, `calories`, `protein_g`, `carbs_g`, `fat_g`, `ingredients` | **Nutrition Recommendation (Collaborative Filtering + RAG)**: Course-wise (Starter, Main, Dessert, Drink) personalized meal menu. |
| **5** | **Exercise Recognition Dataset** | [muhannadtuameh/exercise-recognition](https://www.kaggle.com/datasets/muhannadtuameh/exercise-recognition) | `frame_id`, `landmark_x`, `landmark_y`, `landmark_z`, `exercise_type` | **Exercise Detection (MediaPipe Pose)** & **Classification (ST-GCN)**: 33 3D skeletal landmark tracking, rep counting & form grading. |

---

## 🔗 Verified Kaggle Links:
1. **Kaggle Wearables Dataset**: [https://www.kaggle.com/datasets/manideepreddy966/wearables-dataset](https://www.kaggle.com/datasets/manideepreddy966/wearables-dataset)
2. **MotionSense HAR Dataset**: [https://www.kaggle.com/datasets/malekzadeh/motionsense-dataset](https://www.kaggle.com/datasets/malekzadeh/motionsense-dataset)
3. **Employee Attendance Ratings**: [https://www.kaggle.com/datasets/yasirub/employee-attendance-ratings](https://www.kaggle.com/datasets/yasirub/employee-attendance-ratings)
4. **Indian Food Nutrition Dataset**: [https://www.kaggle.com/datasets/batthulavinay/indian-food-nutrition](https://www.kaggle.com/datasets/batthulavinay/indian-food-nutrition)
5. **Exercise Recognition Dataset**: [https://www.kaggle.com/datasets/muhannadtuameh/exercise-recognition](https://www.kaggle.com/datasets/muhannadtuameh/exercise-recognition)
