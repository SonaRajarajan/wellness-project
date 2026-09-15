import React, { useState, useEffect } from 'react';
import { Bot, Send, Sparkles, Network, RefreshCw } from 'lucide-react';

export default function GenAICoach({ user }) {
  const empId = user?.employee_id || user?.id || 'EMP001';
  const userName = user?.name || 'Sona VR';
  const userDept = user?.department || 'Alpha IT';

  const [query, setQuery] = useState(`How can I lower my work stress and improve sleep recovery for ${userName}?`);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState({
    entities: [
      'Sleep_Extension', 'Cortisol_Spike', 'Mindfulness_Break',
      'EAP_Consultation', 'Mental_Health_Leave', 'Vagal_Breathing'
    ],
    advice: `Based on ${userName}'s physiological metrics and query, here is your personalized RAG AI Wellness Coach guidance:

1. **Physiological Recovery**: Incorporate targeted micro-rest breaks during peak workload windows. Your Knowledge Graph entities indicate Cortisol_Spike management via 5-minute guided vagal breathing exercises.
2. **Sleep Extension Protocol**: Maintain a consistent 7.5-hour sleep window. Avoid blue-light screen exposure 45 minutes prior to bedtime.
3. **Nutritional Support**: Consider warm Dalma or Sweet Lassi post-workout to support parasympathetic tone.`
  });

  useEffect(() => {
    setQuery(`How can I lower my work stress and improve sleep recovery for ${userName}?`);
  }, [userName]);

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!query) return;
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/v1/rag/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employee_id: empId, user_query: query })
      });
      if (res.ok) {
        const data = await res.json();
        setResponse({
          entities: data.knowledge_graph_entities || response.entities,
          advice: data.generated_advice || response.advice
        });
      }
    } catch (e) {
      console.warn('Using fallback GenAI Coach response');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-[#00f0ff] pb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-wider text-[#00f0ff] uppercase flex items-center gap-3">
            <Bot className="text-[#00ff66]" size={32} />
            GenAI Wellness Coach (RAG + Knowledge Graph)
          </h1>
          <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-bold">
            Slide 22 Prototype: Contextual RAG inference powered by personalized medical knowledge graph
          </p>
        </div>

        {/* Active Employee Tag */}
        <div className="px-4 py-2 bg-[#182230] border border-[#00f0ff] text-right">
          <div className="text-xs font-bold text-white uppercase">{userName}</div>
          <div className="text-[10px] text-[#00f0ff] font-mono">{userDept} • {empId}</div>
        </div>
      </div>

      {/* RAG Knowledge Graph Visual Banner */}
      <div className="bg-[#121820] border-2 border-purple-500/80 p-5 space-y-3 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
        <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
          <Network size={16} />
          <span>Active RAG Knowledge Graph Triples ({userName})</span>
        </h3>
        <div className="flex flex-wrap gap-2 pt-1">
          {response.entities.map((ent, idx) => (
            <span
              key={idx}
              className="px-3 py-1 bg-purple-950/60 border border-purple-500 text-purple-300 text-xs font-mono font-bold"
            >
              (Employee) ➔ [{ent}]
            </span>
          ))}
        </div>
      </div>

      {/* Chat Query Box */}
      <form onSubmit={handleAsk} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask GenAI Coach a wellness or recovery question..."
          className="flex-1 bg-[#141923] border-2 border-[#2a3442] focus:border-[#00f0ff] px-4 py-3 text-xs md:text-sm text-white font-mono focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-[#00f0ff] text-black font-extrabold text-xs uppercase tracking-widest border-2 border-white hover:bg-black hover:text-[#00f0ff] transition-all flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? <RefreshCw className="animate-spin" size={16} /> : <Send size={16} />}
          <span>ASK COACH</span>
        </button>
      </form>

      {/* Generated Response Output */}
      <div className="bg-[#121820] border-2 border-[#00ff66] p-6 space-y-4 shadow-[0_0_20px_rgba(0,255,102,0.15)]">
        <h3 className="text-sm font-bold text-[#00ff66] uppercase tracking-wider flex items-center gap-2">
          <Sparkles size={18} />
          <span>Personalized RAG Recommendation</span>
        </h3>

        <div className="text-xs md:text-sm font-mono text-gray-200 whitespace-pre-line leading-relaxed bg-[#182230] p-4 border border-[#2a3442]">
          {response.advice}
        </div>
      </div>
    </div>
  );
}
