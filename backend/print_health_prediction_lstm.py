import json
from app.ml.health_prediction_lstm import LSTMHealthPredictor

def main():
    print("=" * 100)
    print("      SLIDE 16 / IMAGE 3: FEATURE 1 — HEALTH PREDICTION (LSTM NEURAL NETWORK)")
    print("=" * 100)

    predictor = LSTMHealthPredictor()

    sample_telemetry = [
        {"timestamp": "2026-08-25T08:00:00Z", "heart_rate": 72.5, "hrv": 48.2, "sleep_hours": 7.2, "stress_level": 3.8},
        {"timestamp": "2026-08-26T08:00:00Z", "heart_rate": 74.0, "hrv": 46.0, "sleep_hours": 6.8, "stress_level": 4.2},
        {"timestamp": "2026-08-27T08:00:00Z", "heart_rate": 76.8, "hrv": 41.5, "sleep_hours": 6.0, "stress_level": 5.5},
        {"timestamp": "2026-08-28T08:00:00Z", "heart_rate": 79.2, "hrv": 37.0, "sleep_hours": 5.5, "stress_level": 6.8},
    ]

    result = predictor.predict_health_trends(
        employee_id="EMP001 (Sona VR)",
        historical_records=sample_telemetry,
        predict_days=3
    )

    print("\n📊 EVALUATED MODEL OUTPUT & METRICS:")
    print(f"  • ML Module Name     : {result['ml_module']}")
    print(f"  • Employee Target    : {result['employee_id']}")
    print(f"  • Model Accuracy     : {result['confidence_interval']['lstm_model_accuracy_pct']}% (MotionSense HAR Benchmark)")
    print(f"  • Overall Health Trend: {result['overall_health_trend']}\n")

    print("📈 3-DAY TIME-SERIES PREDICTED RECOVERY FORECASTS:")
    for f in result["predicted_metrics"]:
        print(f"  • [{f['day_offset']} ({f['predicted_date']})] HR: {f['predicted_heart_rate']} bpm | HRV: {f['predicted_hrv']} ms | Sleep: {f['predicted_sleep_hours']} h | Readiness Score: {f['readiness_score']}/100")

    print("\n" + "=" * 100)

if __name__ == "__main__":
    main()
