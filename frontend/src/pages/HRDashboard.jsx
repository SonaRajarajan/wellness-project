import React, { useState, useEffect } from 'react';
import { ShieldCheck, Users, AlertTriangle, TrendingUp, Activity, CheckCircle2, Bell, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function HRDashboard({ user, onSelectEmployee }) {
  const navigate = useNavigate();
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

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-[#00ff66] pb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-wider text-[#00ff66] uppercase flex items-center gap-3">
            <ShieldCheck className="text-[#00f0ff]" size={32} />
            HR Enterprise Wellness Dashboard
          </h1>
          <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-bold">
            Executive management portal for workforce health, risk analytics & program effectiveness
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/players')}
            className="px-4 py-2 bg-[#00f0ff] text-black font-extrabold text-xs uppercase tracking-wider border border-white hover:bg-black hover:text-[#00f0ff] transition-all flex items-center gap-1.5 shadow-[0_0_10px_#00f0ff]"
          >
            <Users size={16} />
            <span>PLAYERS DIRECTORY</span>
          </button>
        </div>
      </div>

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
                    className="px-2 py-1 bg-pink-500 text-black font-extrabold text-[10px] uppercase tracking-wider flex items-center gap-1 hover:bg-white transition-colors ml-2"
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
                    className="px-2 py-1 bg-amber-500 text-black font-extrabold text-[10px] uppercase tracking-wider flex items-center gap-1 hover:bg-white transition-colors ml-2"
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
  );
}
