from fastapi import APIRouter, HTTPException
from typing import Optional
from app.rag.genai_wellness_coach_llm_rag_graph import GenAIWellnessCoachRAGEngine
from app.models.schemas import GenAICoachRequest, GenAICoachResponse
from app.rag.knowledge_graph import WellnessKnowledgeGraph

router = APIRouter(prefix="/genai-coach", tags=["8. GenAI Wellness Coach (LLM + RAG + Knowledge Graph)"])
rag_alias_router = APIRouter(prefix="/rag", tags=["8. GenAI Wellness Coach (LLM + RAG + Knowledge Graph)"])

coach_engine = GenAIWellnessCoachRAGEngine()
kg_graph = WellnessKnowledgeGraph()

def process_coach_query(emp_id: str, query: str):
    kg_res = kg_graph.generate_coach_advice(emp_id, query)
    rag_res = coach_engine.generate_coaching_advice(
        employee_id=emp_id,
        goals=query
    )
    
    return {
        "employee_id": emp_id,
        "user_query": query,
        "topic": kg_res.get("topic", "General Wellness"),
        "generated_advice": kg_res["generated_advice"],
        "rag_retrieved_documents": kg_res["rag_retrieved_documents"],
        "knowledge_graph_entities": kg_res["knowledge_graph_entities"],
        "primary_actionable_recommendation": rag_res["primary_actionable_recommendation"],
        "rag_reasoning_explanation": rag_res["rag_reasoning_explanation"],
        "coaching_tone": rag_res["coaching_tone"],
        "daily_active_engagement_rate_target": "71.4% (DAER Benchmark)"
    }

@router.post("/ask")
@router.post("/coach")
def ask_wellness_coach(payload: Optional[GenAICoachRequest] = None, employee_id: Optional[str] = "EMP001", user_query: Optional[str] = "How can I lower my work stress and improve sleep recovery?"):
    try:
        emp_id = payload.employee_id if (payload and payload.employee_id) else employee_id
        query = payload.user_query if (payload and payload.user_query) else user_query
        return process_coach_query(emp_id, query)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@rag_alias_router.post("/coach")
@rag_alias_router.post("/ask")
def ask_wellness_coach_alias(payload: Optional[GenAICoachRequest] = None, employee_id: Optional[str] = "EMP001", user_query: Optional[str] = "How can I lower my work stress and improve sleep recovery?"):
    try:
        emp_id = payload.employee_id if (payload and payload.employee_id) else employee_id
        query = payload.user_query if (payload and payload.user_query) else user_query
        return process_coach_query(emp_id, query)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
