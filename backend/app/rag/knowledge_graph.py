import sqlite3
from typing import Dict, Any, List
from app.db import get_db_connection

class WellnessKnowledgeGraph:
    """
    Knowledge Graph & RAG Advisor for GenAI Wellness Coaching.
    Maps nodes: Employee -> Stress/HRV -> Recovery Needs -> Nutrition & Ergonomic Interventions.
    """

    GRAPH_NODES = {
        "Low_HRV": ["Parasympathetic_Fatigue", "Vagal_Breathing", "Magnesium_Supplementation", "Sleep_Extension"],
        "High_Stress": ["Cortisol_Spike", "Mindfulness_Break", "Workload_Capping", "EAP_Consultation"],
        "Sedentary": ["Spinal_Compression", "Ergonomic_Break_45m", "Daily_Step_Goal_8000"],
        "Burnout_Risk": ["Cognitive_Exhaustion", "Mental_Health_Leave", "Task_Delegation"]
    }

    def generate_coach_advice(self, employee_id: str, query: str) -> Dict[str, Any]:
        """
        Generates contextual GenAI Wellness Coach response backed by Knowledge Graph entities and RAG search.
        """
        conn = get_db_connection()
        cursor = conn.cursor()

        # RAG Search across Knowledge Base
        query_words = [w.lower() for w in query.split() if len(w) > 3]
        docs = []
        if query_words:
            sql = "SELECT category, title, content FROM rag_knowledge_base WHERE " + " OR ".join(["content LIKE ?"] * len(query_words))
            params = [f"%{w}%" for w in query_words]
            cursor.execute(sql, params)
            rows = cursor.fetchall()
            for r in rows:
                docs.append({"category": r["category"], "title": r["title"], "content": r["content"]})

        if not docs:
            cursor.execute("SELECT category, title, content FROM rag_knowledge_base LIMIT 2;")
            for r in cursor.fetchall():
                docs.append({"category": r["category"], "title": r["title"], "content": r["content"]})

        conn.close()

        # Knowledge Graph Entity Mapping
        entities = []
        if "stress" in query.lower() or "burnout" in query.lower():
            entities.extend(self.GRAPH_NODES["High_Stress"])
            entities.extend(self.GRAPH_NODES["Burnout_Risk"])
        if "sleep" in query.lower() or "hrv" in query.lower() or "recovery" in query.lower():
            entities.extend(self.GRAPH_NODES["Low_HRV"])
        if not entities:
            entities = self.GRAPH_NODES["Sedentary"]

        advice_text = (
            f"Based on your query '{query}', here is your personalized AI Wellness Coach guidance:\n\n"
            f"1. **Physiological Recovery**: Incorporate targeted micro-rest breaks. Your Knowledge Graph entities indicate "
            f"{', '.join(entities[:3])}.\n"
            f"2. **Evidence-Based Protocol**: {docs[0]['content'] if docs else 'Maintain daily 8,000 steps and 7.5h sleep.'}\n"
            f"3. **Actionable Step**: Set a reminder for a 3-minute post-lunch breathing exercise to improve HRV parasympathetic tone."
        )

        return {
            "employee_id": employee_id,
            "user_query": query,
            "generated_advice": advice_text,
            "rag_retrieved_documents": docs,
            "knowledge_graph_entities": list(set(entities))
        }
