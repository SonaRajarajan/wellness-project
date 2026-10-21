import React, { useState, useEffect } from 'react';
import { Bot, Send, Sparkles, Brain, RefreshCw, MessageSquare, Compass, ShieldCheck } from 'lucide-react';

export default function GenAICoach({ user }) {
  const empId = user?.employee_id || user?.id || 'EMP001';
  const userName = user?.name || 'Sona VR';
  const userDept = user?.department || 'Alpha IT';

  const [query, setQuery] = useState(`How can I lower my diet for ${userName}?`);
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState('Nutritional & Caloric Management');
  const [response, setResponse] = useState({
    entities: [
      'Calorie Deficit', 'Low Glycemic Index', 'Fiber-Rich Metabolism',
      'Protein Synthesis', 'Hydration Balance'
    ],
    advice: `Based on ${userName}'s query and personalized physiological metrics, here is your AI Wellness Coach guidance:

1. **Calorie & Diet Optimization**: Focus on high-volume, low-calorie-density whole foods (sprouted moong bowls, dalma, fiber-rich green salads) targeting a modest 300–500 kcal daily deficit.

2. **Metabolic Nutrition**: Replace refined sugars and simple carbs with slow-digesting complex grains (ragi, oats, brown rice) to stabilize blood glucose and prevent mid-afternoon energy crashes.

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
      const res = await fetch('http://localhost:8000/api/v1/genai-coach/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employee_id: empId, user_query: query })
      });
      if (res.ok) {
        const data = await res.json();
        setTopic(data.topic || 'GenAI Wellness Guidance');
        // Clean entity labels by removing underscores and raw database prefixes
        const cleanedEntities = (data.knowledge_graph_entities || response.entities).map(ent =>
          ent.replace(/_/g, ' ').replace(/^Employee:\s*/i, '')
        );
        setResponse({
          entities: cleanedEntities,
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
        <p key={pIdx} className="mb-4 leading-relaxed text-gray-200">
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
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8">
      {/* 🌟 PAGE HEADER 🌟 */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#00f0ff]/40 pb-5">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-[#00f0ff] tracking-wide uppercase flex items-center gap-3">
            <Bot className="text-[#00ff66]" size={32} />
            <span>GENAI WELLNESS COACH</span>
          </h1>
          <p className="text-sm md:text-base text-gray-300 mt-1 font-medium">
            Contextual AI wellness guidance powered by personalized health analytics.
          </p>
        </div>

        <div className="px-4 py-2 bg-[#121824] border border-[#00f0ff]/50 rounded-lg text-right shadow-md">
          <div className="text-sm font-bold text-white">{userName}</div>
          <div className="text-xs text-[#00f0ff] font-mono">{userDept} • {empId}</div>
        </div>
      </div>



      {/* 🌟 QUICK PROMPT SUGGESTIONS 🌟 */}
      <div className="space-y-2">
        <div className="text-xs font-bold text-gray-300 uppercase tracking-wider">Suggested Prompts:</div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setQuery(`How can I lower my diet for ${userName}?`)}
            className="px-3.5 py-2 bg-[#141d2b] border border-[#00f0ff]/40 text-[#00f0ff] hover:bg-[#00f0ff] hover:text-black rounded-lg text-xs md:text-sm font-bold transition-all cursor-pointer"
          >
            Lower Diet & Calorie Deficit
          </button>
          <button
            onClick={() => setQuery(`How can I reduce work stress and burnout for ${userName}?`)}
            className="px-3.5 py-2 bg-[#141d2b] border border-amber-500/40 text-amber-300 hover:bg-amber-400 hover:text-black rounded-lg text-xs md:text-sm font-bold transition-all cursor-pointer"
          >
            Burnout & Work Stress
          </button>
          <button
            onClick={() => setQuery(`How can I improve sleep quality and HRV for ${userName}?`)}
            className="px-3.5 py-2 bg-[#141d2b] border border-purple-500/40 text-purple-200 hover:bg-purple-500 hover:text-white rounded-lg text-xs md:text-sm font-bold transition-all cursor-pointer"
          >
            Sleep & HRV Recovery
          </button>
        </div>
      </div>

      {/* 🌟 CHAT QUERY FORM 🌟 */}
      <form onSubmit={handleAsk} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Ask GenAI Coach a question for ${userName}...`}
            className="w-full bg-[#121824] border border-[#2b394a] focus:border-[#00f0ff] px-5 py-3.5 rounded-xl text-sm md:text-base text-white font-mono focus:outline-none font-medium shadow-inner"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-7 py-3.5 bg-[#00f0ff] text-black font-extrabold text-sm uppercase tracking-wider rounded-xl hover:bg-white transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.3)] shrink-0"
        >
          {loading ? <RefreshCw className="animate-spin" size={18} /> : <Send size={18} />}
          <span>{loading ? 'ANALYZING...' : 'ASK COACH'}</span>
        </button>
      </form>

      {/* 🌟 AI COACH RESPONSE CARD 🌟 */}
      <div className="bg-[#121826] border-2 border-[#00ff66]/70 rounded-xl p-6 md:p-8 space-y-4 shadow-[0_0_25px_rgba(0,255,102,0.12)]">
        <div className="flex items-center gap-2.5 border-b border-[#00ff66]/30 pb-4">
          <Sparkles className="text-[#00ff66]" size={22} />
          <h3 className="text-lg md:text-xl font-bold text-[#00ff66] uppercase tracking-wide">
            Personalized Guidance for {userName}
          </h3>
        </div>

        <div className="text-sm md:text-base font-mono bg-[#17202e] p-6 rounded-xl border border-gray-800">
          {renderFormattedAdvice(response.advice)}
        </div>
      </div>
    </div>
  );
}
