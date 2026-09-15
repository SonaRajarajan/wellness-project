#!/usr/bin/env python3
import sys, os
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from app.rag.genai_wellness_coach_llm_rag_graph import GenAIWellnessCoachRAGEngine

def main():
    engine = GenAIWellnessCoachRAGEngine()
    res = engine.generate_coaching_advice(
        employee_id="EMP001",
        name="Sona VR",
        department="Alpha IT",
        burnout_risk_score=0.35,
        steps=9200,
        sleep_hours=7.5,
        goals="Complete 10,000 steps daily & maintain active movement"
    )

    print("\n=======================================================================")
    print(" 8. GenAI Wellness Coach: LLM + RAG + Knowledge Graph (Slide 16 / Image 3)")
    print("=======================================================================")
    print("Employee   :", res["employee_name"], f"({res['department']} • {res['employee_id']})")
    print("Tone       :", res["coaching_tone"])
    print("Advice     :", res["primary_actionable_recommendation"])
    print("RAG Reason :", res["rag_reasoning_explanation"])
    print("Triples    :")
    for t in res["knowledge_graph_triples"]:
        print("  •", t)
    print("=======================================================================\n")

if __name__ == "__main__":
    main()
