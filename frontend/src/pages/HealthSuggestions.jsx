import React, { useState, useEffect } from 'react';
import { HeartPulse, CheckCircle2, Circle, RefreshCw, Award, Heart, Activity, TrendingUp, Sparkles, ShieldCheck, Trophy, Target, Flame, Zap } from 'lucide-react';

const getBadgeTheme = (name, status, idx) => {
  const n = (name || '').toLowerCase();
  const s = (status || '').toLowerCase();

  if (n.includes('track')) {
    return {
      icon: TrendingUp,
      iconColor: 'text-[#00ff66]',
      iconBox: 'bg-[#00ff66]/15 border-[#00ff66] shadow-[0_0_15px_rgba(0,255,102,0.4)]',
      cardBorder: 'border-[#00ff66]/70 shadow-[0_0_20px_rgba(0,255,102,0.15)]',
      statusBadge: 'bg-[#00ff66]/20 border-[#00ff66] text-[#00ff66]'
    };
  }
  if (n.includes('performer') || n.includes('boost') || n.includes('high')) {
    return {
      icon: Trophy,
      iconColor: 'text-[#ffee00]',
      iconBox: 'bg-[#ffee00]/15 border-[#ffee00] shadow-[0_0_15px_rgba(255,238,0,0.4)]',
      cardBorder: 'border-[#ffee00]/70 shadow-[0_0_20px_rgba(255,238,0,0.15)]',
      statusBadge: s.includes('alert') ? 'bg-amber-500/20 border-amber-400 text-amber-400' : 'bg-[#ffee00]/20 border-[#ffee00] text-[#ffee00]'
    };
  }
  if (n.includes('strong')) {
    return {
      icon: ShieldCheck,
      iconColor: 'text-[#00f0ff]',
      iconBox: 'bg-[#00f0ff]/15 border-[#00f0ff] shadow-[0_0_15px_rgba(0,240,255,0.4)]',
      cardBorder: 'border-[#00f0ff]/70 shadow-[0_0_20px_rgba(0,240,255,0.15)]',
      statusBadge: 'bg-[#00f0ff]/20 border-[#00f0ff] text-[#00f0ff]'
    };
  }
  return {
    icon: Target,
    iconColor: 'text-[#3b82f6]',
    iconBox: 'bg-[#3b82f6]/15 border-[#3b82f6] shadow-[0_0_15px_rgba(59,130,246,0.4)]',
    cardBorder: 'border-[#3b82f6]/70 shadow-[0_0_20px_rgba(59,130,246,0.15)]',
    statusBadge: 'bg-[#3b82f6]/20 border-[#3b82f6] text-[#60a5fa]'
  };
};

