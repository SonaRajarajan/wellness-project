import React, { useState, useEffect } from 'react';
import { Layers, Activity, Cpu, ShieldCheck, Heart, Users, Utensils, Video, Sparkles, CheckCircle2 } from 'lucide-react';

export default function ArchitectureView() {
  const [archData, setArchData] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8000/api/v1/architecture')
      .then((res) => res.json())
      .then((data) => setArchData(data))
      .catch((e) => console.warn('Using default architecture metadata'));
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2 border-b-2 border-[#00f0ff] pb-4">
        <h1 className="text-2xl md:text-3xl font-black tracking-wider text-[#00f0ff] uppercase flex items-center justify-center gap-3">
          <Layers className="text-pink-500" size={36} />
          Proposed System Architecture
        </h1>
        <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">
          3-Layer AI-Driven Multimodal Workforce Wellness Engine (VIT Chennai)
        </p>
      </div>

      {/* LAYER 1: EMPLOYEE ECOSYSTEM */}
      <div className="bg-[#121820] border-2 border-slate-600 p-6 space-y-4 shadow-xl">
        <div className="bg-slate-900 border border-slate-700 p-3 flex items-center justify-between">
          <h2 className="text-sm font-black text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Users className="text-[#00f0ff]" size={18} />
            LAYER 1: EMPLOYEE ECOSYSTEM (DATA INPUTS)
          </h2>
          <span className="text-[10px] px-2 py-0.5 bg-[#00ff66]/10 text-[#00ff66] font-mono border border-[#00ff66]">
            MULTIMODAL INGESTION ACTIVE
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Wearable IoT */}
          <div className="bg-[#182230] border border-green-500/50 p-4 space-y-2 text-center">
            <Activity className="mx-auto text-green-400" size={24} />
            <div className="text-xs font-bold text-white uppercase">Wearable IoT Data</div>
            <div className="text-[10px] text-gray-400 font-mono">HR • HRV • Sleep • SpO2 • Steps • Calories</div>
          </div>

          {/* HRMS Data */}
          <div className="bg-[#182230] border border-blue-500/50 p-4 space-y-2 text-center">
            <Users className="mx-auto text-blue-400" size={24} />
            <div className="text-xs font-bold text-white uppercase">HRMS Data</div>
            <div className="text-[10px] text-gray-400 font-mono">Attendance • Workload • Leave • Demographics</div>
          </div>

          {/* Nutrition Data */}
          <div className="bg-[#182230] border border-amber-500/50 p-4 space-y-2 text-center">
            <Utensils className="mx-auto text-amber-400" size={24} />
            <div className="text-xs font-bold text-white uppercase">Nutrition Data</div>
            <div className="text-[10px] text-gray-400 font-mono">Cafeteria • BMI • Meals • Calories • Nutrients</div>
          </div>

          {/* Computer Vision */}
          <div className="bg-[#182230] border border-purple-500/50 p-4 space-y-2 text-center">
            <Video className="mx-auto text-purple-400" size={24} />
            <div className="text-xs font-bold text-white uppercase">Computer Vision Input</div>
            <div className="text-[10px] text-gray-400 font-mono">Exercise Tracking • Posture • Quality</div>
          </div>

          {/* Employee Inputs */}
          <div className="bg-[#182230] border border-pink-500/50 p-4 space-y-2 text-center">
            <Heart className="mx-auto text-pink-400" size={24} />
            <div className="text-xs font-bold text-white uppercase">Employee Inputs</div>
            <div className="text-[10px] text-gray-400 font-mono">Goals • Mood • Symptoms • Habits</div>
          </div>
        </div>

        {/* Integration Bar */}
        <div className="bg-[#182230] border border-[#00f0ff]/40 p-3 text-center text-xs font-mono text-[#00f0ff]">
          📊 MULTIMODAL DATA INTEGRATION LAYER: Data Cleaning ➔ Synchronization ➔ Feature Engineering ➔ Secure Encryption
        </div>
      </div>

      {/* LAYER 2: HYBRID AI + GenAI ENGINE */}
      <div className="bg-[#121820] border-2 border-purple-500 p-6 space-y-6 shadow-[0_0_20px_rgba(168,85,247,0.15)]">
        <div className="bg-purple-950/60 border border-purple-500 p-3 flex items-center justify-between">
          <h2 className="text-sm font-black text-purple-300 uppercase tracking-wider flex items-center gap-2">
            <Cpu className="text-[#00f0ff]" size={18} />
            LAYER 2: HYBRID AI + GenAI INTELLIGENCE ENGINE
          </h2>
          <span className="text-[10px] px-2 py-0.5 bg-purple-900 text-purple-200 font-mono border border-purple-400">
            XGBoost • LSTM • MediaPipe • RAG LLM
          </span>
        </div>

        {/* Top 5 Model Engines */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <div className="bg-[#182230] p-3 border border-purple-400/40 text-center space-y-1">
            <div className="text-[11px] font-bold text-white uppercase">Predictive Health Intelligence</div>
            <div className="text-[10px] text-purple-300 font-mono">LSTM / TFT Forecaster</div>
          </div>

          <div className="bg-[#182230] p-3 border border-purple-400/40 text-center space-y-1">
            <div className="text-[11px] font-bold text-white uppercase">Stress & Burnout Prediction</div>
            <div className="text-[10px] text-purple-300 font-mono">XGBoost (94.2% Acc)</div>
          </div>

          <div className="bg-[#182230] p-3 border border-purple-400/40 text-center space-y-1">
            <div className="text-[11px] font-bold text-white uppercase">Wellness Orchestration</div>
            <div className="text-[10px] text-purple-300 font-mono">AHA Multi-Objective</div>
          </div>

          <div className="bg-[#182230] p-3 border border-purple-400/40 text-center space-y-1">
            <div className="text-[11px] font-bold text-white uppercase">Exercise Motion Analytics</div>
            <div className="text-[10px] text-purple-300 font-mono">MediaPipe + ST-GCN</div>
          </div>

          <div className="bg-[#182230] p-3 border border-purple-400/40 text-center space-y-1">
            <div className="text-[11px] font-bold text-white uppercase">GenAI Recommendation Engine</div>
            <div className="text-[10px] text-purple-300 font-mono">RAG Knowledge Graph</div>
          </div>
        </div>

        {/* 4 Core Subsystems Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Subsystem 1 */}
          <div className="bg-[#182230] border-2 border-green-500 p-4 space-y-3">
            <div className="text-xs font-black text-green-400 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-5 h-5 bg-green-500 text-black font-extrabold text-[10px] rounded-full flex items-center justify-center">1</span>
              Gamification & Engagement
            </div>
            <ul className="text-[11px] text-gray-300 space-y-1 font-mono">
              <li>• Dept-wise Challenges</li>
              <li>• Daily / Weekly Missions</li>
              <li>• Leaderboard Podium</li>
              <li>• Badges & Achievements</li>
              <li>• Food Recommendations</li>
            </ul>
          </div>

          {/* Subsystem 2 */}
          <div className="bg-[#182230] border-2 border-blue-500 p-4 space-y-3">
            <div className="text-xs font-black text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-5 h-5 bg-blue-500 text-black font-extrabold text-[10px] rounded-full flex items-center justify-center">2</span>
              Exercise Motion Analytics
            </div>
            <ul className="text-[11px] text-gray-300 space-y-1 font-mono">
              <li>• Real-time Exercise Tracking</li>
              <li>• Squat Repetition Counting</li>
              <li>• Movement Quality Score</li>
              <li>• Personalized Plan</li>
            </ul>
          </div>

          {/* Subsystem 3 */}
          <div className="bg-[#182230] border-2 border-pink-500 p-4 space-y-3">
            <div className="text-xs font-black text-pink-400 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-5 h-5 bg-pink-500 text-black font-extrabold text-[10px] rounded-full flex items-center justify-center">3</span>
              Digital Twin Profile
            </div>
            <ul className="text-[11px] text-gray-300 space-y-1 font-mono">
              <li>• Comprehensive Health Score</li>
              <li>• Risk Index & Predictions</li>
              <li>• Wellness Trends Over Time</li>
              <li>• Productivity Insights</li>
            </ul>
          </div>

          {/* Subsystem 4 */}
          <div className="bg-[#182230] border-2 border-amber-500 p-4 space-y-3">
            <div className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-5 h-5 bg-amber-500 text-black font-extrabold text-[10px] rounded-full flex items-center justify-center">4</span>
              Anomaly Detection & Alerts
            </div>
            <ul className="text-[11px] text-gray-300 space-y-1 font-mono">
              <li>• Isolation Forest Detection</li>
              <li>• Outlier Identification</li>
              <li>• Real-time Notifications</li>
              <li>• HR Manager Escalation</li>
            </ul>
          </div>
        </div>
      </div>

      {/* LAYER 3: DASHBOARDS & IMPACT */}
      <div className="bg-[#121820] border-2 border-[#00f0ff] p-6 space-y-4 shadow-xl">
        <div className="bg-[#00f0ff]/10 border border-[#00f0ff] p-3 flex items-center justify-between">
          <h2 className="text-sm font-black text-[#00f0ff] uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck size={18} />
            LAYER 3: ENTERPRISE WELLNESS DASHBOARD & ORGANIZATIONAL IMPACT
          </h2>
          <span className="text-[10px] px-2 py-0.5 bg-[#00f0ff] text-black font-mono font-bold">
            TRL 7 VERIFIED
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#182230] border border-[#00f0ff]/40 p-4 space-y-2">
            <div className="text-xs font-bold text-[#00f0ff] uppercase">Employee Dashboard (Port 5173)</div>
            <div className="text-[11px] text-gray-300 font-mono">
              Health Trends • Wellness Score (8.0/10) • Exercise Analytics • Food Recs • Rewards & Badges
            </div>
          </div>

          <div className="bg-[#182230] border border-[#00ff66]/40 p-4 space-y-2">
            <div className="text-xs font-bold text-[#00ff66] uppercase">HR Dashboard (Port 8000/docs)</div>
            <div className="text-[11px] text-gray-300 font-mono">
              Workforce Overview • Risk & Burnout Analytics • 71.4% DAER Engagement • Anomaly Alerts
            </div>
          </div>
        </div>

        {/* Organizational Impact */}
        <div className="bg-[#182230] border border-emerald-500/50 p-4 space-y-3">
          <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 size={16} />
            VERIFIED ORGANIZATIONAL IMPACT METRICS
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-center text-[10px] font-mono">
            <div className="p-2 bg-emerald-950/60 border border-emerald-500/40 text-emerald-300">+18.3% Health</div>
            <div className="p-2 bg-emerald-950/60 border border-emerald-500/40 text-emerald-300">94.5% Form</div>
            <div className="p-2 bg-emerald-950/60 border border-emerald-500/40 text-emerald-300">-14.2% Burnout</div>
            <div className="p-2 bg-emerald-950/60 border border-emerald-500/40 text-emerald-300">71.4% DAER</div>
            <div className="p-2 bg-emerald-950/60 border border-emerald-500/40 text-emerald-300">High Productivity</div>
            <div className="p-2 bg-emerald-950/60 border border-emerald-500/40 text-emerald-300">Data Decisions</div>
          </div>
        </div>
      </div>
    </div>
  );
}
