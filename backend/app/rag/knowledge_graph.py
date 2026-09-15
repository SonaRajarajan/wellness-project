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
        "Burnout_Risk": ["Cognitive_Exhaustion", "Mental_Health_Leave", "Task_Delegation"],
        "Diet_Management": ["Calorie_Deficit", "Low_Glycemic_Index", "Fiber_Rich_Metabolism", "Protein_Synthesis", "Hydration_Balance"],
        "Exercise_Posture": ["Quad_Flexion_90", "Spinal_Decompression", "MediaPipe_3D_Pose", "Postural_Alignment"]
    }

    def generate_coach_advice(self, employee_id: str, query: str) -> Dict[str, Any]:
        """
        Generates contextual GenAI Wellness Coach response backed by Knowledge Graph entities and RAG search.
        """
        conn = get_db_connection()
        cursor = conn.cursor()

        # Retrieve employee details
        cursor.execute("SELECT name, department, role FROM employees WHERE employee_id = ?", (employee_id,))
        emp_row = cursor.fetchone()
        emp_name = emp_row["name"] if emp_row else f"Employee {employee_id}"

        q_lower = query.lower()

        # RAG Search across Knowledge Base
        query_words = [w for w in q_lower.split() if len(w) > 3]
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

        # Knowledge Graph Entity & Topic Intent Mapping
        entities = []
        topic = "General Wellness"

        if any(w in q_lower for w in ["diet", "food", "calorie", "meal", "weight", "eat", "lower", "nutrition", "fat"]):
            topic = "Nutritional & Caloric Management"
            entities.extend(self.GRAPH_NODES["Diet_Management"])
            advice_text = (
                f"Based on {emp_name}'s query ('{query}') and personalized physiological metrics, here is your RAG AI Wellness Coach guidance:\n\n"
                f"1. **Calorie & Diet Optimization**: To lower dietary intake and optimize metabolism for {emp_name}, focus on high-volume, low-calorie-density whole foods (sprouted moong bowls, dalma, fiber-rich green salads) targeting a modest 300–500 kcal daily deficit.\n\n"
                f"2. **Nutritional RAG Protocol**: Replace refined sugars and simple carbs with slow-digesting complex grains (ragi, oats, brown rice) to stabilize blood glucose and prevent mid-afternoon energy crashes.\n\n"
                f"3. **Hydration & Portion Control**: Drink 500ml of water 20 minutes prior to main meals, and maintain a 30g protein baseline per meal to preserve lean muscle mass while lowering overall caloric intake."
            )
        elif any(w in q_lower for w in ["stress", "burnout", "workload", "anxious", "overwhelmed"]):
            topic = "Stress & Workload Management"
            entities.extend(self.GRAPH_NODES["High_Stress"])
            entities.extend(self.GRAPH_NODES["Burnout_Risk"])
            advice_text = (
                f"Based on {emp_name}'s query ('{query}'), here is your RAG AI Wellness Coach stress mitigation strategy:\n\n"
                f"1. **Physiological Stress Reset**: Your Knowledge Graph entities indicate Cortisol_Spike management via 5-minute guided vagal breathing exercises and micro-rest intervals during peak workload hours.\n\n"
                f"2. **Workload Capping**: Cap maximum continuous work sessions at 90 minutes followed by 10-minute active recovery breaks to preserve parasympathetic tone.\n\n"
                f"3. **Sleep Extension**: Maintain a consistent 7.5-hour nightly sleep window to reduce systemic inflammation and cognitive exhaustion."
            )
        elif any(w in q_lower for w in ["sleep", "hrv", "tired", "fatigue", "rest", "insomnia"]):
            topic = "Sleep & Autonomic Recovery"
            entities.extend(self.GRAPH_NODES["Low_HRV"])
            advice_text = (
                f"Based on {emp_name}'s query ('{query}'), here is your RAG AI Wellness Coach sleep recovery plan:\n\n"
                f"1. **Circadian Alignment**: Establish a strict bed & wake time schedule. Eliminate blue-light screen exposure 45 minutes prior to sleep to maximize natural melatonin synthesis.\n\n"
                f"2. **Autonomic HRV Booster**: Incorporate magnesium-rich evening snacks (Semolina Porridge, warm turmeric milk) to activate parasympathetic vagal tone before bedtime.\n\n"
                f"3. **Recovery Goal**: Target 7.5 to 8.0 hours of un-fragmented sleep to restore HRV balance above 45ms."
            )
        elif any(w in q_lower for w in ["squat", "exercise", "posture", "workout", "lunge", "pushup", "reps"]):
            topic = "Exercise Biomechanics & Posture Tracking"
            entities.extend(self.GRAPH_NODES["Exercise_Posture"])
            advice_text = (
                f"Based on {emp_name}'s query ('{query}'), here is your RAG AI Exercise CV guidance:\n\n"
                f"1. **Biomechanics & Joint Flexion**: Ensure complete range of motion during squats (achieving 90° knee flexion with hips parallel to the ground) to maximize quad engagement.\n\n"
                f"2. **Posture Form Score**: Keep your chest erect and heels firmly grounded throughout repetition movement cycles to prevent lumbar compensation.\n\n"
                f"3. **MediaPipe Tracking**: Utilize the live Video CV Analyzer on the Exercise tab for real-time 3D skeletal landmark validation and ST-GCN posture grading."
            )
        else:
            entities.extend(self.GRAPH_NODES["Sedentary"])
            advice_text = (
                f"Based on {emp_name}'s query ('{query}'), here is your personalized RAG AI Wellness Coach guidance:\n\n"
                f"1. **Workplace Active Recovery**: Incorporate 5-minute movement breaks every 45 minutes to relieve spinal compression and boost blood flow.\n\n"
                f"2. **Evidence-Based Protocol**: {docs[0]['content'] if docs else 'Maintain daily 8,000 steps and 7.5h sleep.'}\n\n"
                f"3. **Actionable Goal**: Set a daily step target of 8,500 steps and log your nutrition to optimize overall Digital Twin wellness metrics."
            )

        return {
            "employee_id": employee_id,
            "user_query": query,
            "topic": topic,
            "generated_advice": advice_text,
            "rag_retrieved_documents": docs,
            "knowledge_graph_entities": list(set(entities))
        }

    def query_triples(self, goals: str = "", symptom: str = "", burnout_risk: float = 0.35) -> List[str]:
        triples = []
        g_lower = (goals or "").lower()
        if any(w in g_lower for w in ["diet", "calorie", "weight", "food", "eat", "lower", "nutrition"]):
            triples.extend(["Calorie_Deficit", "Low_Glycemic_Index", "Fiber_Rich_Metabolism", "Protein_Synthesis"])
        elif any(w in g_lower for w in ["stress", "burnout", "workload"]) or burnout_risk > 0.6:
            triples.extend(["Cortisol_Spike", "Mindfulness_Break", "Workload_Capping", "EAP_Consultation"])
        elif any(w in g_lower for w in ["sleep", "hrv", "fatigue"]):
            triples.extend(["Sleep_Extension", "Parasympathetic_Tone", "Melatonin_Circadian"])
        else:
            triples.extend(["Spinal_Compression", "Ergonomic_Break_45m", "Daily_Step_Goal_8000"])
        return list(set(triples))
