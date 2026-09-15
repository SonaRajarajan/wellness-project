import React, { useState, useEffect } from 'react';
import { ShieldCheck, Users, AlertTriangle, TrendingUp, Activity, CheckCircle2, Bell, ExternalLink, Lock, ShieldAlert, KeyRound, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function HRDashboard({ user, onSelectEmployee, isHrAuthenticated, onAuthenticateHr }) {
  const navigate = useNavigate();
  const [inputPin, setInputPin] = useState('');
  const [pinError, setPinError] = useState('');

  const [hrData, setHrData] = useState({
    workforce_health_overview: {
      total_employees: 130,
      avg_wellness_score: 8.0,
      active_engagement_rate_pct: 71.4,
      control_group_engagement_pct: 28.7,
      healthy_employees_cnt: 98,
      at_risk_employees_cnt: 32
    },
    risk_and_burnout_analytics: {
      high_risk_flagged: [
        {
          employee_id: 'EMP002',
          name: 'Priya Kapoor',
          department: 'Beta IT',
          workload_hours: 58.0,
          sleep_hours: 5.2,
          burnout_risk_score: 0.72,
          risk_level: 'High Risk',
          recommendation: 'Cap maximum weekly work hours at 45h and delegate tasks.'
        },
        {
          employee_id: 'EMP003',
          name: 'Kavya Patel',
          department: 'Engineering',
          workload_hours: 61.5,
          sleep_hours: 4.8,
          burnout_risk_score: 0.84,
          risk_level: 'Critical Risk',
          recommendation: 'Immediate workload reduction & posture intervention.'
        }
      ],
      burnout_trend: 'Declining (-14.2% burnout cases post-gamification implementation)'
    },
    engagement_metrics: {
      daer_daily_active_rate: '71.4%',
      jungle_survival_store_buys: 142,
      rival_challenges_completed: 88,
      food_recommendations_ordered: 320
    },
    program_effectiveness: {
      '8_week_wellness_score_improvement': '+18.3%',
      exercise_form_accuracy: '94.5%',
      technology_readiness_level: 'TRL 7 Verified'
    },
    department_comparison: [
      { department: 'Operations', score: 57, rank: 1, status: 'CHAMPION', members: 24 },
      { department: 'Alpha IT', score: 41, rank: 2, status: 'RUNNER-UP', members: 28 },
      { department: 'Beta IT', score: 40, rank: 3, status: 'THIRD PLACE', members: 22 },
      { department: 'Engineering', score: 38, rank: 4, status: '4TH PLACE', members: 20 }
    ],
    anomaly_detection_alerts: [
      {
        alert_id: 'ALT-901',
        employee_id: 'EMP003',
        name: 'Kavya Patel',
        type: 'Isolation Forest Motion Outlier',
        severity: 'HIGH',
        message: 'Sudden posture acceleration shift detected during exercise cycle.',
        action: 'Escalated to HR / Manager Notification'
      }
    ]
  });

  useEffect(() => {
    fetch('http://localhost:8000/api/v1/hr-dashboard')
      .then((res) => res.json())
      .then((data) => {
        if (data.workforce_health_overview) setHrData(data);
      })
      .catch((e) => console.warn('Using default HR Dashboard data'));
  }, []);

  const handleInspectEmployee = (emp) => {
    if (onSelectEmployee) {
      onSelectEmployee({
        id: emp.employee_id,
        employee_id: emp.employee_id,
        name: emp.name || emp.employee_id,
        department: emp.department || 'All Departments'
      });
    }
    navigate('/digital-twin');
  };

  if (!isHrAuthenticated) {
    const handleVerifyPin = (e) => {
      e.preventDefault();
      if (inputPin.trim().toUpperCase() === 'HR01S') {
        setPinError('');
        if (onAuthenticateHr) onAuthenticateHr();
      } else {
        setPinError('ACCESS DENIED: Invalid Security PIN. Authorized HR PIN required.');
      }
    };

    return (
      <div className="max-w-xl mx-auto my-12 p-6 md:p-8 bg-[#121820] border-2 border-red-500 shadow-[0_0_50px_rgba(239,68,68,0.3)] space-y-6 text-center text-white font-mono">
        <div className="w-20 h-20 mx-auto bg-red-500/10 border-2 border-red-500 rounded-full flex items-center justify-center text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]">
          <Lock size={36} />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-950/80 border border-red-500 text-red-400 text-xs font-bold uppercase tracking-widest">
            <ShieldAlert size={14} />
            EXECUTIVE PRIVACY PROTECTION ACTIVE
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-wider">
            HR DASHBOARD ACCESS LOCKED
          </h2>
          <p className="text-xs text-gray-400 font-mono leading-relaxed max-w-md mx-auto">
            Workforce health scores, XGBoost burnout risk records, and employee profiles are restricted due to privacy policies. Please enter the executive PIN (HR01S) to unlock.
          </p>
        </div>

        <form onSubmit={handleVerifyPin} className="space-y-4 max-w-sm mx-auto">
          <div>
            <label className="block text-xs font-bold text-red-400 uppercase tracking-wider mb-2 flex items-center justify-center gap-1.5">
              <KeyRound size={14} />
              ENTER EXECUTIVE HR PIN
            </label>
            <input
              type="password"
              value={inputPin}
              onChange={(e) => {
                setInputPin(e.target.value);
                setPinError('');
              }}
              placeholder="Enter PIN (HR01S)..."
              className="w-full px-4 py-3 bg-[#0b0e14] border-2 border-red-500 text-white font-mono text-center text-xl font-black tracking-widest focus:outline-none focus:border-[#00f0ff] uppercase placeholder:normal-case placeholder:text-gray-600"
              autoFocus
              required
            />
          </div>

          {pinError && (
            <div className="p-3 bg-red-950/80 border border-red-500 text-red-400 text-xs font-bold font-mono">
              ⚠️ {pinError}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3.5 bg-red-600 text-white font-black uppercase tracking-widest text-xs border-2 border-white hover:bg-black hover:text-red-400 transition-all shadow-[0_0_20px_rgba(239,68,68,0.5)] flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>VERIFY PIN & UNLOCK HR DASHBOARD</span>
            <ArrowRight size={16} />
          </button>
        </form>
      </div>
    );
  }

  const [hrSubTab, setHrSubTab] = useState('overview'); // 'overview' | 'leaderboard' | 'players'

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-[#00ff66] pb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-wider text-[#00ff66] uppercase flex items-center gap-3">
            <ShieldCheck className="text-[#00f0ff]" size={32} />
            HR Enterprise Wellness Portal
          </h1>
          <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-bold">
            Executive management portal: Leaderboard, Players Directory & Individual Player Dashboards
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono">
          <span className="text-xs text-gray-400 font-bold uppercase">Inspecting:</span>
          <span className="px-3 py-1 bg-[#182230] border border-[#00f0ff] text-[#00f0ff] text-xs font-bold uppercase">
            {user?.name || 'Sona VR'} ({user?.employee_id || user?.id || 'EMP001'})
          </span>
        </div>
      </div>

      {/* HR SUB-TAB NAVIGATION BUTTONS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={() => setHrSubTab('overview')}
          className={`p-3.5 border-2 flex items-center justify-center gap-2.5 font-black text-xs md:text-sm uppercase tracking-wider transition-all cursor-pointer ${
            hrSubTab === 'overview'
              ? 'bg-[#00ff66] text-black border-white shadow-[0_0_15px_#00ff66]'
              : 'bg-[#121820] text-gray-400 border-[#2a3442] hover:border-[#00ff66] hover:text-white'
          }`}
        >
          <Activity size={18} />
          <span>1. WORKFORCE RISK ANALYTICS</span>
        </button>

        <button
          onClick={() => setHrSubTab('leaderboard')}
          className={`p-3.5 border-2 flex items-center justify-center gap-2.5 font-black text-xs md:text-sm uppercase tracking-wider transition-all cursor-pointer ${
            hrSubTab === 'leaderboard'
              ? 'bg-[#ffee00] text-black border-white shadow-[0_0_15px_#ffee00]'
              : 'bg-[#121820] text-gray-400 border-[#2a3442] hover:border-[#ffee00] hover:text-white'
          }`}
        >
          <Users size={18} />
          <span>2. LEADERBOARD</span>
        </button>

        <button
          onClick={() => setHrSubTab('players')}
          className={`p-3.5 border-2 flex items-center justify-center gap-2.5 font-black text-xs md:text-sm uppercase tracking-wider transition-all cursor-pointer ${
            hrSubTab === 'players'
              ? 'bg-[#00f0ff] text-black border-white shadow-[0_0_15px_#00f0ff]'
              : 'bg-[#121820] text-gray-400 border-[#2a3442] hover:border-[#00f0ff] hover:text-white'
          }`}
        >
          <Users size={18} />
          <span>3. PLAYERS & DASHBOARDS</span>
        </button>
      </div>

      {/* SUB-TAB 1: WORKFORCE RISK ANALYTICS OVERVIEW */}
      {hrSubTab === 'overview' && (
        <div className="space-y-6">
          {/* Top 4 KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#121820] border-2 border-[#00ff66] p-5 text-center space-y-2 shadow-lg">
              <Users className="mx-auto text-[#00ff66]" size={28} />
              <div className="text-3xl font-black text-[#00ff66]">
                {hrData.workforce_health_overview.total_employees}
              </div>
              <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                Total Active Players
              </div>
            </div>

            <div className="bg-[#121820] border-2 border-[#00f0ff] p-5 text-center space-y-2 shadow-lg">
              <Activity className="mx-auto text-[#00f0ff]" size={28} />
              <div className="text-3xl font-black text-[#00f0ff]">
                {hrData.workforce_health_overview.avg_wellness_score} / 10
              </div>
              <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                Workforce Avg Wellness Score
              </div>
            </div>

            <div className="bg-[#121820] border-2 border-[#ffee00] p-5 text-center space-y-2 shadow-lg">
              <TrendingUp className="mx-auto text-[#ffee00]" size={28} />
              <div className="text-3xl font-black text-[#ffee00]">
                {hrData.engagement_metrics.daer_daily_active_rate}
              </div>
              <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                DAER Engagement Rate
              </div>
            </div>

            <div className="bg-[#121820] border-2 border-pink-500 p-5 text-center space-y-2 shadow-lg">
              <AlertTriangle className="mx-auto text-pink-500" size={28} />
              <div className="text-3xl font-black text-pink-500">
                {hrData.workforce_health_overview.at_risk_employees_cnt}
              </div>
              <div className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                Flagged Risk Alerts
              </div>
            </div>
          </div>

          {/* Burnout Risk & Anomaly Alerts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* High Risk Employees Table */}
            <div className="bg-[#121820] border-2 border-pink-500 p-5 space-y-4 shadow-xl">
              <h3 className="text-sm font-bold text-pink-500 uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle size={16} />
                XGBoost Burnout Risk Analytics
              </h3>
              <div className="space-y-3">
                {hrData.risk_and_burnout_analytics.high_risk_flagged.map((emp) => (
                  <div key={emp.employee_id} className="p-4 bg-[#182230] border border-pink-500/50 space-y-2">
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="font-bold text-white">{emp.name} ({emp.department})</span>
                      <span className="px-2 py-0.5 bg-pink-950 text-pink-400 font-bold border border-pink-600">
                        {emp.risk_level} ({emp.burnout_risk_score})
                      </span>
                    </div>
                    <div className="text-[11px] text-gray-300 font-mono">
                      Workload: {emp.workload_hours}h/wk | Sleep: {emp.sleep_hours}h
                    </div>
                    <div className="text-[10px] text-pink-300 font-mono border-t border-pink-900/50 pt-2 flex items-center justify-between">
                      <span>Action: {emp.recommendation}</span>
                      <button
                        onClick={() => handleInspectEmployee(emp)}
                        className="px-2 py-1 bg-pink-500 text-black font-extrabold text-[10px] uppercase tracking-wider flex items-center gap-1 hover:bg-white transition-colors ml-2 cursor-pointer"
                      >
                        <span>INSPECT DASHBOARD</span>
                        <ExternalLink size={10} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Isolation Forest Anomaly Alerts */}
            <div className="bg-[#121820] border-2 border-amber-500 p-5 space-y-4 shadow-xl">
              <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                <Bell size={16} />
                Isolation Forest Anomaly Detection & Escalations
              </h3>
              <div className="space-y-3">
                {hrData.anomaly_detection_alerts.map((alt) => (
                  <div key={alt.alert_id} className="p-4 bg-[#182230] border border-amber-500/50 space-y-2">
                    <div className="flex justify-between items-center text-xs font-mono">
                      <span className="font-bold text-amber-400">{alt.alert_id} • {alt.employee_id} ({alt.name || alt.employee_id})</span>
                      <span className="px-2 py-0.5 bg-amber-950 text-amber-300 font-bold border border-amber-500">
                        {alt.severity} SEVERITY
                      </span>
                    </div>
                    <div className="text-[11px] text-gray-300 font-mono">{alt.message}</div>
                    <div className="text-[10px] text-amber-300 font-mono border-t border-amber-900/50 pt-2 flex items-center justify-between">
                      <span className="flex items-center gap-1"><CheckCircle2 size={12} /> {alt.action}</span>
                      <button
                        onClick={() => handleInspectEmployee({ employee_id: alt.employee_id, name: alt.name })}
                        className="px-2 py-1 bg-amber-500 text-black font-extrabold text-[10px] uppercase tracking-wider flex items-center gap-1 hover:bg-white transition-colors ml-2 cursor-pointer"
                      >
                        <span>INSPECT DASHBOARD</span>
                        <ExternalLink size={10} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Program Effectiveness & Department Comparison */}
          <div className="bg-[#121820] border-2 border-[#00f0ff] p-5 space-y-4">
            <h3 className="text-sm font-bold text-[#00f0ff] uppercase tracking-wider">
              Program Effectiveness & Department Comparison
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center font-mono text-xs">
              <div className="p-3 bg-[#182230] border border-[#2a3442]">
                <div className="text-gray-400 text-[10px]">8-WEEK IMPROVEMENT</div>
                <div className="text-[#00ff66] font-black text-lg mt-1">+18.3%</div>
              </div>
              <div className="p-3 bg-[#182230] border border-[#2a3442]">
                <div className="text-gray-400 text-[10px]">FORM PRECISION</div>
                <div className="text-[#00f0ff] font-black text-lg mt-1">94.5%</div>
              </div>
              <div className="p-3 bg-[#182230] border border-[#2a3442]">
                <div className="text-gray-400 text-[10px]">DAER VS CONTROL</div>
                <div className="text-pink-400 font-black text-lg mt-1">71.4% vs 28.7%</div>
              </div>
              <div className="p-3 bg-[#182230] border border-[#2a3442]">
                <div className="text-gray-400 text-[10px]">TECH READINESS</div>
                <div className="text-[#ffee00] font-black text-lg mt-1">TRL 7 Verified</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: LEADERBOARD */}
      {hrSubTab === 'leaderboard' && (
        <div className="bg-[#121820] border-2 border-[#ffee00] p-6 space-y-6 shadow-[0_0_20px_rgba(255,238,0,0.15)]">
          <div className="text-center space-y-1 border-b border-[#ffee00]/40 pb-4">
            <h2 className="text-xl font-black text-[#ffee00] uppercase tracking-wider flex items-center justify-center gap-2">
              🏆 Workforce Department Leaderboard
            </h2>
            <p className="text-xs text-gray-400 font-mono">
              Gamified inter-department rankings and XP points scoreboards
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end justify-center pt-4 max-w-4xl mx-auto">
            {/* 2nd Place */}
            <div className="bg-[#182230] border-2 border-slate-400 p-5 text-center space-y-3 shadow-lg">
              <div className="w-10 h-10 mx-auto bg-slate-400 text-black font-extrabold text-lg flex items-center justify-center rounded-full">
                2
              </div>
              <div className="text-base font-bold text-white uppercase">Alpha IT</div>
              <div className="text-3xl font-black text-slate-300">41 PTS</div>
              <div className="py-1 px-3 bg-slate-800 text-slate-300 text-[10px] font-black uppercase tracking-widest border border-slate-500">
                RUNNER-UP
              </div>
            </div>

            {/* 1st Place */}
            <div className="bg-[#1c2736] border-4 border-[#ffee00] p-6 text-center space-y-4 shadow-[0_0_20px_#ffee00] -translate-y-2">
              <div className="w-12 h-12 mx-auto bg-[#ffee00] text-black font-black text-xl flex items-center justify-center rounded-full">
                1
              </div>
              <div className="text-lg font-black text-white uppercase">Operations</div>
              <div className="text-4xl font-black text-[#ffee00]">57 PTS</div>
              <div className="py-1.5 px-4 bg-[#ffee00] text-black text-xs font-black uppercase tracking-widest border-2 border-white">
                CHAMPION
              </div>
            </div>

            {/* 3rd Place */}
            <div className="bg-[#182230] border-2 border-amber-600 p-5 text-center space-y-3 shadow-lg">
              <div className="w-10 h-10 mx-auto bg-amber-600 text-white font-extrabold text-lg flex items-center justify-center rounded-full">
                3
              </div>
              <div className="text-base font-bold text-white uppercase">Beta IT</div>
              <div className="text-3xl font-black text-amber-500">40 PTS</div>
              <div className="py-1 px-3 bg-amber-950 text-amber-400 text-[10px] font-black uppercase tracking-widest border border-amber-600">
                THIRD PLACE
              </div>
            </div>
          </div>

          <div className="overflow-x-auto pt-4 border-t border-[#2a3442]">
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead>
                <tr className="border-b-2 border-[#ffee00] text-[#ffee00] uppercase">
                  <th className="p-3">Rank</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Wellness Score</th>
                  <th className="p-3">Gamification Points</th>
                  <th className="p-3">Active Members</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a3442]">
                {hrData.department_comparison.map((dept) => (
                  <tr key={dept.rank} className="hover:bg-[#182230] transition-colors">
                    <td className="p-3 font-bold text-white">#{dept.rank}</td>
                    <td className="p-3 font-bold text-[#00f0ff] uppercase">{dept.department}</td>
                    <td className="p-3 font-black text-[#00ff66]">{dept.score}</td>
                    <td className="p-3 text-gray-300">{(dept.score * 85).toLocaleString()} XP</td>
                    <td className="p-3 text-gray-400">{dept.members} employees</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: PLAYERS DIRECTORY & INDIVIDUAL DASHBOARDS */}
      {hrSubTab === 'players' && (
        <div className="bg-[#121820] border-2 border-[#00f0ff] p-6 space-y-6 shadow-[0_0_20px_rgba(0,240,255,0.15)]">
          <div className="text-center space-y-1 border-b border-[#00f0ff]/40 pb-4">
            <h2 className="text-xl font-black text-[#00f0ff] uppercase tracking-wider flex items-center justify-center gap-2">
              👥 Players Directory & Individual Dashboard Inspector
            </h2>
            <p className="text-xs text-gray-400 font-mono">
              Select any registered employee player to inspect their specific Digital Twin profile dashboard in HR mode
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {[
              { id: 'EMP001', name: 'Sona VR', department: 'Alpha IT', role: 'Lead AI Engineer', pts: 3450 },
              { id: 'EMP002', name: 'Priya Kapoor', department: 'Beta IT', role: 'Senior Software Developer', pts: 3120 },
              { id: 'EMP003', name: 'Kavya Patel', department: 'Engineering', role: 'Data Scientist', pts: 2890 },
              { id: 'EMP004', name: 'Raj Verma', department: 'Operations', role: 'Product Manager', pts: 3361 },
              { id: 'EMP005', name: 'Amit Sharma', department: 'Design', role: 'UI/UX Designer', pts: 2820 }
            ].map((p) => (
              <div key={p.id} className="bg-[#182230] border-2 border-[#2a3442] hover:border-[#00f0ff] p-5 flex flex-col justify-between space-y-4 shadow-md transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#0b0e14] border-2 border-[#00f0ff] rounded-full flex items-center justify-center text-[#00f0ff] font-black text-lg">
                    👤
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white uppercase">{p.name}</div>
                    <div className="text-[11px] text-[#00f0ff] font-mono">{p.id} • {p.department}</div>
                    <div className="text-[10px] text-gray-400 font-mono">{p.role}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-[#2a3442] pt-3 text-xs font-mono">
                  <span className="text-[#00ff66] font-bold">{p.pts} XP</span>
                  <button
                    onClick={() => handleInspectEmployee({ employee_id: p.id, name: p.name, department: p.department })}
                    className="px-3 py-1.5 bg-[#00f0ff] text-black font-extrabold text-[10px] uppercase tracking-wider border border-white hover:bg-black hover:text-[#00f0ff] transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <span>INSPECT DASHBOARD</span>
                    <ExternalLink size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
