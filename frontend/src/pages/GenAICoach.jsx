import React, { useState, useEffect } from 'react';
import { Bot, Send, Sparkles, Network, RefreshCw, MessageSquare } from 'lucide-react';

export default function GenAICoach({ user }) {
  const empId = user?.employee_id || user?.id || 'EMP001';
  const userName = user?.name || 'Sona VR';
  const userDept = user?.department || 'Alpha IT';

  const [query, setQuery] = useState(`How can I lower my diet for ${userName}?`);
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState('Nutritional & Caloric Management');
  const [response, setResponse] = useState({
    entities: [
      'Calorie_Deficit', 'Low_Glycemic_Index', 'Fiber_Rich_Metabolism',
      'Protein_Synthesis', 'Hydration_Balance'
    ],
    advice: `Based on ${userName}'s query ('How can I lower my diet for ${userName}?') and personalized physiological metrics, here is your RAG AI Wellness Coach guidance:

1. **Calorie & Diet Optimization**: To lower dietary intake and optimize metabolism for ${userName}, focus on high-volume, low-calorie-density whole foods (sprouted moong bowls, dalma, fiber-rich green salads) targeting a modest 300–500 kcal daily deficit.

2. **Nutritional RAG Protocol**: Replace refined sugars and simple carbs with slow-digesting complex grains (ragi, oats, brown rice) to stabilize blood glucose and prevent mid-afternoon energy crashes.

3. **Hydration & Portion Control**: Drink 500ml of water 20 minutes prior to main meals, and maintain a 30g protein baseline per meal to preserve lean muscle mass while lowering overall caloric intake.`
  });

  useEffect(() => {
    setQuery(`How can I lower my diet for ${userName}?`);
  }, [userName]);

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      // Call FastAPI GenAI Coach endpoint
      const res = await fetch('http://localhost:8000/api/v1/genai-coach/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employee_id: empId, user_query: query })
      });
      if (res.ok) {
        const data = await res.json();
        setTopic(data.topic || 'GenAI Wellness Guidance');
        setResponse({
          entities: data.knowledge_graph_entities || response.entities,
          advice: data.generated_advice || response.advice
        });
      }
    } catch (e) {
      console.warn('Using fallback GenAI Coach response:', e);
    } finally {
      setLoading(false);
    }
  };

  const renderFormattedAdvice = (text) => {
    if (!text) return null;
    const paragraphs = text.split('\n\n');
    return paragraphs.map((paragraph, pIdx) => {
      const parts = paragraph.split(/(\*\*.*?\*\*)/g);
      return (
        <p key={pIdx} className="mb-3 leading-relaxed">
          {parts.map((part, idx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <strong key={idx} className="text-[#00f0ff] font-bold">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            return part;
          })}
        </p>
      );
    });
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
        <div className="px-4 py-2 bg-[#182230] border border-[#00f0ff] text-right shadow-[0_0_10px_rgba(0,240,255,0.2)]">
          <div className="text-xs font-bold text-white uppercase">{userName}</div>
          <div className="text-[10px] text-[#00f0ff] font-mono">{userDept} • {empId}</div>
        </div>
      </div>

      {/* RAG Knowledge Graph Visual Banner */}
      <div className="bg-[#121820] border-2 border-purple-500/80 p-5 space-y-3 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
        <div className="flex items-center justify-between border-b border-purple-500/30 pb-2">
          <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
            <Network size={16} />
            <span>Active RAG Knowledge Graph Triples ({userName})</span>
          </h3>
          <span className="text-[10px] font-mono text-[#00ff66] bg-[#00ff66]/10 px-2 py-0.5 border border-[#00ff66]">
            TOPIC: {topic.toUpperCase()}
          </span>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {response.entities.map((ent, idx) => (
            <span
              key={idx}
              className="px-3 py-1 bg-purple-950/60 border border-purple-500 text-purple-300 text-xs font-mono font-bold"
            >
              (Employee: {userName}) ➔ [{ent}]
            </span>
          ))}
        </div>
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
        <span className="text-gray-400 font-bold uppercase">Quick Prompts:</span>
        <button
          onClick={() => setQuery(`How can I lower my diet for ${userName}?`)}
          className="px-2.5 py-1 bg-[#182230] border border-[#00f0ff]/50 text-[#00f0ff] hover:bg-[#00f0ff] hover:text-black transition-all"
        >
          🥗 Lower Diet & Calorie Deficit
        </button>
        <button
          onClick={() => setQuery(`How can I reduce work stress and burnout for ${userName}?`)}
          className="px-2.5 py-1 bg-[#182230] border border-yellow-500/50 text-yellow-300 hover:bg-yellow-400 hover:text-black transition-all"
        >
          🧘 Burnout & Work Stress
        </button>
        <button
          onClick={() => setQuery(`How can I improve sleep quality and HRV for ${userName}?`)}
          className="px-2.5 py-1 bg-[#182230] border border-purple-500/50 text-purple-300 hover:bg-purple-500 hover:text-white transition-all"
        >
          🌙 Sleep & HRV Recovery
        </button>
      </div>

      {/* Chat Query Box */}
      <form onSubmit={handleAsk} className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Ask GenAI Coach a question for ${userName}...`}
            className="w-full bg-[#141923] border-2 border-[#2a3442] focus:border-[#00f0ff] px-4 py-3 text-xs md:text-sm text-white font-mono focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-[#00f0ff] text-black font-extrabold text-xs uppercase tracking-widest border-2 border-white hover:bg-black hover:text-[#00f0ff] transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.4)]"
        >
          {loading ? <RefreshCw className="animate-spin" size={16} /> : <Send size={16} />}
          <span>{loading ? 'ANALYZING RAG...' : 'ASK COACH'}</span>
        </button>
      </form>

      {/* Generated Response Output */}
      <div className="bg-[#121820] border-2 border-[#00ff66] p-6 space-y-4 shadow-[0_0_20px_rgba(0,255,102,0.15)]">
        <h3 className="text-sm font-bold text-[#00ff66] uppercase tracking-wider flex items-center gap-2">
          <Sparkles size={18} />
          <span>Personalized RAG Recommendation for {userName}</span>
        </h3>

        <div className="text-xs md:text-sm font-mono text-gray-200 bg-[#182230] p-4 border border-[#2a3442]">
          {renderFormattedAdvice(response.advice)}
        </div>
      </div>
    </div>
  );
}
