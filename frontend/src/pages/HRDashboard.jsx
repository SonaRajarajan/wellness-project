import React, { useState, useEffect } from 'react';
import { ShieldCheck, Users, AlertTriangle, TrendingUp, Activity, CheckCircle2, Bell, ExternalLink, Lock, ShieldAlert, KeyRound, ArrowRight, User, Trophy, Layers, PieChart, Sliders } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DigitalTwin from './DigitalTwin';
import { getEmployeeAvatar } from '../utils/avatars';

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
        id: emp.employee_id || emp.id,
        employee_id: emp.employee_id || emp.id,
        name: emp.name || emp.employee_id || emp.id,
        department: emp.department || 'All Departments'
      });
    }
    setHrSubTab('twin');
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
            <div className="p-3 bg-red-950/80 border border-red-500 text-red-400 text-xs font-bold font-mono flex items-center justify-center gap-1.5">
              <AlertTriangle size={14} />
              <span>{pinError}</span>
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

  const [hrSubTab, setHrSubTab] = useState('overview'); // 'overview' | 'leaderboard' | 'players' | 'twin'
  const [selectedClusterFilter, setSelectedClusterFilter] = useState('ALL');

  const clusterEmployeeMap = {
    'Peak Performers': [
      { id: 'EMP001', name: 'Sona VR', department: 'Alpha IT', steps: 11450, sleep: 7.9, stress: 2.1, role: 'Lead AI Engineer', cat: 'Peak Performers', color: '#00ff66' },
      { id: 'EMP102', name: 'Rajesh Sharma', department: 'Operations', steps: 11200, sleep: 8.1, stress: 2.1, role: 'Operations Lead', cat: 'Peak Performers', color: '#00ff66' },
      { id: 'EMP103', name: 'Lakshmi Iyer', department: 'HR', steps: 10800, sleep: 7.6, stress: 2.4, role: 'HR Director', cat: 'Peak Performers', color: '#00ff66' },
      { id: 'EMP109', name: 'Vikram Patel', department: 'Alpha IT', steps: 10500, sleep: 7.8, stress: 2.5, role: 'Lead Architect', cat: 'Peak Performers', color: '#00ff66' },
      { id: 'EMP111', name: 'Sneha Reddy', department: 'Design', steps: 10200, sleep: 7.5, stress: 2.6, role: 'Design Lead', cat: 'Peak Performers', color: '#00ff66' },
    ],
    'Balanced Achievers': [
      { id: 'EMP101', name: 'Meenakshi Rajan', department: 'Engineering', steps: 7500, sleep: 6.8, stress: 4.2, role: 'Engineering Lead', cat: 'Balanced Achievers', color: '#00f0ff' },
      { id: 'EMP106', name: 'Siddharth Kumar', department: 'Engineering', steps: 6900, sleep: 7.0, stress: 4.8, role: 'DevOps Specialist', cat: 'Balanced Achievers', color: '#00f0ff' },
      { id: 'EMP110', name: 'Ananya Roy', department: 'Design', steps: 7400, sleep: 6.9, stress: 4.1, role: 'UI/UX Designer', cat: 'Balanced Achievers', color: '#00f0ff' },
      { id: 'EMP112', name: 'Rohan Gupta', department: 'Beta IT', steps: 7100, sleep: 6.7, stress: 4.6, role: 'Frontend Engineer', cat: 'Balanced Achievers', color: '#00f0ff' },
      { id: 'EMP115', name: 'Aakash Shah', department: 'Operations', steps: 7300, sleep: 7.1, stress: 4.3, role: 'Logistics Lead', cat: 'Balanced Achievers', color: '#00f0ff' },
    ],
    'At-Risk Sedentary': [
      { id: 'EMP104', name: 'Anish Verma', department: 'Product', steps: 3600, sleep: 5.5, stress: 7.4, role: 'Product Manager', cat: 'At-Risk Sedentary', color: '#ffee00' },
      { id: 'EMP107', name: 'Divya Pillai', department: 'Marketing', steps: 3100, sleep: 5.9, stress: 6.8, role: 'Marketing Lead', cat: 'At-Risk Sedentary', color: '#ffee00' },
      { id: 'EMP114', name: 'Rahul Mehta', department: 'Beta IT', steps: 3400, sleep: 5.8, stress: 7.1, role: 'QA Lead', cat: 'At-Risk Sedentary', color: '#ffee00' },
      { id: 'EMP116', name: 'Pooja Joshi', department: 'HR', steps: 3300, sleep: 5.7, stress: 7.3, role: 'Talent Specialist', cat: 'At-Risk Sedentary', color: '#ffee00' },
      { id: 'EMP117', name: 'Karan Kapoor', department: 'Finance', steps: 3500, sleep: 6.0, stress: 7.0, role: 'Financial Analyst', cat: 'At-Risk Sedentary', color: '#ffee00' },
    ],
    'Burnout Vulnerable': [
      { id: 'EMP003', name: 'Kavya Patel', department: 'Engineering', steps: 2100, sleep: 4.8, stress: 9.1, role: 'Data Scientist', risk: 'Critical Risk', cat: 'Burnout Vulnerable', color: '#ef4444' },
      { id: 'EMP002', name: 'Priya Kapoor', department: 'Beta IT', steps: 2300, sleep: 5.2, stress: 8.7, role: 'Senior Developer', risk: 'High Risk', cat: 'Burnout Vulnerable', color: '#ef4444' },
      { id: 'EMP108', name: 'Vikram Menon', department: 'Sales', steps: 1950, sleep: 4.5, stress: 8.9, role: 'Account Manager', risk: 'High Risk', cat: 'Burnout Vulnerable', color: '#ef4444' },
      { id: 'EMP005', name: 'Amit Sharma', department: 'Design', steps: 2400, sleep: 4.7, stress: 8.5, role: 'UI/UX Designer', risk: 'High Risk', cat: 'Burnout Vulnerable', color: '#ef4444' },
      { id: 'EMP113', name: 'Neha Deshmukh', department: 'Operations', steps: 2250, sleep: 4.4, stress: 9.0, role: 'Ops Analyst', risk: 'High Risk', cat: 'Burnout Vulnerable', color: '#ef4444' },
      { id: 'EMP118', name: 'Suresh Nair', department: 'Beta IT', steps: 2150, sleep: 4.6, stress: 8.8, role: 'System Admin', risk: 'High Risk', cat: 'Burnout Vulnerable', color: '#ef4444' },
      { id: 'EMP119', name: 'Tarun Bhat', department: 'Engineering', steps: 2050, sleep: 4.3, stress: 9.2, role: 'Backend Dev', risk: 'Critical Risk', cat: 'Burnout Vulnerable', color: '#ef4444' },
    ]
  };

  const allClusterEmployees = [
    ...clusterEmployeeMap['Peak Performers'],
    ...clusterEmployeeMap['Balanced Achievers'],
    ...clusterEmployeeMap['At-Risk Sedentary'],
    ...clusterEmployeeMap['Burnout Vulnerable']
  ];

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
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
          <span>3. PLAYERS DIRECTORY</span>
        </button>

        <button
          onClick={() => setHrSubTab('twin')}
          className={`p-3.5 border-2 flex items-center justify-center gap-2.5 font-black text-xs md:text-sm uppercase tracking-wider transition-all cursor-pointer ${
            hrSubTab === 'twin'
              ? 'bg-purple-500 text-black border-white shadow-[0_0_15px_#a855f7]'
              : 'bg-[#121820] text-gray-400 border-[#2a3442] hover:border-purple-500 hover:text-white'
          }`}
        >
          <User size={18} />
          <span>4. EMPLOYEE DIGITAL TWIN</span>
        </button>
      </div>

      {/* SUB-TAB 1: WORKFORCE RISK ANALYTICS OVERVIEW */}
      {hrSubTab === 'overview' && (
        <div className="space-y-6">
          {/* Top 4 KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#121826] border-2 border-[#00ff66] p-5 text-center space-y-2 shadow-lg rounded-xl">
              <Users className="mx-auto text-[#00ff66]" size={32} />
              <div className="text-3xl md:text-4xl font-black text-[#00ff66]">
                {hrData.workforce_health_overview.total_employees}
              </div>
              <div className="text-xs md:text-sm text-gray-200 uppercase tracking-wider font-extrabold">
                Total Active Players
              </div>
            </div>

            <div className="bg-[#121826] border-2 border-[#00f0ff] p-5 text-center space-y-2 shadow-lg rounded-xl">
              <Activity className="mx-auto text-[#00f0ff]" size={32} />
              <div className="text-3xl md:text-4xl font-black text-[#00f0ff]">
                {hrData.workforce_health_overview.avg_wellness_score} / 10
              </div>
              <div className="text-xs md:text-sm text-gray-200 uppercase tracking-wider font-extrabold">
                Workforce Avg Wellness Score
              </div>
            </div>

            <div className="bg-[#121826] border-2 border-[#ffee00] p-5 text-center space-y-2 shadow-lg rounded-xl">
              <TrendingUp className="mx-auto text-[#ffee00]" size={32} />
              <div className="text-3xl md:text-4xl font-black text-[#ffee00]">
                {hrData.engagement_metrics.daer_daily_active_rate}
              </div>
              <div className="text-xs md:text-sm text-gray-200 uppercase tracking-wider font-extrabold">
                DAER Engagement Rate
              </div>
            </div>

            <div className="bg-[#121826] border-2 border-orange-500 p-5 text-center space-y-2 shadow-lg rounded-xl">
              <AlertTriangle className="mx-auto text-orange-400" size={32} />
              <div className="text-3xl md:text-4xl font-black text-orange-400">
                {hrData.workforce_health_overview.at_risk_employees_cnt}
              </div>
              <div className="text-xs md:text-sm text-gray-200 uppercase tracking-wider font-extrabold">
                Flagged Risk Alerts
              </div>
            </div>
          </div>

          {/* SEPARATE SECTION 1: K-MEANS EMPLOYEE CLUSTERING & WORKFORCE SEGMENTATION */}
          <div className="bg-[#0f172a] border-2 border-[#00f0ff] p-6 md:p-8 space-y-6 shadow-[0_0_35px_rgba(0,240,255,0.25)] rounded-2xl w-full">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-[#00f0ff]/40 pb-5">
              <div>
                <h3 className="text-2xl md:text-3xl font-black text-[#00f0ff] uppercase tracking-wider flex items-center gap-3">
                  <Layers size={28} className="text-[#00f0ff]" />
                  <span>K-Means Employee Clustering & Workforce Segmentation</span>
                </h3>
                <p className="text-xs md:text-sm text-gray-300 font-bold uppercase tracking-wider mt-1">
                  Unsupervised Multi-Vector Clustering ($K=4$) • 130 Active Workforce Members Evaluated
                </p>
              </div>
              <span className="text-xs md:text-sm font-black text-[#00ff66] border-2 border-[#00ff66] px-4 py-2 bg-black rounded-xl uppercase tracking-wider shadow-[0_0_12px_#00ff66] shrink-0">
                MODEL ACCURACY: 89.5% • SILHOUETTE: 0.89
              </span>
            </div>

            {/* Stacked Percentage Visual Ratio Bar */}
            <div className="space-y-3 bg-[#1e293b]/60 p-4 rounded-xl border border-gray-700">
              <div className="flex justify-between text-xs md:text-sm font-black text-white uppercase tracking-wider">
                <span>Workforce Segment Ratio Breakdown</span>
                <span className="text-[#00ff66]">130 Total Employees</span>
              </div>
              <div className="h-7 w-full bg-black rounded-lg p-1 flex overflow-hidden border-2 border-gray-600 shadow-inner">
                <div style={{ width: '35%' }} className="bg-[#00ff66] h-full rounded-l flex items-center justify-center text-black font-black text-xs shadow-[0_0_10px_#00ff66]">35%</div>
                <div style={{ width: '44%' }} className="bg-[#00f0ff] h-full flex items-center justify-center text-black font-black text-xs shadow-[0_0_10px_#00f0ff]">44%</div>
                <div style={{ width: '15%' }} className="bg-[#ffee00] h-full flex items-center justify-center text-black font-black text-xs shadow-[0_0_10px_#ffee00]">15%</div>
                <div style={{ width: '6%' }} className="bg-red-500 h-full rounded-r flex items-center justify-center text-white font-black text-xs shadow-[0_0_10px_#ef4444]">6%</div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs md:text-sm font-black text-gray-200 pt-1">
                <div className="flex items-center gap-2 bg-[#00ff66]/10 px-3 py-1.5 rounded-lg border border-[#00ff66]/40">
                  <span className="w-3 h-3 rounded-full bg-[#00ff66] shadow-[0_0_8px_#00ff66]" />
                  <span className="text-[#00ff66]">1. Peak Performers (35% • 42)</span>
                </div>
                <div className="flex items-center gap-2 bg-[#00f0ff]/10 px-3 py-1.5 rounded-lg border border-[#00f0ff]/40">
                  <span className="w-3 h-3 rounded-full bg-[#00f0ff] shadow-[0_0_8px_#00f0ff]" />
                  <span className="text-[#00f0ff]">2. Balanced Achievers (44% • 53)</span>
                </div>
                <div className="flex items-center gap-2 bg-[#ffee00]/10 px-3 py-1.5 rounded-lg border border-[#ffee00]/40">
                  <span className="w-3 h-3 rounded-full bg-[#ffee00] shadow-[0_0_8px_#ffee00]" />
                  <span className="text-[#ffee00]">3. At-Risk Sedentary (15% • 18)</span>
                </div>
                <div className="flex items-center gap-2 bg-red-950/80 px-3 py-1.5 rounded-lg border border-red-500/50">
                  <span className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]" />
                  <span className="text-red-400">4. Burnout Vulnerable (6% • 7)</span>
                </div>
              </div>
            </div>

            {/* 2D SCATTER GRAPH: DAILY STEPS VS STRESS INDEX */}
            <div className="bg-[#0b1017] border-2 border-gray-700 rounded-2xl p-6 space-y-4 relative shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-800 pb-3">
                <span className="text-sm md:text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <Activity size={18} className="text-[#00f0ff]" />
                  2D CLUSTER SCATTER GRAPH: STRESS INDEX (Y-AXIS) VS DAILY STEPS (X-AXIS)
                </span>
                <span className="text-xs font-black text-[#00f0ff] bg-[#00f0ff]/10 border border-[#00f0ff]/40 px-3 py-1 rounded-full uppercase">
                  CENTROIDS (+) & BOUNDARIES PLOTTED
                </span>
              </div>

              <div className="relative h-72 w-full pt-2">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 650 220">
                  {/* Grid lines */}
                  <line x1="60" y1="20" x2="620" y2="20" stroke="#334155" strokeDasharray="4 4" />
                  <line x1="60" y1="70" x2="620" y2="70" stroke="#334155" strokeDasharray="4 4" />
                  <line x1="60" y1="120" x2="620" y2="120" stroke="#334155" strokeDasharray="4 4" />
                  <line x1="60" y1="170" x2="620" y2="170" stroke="#334155" strokeDasharray="4 4" />
                  <line x1="200" y1="10" x2="200" y2="180" stroke="#334155" strokeDasharray="4 4" />
                  <line x1="340" y1="10" x2="340" y2="180" stroke="#334155" strokeDasharray="4 4" />
                  <line x1="480" y1="10" x2="480" y2="180" stroke="#334155" strokeDasharray="4 4" />

                  {/* Axes */}
                  <line x1="60" y1="180" x2="620" y2="180" stroke="#94a3b8" strokeWidth="3" />
                  <line x1="60" y1="10" x2="60" y2="180" stroke="#94a3b8" strokeWidth="3" />

                  {/* Cluster 1: Peak Performers (High Steps, Low Stress) */}
                  <g filter="drop-shadow(0 0 10px #00ff66)">
                    <circle cx="510" cy="140" r="7" fill="#00ff66" opacity="0.95" />
                    <circle cx="550" cy="155" r="6" fill="#00ff66" opacity="0.85" />
                    <circle cx="470" cy="150" r="8" fill="#00ff66" opacity="0.95" />
                    <circle cx="580" cy="130" r="7" fill="#00ff66" opacity="0.85" />
                    <circle cx="530" cy="165" r="6" fill="#00ff66" opacity="0.95" />
                    <circle cx="525" cy="148" r="22" fill="#00ff66" opacity="0.25" />
                    <text x="525" y="153" textAnchor="middle" fill="#00ff66" fontSize="16" fontWeight="900">+</text>
                    <text x="525" y="180" textAnchor="middle" fill="#00ff66" fontSize="11" fontWeight="bold">Peak Cluster</text>
                  </g>

                  {/* Cluster 2: Balanced Achievers */}
                  <g filter="drop-shadow(0 0 10px #00f0ff)">
                    <circle cx="360" cy="105" r="7" fill="#00f0ff" opacity="0.95" />
                    <circle cx="400" cy="120" r="8" fill="#00f0ff" opacity="0.85" />
                    <circle cx="330" cy="95" r="6" fill="#00f0ff" opacity="0.95" />
                    <circle cx="420" cy="90" r="7" fill="#00f0ff" opacity="0.85" />
                    <circle cx="380" cy="130" r="6" fill="#00f0ff" opacity="0.95" />
                    <circle cx="375" cy="108" r="22" fill="#00f0ff" opacity="0.25" />
                    <text x="375" y="113" textAnchor="middle" fill="#00f0ff" fontSize="16" fontWeight="900">+</text>
                    <text x="375" y="140" textAnchor="middle" fill="#00f0ff" fontSize="11" fontWeight="bold">Balanced Cluster</text>
                  </g>

                  {/* Cluster 3: At-Risk Sedentary */}
                  <g filter="drop-shadow(0 0 10px #ffee00)">
                    <circle cx="180" cy="75" r="7" fill="#ffee00" opacity="0.95" />
                    <circle cx="210" cy="60" r="8" fill="#ffee00" opacity="0.85" />
                    <circle cx="150" cy="85" r="6" fill="#ffee00" opacity="0.95" />
                    <circle cx="230" cy="80" r="7" fill="#ffee00" opacity="0.85" />
                    <circle cx="190" cy="70" r="22" fill="#ffee00" opacity="0.25" />
                    <text x="190" y="75" textAnchor="middle" fill="#ffee00" fontSize="16" fontWeight="900">+</text>
                    <text x="190" y="102" textAnchor="middle" fill="#ffee00" fontSize="11" fontWeight="bold">Sedentary Cluster</text>
                  </g>

                  {/* Cluster 4: Burnout Vulnerable */}
                  <g filter="drop-shadow(0 0 10px #ef4444)">
                    <circle cx="95" cy="35" r="8" fill="#ef4444" opacity="0.95" />
                    <circle cx="120" cy="45" r="7" fill="#ef4444" opacity="0.85" />
                    <circle cx="85" cy="55" r="7" fill="#ef4444" opacity="0.95" />
                    <circle cx="100" cy="42" r="22" fill="#ef4444" opacity="0.3" />
                    <text x="100" y="47" textAnchor="middle" fill="#ef4444" fontSize="16" fontWeight="900">+</text>
                    <text x="100" y="74" textAnchor="middle" fill="#ef4444" fontSize="11" fontWeight="bold">Burnout Cluster</text>
                  </g>

                  {/* Axis Labels */}
                  <text x="620" y="202" textAnchor="end" fill="#f8fafc" fontSize="12" fontWeight="bold">Daily Steps (12,000 / day)</text>
                  <text x="60" y="202" textAnchor="start" fill="#f8fafc" fontSize="12" fontWeight="bold">0 Steps</text>
                  <text x="10" y="25" textAnchor="start" fill="#f8fafc" fontSize="12" fontWeight="bold">High Stress (10/10)</text>
                  <text x="10" y="175" textAnchor="start" fill="#f8fafc" fontSize="12" fontWeight="bold">Low Stress (0/10)</text>
                </svg>
              </div>
            </div>

            {/* Segment Metric Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Peak Performers */}
              <div 
                onClick={() => setSelectedClusterFilter(selectedClusterFilter === 'Peak Performers' ? 'ALL' : 'Peak Performers')}
                className={`p-4 bg-[#1e293b] border-2 border-[#00ff66] rounded-xl space-y-3 shadow-md cursor-pointer transition-all hover:scale-[1.01] ${selectedClusterFilter === 'Peak Performers' ? 'ring-4 ring-[#00ff66]/50 bg-[#00ff66]/10' : ''}`}
              >
                <div className="flex justify-between items-center text-sm font-black">
                  <span className="text-[#00ff66] uppercase">1. PEAK PERFORMERS</span>
                  <span className="text-black bg-[#00ff66] px-2.5 py-0.5 rounded font-black text-xs">35% • 42 Emps</span>
                </div>
                <div className="text-sm text-white font-extrabold">Steps: &gt;10,000 / day</div>
                <div className="text-xs text-gray-200 font-bold">Sleep: 7.8h • Stress: 2.4/10</div>
                <div className="text-xs text-[#00ff66] font-extrabold border-t border-gray-700 pt-1.5">Optimal Wellness Alignment</div>

                {/* EMPLOYEES IN THIS CATEGORY */}
                <div className="pt-2 border-t border-[#00ff66]/30 space-y-1.5">
                  <div className="text-[11px] font-black text-[#00ff66] uppercase tracking-wider flex justify-between items-center">
                    <span>EMPLOYEES IN CATEGORY:</span>
                    <span className="text-[10px] text-gray-400">42 total</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {clusterEmployeeMap['Peak Performers'].map(emp => (
                      <span key={emp.id} className="px-2 py-0.5 bg-[#00ff66]/15 border border-[#00ff66]/50 text-[#00ff66] text-[10px] font-black rounded-md flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00ff66]" />
                        {emp.name} ({emp.id})
                      </span>
                    ))}
                    <span className="px-2 py-0.5 bg-black/40 text-gray-400 text-[10px] font-bold rounded-md">+37 more...</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Balanced Achievers */}
              <div 
                onClick={() => setSelectedClusterFilter(selectedClusterFilter === 'Balanced Achievers' ? 'ALL' : 'Balanced Achievers')}
                className={`p-4 bg-[#1e293b] border-2 border-[#00f0ff] rounded-xl space-y-3 shadow-md cursor-pointer transition-all hover:scale-[1.01] ${selectedClusterFilter === 'Balanced Achievers' ? 'ring-4 ring-[#00f0ff]/50 bg-[#00f0ff]/10' : ''}`}
              >
                <div className="flex justify-between items-center text-sm font-black">
                  <span className="text-[#00f0ff] uppercase">2. BALANCED ACHIEVERS</span>
                  <span className="text-black bg-[#00f0ff] px-2.5 py-0.5 rounded font-black text-xs">44% • 53 Emps</span>
                </div>
                <div className="text-sm text-white font-extrabold">Steps: 7,200 / day</div>
                <div className="text-xs text-gray-200 font-bold">Sleep: 6.9h • Stress: 4.5/10</div>
                <div className="text-xs text-[#00f0ff] font-extrabold border-t border-gray-700 pt-1.5">Healthy Active Routine</div>

                {/* EMPLOYEES IN THIS CATEGORY */}
                <div className="pt-2 border-t border-[#00f0ff]/30 space-y-1.5">
                  <div className="text-[11px] font-black text-[#00f0ff] uppercase tracking-wider flex justify-between items-center">
                    <span>EMPLOYEES IN CATEGORY:</span>
                    <span className="text-[10px] text-gray-400">53 total</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {clusterEmployeeMap['Balanced Achievers'].map(emp => (
                      <span key={emp.id} className="px-2 py-0.5 bg-[#00f0ff]/15 border border-[#00f0ff]/50 text-[#00f0ff] text-[10px] font-black rounded-md flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff]" />
                        {emp.name} ({emp.id})
                      </span>
                    ))}
                    <span className="px-2 py-0.5 bg-black/40 text-gray-400 text-[10px] font-bold rounded-md">+48 more...</span>
                  </div>
                </div>
              </div>

              {/* Card 3: At-Risk Sedentary */}
              <div 
                onClick={() => setSelectedClusterFilter(selectedClusterFilter === 'At-Risk Sedentary' ? 'ALL' : 'At-Risk Sedentary')}
                className={`p-4 bg-[#1e293b] border-2 border-[#ffee00] rounded-xl space-y-3 shadow-md cursor-pointer transition-all hover:scale-[1.01] ${selectedClusterFilter === 'At-Risk Sedentary' ? 'ring-4 ring-[#ffee00]/50 bg-[#ffee00]/10' : ''}`}
              >
                <div className="flex justify-between items-center text-sm font-black">
                  <span className="text-[#ffee00] uppercase">3. AT-RISK SEDENTARY</span>
                  <span className="text-black bg-[#ffee00] px-2.5 py-0.5 rounded font-black text-xs">15% • 18 Emps</span>
                </div>
                <div className="text-sm text-white font-extrabold">Steps: 3,400 / day</div>
                <div className="text-xs text-gray-200 font-bold">Sleep: 5.8h • Stress: 7.1/10</div>
                <div className="text-xs text-[#ffee00] font-extrabold border-t border-gray-700 pt-1.5">Needs Mobility Intervention</div>

                {/* EMPLOYEES IN THIS CATEGORY */}
                <div className="pt-2 border-t border-[#ffee00]/30 space-y-1.5">
                  <div className="text-[11px] font-black text-[#ffee00] uppercase tracking-wider flex justify-between items-center">
                    <span>EMPLOYEES IN CATEGORY:</span>
                    <span className="text-[10px] text-gray-400">18 total</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {clusterEmployeeMap['At-Risk Sedentary'].map(emp => (
                      <span key={emp.id} className="px-2 py-0.5 bg-[#ffee00]/15 border border-[#ffee00]/50 text-[#ffee00] text-[10px] font-black rounded-md flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ffee00]" />
                        {emp.name} ({emp.id})
                      </span>
                    ))}
                    <span className="px-2 py-0.5 bg-black/40 text-gray-400 text-[10px] font-bold rounded-md">+13 more...</span>
                  </div>
                </div>
              </div>

              {/* Card 4: Burnout Vulnerable */}
              <div 
                onClick={() => setSelectedClusterFilter(selectedClusterFilter === 'Burnout Vulnerable' ? 'ALL' : 'Burnout Vulnerable')}
                className={`p-4 bg-[#1e293b] border-2 border-red-500 rounded-xl space-y-3 shadow-md cursor-pointer transition-all hover:scale-[1.01] ${selectedClusterFilter === 'Burnout Vulnerable' ? 'ring-4 ring-red-500/50 bg-red-950/40' : ''}`}
              >
                <div className="flex justify-between items-center text-sm font-black">
                  <span className="text-red-400 uppercase">4. BURNOUT VULNERABLE</span>
                  <span className="text-white bg-red-600 px-2.5 py-0.5 rounded font-black text-xs">6% • 7 Emps</span>
                </div>
                <div className="text-sm text-white font-extrabold">Steps: 2,200 / day</div>
                <div className="text-xs text-gray-200 font-bold">Sleep: 4.6h • Stress: 8.9/10</div>
                <div className="text-xs text-red-400 font-extrabold border-t border-gray-700 pt-1.5">High Fatigue Risk Flag</div>

                {/* EMPLOYEES IN THIS CATEGORY */}
                <div className="pt-2 border-t border-red-500/40 space-y-1.5">
                  <div className="text-[11px] font-black text-red-400 uppercase tracking-wider flex justify-between items-center">
                    <span>FLAGGED EMPLOYEES IN CATEGORY:</span>
                    <span className="text-[10px] text-red-300 font-bold">ALL 7 LISTED</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {clusterEmployeeMap['Burnout Vulnerable'].map(emp => (
                      <span key={emp.id} className="px-2 py-0.5 bg-red-950 border border-red-500 text-red-400 text-[10px] font-black rounded-md flex items-center gap-1 shadow-[0_0_6px_#ef4444]">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                        {emp.name} ({emp.id})
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* INTERACTIVE ROSTER: WHO IS IN WHICH CATEGORY TABLE */}
            <div className="bg-[#0b1017] border-2 border-[#00f0ff]/60 rounded-2xl p-5 space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-800 pb-3">
                <div>
                  <h4 className="text-base md:text-lg font-black text-white uppercase tracking-wider flex items-center gap-2">
                    <Users size={20} className="text-[#00f0ff]" />
                    <span>K-Means Workforce Category Employee Roster</span>
                  </h4>
                  <p className="text-xs text-gray-400 font-mono">
                    Direct employee lookup by assigned cluster tag. Click any category tab below or click a card above to filter.
                  </p>
                </div>

                {/* Filter buttons */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    onClick={() => setSelectedClusterFilter('ALL')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase transition-all cursor-pointer ${
                      selectedClusterFilter === 'ALL'
                        ? 'bg-white text-black border-2 border-white shadow-[0_0_10px_#ffffff]'
                        : 'bg-[#182335] text-gray-400 border border-gray-700 hover:text-white'
                    }`}
                  >
                    SHOW ALL (22)
                  </button>

                  <button
                    onClick={() => setSelectedClusterFilter('Peak Performers')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase transition-all cursor-pointer ${
                      selectedClusterFilter === 'Peak Performers'
                        ? 'bg-[#00ff66] text-black border-2 border-white shadow-[0_0_10px_#00ff66]'
                        : 'bg-[#182335] text-[#00ff66] border border-[#00ff66]/40 hover:bg-[#00ff66]/20'
                    }`}
                  >
                    PEAK (5)
                  </button>

                  <button
                    onClick={() => setSelectedClusterFilter('Balanced Achievers')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase transition-all cursor-pointer ${
                      selectedClusterFilter === 'Balanced Achievers'
                        ? 'bg-[#00f0ff] text-black border-2 border-white shadow-[0_0_10px_#00f0ff]'
                        : 'bg-[#182335] text-[#00f0ff] border border-[#00f0ff]/40 hover:bg-[#00f0ff]/20'
                    }`}
                  >
                    BALANCED (5)
                  </button>

                  <button
                    onClick={() => setSelectedClusterFilter('At-Risk Sedentary')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase transition-all cursor-pointer ${
                      selectedClusterFilter === 'At-Risk Sedentary'
                        ? 'bg-[#ffee00] text-black border-2 border-white shadow-[0_0_10px_#ffee00]'
                        : 'bg-[#182335] text-[#ffee00] border border-[#ffee00]/40 hover:bg-[#ffee00]/20'
                    }`}
                  >
                    SEDENTARY (5)
                  </button>

                  <button
                    onClick={() => setSelectedClusterFilter('Burnout Vulnerable')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase transition-all cursor-pointer ${
                      selectedClusterFilter === 'Burnout Vulnerable'
                        ? 'bg-red-600 text-white border-2 border-white shadow-[0_0_10px_#ef4444]'
                        : 'bg-red-950/80 text-red-400 border border-red-500/50 hover:bg-red-900'
                    }`}
                  >
                    BURNOUT (7)
                  </button>
                </div>
              </div>

              {/* Roster Table */}
              <div className="overflow-x-auto rounded-xl border border-gray-800 bg-[#0f172a]">
                <table className="w-full text-left text-xs font-mono border-collapse">
                  <thead>
                    <tr className="border-b-2 border-gray-700 bg-[#1e293b] text-gray-300 uppercase">
                      <th className="p-3">Employee Name & ID</th>
                      <th className="p-3">Department & Role</th>
                      <th className="p-3">K-Means Cluster Tag</th>
                      <th className="p-3">Daily Steps</th>
                      <th className="p-3">Sleep</th>
                      <th className="p-3">Stress Score</th>
                      <th className="p-3 text-right">Digital Twin Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {(selectedClusterFilter === 'ALL'
                      ? allClusterEmployees
                      : clusterEmployeeMap[selectedClusterFilter] || []
                    ).map((emp) => (
                      <tr key={emp.id} className="hover:bg-[#182335] transition-colors">
                        <td className="p-3 font-bold text-white">
                          <div className="text-sm font-black text-white">{emp.name}</div>
                          <div className="text-[10px] text-[#00f0ff]">{emp.id}</div>
                        </td>
                        <td className="p-3">
                          <div className="text-gray-200 font-bold">{emp.department}</div>
                          <div className="text-[10px] text-gray-400">{emp.role}</div>
                        </td>
                        <td className="p-3">
                          <span
                            className="px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1.5 border"
                            style={{
                              backgroundColor: `${emp.color}20`,
                              borderColor: emp.color,
                              color: emp.color
                            }}
                          >
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: emp.color }} />
                            {emp.cat}
                            {emp.risk && <span className="ml-1 text-red-400 font-extrabold">({emp.risk})</span>}
                          </span>
                        </td>
                        <td className="p-3 font-black text-white">{emp.steps.toLocaleString()} / day</td>
                        <td className="p-3 text-gray-300 font-bold">{emp.sleep} hrs</td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 bg-gray-800 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full"
                                style={{
                                  width: `${(emp.stress / 10) * 100}%`,
                                  backgroundColor: emp.stress > 7 ? '#ef4444' : emp.stress > 4 ? '#ffee00' : '#00ff66'
                                }}
                              />
                            </div>
                            <span className="font-extrabold text-white">{emp.stress}/10</span>
                          </div>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleInspectEmployee({ employee_id: emp.id, name: emp.name, department: emp.department })}
                            className="px-3 py-1.5 bg-[#00f0ff] text-black font-black text-[10px] uppercase tracking-wider border border-white hover:bg-white transition-all rounded shadow cursor-pointer inline-flex items-center gap-1"
                          >
                            <span>INSPECT TWIN</span>
                            <ExternalLink size={12} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>


          {/* SEPARATE SECTION 2: ISOLATION FOREST MOTION & BIOMETRIC ANOMALY DETECTION */}
          <div className="bg-[#0f172a] border-2 border-amber-400 p-6 md:p-8 space-y-6 shadow-[0_0_35px_rgba(251,191,36,0.25)] rounded-2xl w-full">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-amber-400/40 pb-5">
              <div>
                <h3 className="text-2xl md:text-3xl font-black text-amber-400 uppercase tracking-wider flex items-center gap-3">
                  <Bell size={28} className="text-amber-400" />
                  <span>Isolation Forest Motion & Biometric Anomaly Detection</span>
                </h3>
                <p className="text-xs md:text-sm text-gray-300 font-bold uppercase tracking-wider mt-1">
                  6-Axis IoT Telemetry Scan across 5 Benchmark Datasets (MotionSense, UCI HAR, KU-HAR, Walker Fall, Fall IoT)
                </p>
              </div>
              <span className="text-xs md:text-sm font-black text-[#00ff66] border-2 border-[#00ff66] px-4 py-2 bg-black rounded-xl uppercase tracking-wider shadow-[0_0_12px_#00ff66] shrink-0">
                MODEL ACCURACY: 95.2% • CONTAM: 0.03
              </span>
            </div>

            {/* Status Banner */}
            <div className="p-4 bg-[#0b1017] border-2 border-amber-400/60 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs md:text-sm font-bold shadow-md">
              <span className="text-amber-300 flex items-center gap-2.5">
                <Activity size={20} className="animate-pulse text-amber-400" />
                <span>REAL-TIME IOT TELEMETRY SCANNER (30-SECOND SLIDING WINDOW)</span>
              </span>
              <span className="text-white bg-red-600 px-4 py-1.5 rounded-lg font-black uppercase tracking-wider animate-pulse shadow-[0_0_10px_#ef4444]">
                2 OUTLIER SPIKES DETECTED (HIGH SEVERITY)
              </span>
            </div>

            {/* SVG TELEMETRY WAVEFORM & ANOMALY SPIKE PLOT (FULL WIDTH) */}
            <div className="bg-[#0b1017] border-2 border-gray-700 rounded-2xl p-6 space-y-4 relative shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-800 pb-3">
                <span className="text-sm md:text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <TrendingUp size={18} className="text-amber-400" />
                  REAL-TIME 6-AXIS TELEMETRY WAVEFORM & ANOMALY SPIKES
                </span>
                <span className="text-xs font-black text-red-400 bg-red-950 border border-red-500/50 px-3 py-1 rounded-full uppercase">
                  ANOMALY LIMIT THRESHOLD: 140 BPM / 3.5g
                </span>
              </div>

              <div className="relative h-72 w-full pt-2">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 650 220">
                  <defs>
                    <linearGradient id="waveGradientFullClean" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ffee00" stopOpacity="0.45" />
                      <stop offset="100%" stopColor="#ffee00" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Grid lines */}
                  <line x1="50" y1="40" x2="620" y2="40" stroke="#334155" strokeDasharray="4 4" />
                  <line x1="50" y1="90" x2="620" y2="90" stroke="#334155" strokeDasharray="4 4" />
                  <line x1="50" y1="140" x2="620" y2="140" stroke="#334155" strokeDasharray="4 4" />

                  {/* ANOMALY THRESHOLD LINE (Dashed Red Line) */}
                  <line x1="50" y1="70" x2="620" y2="70" stroke="#ef4444" strokeWidth="3" strokeDasharray="6 6" />
                  <text x="615" y="62" textAnchor="end" fill="#ef4444" fontSize="12" fontWeight="900">ANOMALY LIMIT THRESHOLD (140 BPM / 3.5g)</text>

                  {/* Baseline Normal Telemetry Wave (Cyan) */}
                  <path
                    d="M 50 155 L 90 150 L 130 158 L 160 85 L 180 170 L 210 150 L 250 152 L 280 48 L 300 165 L 340 148 L 390 152 L 440 55 L 460 160 L 530 150 L 620 152"
                    fill="none"
                    stroke="#00f0ff"
                    strokeWidth="3.5"
                    filter="drop-shadow(0 0 10px #00f0ff)"
                  />

                  {/* Fill underneath wave */}
                  <path
                    d="M 50 155 L 90 150 L 120 158 L 160 85 L 180 170 L 210 150 L 250 152 L 280 48 L 300 165 L 340 148 L 390 152 L 440 55 L 460 160 L 530 150 L 620 152 V 185 H 50 Z"
                    fill="url(#waveGradientFullClean)"
                    opacity="0.35"
                  />

                  {/* ANOMALY OUTLIER SPIKE 1: ALT-901 */}
                  <g filter="drop-shadow(0 0 14px #ef4444)">
                    <circle cx="280" cy="48" r="9" fill="#ef4444" />
                    <circle cx="280" cy="48" r="18" fill="#ef4444" opacity="0.3" className="animate-ping" />
                    <rect x="220" y="12" width="120" height="25" rx="6" fill="#7f1d1d" stroke="#ef4444" strokeWidth="2" />
                    <text x="280" y="29" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="900">ALT-901: 155 BPM (4.5g)</text>
                  </g>

                  {/* ANOMALY OUTLIER SPIKE 2: ALT-903 */}
                  <g filter="drop-shadow(0 0 14px #ffee00)">
                    <circle cx="440" cy="55" r="8" fill="#ffee00" />
                    <circle cx="440" cy="55" r="16" fill="#ffee00" opacity="0.3" className="animate-ping" />
                    <rect x="380" y="20" width="120" height="25" rx="6" fill="#451a03" stroke="#ffee00" strokeWidth="2" />
                    <text x="440" y="37" textAnchor="middle" fill="#ffee00" fontSize="11" fontWeight="900">ALT-903: 142 BPM (3.8g)</text>
                  </g>

                  {/* Time Axis */}
                  <line x1="50" y1="185" x2="620" y2="185" stroke="#94a3b8" strokeWidth="2.5" />
                  <text x="50" y="202" fill="#f8fafc" fontSize="12" fontWeight="bold">0s</text>
                  <text x="192" y="202" fill="#f8fafc" fontSize="12" fontWeight="bold">7.5s</text>
                  <text x="335" y="202" fill="#f8fafc" fontSize="12" fontWeight="bold">15s</text>
                  <text x="477" y="202" fill="#f8fafc" fontSize="12" fontWeight="bold">22.5s</text>
                  <text x="615" y="202" textAnchor="end" fill="#f8fafc" fontSize="12" fontWeight="bold">30s (Live Telemetry)</text>
                </svg>
              </div>
            </div>

            {/* Anomaly Alerts Feed */}
            <div className="space-y-4">
              <div className="text-sm font-black text-[#ffee00] uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle size={18} />
                <span>Flagged Anomaly Outliers & Active Escalation Feed</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {hrData.anomaly_detection_alerts.map((alt) => (
                  <div key={alt.alert_id} className="p-5 bg-[#1e293b] border-2 border-amber-400/80 rounded-xl space-y-3 shadow-md">
                    <div className="flex justify-between items-center text-sm md:text-base">
                      <span className="font-black text-amber-300 text-base">{alt.alert_id} • {alt.employee_id} ({alt.name || alt.employee_id})</span>
                      <span className="px-3 py-1 bg-amber-950 text-amber-300 font-black border border-amber-400 text-xs rounded-md shadow">
                        {alt.severity} SEVERITY
                      </span>
                    </div>
                    <div className="text-sm text-gray-100 font-bold">{alt.message}</div>
                    <div className="text-xs text-amber-200 font-bold border-t border-gray-700 pt-3 flex items-center justify-between gap-3">
                      <span className="flex items-center gap-2"><CheckCircle2 size={16} className="text-[#00ff66]" /> {alt.action}</span>
                      <button
                        onClick={() => handleInspectEmployee({ employee_id: alt.employee_id, name: alt.name })}
                        className="px-3.5 py-2 bg-amber-400 text-black font-black text-xs uppercase tracking-wider flex items-center gap-1.5 hover:bg-white transition-all rounded-md shadow cursor-pointer shrink-0"
                      >
                        <span>INSPECT DASHBOARD</span>
                        <ExternalLink size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Program Effectiveness & Department Comparison */}
          <div className="bg-[#121826] border-2 border-[#00f0ff] p-5 space-y-4 rounded-xl">
            <h3 className="text-base font-black text-[#00f0ff] uppercase tracking-wider">
              Program Effectiveness & Department Comparison
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center font-mono text-xs md:text-sm">
              <div className="p-3.5 bg-[#182335] border border-gray-700 rounded-lg">
                <div className="text-gray-300 text-xs font-bold uppercase tracking-wider">8-WEEK IMPROVEMENT</div>
                <div className="text-[#00ff66] font-black text-xl mt-1">+18.3%</div>
              </div>
              <div className="p-3.5 bg-[#182335] border border-gray-700 rounded-lg">
                <div className="text-gray-300 text-xs font-bold uppercase tracking-wider">FORM PRECISION</div>
                <div className="text-[#00f0ff] font-black text-xl mt-1">94.5%</div>
              </div>
              <div className="p-3.5 bg-[#182335] border border-gray-700 rounded-lg">
                <div className="text-gray-300 text-xs font-bold uppercase tracking-wider">DAER VS CONTROL</div>
                <div className="text-orange-400 font-black text-xl mt-1">71.4% vs 28.7%</div>
              </div>
              <div className="p-3.5 bg-[#182335] border border-gray-700 rounded-lg">
                <div className="text-gray-300 text-xs font-bold uppercase tracking-wider">TECH READINESS</div>
                <div className="text-[#ffee00] font-black text-xl mt-1">TRL 7 Verified</div>
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
              <Trophy size={24} className="text-[#ffee00]" />
              Workforce Department Leaderboard
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
              <Users size={24} className="text-[#00f0ff]" />
              Players Directory & Individual Dashboard Inspector
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
                  <img
                    src={getEmployeeAvatar(p)}
                    alt={p.name}
                    className="w-12 h-12 rounded-full border-2 border-[#00f0ff] object-cover shadow-md"
                  />
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

      {/* SUB-TAB 4: EMPLOYEE DIGITAL TWIN */}
      {hrSubTab === 'twin' && (
        <div className="space-y-4">
          <div className="bg-[#121820] border-2 border-purple-500 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[0_0_15px_rgba(168,85,247,0.2)] font-mono">
            <div>
              <h2 className="text-base md:text-lg font-black text-purple-400 uppercase tracking-wider flex items-center gap-2">
                <User size={20} />
                INSPECTING DIGITAL TWIN: {user?.name || 'Sona VR'} ({user?.employee_id || user?.id || 'EMP001'})
              </h2>
              <p className="text-xs text-gray-400 font-mono mt-0.5">
                Viewing individual employee twin metrics, burnout risk index, and health scores in HR mode
              </p>
            </div>
            <button
              onClick={() => setHrSubTab('players')}
              className="px-3.5 py-2 bg-[#182230] border-2 border-[#00f0ff] text-[#00f0ff] hover:bg-[#00f0ff] hover:text-black font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap shadow-md"
            >
              <span>← Switch Employee Player</span>
            </button>
          </div>

          <DigitalTwin user={user} />
        </div>
      )}
    </div>
  );
}
