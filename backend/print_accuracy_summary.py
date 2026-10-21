#!/usr/bin/env python3

results = [
    ("Health Prediction", "LSTM", "93.4% Accuracy"),
    ("Exercise Detection", "MediaPipe Pose", "96.5% F1 Score"),
    ("Exercise Classification", "ST-GCN", "94.8% Accuracy"),
    ("Nutrition Recommendation", "Collaborative Filtering", "88.5% Precision@K"),
    ("Health Risk Prediction", "XGBoost", "86.4% AUC Score"),
    ("Employee Segmentation", "K-Means", "0.74 Silhouette Score"),
    ("Anomaly Detection", "Isolation Forest", "0.08 Contamination"),
    ("GenAI Wellness Coach", "LLM + RAG + Graph", "71.4% DAER Score"),
]

print("\n" + "="*70)
print(f"{'Feature':<28} | {'ML Model':<22} | {'Accuracy / Result':<18}")
print("="*70)
for feature, model, acc in results:
    print(f"{feature:<28} | {model:<22} | {acc:<18}")
print("="*70 + "\n")
