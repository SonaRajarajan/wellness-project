import React, { useState, useEffect } from 'react';
import { UserCheck, UserPlus, Shield, Activity, Heart, Moon, Zap, Flame, CheckCircle2, ArrowRight, X, Target, Smile, AlertCircle, Utensils, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

export default function EmployeeOnboardingModal({ isOpen, onClose, onSelectEmployee }) {
  const [activeTab, setActiveTab] = useState('existing'); // 'existing' | 'new'
  const [employeesList, setEmployeesList] = useState([]);
  const [selectedEmpId, setSelectedEmpId] = useState('EMP001');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [showAdvancedSynthetic, setShowAdvancedSynthetic] = useState(false);

  // New Employee Form Inputs (Slide 16 Architecture: Employee Inputs + Synthetic Data Engine)
  const [formData, setFormData] = useState({
    name: 'Rajarajan S',
    department: 'Alpha IT',
    role: 'Lead AI Engineer',
    age: 28,
    gender: 'Male',
    activity_level: 'Moderately Active',

    // Employee Inputs (Slide 16 Architecture)
    goals: 'Weight Loss & Fat Burn',
    mood: 'Energetic & Focused',
    symptoms: 'None / Healthy',
    dietary_preference: 'High Protein',
    habits: 'Coffee 2 cups/day, Regular Hydration',

    // Wearable & Clinical (Optional override, auto-synthesized if omitted)
    heart_rate: 72,
    sleep_hours: 7.5,
    sleep_quality_score: 85,
    step_count: 9200,
    calories_burned: 2200,
    stress_level: 3.5,
    spo2: 98,
    systolic_bp: 120,
    diastolic_bp: 80,
    bmi: 23.5,
    glucose: 95,
    workload_hours_per_week: 40,
    physical_activity_hours: 5,
    water_intake_l: 2.5
  });

  useEffect(() => {
    fetch('http://localhost:8000/api/v1/players')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.players) {
          setEmployeesList(data.players);
          if (data.players.length > 0) {
            setSelectedEmpId(data.players[0].employee_id || data.players[0].id);
          }
        }
      })
      .catch(() => {});
  }, []);

  if (!isOpen) return null;

  const handleSelectExisting = () => {
    const found = employeesList.find((e) => (e.employee_id || e.id) === selectedEmpId);
    if (found && onSelectEmployee) {
      onSelectEmployee(found);
      onClose();
    }
  };

  const handleRegisterNew = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');

    try {
      const res = await fetch('http://localhost:8000/api/v1/players/register-employee', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.employee) {
          setSuccessMsg(`Registered ${data.employee.name} (${data.employee.employee_id}) successfully with synthesized AI datasets!`);
          setTimeout(() => {
            onSelectEmployee(data.employee);
            setLoading(false);
            onClose();
          }, 800);
          return;
        }
      }
      throw new Error('Registration failed');
    } catch (err) {
      const newEmpObj = {
        id: `EMP${Math.floor(100 + Math.random() * 900)}`,
        employee_id: `EMP${Math.floor(100 + Math.random() * 900)}`,
        name: formData.name,
        department: formData.department,
        role: formData.role,
        age: Number(formData.age),
        activity_level: formData.activity_level,
        goals: formData.goals,
        mood: formData.mood,
        symptoms: formData.symptoms,
        dietary_preference: formData.dietary_preference,
        habits: formData.habits,
        points: 1250,
        tier_badge: `${formData.department} - 1250 XP`
      };
      onSelectEmployee(newEmpObj);
      setLoading(false);
      onClose();
    }
  };

  const handleInputChange = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const selectedEmpObj = employeesList.find((e) => (e.employee_id || e.id) === selectedEmpId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto font-mono">
      <div className="w-full max-w-4xl crt-monitor-frame p-6 md:p-8 shadow-[0_0_50px_rgba(77,238,234,0.4)] relative text-white my-8 crt-screen-sheen">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white bg-[#0b071e] p-2 border-2 border-[#4deeea] hover:border-[#ff007f] transition-all cursor-pointer font-pixel text-xs z-30"
        >
          ✕
        </button>

        {/* RETRO CRT MISSION BRIEFING HEADER (Directly matching reference image) */}
        <div className="text-center mb-6 space-y-3">
          <div className="text-xs md:text-sm font-pixel text-[#4deeea] tracking-widest uppercase animate-pulse">
            MISSION BRIEFING:
          </div>
          <h2 className="text-2xl md:text-4xl font-black text-white font-pixel uppercase tracking-widest drop-shadow-[0_0_12px_#ffffff]">
            ONBOARDING
          </h2>

          {/* Retro Pixel HP Energy Meter */}
          <div className="max-w-xs mx-auto pixel-hp-bar rounded-full my-2">
            <span className="text-red-500 animate-pulse text-base">❤️</span>
            <div className="flex-1 h-3 bg-[#090517] border border-[#00ff66] rounded-sm overflow-hidden">
              <div className="pixel-hp-bar-fill w-[80%]" />
            </div>
          </div>

          {/* CRT Computer Terminal Box Motif (Matching center frame in reference image) */}
          <div className="bg-[#0b071e] border-4 border-[#4deeea] p-4 md:p-6 max-w-lg mx-auto rounded-xl shadow-[0_0_20px_rgba(77,238,234,0.3)] space-y-3 relative overflow-hidden">
            <div className="text-xs md:text-sm text-[#00f0ff] font-vt323 tracking-widest">
              HI. . . . . . . . YOU'RE INVITED TO:
            </div>
            <div className="text-lg md:text-2xl font-black text-[#ffe600] font-pixel leading-relaxed uppercase tracking-wider drop-shadow-[0_0_10px_#ffe600]">
              ONBOARDING SMILEMOTION STELLAR <span className="text-red-500">❤️</span> 2026 <span className="text-red-500">❤️</span>
            </div>
          </div>

          {/* Retro Pill Badges (Directly from reference image) */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <div className="pixel-pill-badge">
              <span>📅 Friday, 13 March 2026</span>
            </div>
            <div className="pixel-pill-badge pixel-pill-badge-cyan">
              <span>⏰ 16.30 - finished</span>
            </div>
            <div className="pixel-pill-badge pixel-pill-badge-yellow">
              <span>🚀 RK 1 GD 2 FKG UNPAD</span>
            </div>
          </div>
        </div>

        {/* 2 MAIN MODE TAB BUTTONS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => setActiveTab('existing')}
            className={`p-4 border-3 flex items-center justify-center gap-3 font-black text-xs md:text-sm font-silkscreen uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'existing'
                ? 'bg-[#00f0ff] text-black border-white shadow-[0_0_20px_#00f0ff]'
                : 'bg-[#120a2e] text-gray-300 border-[#2b1b54] hover:border-[#00f0ff] hover:text-white'
            }`}
          >
            <UserCheck size={20} />
            <span>1. EXISTING EMPLOYEE</span>
          </button>

          <button
            onClick={() => setActiveTab('new')}
            className={`p-4 border-3 flex items-center justify-center gap-3 font-black text-xs md:text-sm font-silkscreen uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'new'
                ? 'bg-[#00ff66] text-black border-white shadow-[0_0_20px_#00ff66]'
                : 'bg-[#120a2e] text-gray-300 border-[#2b1b54] hover:border-[#00ff66] hover:text-white'
            }`}
          >
            <UserPlus size={20} />
            <span>2. NEW EMPLOYEE (INPUTS)</span>
          </button>
        </div>

        {/* TAB 1: EXISTING EMPLOYEE DETAILS */}
        {activeTab === 'existing' && (
          <div className="space-y-6 bg-[#120a2e] p-6 border-2 border-[#00f0ff] shadow-lg">
            <div>
              <label className="block text-xs uppercase font-bold text-[#00f0ff] tracking-wider mb-2 font-silkscreen">
                Select Registered Employee from Database:
              </label>
              <select
                value={selectedEmpId}
                onChange={(e) => setSelectedEmpId(e.target.value)}
                className="w-full px-4 py-3 bg-[#0b071e] border-2 border-[#00f0ff] text-white font-mono text-sm font-bold focus:outline-none cursor-pointer"
              >
                {employeesList.map((emp) => {
                  const idVal = emp.employee_id || emp.id;
                  return (
                    <option key={idVal} value={idVal} className="bg-[#0b071e] text-white">
                      {idVal} — {emp.name} ({emp.department} • {emp.role || 'Employee'})
                    </option>
                  );
                })}
              </select>
            </div>

            {selectedEmpObj && (
              <div className="bg-[#0b0e14] p-4 border border-purple-500/50 flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-bold text-white uppercase">{selectedEmpObj.name}</div>
                  <div className="text-xs text-[#00f0ff] font-mono mt-0.5">
                    ID: {selectedEmpObj.employee_id || selectedEmpObj.id} • {selectedEmpObj.department} • {selectedEmpObj.role || 'Staff'}
                  </div>
                  <div className="text-[11px] text-gray-400 mt-1">
                    Activity Level: <span className="text-purple-300 font-bold">{selectedEmpObj.activity_level || 'Active'}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-black text-[#00ff66]">{selectedEmpObj.points || 1200} XP</div>
                  <div className="text-[10px] text-gray-400 font-mono">GAMIFICATION LEVEL 1</div>
                </div>
              </div>
            )}

            <button
              onClick={handleSelectExisting}
              className="w-full py-3 bg-[#00f0ff] text-black font-black uppercase tracking-widest text-sm border-2 border-white hover:bg-black hover:text-[#00f0ff] transition-all shadow-[0_0_15px_rgba(0,240,255,0.4)] flex items-center justify-center gap-2"
            >
              <span>LOAD EXISTING EMPLOYEE DIGITAL TWIN</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}

        {/* TAB 2: NEW EMPLOYEE DETAILS (GOALS, MOOD, SYMPTOMS, HABITS + SYNTHETIC DATA ENGINE) */}
        {activeTab === 'new' && (
          <form onSubmit={handleRegisterNew} className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
            
            {/* Section A: Demographics */}
            <div className="bg-[#182230] p-4 border border-[#2a3442] space-y-4">
              <h3 className="text-xs font-bold text-[#00ff66] uppercase tracking-wider border-b border-gray-700 pb-2 flex items-center gap-2">
                <UserCheck size={16} />
                SECTION 1: PERSONAL & JOB DETAILS
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-300 uppercase mb-1">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 bg-[#0b0e14] border border-[#2a3442] focus:border-[#00ff66] text-xs font-mono outline-none text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-300 uppercase mb-1">Department</label>
                  <select
                    value={formData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    className="w-full px-3 py-2 bg-[#0b0e14] border border-[#2a3442] focus:border-[#00ff66] text-xs font-mono outline-none text-white cursor-pointer"
                  >
                    <option value="Alpha IT">Alpha IT</option>
                    <option value="Beta IT">Beta IT</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Operations">Operations</option>
                    <option value="Design">Design</option>
                    <option value="Finance">Finance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-300 uppercase mb-1">Job Role</label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    className="w-full px-3 py-2 bg-[#0b0e14] border border-[#2a3442] focus:border-[#00ff66] text-xs font-mono outline-none text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-300 uppercase mb-1">Age</label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                    className="w-full px-3 py-2 bg-[#0b0e14] border border-[#2a3442] focus:border-[#00ff66] text-xs font-mono outline-none text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-300 uppercase mb-1">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="w-full px-3 py-2 bg-[#0b0e14] border border-[#2a3442] focus:border-[#00ff66] text-xs font-mono outline-none text-white cursor-pointer"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non-binary">Non-binary</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-300 uppercase mb-1">Activity Level</label>
                  <select
                    value={formData.activity_level}
                    onChange={(e) => handleInputChange('activity_level', e.target.value)}
                    className="w-full px-3 py-2 bg-[#0b0e14] border border-[#2a3442] focus:border-[#00ff66] text-xs font-mono outline-none text-white cursor-pointer"
                  >
                    <option value="Sedentary">Sedentary</option>
                    <option value="Lightly Active">Lightly Active</option>
                    <option value="Moderately Active">Moderately Active</option>
                    <option value="Very Active">Very Active</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section B: EMPLOYEE INPUTS (Slide 16 Architecture: Goals, Mood, Symptoms, Habits, Diet) */}
            <div className="bg-[#182230] p-4 border border-[#00f0ff]/60 space-y-4 shadow-[0_0_15px_rgba(0,240,255,0.1)]">
              <div className="flex items-center justify-between border-b border-[#00f0ff]/30 pb-2">
                <h3 className="text-xs font-bold text-[#00f0ff] uppercase tracking-wider flex items-center gap-2">
                  <Target size={16} />
                  SECTION 2: EMPLOYEE INPUTS (SLIDE 16 ARCHITECTURE)
                </h3>
                <span className="text-[10px] text-[#00ff66] font-mono bg-[#00ff66]/10 px-2.5 py-0.5 border border-[#00ff66]">
                  USER-FRIENDLY SELECTIONS
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Goals */}
                <div>
                  <label className="block text-[11px] font-bold text-[#00f0ff] uppercase mb-1 flex items-center gap-1.5">
                    <Target size={14} />
                    Primary Health Goal
                  </label>
                  <select
                    value={formData.goals}
                    onChange={(e) => handleInputChange('goals', e.target.value)}
                    className="w-full px-3 py-2 bg-[#0b0e14] border-2 border-[#00f0ff]/60 focus:border-[#00f0ff] text-xs font-mono outline-none text-white cursor-pointer"
                  >
                    <option value="Weight Loss & Fat Burn">🎯 Weight Loss & Fat Burn (Calorie Deficit)</option>
                    <option value="Muscle Building & Strength">💪 Muscle Building & Strength (High Protein)</option>
                    <option value="Burnout Prevention & Stress Relief">🧘 Burnout Prevention & Stress Relief</option>
                    <option value="Energy Boost & Focus">⚡ Energy Boost & Peak Workplace Focus</option>
                    <option value="Heart & Metabolic Health">❤️ Heart & Metabolic Health</option>
                  </select>
                </div>

                {/* 2. Mood */}
                <div>
                  <label className="block text-[11px] font-bold text-yellow-300 uppercase mb-1 flex items-center gap-1.5">
                    <Smile size={14} />
                    Current Workplace Mood
                  </label>
                  <select
                    value={formData.mood}
                    onChange={(e) => handleInputChange('mood', e.target.value)}
                    className="w-full px-3 py-2 bg-[#0b0e14] border border-[#2a3442] focus:border-yellow-400 text-xs font-mono outline-none text-white cursor-pointer"
                  >
                    <option value="Energetic & Focused">😊 Energetic & Focused</option>
                    <option value="Slightly Tired / Fatigued">😴 Slightly Tired / Fatigued</option>
                    <option value="Stressed / Overwhelmed">🤯 Stressed / Overwhelmed</option>
                    <option value="Calm & Balanced">🧘 Calm & Balanced</option>
                  </select>
                </div>

                {/* 3. Symptoms */}
                <div>
                  <label className="block text-[11px] font-bold text-red-300 uppercase mb-1 flex items-center gap-1.5">
                    <AlertCircle size={14} />
                    Physical Symptoms / Discomforts
                  </label>
                  <select
                    value={formData.symptoms}
                    onChange={(e) => handleInputChange('symptoms', e.target.value)}
                    className="w-full px-3 py-2 bg-[#0b0e14] border border-[#2a3442] focus:border-red-400 text-xs font-mono outline-none text-white cursor-pointer"
                  >
                    <option value="None / Healthy">🟢 None / Feeling Healthy</option>
                    <option value="Eye Strain / Headaches">💻 Eye Strain / Headaches (Screen Fatigue)</option>
                    <option value="Lower Back Stiffness">🪑 Lower Back Stiffness (Posture Strain)</option>
                    <option value="Leg Fatigue / Soreness">🦵 Leg Fatigue / Muscle Soreness</option>
                    <option value="Insomnia / Poor Sleep">🌙 Insomnia / Poor Sleep Recovery</option>
                  </select>
                </div>

                {/* 4. Dietary Preference */}
                <div>
                  <label className="block text-[11px] font-bold text-purple-300 uppercase mb-1 flex items-center gap-1.5">
                    <Utensils size={14} />
                    Dietary Preference
                  </label>
                  <select
                    value={formData.dietary_preference}
                    onChange={(e) => handleInputChange('dietary_preference', e.target.value)}
                    className="w-full px-3 py-2 bg-[#0b0e14] border border-[#2a3442] focus:border-purple-400 text-xs font-mono outline-none text-white cursor-pointer"
                  >
                    <option value="High Protein">🥗 High Protein</option>
                    <option value="Balanced">🍲 Balanced</option>
                    <option value="Keto / Low Carb">🥑 Keto / Low Carb</option>
                    <option value="Vegetarian">🌿 Vegetarian</option>
                    <option value="Vegan">🍃 Vegan</option>
                  </select>
                </div>
              </div>

              {/* 5. Habits */}
              <div>
                <label className="block text-[11px] font-bold text-gray-300 uppercase mb-1">
                  Daily Habits & Routine Notes
                </label>
                <input
                  type="text"
                  value={formData.habits}
                  onChange={(e) => handleInputChange('habits', e.target.value)}
                  placeholder="e.g. Coffee 2 cups/day, Desk Job, Regular Hydration"
                  className="w-full px-3 py-2 bg-[#0b0e14] border border-[#2a3442] focus:border-[#00f0ff] text-xs font-mono outline-none text-white"
                />
              </div>
            </div>

            {/* Section C: AUTOMATIC SYNTHETIC DATA GENERATOR TOGGLE */}
            <div className="bg-[#141d2b] border border-purple-500/50 p-4 space-y-3">
              <div
                onClick={() => setShowAdvancedSynthetic(!showAdvancedSynthetic)}
                className="flex items-center justify-between cursor-pointer select-none"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="text-purple-400 animate-pulse" size={18} />
                  <div>
                    <div className="text-xs font-bold text-purple-300 uppercase flex items-center gap-2">
                      AUTOMATIC SYNTHETIC DATA ENGINE ACTIVE
                      <span className="text-[10px] text-[#00ff66] bg-[#00ff66]/10 px-2 py-0.5 border border-[#00ff66]">
                        WEARABLE IoT + HRMS + CLINICAL
                      </span>
                    </div>
                    <div className="text-[10px] text-gray-400 mt-0.5">
                      Wearable IoT, HRMS, and Clinical metrics are automatically synthesized based on selected Goal, Mood & Symptoms.
                    </div>
                  </div>
                </div>
                {showAdvancedSynthetic ? <ChevronUp size={18} className="text-purple-300" /> : <ChevronDown size={18} className="text-purple-300" />}
              </div>

              {showAdvancedSynthetic && (
                <div className="pt-3 border-t border-purple-500/30 space-y-4 animate-fadeIn">
                  <div className="text-[11px] text-gray-300 italic">
                    Optional: Preview or customize auto-generated Wearable IoT & Clinical Parameters:
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Heart Rate (BPM)</label>
                      <input
                        type="number"
                        placeholder="Auto (72)"
                        value={formData.heart_rate || ''}
                        onChange={(e) => handleInputChange('heart_rate', e.target.value ? Number(e.target.value) : null)}
                        className="w-full px-2.5 py-1.5 bg-[#0b0e14] border border-[#2a3442] text-xs font-mono text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Sleep Hours</label>
                      <input
                        type="number"
                        step="0.1"
                        placeholder="Auto (7.5)"
                        value={formData.sleep_hours || ''}
                        onChange={(e) => handleInputChange('sleep_hours', e.target.value ? Number(e.target.value) : null)}
                        className="w-full px-2.5 py-1.5 bg-[#0b0e14] border border-[#2a3442] text-xs font-mono text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Daily Steps</label>
                      <input
                        type="number"
                        placeholder="Auto (9200)"
                        value={formData.step_count || ''}
                        onChange={(e) => handleInputChange('step_count', e.target.value ? Number(e.target.value) : null)}
                        className="w-full px-2.5 py-1.5 bg-[#0b0e14] border border-[#2a3442] text-xs font-mono text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Stress Level (1-10)</label>
                      <input
                        type="number"
                        step="0.5"
                        placeholder="Auto (3.5)"
                        value={formData.stress_level || ''}
                        onChange={(e) => handleInputChange('stress_level', e.target.value ? Number(e.target.value) : null)}
                        className="w-full px-2.5 py-1.5 bg-[#0b0e14] border border-[#2a3442] text-xs font-mono text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Systolic BP</label>
                      <input
                        type="number"
                        placeholder="Auto (120)"
                        value={formData.systolic_bp || ''}
                        onChange={(e) => handleInputChange('systolic_bp', e.target.value ? Number(e.target.value) : null)}
                        className="w-full px-2.5 py-1.5 bg-[#0b0e14] border border-[#2a3442] text-xs font-mono text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Diastolic BP</label>
                      <input
                        type="number"
                        placeholder="Auto (80)"
                        value={formData.diastolic_bp || ''}
                        onChange={(e) => handleInputChange('diastolic_bp', e.target.value ? Number(e.target.value) : null)}
                        className="w-full px-2.5 py-1.5 bg-[#0b0e14] border border-[#2a3442] text-xs font-mono text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">BMI (kg/m²)</label>
                      <input
                        type="number"
                        step="0.1"
                        placeholder="Auto (23.5)"
                        value={formData.bmi || ''}
                        onChange={(e) => handleInputChange('bmi', e.target.value ? Number(e.target.value) : null)}
                        className="w-full px-2.5 py-1.5 bg-[#0b0e14] border border-[#2a3442] text-xs font-mono text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Glucose (mg/dL)</label>
                      <input
                        type="number"
                        placeholder="Auto (95)"
                        value={formData.glucose || ''}
                        onChange={(e) => handleInputChange('glucose', e.target.value ? Number(e.target.value) : null)}
                        className="w-full px-2.5 py-1.5 bg-[#0b0e14] border border-[#2a3442] text-xs font-mono text-white"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {successMsg && (
              <div className="p-3 bg-[#00ff66]/20 border border-[#00ff66] text-[#00ff66] text-xs font-bold text-center">
                {successMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#00ff66] text-black font-black uppercase tracking-widest text-sm border-2 border-white hover:bg-black hover:text-[#00ff66] transition-all shadow-[0_0_20px_rgba(0,255,102,0.4)] flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap size={18} />
              <span>{loading ? 'SYNTHESIZING WEARABLE DATA & RUNNING AI MODELS...' : '⚡ COMPUTE AI DIGITAL TWIN & SUBMIT EMPLOYEE GOALS'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
