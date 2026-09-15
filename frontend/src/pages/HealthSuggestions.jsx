import React, { useState, useEffect } from 'react';
import { HeartPulse, CheckCircle2, Circle, RefreshCw, Award, Heart, Activity, TrendingUp, UserCheck } from 'lucide-react';

export default function HealthSuggestions({ user }) {
  const empId = user?.employee_id || user?.id || 'EMP001';
  const userName = user?.name || 'Sona VR';
  const userDept = user?.department || 'Alpha IT';

  const [dashboardData, setDashboardData] = useState({
    title: 'Health Suggestions',
    subtitle: 'Personalized wellness recommendations for your daily routine',
    stats: {
      wellness_score_pct: 72.4,
      tasks_completed_str: '1/3',
      improvement_rate_pct: 3.3
    },
    daily_tasks: [
      {
        id: 'TASK-1',
        title: 'Take a 15-minute walk',
        category: 'Physical',
        intensity: 'Moderate',
        difficulty: 'Easy',
        duration: '15 min',
        completed: false,
        support: 'Improves cardiovascular health and mental clarity.'
      },
      {
        id: 'TASK-2',
        title: 'Practice deep breathing',
        category: 'Mindfulness',
        intensity: 'High',
        difficulty: 'Easy',
        duration: '5 min',
        completed: false,
        support: 'Lowers cortisol levels and promotes vagal parasympathetic tone.'
      },
      {
        id: 'TASK-3',
        title: 'Drink 2 glasses of water',
        category: 'Hydration',
        intensity: 'High',
        difficulty: 'Easy',
        duration: '2 min',
        completed: true,
        support: 'Maintains cellular hydration and metabolic function.'
      }
    ],
    wellness_badges: [
      { name: 'On Track', status: 'Active', color: '#00ff66' },
      { name: 'Needs Boost', status: 'Alert', color: '#ffee00' },
      { name: 'Strong', status: 'Achieved', color: '#00f0ff' },
      { name: 'Focused', status: 'Achieved', color: '#ff0055' }
    ]
  });

  const [loading, setLoading] = useState(false);

  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/api/v1/health-suggestions/dashboard?employee_id=${empId}`);
      if (res.ok) {
        const data = await res.json();
        setDashboardData(data);
      }
    } catch (e) {
      console.warn('Using default health suggestions fallback');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, [empId, user]);

  const toggleComplete = async (taskId) => {
    try {
      const updated = dashboardData.daily_tasks.map((t) =>
        t.id === taskId ? { ...t, completed: !t.completed } : t
      );
      const compCnt = updated.filter((t) => t.completed).length;
      setDashboardData({
        ...dashboardData,
        daily_tasks: updated,
        stats: { ...dashboardData.stats, tasks_completed_str: `${compCnt}/${updated.length}` }
      });
    } catch (e) {
      console.warn('Error toggling task', e);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header (Figure 6.1) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-[#00f0ff] pb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-wider text-[#00f0ff] uppercase flex items-center gap-3">
            <HeartPulse className="text-pink-500" size={32} />
            Health Suggestions Dashboard
          </h1>
          <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-bold">
            Personalized wellness recommendations for {userName} ({userDept} • {empId})
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-[#182230] border border-[#00f0ff] text-right">
            <div className="text-xs font-bold text-white uppercase">{userName}</div>
            <div className="text-[10px] text-[#00f0ff] font-mono">{userDept} • {empId}</div>
          </div>

          <button
            onClick={fetchSuggestions}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#00f0ff] text-black font-extrabold text-xs uppercase tracking-widest border-2 border-white hover:bg-black hover:text-[#00f0ff] transition-all shadow-[0_0_12px_#00f0ff]"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>REFRESH</span>
          </button>
        </div>
      </div>

      {/* Top 3 Metric Cards (Figure 6.1) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Heart Rate / Wellness Score */}
        <div className="bg-[#121820] border-2 border-[#00f0ff] p-5 text-center space-y-2 shadow-lg">
          <Heart className="mx-auto text-pink-500" size={28} />
          <div className="text-3xl font-black text-[#00f0ff]">
            {dashboardData.stats.wellness_score_pct}%
          </div>
          <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
            Composite Wellness Score (AHA Formula)
          </div>
        </div>

        {/* Today's Tasks Completed */}
        <div className="bg-[#121820] border-2 border-[#00ff66] p-5 text-center space-y-2 shadow-lg">
          <Activity className="mx-auto text-[#00ff66]" size={28} />
          <div className="text-3xl font-black text-[#00ff66]">
            {dashboardData.stats.tasks_completed_str}
          </div>
          <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
            Daily Goal Progress
          </div>
        </div>

        {/* Improvement Rate */}
        <div className="bg-[#121820] border-2 border-[#ffee00] p-5 text-center space-y-2 shadow-lg">
          <TrendingUp className="mx-auto text-[#ffee00]" size={28} />
          <div className="text-3xl font-black text-[#ffee00]">
            {dashboardData.stats.improvement_rate_pct}%
          </div>
          <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
            Improvement Rate
          </div>
        </div>
      </div>

      {/* Daily Tasks Cards */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider border-l-4 border-[#00f0ff] pl-3 py-1">
          Daily Tasks & Actions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {dashboardData.daily_tasks.map((task) => (
            <div
              key={task.id}
              className={`bg-[#121820] border-2 p-5 flex flex-col justify-between space-y-4 shadow-lg transition-all ${
                task.completed ? 'border-[#00ff66]' : 'border-[#2a3442] hover:border-[#00f0ff]'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 bg-[#182230] text-[#00f0ff] text-[10px] font-bold uppercase border border-[#2a3442]">
                    {task.category}
                  </span>
                  <span className="text-xs text-gray-400 font-mono">{task.duration}</span>
                </div>

                <h3 className="text-base font-bold text-white uppercase">{task.title}</h3>

                <div className="bg-[#182230] p-3 border border-[#2a3442] text-[11px] text-gray-300 space-y-1">
                  <div className="text-[10px] text-gray-400 font-bold uppercase">SUPPORT</div>
                  <p className="leading-relaxed">{task.support}</p>
                </div>
              </div>

              <button
                onClick={() => toggleComplete(task.id)}
                className={`w-full py-2.5 text-xs font-black uppercase tracking-widest border-2 transition-all flex items-center justify-center gap-2 ${
                  task.completed
                    ? 'bg-[#00ff66]/20 text-[#00ff66] border-[#00ff66]'
                    : 'bg-[#00f0ff] text-black border-white hover:bg-black hover:text-[#00f0ff]'
                }`}
              >
                {task.completed ? (
                  <>
                    <CheckCircle2 size={16} />
                    <span>COMPLETED</span>
                  </>
                ) : (
                  <>
                    <Circle size={16} />
                    <span>MARK DONE</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Wellness Badges (Figure 6.1) */}
      <div className="bg-[#121820] border-2 border-[#2a3442] p-6 space-y-4">
        <h3 className="text-sm font-bold text-[#00f0ff] uppercase tracking-wider flex items-center gap-2">
          <Award size={18} />
          <span>{userName.toUpperCase()}'S WELLNESS BADGES</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {dashboardData.wellness_badges.map((b, idx) => (
            <div
              key={idx}
              className="bg-[#182230] p-4 border border-[#2a3442] text-center space-y-2 hover:border-[#00f0ff] transition-all"
            >
              <div className="w-10 h-10 mx-auto bg-[#00f0ff]/10 border border-[#00f0ff] flex items-center justify-center text-[#00f0ff] text-lg font-bold">
                🏅
              </div>
              <div className="text-xs font-bold text-white uppercase">{b.name}</div>
              <div className="text-[10px] text-gray-400 font-mono uppercase">{b.status}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