export default function HealthSuggestions({ user }) {
  const empId = user?.employee_id || user?.id || 'EMP001';
  const userName = user?.name || 'Sona VR';
  const userDept = user?.department || 'Alpha IT';

  const [dashboardData, setDashboardData] = useState({
    title: 'Health Suggestions',
    subtitle: 'Personalized wellness recommendations for your daily routine',
    stats: {
      wellness_score_pct: 73.2,
      tasks_completed_str: '2/3',
      improvement_rate_pct: 3.5
    },
    daily_tasks: [
      {
        id: 'TASK-1',
        title: 'Perform 20 min posture correction micro-workouts daily',
        category: 'Physical',
        intensity: 'Moderate',
        difficulty: 'Easy',
        duration: '15 min',
        completed: true,
        support: 'Customized for your activity level to reduce spinal & neck stiffness.'
      },
      {
        id: 'TASK-2',
        title: 'Symptom Care: Address Eye Strain',
        category: 'Mindfulness',
        intensity: 'High',
        difficulty: 'Easy',
        duration: '5 min',
        completed: false,
        support: 'Lowers cortisol levels and promotes parasympathetic nervous system recovery.'
      },
      {
        id: 'TASK-3',
        title: 'Drink 2.5L Water Intake Target',
        category: 'Hydration',
        intensity: 'High',
        difficulty: 'Easy',
        duration: '2 min',
        completed: true,
        support: 'Maintains cellular hydration, joint lubrication, and metabolic function.'
      }
    ],
    wellness_badges: [
      { name: 'On Track', status: 'Active', description: 'Consistently meeting daily steps & movement goals' },
      { name: 'High Performer', status: 'Achieved', description: 'Step count & circadian sleep score progress' },
      { name: 'Strong', status: 'Achieved', description: 'Completed daily exercise & physical activity sessions' },
      { name: 'Focused', status: 'Achieved', description: 'Achieved optimal circadian deep work targets' }
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
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
      {/* 🌟 PAGE HEADER 🌟 */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-2 border-[#00f0ff]/40 pb-5">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-[#00f0ff] tracking-wider uppercase flex items-center gap-3">
            <HeartPulse className="text-[#00ff66]" size={32} />
            <span>HEALTH TASKS & DASHBOARD</span>
          </h1>
          <p className="text-sm md:text-base text-gray-300 mt-1 font-medium">
            Personalized daily wellness actions & health progress tracking.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-[#121824] border-2 border-[#00f0ff]/50 rounded-lg text-right shadow-md">
            <div className="text-sm font-black text-white uppercase">{userName}</div>
            <div className="text-xs text-[#00f0ff] font-mono font-bold">{userDept} • {empId}</div>
          </div>

          <button
            onClick={fetchSuggestions}
            className="px-5 py-2.5 bg-[#00f0ff] text-black font-black text-xs uppercase tracking-wider rounded-lg hover:bg-white transition-all flex items-center gap-2 cursor-pointer shadow-md"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            <span>REFRESH</span>
          </button>
        </div>
      </div>

      {/* 🌟 METRIC CARDS 🌟 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Composite Wellness Score */}
        <div className="bg-[#121826] border-2 border-[#00f0ff]/60 rounded-xl p-6 text-center space-y-2 shadow-xl hover:shadow-[0_0_20px_rgba(0,240,255,0.2)] transition-all">
          <Heart className="mx-auto text-[#00f0ff]" size={28} />
          <div className="text-3xl md:text-4xl font-black text-[#00f0ff]">
            {dashboardData.stats.wellness_score_pct}%
          </div>
          <div className="text-xs md:text-sm font-black text-gray-200 uppercase tracking-wider">
            Composite Wellness Score
          </div>
        </div>

        {/* Daily Goal Progress */}
        <div className="bg-[#121826] border-2 border-[#00ff66]/60 rounded-xl p-6 text-center space-y-2 shadow-xl hover:shadow-[0_0_20px_rgba(0,255,102,0.2)] transition-all">
          <Activity className="mx-auto text-[#00ff66]" size={28} />
          <div className="text-3xl md:text-4xl font-black text-[#00ff66]">
            {dashboardData.stats.tasks_completed_str}
          </div>
          <div className="text-xs md:text-sm font-black text-gray-200 uppercase tracking-wider">
            Daily Goal Progress
          </div>
        </div>

        {/* Improvement Rate */}
        <div className="bg-[#121826] border-2 border-[#ffee00]/60 rounded-xl p-6 text-center space-y-2 shadow-xl hover:shadow-[0_0_20px_rgba(255,230,0,0.2)] transition-all">
          <TrendingUp className="mx-auto text-[#ffee00]" size={28} />
          <div className="text-3xl md:text-4xl font-black text-[#ffee00]">
            +{dashboardData.stats.improvement_rate_pct}%
          </div>
          <div className="text-xs md:text-sm font-black text-gray-200 uppercase tracking-wider">
            Weekly Health Improvement
          </div>
        </div>
      </div>

      {/* 🌟 DAILY TASKS SECTION 🌟 */}
      <div className="space-y-6">
        <div className="border-l-4 border-[#00f0ff] pl-4 py-1">
          <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-wider">
            DAILY TASKS & ACTIONS
          </h2>
          <p className="text-xs md:text-sm text-gray-300 font-mono">Complete daily micro-habits to boost your wellness score.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {dashboardData.daily_tasks.map((task) => (
            <div
              key={task.id}
              className={`bg-[#121826] border-2 rounded-xl p-6 flex flex-col justify-between space-y-5 transition-all shadow-xl ${
                task.completed
                  ? 'border-[#00ff66]/70 shadow-[0_0_15px_rgba(0,255,102,0.15)]'
                  : 'border-[#2b394a] hover:border-[#00f0ff]'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-[#1a2433] text-[#00f0ff] text-xs font-black uppercase rounded-full border border-[#00f0ff]/40">
                    {task.category}
                  </span>
                  <span className="text-xs md:text-sm text-gray-300 font-mono font-black">{task.duration}</span>
                </div>

                <h3 className="text-lg font-black text-white leading-snug">{task.title}</h3>

                <p className="text-xs md:text-sm text-gray-200 leading-relaxed bg-[#17202e] p-4 rounded-lg border border-gray-800 font-mono">
                  {task.support}
                </p>
              </div>

              <button
                onClick={() => toggleComplete(task.id)}
                className={`w-full py-3 rounded-lg text-xs md:text-sm font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                  task.completed
                    ? 'bg-[#00ff66]/20 text-[#00ff66] border-2 border-[#00ff66]'
                    : 'bg-[#00f0ff] text-black hover:bg-white'
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
                    <span>MARK TASK DONE</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 🌟 ENHANCED COMPACT WELLNESS BADGES 🌟 */}
      <div className="bg-[#121820] border-2 border-[#00f0ff] rounded-xl p-4 md:p-5 space-y-4 shadow-[0_0_20px_rgba(0,240,255,0.12)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-[#2a3442] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-[#00f0ff]/20 border-2 border-[#00f0ff] rounded-lg flex items-center justify-center text-[#00f0ff] shadow-[0_0_10px_#00f0ff]">
              <Award size={20} />
            </div>
            <div>
              <h3 className="text-base font-black text-[#00f0ff] uppercase tracking-wider">
                {userName.toUpperCase()}'S WELLNESS BADGES
              </h3>
              <p className="text-[11px] text-gray-300 font-mono font-bold">
                Achievement milestones derived from physical telemetry & activity targets
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {dashboardData.wellness_badges.map((b, idx) => {
            const badgeTheme = getBadgeTheme(b.name, b.status, idx);
            const IconComponent = badgeTheme.icon;

            return (
              <div
                key={idx}
                className={`bg-[#182230] p-3.5 rounded-lg border-2 transition-all space-y-2.5 text-center hover:scale-[1.02] cursor-pointer ${badgeTheme.cardBorder}`}
              >
                <div className={`w-10 h-10 mx-auto rounded-full border-2 flex items-center justify-center transition-all ${badgeTheme.iconBox}`}>
                  <IconComponent size={20} className={badgeTheme.iconColor} />
                </div>
                
                <div className="space-y-0.5">
                  <div className="text-xs sm:text-sm font-black text-white uppercase tracking-wider">
                    {b.name}
                  </div>
                  {b.description && (
                    <div className="text-[11px] text-gray-300 font-mono font-bold leading-tight">
                      {b.description}
                    </div>
                  )}
                </div>

                <div>
                  <span className={`inline-block px-2.5 py-0.5 text-[10px] font-mono font-black uppercase tracking-widest rounded-full border ${badgeTheme.statusBadge}`}>
                    {b.status || 'ACHIEVED'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
