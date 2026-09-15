from fastapi import APIRouter, HTTPException
from app.rag.genai_wellness_coach_llm_rag_graph import GenAIWellnessCoachRAGEngine

router = APIRouter(prefix="/genai-coach", tags=["8. GenAI Wellness Coach (LLM + RAG + Knowledge Graph)"])
coach_engine = GenAIWellnessCoachRAGEngine()

@router.post("/ask")
def ask_wellness_coach(employee_id: str = "EMP001", user_query: str = "How can I improve my sleep and recovery score?"):
    """
    8. GenAI Wellness Coach: LLM + RAG + Knowledge Graph (Slide 16 / Image 3)
    """
    try:
        res = coach_engine.generate_coaching_advice(
            employee_id=employee_id,
            goals=user_query
        )
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
