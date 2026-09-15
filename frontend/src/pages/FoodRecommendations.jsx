import React, { useState, useEffect } from 'react';
import { Utensils, RefreshCw, Star, Clock, ShoppingCart, Check, Target, HeartHandshake, AlertCircle, Network, Sparkles, ChefHat } from 'lucide-react';

export default function FoodRecommendations({ user }) {
  const empId = user?.employee_id || user?.id || 'EMP001';
  const userName = user?.name || 'Sona VR';
  const userDept = user?.department || 'Alpha IT';

  const [meta, setMeta] = useState({
    personal_goal: 'Complete 10,000 steps daily & maintain active movement',
    current_mood: 'Motivated',
    active_symptom: 'None',
    daily_calorie_burn: 2200,
    peer_cosine_sim: 0.99
  });

  const [foodItems, setFoodItems] = useState([
    {
      id: 'RAG-STEP-STARTER',
      course: 'Starter & Appetizer',
      title: 'Spiced Chana Chaat',
      category: 'Clean Energy',
      calories: 210.0,
      rating: 4.9,
      prep_time: '10 min',
      cost_pts: 95,
      rag_triple: '(Employee_Goal: Steps) ➔ [Low_Glycemic_Index] ➔ (Sustained_Focus)',
      why_this: `Collaborative Filtering + RAG Starter: Low glycemic energy appetizer providing continuous mitochondrial ATP production.`,
      ordered: false
    },
    {
      id: 'RAG-STEP-MAIN',
      course: 'Main Dish & Power Meal',
      title: 'Ragi Malt & Sprouted Moong Power Bowl',
      category: 'High Endurance',
      calories: 320.0,
      rating: 4.95,
      prep_time: '15 min',
      cost_pts: 125,
      rag_triple: '(Employee_Goal: Steps) ➔ [Leucine_Protein_Synthesis] ➔ (Muscle_Recovery)',
      why_this: 'Collaborative Filtering + RAG Main Dish: High complex carbs and plant protein (18g) for muscle recovery post 10,000 steps.',
      ordered: false
    },
    {
      id: 'RAG-STEP-DESSERT',
      course: 'Healthy Dessert & Treat',
      title: 'Dates & Almond Protein Bites',
      category: 'Natural Energy',
      calories: 140.0,
      rating: 4.88,
      prep_time: '5 min',
      cost_pts: 85,
      rag_triple: '(Employee_Goal: Steps) ➔ [Glycogen_Resynthesis] ➔ (Leg_Muscle_Care)',
      why_this: 'Collaborative Filtering + RAG Dessert: Natural fructose and magnesium recovery treat for active leg muscles.',
      ordered: false
    },
    {
      id: 'RAG-STEP-BEVERAGE',
      course: 'Functional Beverage',
      title: 'Sattu Energy Shake',
      category: 'Superfood Drink',
      calories: 190.0,
      rating: 4.85,
      prep_time: '5 min',
      cost_pts: 85,
      rag_triple: '(Employee_Goal: Steps) ➔ [Iron_Bioavailability] ➔ (Oxygen_Transport)',
      why_this: 'Collaborative Filtering + RAG Beverage: Roasted chickpea flour drink delivering iron & natural electrolytes.',
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
          personal_goal: data.personal_goal || meta.personal_goal,
          current_mood: data.current_mood || meta.current_mood,
          active_symptom: data.active_symptom || meta.active_symptom,
          daily_calorie_burn: data.daily_calorie_burn || meta.daily_calorie_burn,
          peer_cosine_sim: data.peer_cosine_similarity || 0.99
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
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-orange-500 pb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-wider text-orange-500 uppercase flex items-center gap-3">
            <Utensils className="text-[#00f0ff]" size={32} />
            Collaborative Filtering Course Recommendations
          </h1>
          <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-bold">
            Targeted Indian Food & Nutrition Dataset matched via Collaborative Filtering (Cosine Sim: {meta.peer_cosine_sim})
          </p>
        </div>

        {/* Active Employee Tag */}
        <div className="px-4 py-2 bg-[#182230] border border-[#00f0ff] text-right">
          <div className="text-xs font-bold text-white uppercase">{userName}</div>
          <div className="text-[10px] text-[#00f0ff] font-mono">{userDept} • {empId}</div>
        </div>
      </div>

      {/* 🌟 PROMINENT PERSONAL GOAL BOX 🌟 */}
      <div className="bg-[#121820] border-2 border-orange-500 p-5 shadow-[0_0_20px_rgba(249,115,22,0.2)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-500/20 border-2 border-orange-500 flex items-center justify-center text-orange-400">
            <Target size={28} />
          </div>
          <div>
            <div className="text-xs font-black text-orange-400 uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles size={14} />
              <span>EMPLOYEE PERSONAL GOAL BOX</span>
            </div>
            <div className="text-base md:text-lg font-black text-white mt-1">
              "{meta.personal_goal}"
            </div>
            <div className="text-xs text-gray-400 font-mono mt-1">
              Energy Status: <span className="text-[#00ff66] font-bold">{meta.current_mood}</span> ({meta.daily_calorie_burn} kcal burn) • Active Symptom: <span className="text-pink-400 font-bold">{meta.active_symptom}</span>
            </div>
          </div>
        </div>

        <div className="px-4 py-2 bg-orange-950/60 border border-orange-500 text-right font-mono text-xs text-orange-300">
          <div className="font-bold uppercase">MATCHING ALGORITHM</div>
          <div className="text-[11px]">Collaborative Filtering + RAG</div>
        </div>
      </div>

      {message && (
        <div className="p-3 bg-[#00ff66]/10 border border-[#00ff66] text-[#00ff66] text-xs font-bold text-center">
          {message}
        </div>
      )}

      {/* 🌟 CATEGORIZED MEAL COURSES (STARTER, MAIN DISH, DESSERT, BEVERAGE) 🌟 */}
      <div className="space-y-6">
        <h2 className="text-lg font-black text-white uppercase tracking-wider flex items-center gap-2 border-l-4 border-orange-500 pl-3 py-1">
          <ChefHat size={22} className="text-orange-400" />
          <span>COURSE-WISE NUTRITION MENU RECOMMENDED FOR {userName.toUpperCase()}</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {foodItems.map((item) => (
            <div
              key={item.id}
              className="bg-[#121820] border-2 border-[#2a3442] p-5 hover:border-orange-500 transition-all flex flex-col justify-between space-y-4 shadow-lg relative group"
            >
              <div className="space-y-3">
                {/* Course Tag */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase px-3 py-1 bg-orange-500 text-black border border-white tracking-widest shadow-md">
                    🍽️ {item.course}
                  </span>
                  <div className="flex items-center gap-1 text-yellow-400 text-xs font-bold font-mono bg-[#182230] px-2 py-0.5 border border-yellow-500/40">
                    <Star size={14} fill="currentColor" />
                    <span>{item.rating} / 5.0 ⭐</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-black text-white flex items-center justify-between">
                    <span>{item.title}</span>
                  </h3>
                  <span className="text-[10px] text-gray-400 font-mono uppercase block mt-0.5">Category: {item.category}</span>

                  {item.rag_triple && (
                    <div className="mt-2 px-2.5 py-1 bg-purple-950/60 border border-purple-500 text-purple-300 text-[10px] font-mono font-bold flex items-center gap-1.5">
                      <Network size={12} className="text-purple-400" />
                      <span>{item.rag_triple}</span>
                    </div>
                  )}
                  <p className="text-xs text-gray-300 mt-2 font-mono leading-relaxed">{item.why_this}</p>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono text-gray-300 border-t border-[#2a3442] pt-3">
                  <div>🔥 <span className="font-bold text-orange-400">{item.calories} kcal</span></div>
                  <div className="flex items-center gap-1"><Clock size={12} /> {item.prep_time}</div>
                  <div>Points: <span className="font-bold text-[#00ff66]">{item.cost_pts} XP</span></div>
                </div>
              </div>

              {item.ordered ? (
                <div className="py-2 bg-[#00ff66]/20 border border-[#00ff66] text-[#00ff66] text-xs font-bold uppercase tracking-widest text-center flex items-center justify-center gap-1.5">
                  <Check size={16} />
                  <span>ORDERED FOR {userName.toUpperCase()}</span>
                </div>
              ) : (
                <button
                  onClick={() => handleOrder(item.id)}
                  className="w-full py-2.5 bg-orange-500 text-black font-extrabold text-xs uppercase tracking-widest border-2 border-white hover:bg-black hover:text-orange-400 transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={15} />
                  <span>ORDER {item.course?.toUpperCase()} NOW</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
