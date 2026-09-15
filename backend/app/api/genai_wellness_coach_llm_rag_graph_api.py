from fastapi import APIRouter, HTTPException
from app.rag.genai_wellness_coach_llm_rag_graph import GenAIWellnessCoachRAGEngine

router = APIRouter(prefix="/genai-coach", tags=["8. GenAI Wellness Coach (LLM + RAG + Knowledge Graph)"])
coach_engine = GenAIWellnessCoachRAGEngine()

from typing import Optional
from app.models.schemas import GenAICoachRequest, GenAICoachResponse
from app.rag.knowledge_graph import WellnessKnowledgeGraph

kg_graph = WellnessKnowledgeGraph()

@router.post("/ask")
def ask_wellness_coach(payload: Optional[GenAICoachRequest] = None, employee_id: Optional[str] = "EMP001", user_query: Optional[str] = "How can I lower my work stress and improve sleep recovery?"):
    """
    8. GenAI Wellness Coach: LLM + RAG + Knowledge Graph (Slide 16 / Image 3)
    """
    try:
        emp_id = payload.employee_id if payload else employee_id
        query = payload.user_query if payload else user_query
        
        kg_res = kg_graph.generate_coach_advice(emp_id, query)
        rag_res = coach_engine.generate_coaching_advice(
            employee_id=emp_id,
            goals=query
        )
        
        return {
            "employee_id": emp_id,
            "user_query": query,
            "generated_advice": kg_res["generated_advice"],
            "rag_retrieved_documents": kg_res["rag_retrieved_documents"],
            "knowledge_graph_entities": kg_res["knowledge_graph_entities"],
            "primary_actionable_recommendation": rag_res["primary_actionable_recommendation"],
            "rag_reasoning_explanation": rag_res["rag_reasoning_explanation"],
            "coaching_tone": rag_res["coaching_tone"],
            "daily_active_engagement_rate_target": "71.4% (DAER Benchmark)"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
