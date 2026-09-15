import React, { useState, useEffect } from 'react';
import { User, Activity, AlertTriangle, TrendingUp, Zap, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function DigitalTwin({ user }) {
  const empId = user?.employee_id || user?.id || 'EMP001';

  const [twinData, setTwinData] = useState({
    name: user?.name || 'Sona VR',
    department: user?.department || 'Alpha IT',
    comprehensive_health_score: 8.0,
    wellness_score_out_of_100: 80.0,
    sub_scores: { steps_score: 9.2, sleep_score: 10.0, activity_score: 7.5, food_score: 3.9 },
    risk_index: {
      burnout_risk_score: 0.70,
      risk_category: 'High Risk',
      strain_index: 0.28,
      contributing_factors: [
        'Excessive Weekly Workload (55.0 hrs/week)',
        'Sleep Deprivation (5.2 hrs/night average)',
        'High Perceived Stress Score (8.5/10)'
      ]
    },
    wellness_trends_over_time: [
      { week: 'Week 1', score: 6.8 },
      { week: 'Week 2', score: 7.1 },
      { week: 'Week 3', score: 7.4 },
      { week: 'Week 4', score: 7.6 },
      { week: 'Week 5', score: 7.8 },
      { week: 'Week 6', score: 8.0 }
    ],
    productivity_insights: {
      focus_time_hrs: 6.2,
      deep_work_index: 'High (88%)',
      fatigue_risk_window: '15:30 - 16:30 PM',
      recommended_microbreak: '5-min Vagal Deep Breathing at 15:30 PM'
    },
    personalized_recommendations: [
      'Maintain 9,000+ daily steps to keep Step Sub-Score high',
      'Incorporate targeted micro-rest breaks during peak workload windows',
      'Order Dalma or Cream of tomato soup for balanced protein recovery'
    ]
  });

  useEffect(() => {
    fetch(`http://localhost:8000/api/v1/digital-twin/${empId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.digital_twin) {
          setTwinData({
            ...data.digital_twin,
            name: data.name || user?.name || 'Sona VR',
            department: data.department || user?.department || 'Alpha IT'
          });
        }
      })
      .catch((e) => console.warn('Using default Digital Twin profile'));
  }, [empId, user]);

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-pink-500 pb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-wider text-pink-500 uppercase flex items-center gap-3">
            <User className="text-[#00f0ff]" size={32} />
            Digital Twin Employee Profile
          </h1>
          <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-bold">
            Real-time avatar digital twin modeling physiological health & risk index
          </p>
        </div>

        <div className="px-4 py-2 bg-[#182230] border border-[#00f0ff] text-right">
          <div className="text-xs font-bold text-white uppercase">{twinData.name}</div>
          <div className="text-[10px] text-[#00f0ff] font-mono">{twinData.department} • {empId}</div>
        </div>
      </div>

      {/* Top 4 Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Comprehensive Health Score */}
        <div className="bg-[#121820] border-2 border-[#00ff66] p-5 text-center space-y-2 shadow-lg">
          <Activity className="mx-auto text-[#00ff66]" size={28} />
          <div className="text-3xl font-black text-[#00ff66]">
            {twinData.comprehensive_health_score} / 10
          </div>
          <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
            Comprehensive Health Score
          </div>
        </div>

        {/* Burnout Risk Category */}
        <div className="bg-[#121820] border-2 border-pink-500 p-5 text-center space-y-2 shadow-lg">
          <ShieldAlert className="mx-auto text-pink-500" size={28} />
          <div className="text-2xl font-black text-pink-500 uppercase">
            {twinData.risk_index.risk_category}
          </div>
          <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
            XGBoost Risk Index
          </div>
        </div>

        {/* Deep Work Index */}
        <div className="bg-[#121820] border-2 border-[#00f0ff] p-5 text-center space-y-2 shadow-lg">
          <Zap className="mx-auto text-[#00f0ff]" size={28} />
          <div className="text-2xl font-black text-[#00f0ff]">
            {twinData.productivity_insights.deep_work_index}
          </div>
          <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
            Productivity Focus Index
          </div>
        </div>

        {/* Strain Index */}
        <div className="bg-[#121820] border-2 border-[#ffee00] p-5 text-center space-y-2 shadow-lg">
          <TrendingUp className="mx-auto text-[#ffee00]" size={28} />
          <div className="text-3xl font-black text-[#ffee00]">
            {twinData.risk_index.strain_index}
          </div>
          <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
            Physiological Strain
          </div>
        </div>
      </div>

      {/* Sub-Scores & Trends Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sub-Score Breakdown */}
        <div className="bg-[#121820] border-2 border-[#2a3442] p-5 space-y-4">
          <h3 className="text-sm font-bold text-[#00f0ff] uppercase tracking-wider">
            Health Sub-Score Breakdown (AHA Formula)
          </h3>
          <div className="space-y-3 font-mono text-xs">
            <div>
              <div className="flex justify-between text-gray-300 mb-1">
                <span>Steps Sub-Score (35% Weight)</span>
                <span className="text-[#00ff66] font-bold">{twinData.sub_scores.steps_score} / 10</span>
              </div>
              <div className="w-full bg-[#182230] h-2 border border-[#2a3442]">
                <div className="bg-[#00ff66] h-full" style={{ width: `${(twinData.sub_scores.steps_score / 10) * 100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-gray-300 mb-1">
                <span>Sleep Sub-Score (25% Weight)</span>
                <span className="text-[#00f0ff] font-bold">{twinData.sub_scores.sleep_score} / 10</span>
              </div>
              <div className="w-full bg-[#182230] h-2 border border-[#2a3442]">
                <div className="bg-[#00f0ff] h-full" style={{ width: `${(twinData.sub_scores.sleep_score / 10) * 100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-gray-300 mb-1">
                <span>Activity Sub-Score (20% Weight)</span>
                <span className="text-pink-400 font-bold">{twinData.sub_scores.activity_score} / 10</span>
              </div>
              <div className="w-full bg-[#182230] h-2 border border-[#2a3442]">
                <div className="bg-pink-500 h-full" style={{ width: `${(twinData.sub_scores.activity_score / 10) * 100}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-gray-300 mb-1">
                <span>Food Sub-Score (20% Weight)</span>
                <span className="text-[#ffee00] font-bold">{twinData.sub_scores.food_score} / 10</span>
              </div>
              <div className="w-full bg-[#182230] h-2 border border-[#2a3442]">
                <div className="bg-[#ffee00] h-full" style={{ width: `${(twinData.sub_scores.food_score / 10) * 100}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Wellness Trends */}
        <div className="bg-[#121820] border-2 border-[#2a3442] p-5 space-y-4">
          <h3 className="text-sm font-bold text-pink-500 uppercase tracking-wider">
            Wellness Score Trends (Past 6 Weeks)
          </h3>
          <div className="space-y-2">
            {twinData.wellness_trends_over_time.map((w, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 bg-[#182230] border border-[#2a3442] text-xs font-mono">
                <span className="text-gray-400">{w.week}</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-black h-2 border border-slate-700">
                    <div className="bg-pink-500 h-full" style={{ width: `${(w.score / 10) * 100}%` }} />
                  </div>
                  <span className="text-white font-bold">{w.score} / 10</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendations Card */}
      <div className="bg-[#121820] border-2 border-[#00f0ff] p-5 space-y-3">
        <h3 className="text-sm font-bold text-[#00f0ff] uppercase tracking-wider flex items-center gap-2">
          <CheckCircle2 size={16} />
          Digital Twin Actionable Recommendations
        </h3>
        <ul className="space-y-2 text-xs font-mono text-gray-300">
          {twinData.personalized_recommendations.map((rec, idx) => (
            <li key={idx} className="flex items-start gap-2 p-2 bg-[#182230] border border-[#2a3442]">
              <span className="text-[#00ff66] font-bold">➜</span>
              <span>{rec}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
