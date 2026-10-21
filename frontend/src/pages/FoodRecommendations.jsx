import React, { useState, useEffect } from 'react';
import { Utensils, Star, Clock, ShoppingCart, Check, Target, Sparkles, ChefHat, Flame, Award, Activity, Brain } from 'lucide-react';

export default function FoodRecommendations({ user }) {
  const empId = user?.employee_id || user?.id || 'EMP001';
  const userName = user?.name || 'Sona VR';
  const userDept = user?.department || 'Alpha IT';

  const [meta, setMeta] = useState({
    personal_goal: 'Perform 20 min posture correction micro-workouts daily',
    prediction_recommendation: 'AI Forecast: Eye Strain & Strain Index detected — Anti-inflammatory bioflavonoids, magnesium & joint mobility nutrients recommended.',
    current_mood: 'Calm',
    active_symptom: 'Eye Strain',
    daily_calorie_burn: 1657,
    peer_cosine_sim: 0.955
  });

  const [foodItems, setFoodItems] = useState([
    {
      id: 'RAG-POST-STARTER',
      course: 'Starter & Appetizer',
      title: 'Moringa & Yellow Lentil Broth',
      category: 'Anti-Inflammatory',
      calories: 160.0,
      rating: 4.88,
      prep_time: '12 min',
      cost_pts: 100,
      goal_match: 'Supports 20 min posture correction & spinal flexibility',
      prediction_match: 'Counteracts Eye Strain & High Strain Index (0.28)',
      why_this: 'Formulated to fulfill both your personal posture goal and AI strain forecast with anti-inflammatory bioflavonoids reducing spinal & ocular stiffness.',
      ordered: false
    },
    {
      id: 'RAG-POST-MAIN',
      course: 'Main Power Meal',
      title: 'Palak Paneer & Multigrain Roti',
      category: 'Spinal & Muscle Support',
      calories: 380.0,
      rating: 4.93,
      prep_time: '18 min',
      cost_pts: 135,
      goal_match: 'Provides Magnesium & Calcium for posture alignment',
      prediction_match: 'AI Forecast: Muscle & fatigue recovery support',
      why_this: 'Combines magnesium & calcium rich greens supporting spinal disc alignment during daily micro-workout routines.',
      ordered: false
    },
    {
      id: 'RAG-POST-DESSERT',
      course: 'Healthy Dessert',
      title: 'Roasted Flaxseed & Jaggery Chikki',
      category: 'Disc Hydration & Care',
      calories: 150.0,
      rating: 4.82,
      prep_time: '5 min',
      cost_pts: 85,
      goal_match: 'Essential Omega-3 fatty acids for joint mobility',
      prediction_match: 'AI Forecast: Cellular strain & inflammation relief',
      why_this: 'Rich in plant Omega-3 fatty acids promoting intervertebral disc hydration and post-exercise recovery.',
      ordered: false
    },
    {
      id: 'RAG-POST-BEVERAGE',
      course: 'Functional Beverage',
      title: 'Curd & Pomegranate Elixir',
      category: 'Probiotic & Eye Care',
      calories: 170.0,
      rating: 4.85,
      prep_time: '8 min',
      cost_pts: 95,
      goal_match: 'Hydration & probiotic support for active routines',
      prediction_match: 'AI Forecast: Antioxidant eye strain protection',
      why_this: 'Probiotic gut-joint elixir delivering anthocyanins to soothe eye strain and replenish cellular hydration.',
      ordered: false
    }
  ]);

  const [message, setMessage] = useState('');

  const fetchRecommendations = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/nutrition/recommendations?employee_id=${empId}`);
      if (res.ok) {
        const data = await res.json();
        setMeta({
          personal_goal: user?.goals || data.personal_goal || meta.personal_goal,
          prediction_recommendation: data.prediction_recommendation || meta.prediction_recommendation,
          current_mood: user?.mood || data.current_mood || meta.current_mood,
          active_symptom: user?.symptoms || data.active_symptom || meta.active_symptom,
          daily_calorie_burn: data.daily_calorie_burn || meta.daily_calorie_burn,
          peer_cosine_sim: data.peer_cosine_similarity || 0.955
        });
        if (data.recommendations && data.recommendations.length > 0) {
          setFoodItems(data.recommendations);
        }
      }
    } catch (e) {
      console.warn('Using default food recommendations fallback');
    }
  };

  useEffect(() => {
    setMeta(prev => ({
      ...prev,
      personal_goal: user?.goals || prev.personal_goal,
      current_mood: user?.mood || prev.current_mood,
      active_symptom: user?.symptoms || prev.active_symptom
    }));
    fetchRecommendations();
  }, [empId, user]);

  const handleOrder = (id) => {
    setFoodItems(
      foodItems.map((item) => (item.id === id ? { ...item, ordered: true } : item))
    );
    const orderedItem = foodItems.find((item) => item.id === id);
    setMessage(`Ordered ${orderedItem?.title}! Added to ${userName}'s health journal.`);
    setTimeout(() => setMessage(''), 4000);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
      {/* 🌟 PAGE HEADER 🌟 */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-orange-500/40 pb-5">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-orange-400 tracking-wide uppercase flex items-center gap-3">
            <Utensils className="text-[#00f0ff]" size={32} />
            <span>FOOD RECOMMENDATIONS</span>
          </h1>
          <p className="text-sm md:text-base text-gray-300 mt-1 font-medium">
            Personalized meal selection generated from both your <strong className="text-orange-400">Personal Goal</strong> & <strong className="text-[#00f0ff]">AI Health Predictions</strong>.
          </p>
        </div>

        <div className="px-4 py-2 bg-[#121824] border border-[#00f0ff]/50 rounded-lg text-right">
          <div className="text-sm font-bold text-white">{userName}</div>
          <div className="text-xs text-[#00f0ff] font-mono">{userDept} • {empId}</div>
        </div>
      </div>

      {/* 🌟 DUAL SOURCE BANNER: GOAL + AI PREDICTION 🌟 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* SOURCE 1: EMPLOYEE PERSONAL GOAL */}
        <div className="bg-[#121826] border-2 border-orange-500/70 rounded-xl p-6 shadow-[0_0_20px_rgba(249,115,22,0.12)] space-y-4">
          <div className="flex items-center justify-between border-b border-orange-500/30 pb-3">
            <span className="text-xs md:text-sm font-black text-orange-400 uppercase tracking-widest flex items-center gap-2">
              <Target size={18} />
              <span>EMPLOYEE PERSONAL GOAL</span>
            </span>
            <span className="text-xs text-orange-400 font-mono font-bold bg-orange-500/10 border border-orange-500/40 px-2.5 py-0.5 rounded">
              USER DEFINED
            </span>
          </div>

          <ul className="space-y-2 font-mono text-xs md:text-sm text-gray-200">
            <li className="flex items-center gap-2 whitespace-nowrap overflow-hidden text-ellipsis">
              <span className="text-orange-400 font-black">•</span>
              <span><strong>Target Goal:</strong> {meta.personal_goal}</span>
            </li>
            <li className="flex items-center gap-2 whitespace-nowrap overflow-hidden text-ellipsis">
              <span className="text-[#00ff66] font-black">•</span>
              <span><strong>Primary Focus:</strong> Posture alignment & spinal decompression</span>
            </li>
            <li className="flex items-center gap-2 whitespace-nowrap overflow-hidden text-ellipsis">
              <span className="text-[#ffee00] font-black">•</span>
              <span><strong>Routine Target:</strong> Daily active micro-workout sessions</span>
            </li>
          </ul>

          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-300 pt-1 font-mono border-t border-gray-800">
            <span className="bg-[#1a2332] px-3 py-1 border border-gray-700 rounded-md">
              Status: <strong className="text-[#00ff66]">{meta.current_mood}</strong>
            </span>
            <span className="bg-[#1a2332] px-3 py-1 border border-gray-700 rounded-md">
              Calorie Burn: <strong className="text-orange-400">{meta.daily_calorie_burn} kcal</strong>
            </span>
          </div>
        </div>

        {/* SOURCE 2: AI HEALTH PREDICTION RECOMMENDATION */}
        <div className="bg-[#121826] border-2 border-[#00f0ff]/70 rounded-xl p-6 shadow-[0_0_20px_rgba(0,240,255,0.12)] space-y-4">
          <div className="flex items-center justify-between border-b border-[#00f0ff]/30 pb-3">
            <span className="text-xs md:text-sm font-black text-[#00f0ff] uppercase tracking-widest flex items-center gap-2">
              <Brain size={18} />
              <span>AI HEALTH PREDICTION RECOMMENDATION</span>
            </span>
            <span className="text-xs text-[#00f0ff] font-mono font-bold bg-[#00f0ff]/10 border border-[#00f0ff]/40 px-2.5 py-0.5 rounded">
              XGBoost + RAG AI
            </span>
          </div>

          <ul className="space-y-2 font-mono text-xs md:text-sm text-gray-200">
            <li className="flex items-center gap-2 whitespace-nowrap overflow-hidden text-ellipsis">
              <span className="text-[#00f0ff] font-black">•</span>
              <span><strong>AI Health Forecast:</strong> High strain & muscular fatigue protection</span>
            </li>
            <li className="flex items-center gap-2 whitespace-nowrap overflow-hidden text-ellipsis">
              <span className="text-[#00ff66] font-black">•</span>
              <span><strong>Nutrition AI:</strong> Anti-inflammatory bioflavonoids & magnesium</span>
            </li>
            <li className="flex items-center gap-2 whitespace-nowrap overflow-hidden text-ellipsis">
              <span className="text-[#ffee00] font-black">•</span>
              <span><strong>RAG Action:</strong> Disc hydration & cellular recovery nutrients</span>
            </li>
          </ul>

          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-300 pt-1 font-mono border-t border-gray-800">
            <span className="bg-[#1a2332] px-3 py-1 border border-gray-700 rounded-md">
              Detected Symptom: <strong className="text-purple-300">{meta.active_symptom || 'Eye Strain'}</strong>
            </span>
            <span className="bg-[#1a2332] px-3 py-1 border border-gray-700 rounded-md">
              Peer Cosine Sim: <strong className="text-[#00f0ff]">{meta.peer_cosine_sim}</strong>
            </span>
          </div>
        </div>
      </div>

      {message && (
        <div className="p-4 bg-[#00ff66]/15 border border-[#00ff66] text-[#00ff66] text-sm font-bold rounded-lg text-center shadow-lg">
          {message}
        </div>
      )}

      {/* 🌟 RECOMMENDED MEAL COURSES 🌟 */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-l-4 border-orange-500 pl-4 py-1">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white uppercase flex items-center gap-2">
              <ChefHat size={24} className="text-orange-400" />
              <span>DUAL-MATCHED MEAL RECOMMENDATIONS FOR {userName.toUpperCase()}</span>
            </h2>
            <p className="text-xs md:text-sm text-gray-400">Recipes specifically formulated to address both your target goal & AI health prediction.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {foodItems.map((item) => (
            <div
              key={item.id}
              className="bg-[#121826] border border-[#2b394a] hover:border-orange-400/80 rounded-xl p-6 transition-all flex flex-col justify-between space-y-5 shadow-xl hover:shadow-[0_0_20px_rgba(249,115,22,0.15)] group"
            >
              <div className="space-y-4">
                {/* Course Tag & Rating */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold uppercase px-3 py-1 bg-orange-500/20 text-orange-400 border border-orange-400/50 rounded-full tracking-wider flex items-center gap-1.5">
                    <Utensils size={13} /> {item.course}
                  </span>
                  <div className="flex items-center gap-1 text-amber-400 text-sm font-bold bg-[#1a2433] px-3 py-1 rounded-full border border-amber-500/30">
                    <Star size={15} fill="currentColor" />
                    <span>{item.rating}</span>
                  </div>
                </div>

                {/* Title & Category */}
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-orange-300 transition-colors">
                    {item.title}
                  </h3>
                  <span className="text-xs text-orange-400/90 font-mono font-semibold block mt-1">
                    {item.category}
                  </span>
                </div>

                {/* Dual Match Badges */}
                <div className="space-y-2 font-mono text-xs">
                  <div className="px-3 py-1.5 bg-orange-950/40 border border-orange-500/40 text-orange-300 rounded-md font-semibold">
                    Goal Match: <span className="text-white">{item.goal_match || 'Aligned with posture micro-workouts'}</span>
                  </div>
                  <div className="px-3 py-1.5 bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-[#00f0ff] rounded-md font-semibold">
                    AI Forecast Match: <span className="text-white">{item.prediction_match || 'Relieves Eye Strain & Strain Index'}</span>
                  </div>
                </div>

                {/* Explanation text */}
                <p className="text-sm md:text-base text-gray-300 leading-relaxed bg-[#17202e] p-4 rounded-lg border border-gray-800">
                  {item.why_this}
                </p>

                {/* Metrics */}
                <div className="flex items-center justify-between text-xs md:text-sm font-mono text-gray-300 pt-2 border-t border-gray-800">
                  <div className="flex items-center gap-1.5">
                    <Flame size={15} className="text-orange-400" />
                    <span className="font-bold text-white">{item.calories} kcal</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={15} className="text-blue-400" />
                    <span>{item.prep_time} prep</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Award size={15} className="text-[#00ff66]" />
                    <span className="font-bold text-[#00ff66]">+{item.cost_pts} XP</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              {item.ordered ? (
                <div className="py-3 bg-[#00ff66]/20 border border-[#00ff66] text-[#00ff66] text-sm font-extrabold uppercase rounded-lg text-center flex items-center justify-center gap-2">
                  <Check size={18} />
                  <span>ORDERED FOR {userName.toUpperCase()}</span>
                </div>
              ) : (
                <button
                  onClick={() => handleOrder(item.id)}
                  className="w-full py-3 bg-orange-500 text-black font-extrabold text-sm uppercase tracking-wider rounded-lg hover:bg-orange-400 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-[0_0_15px_rgba(249,115,22,0.4)] cursor-pointer"
                >
                  <ShoppingCart size={16} />
                  <span>ORDER THIS MEAL</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
