import React, { useState, useEffect } from 'react';
import { UserCheck, UserPlus, Shield, Activity, Heart, Moon, Zap, Flame, CheckCircle2, ArrowRight, X } from 'lucide-react';

export default function EmployeeOnboardingModal({ isOpen, onClose, onSelectEmployee }) {
  const [activeTab, setActiveTab] = useState('existing'); // 'existing' | 'new'
  const [employeesList, setEmployeesList] = useState([]);
  const [selectedEmpId, setSelectedEmpId] = useState('EMP001');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // New Employee Form Inputs
  const [formData, setFormData] = useState({
    name: 'Rajarajan S',
    department: 'Alpha IT',
    role: 'Lead AI Engineer',
    age: 28,
    gender: 'Male',
    activity_level: 'Moderately Active',
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
          setSuccessMsg(`Registered ${data.employee.name} (${data.employee.employee_id}) successfully!`);
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
      // Fallback local registration
      const newEmpObj = {
        id: `EMP${Math.floor(100 + Math.random() * 900)}`,
        employee_id: `EMP${Math.floor(100 + Math.random() * 900)}`,
        name: formData.name,
        department: formData.department,
        role: formData.role,
        age: Number(formData.age),
        activity_level: formData.activity_level,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-4xl bg-[#121820] border-2 border-[#00f0ff] p-6 shadow-[0_0_40px_rgba(0,240,255,0.3)] relative text-white my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white bg-[#182230] p-1.5 border border-[#2a3442] hover:border-[#00f0ff] transition-all"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center gap-2 px-3 py-1 bg-[#00f0ff]/10 border border-[#00f0ff] text-[#00f0ff] text-xs font-bold uppercase tracking-widest mb-2">
            <Shield size={14} />
            EMPLOYEE ACCESS & ONBOARDING PORTAL
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-wider">
            Select or Register Employee Profile
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Choose an existing registered employee or register a new employee with physiological & clinical metrics.
          </p>
        </div>

        {/* 2 MAIN MODE TAB BUTTONS */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => setActiveTab('existing')}
            className={`p-4 border-2 flex items-center justify-center gap-3 font-black text-sm uppercase tracking-wider transition-all ${
              activeTab === 'existing'
                ? 'bg-[#00f0ff] text-black border-white shadow-[0_0_20px_#00f0ff]'
                : 'bg-[#182230] text-gray-400 border-[#2a3442] hover:border-[#00f0ff] hover:text-white'
            }`}
          >
            <UserCheck size={22} />
            <span>1. EXISTING EMPLOYEE DETAILS</span>
          </button>

          <button
            onClick={() => setActiveTab('new')}
            className={`p-4 border-2 flex items-center justify-center gap-3 font-black text-sm uppercase tracking-wider transition-all ${
              activeTab === 'new'
                ? 'bg-[#00ff66] text-black border-white shadow-[0_0_20px_#00ff66]'
                : 'bg-[#182230] text-gray-400 border-[#2a3442] hover:border-[#00ff66] hover:text-white'
            }`}
          >
            <UserPlus size={22} />
            <span>2. NEW EMPLOYEE DETAILS (ALL INPUTS)</span>
          </button>
        </div>

        {/* TAB 1: EXISTING EMPLOYEE DETAILS */}
        {activeTab === 'existing' && (
          <div className="space-y-6 bg-[#182230] p-6 border border-[#2a3442]">
            <div>
              <label className="block text-xs uppercase font-bold text-[#00f0ff] tracking-wider mb-2">
                Select Registered Employee from Database:
              </label>
              <select
                value={selectedEmpId}
                onChange={(e) => setSelectedEmpId(e.target.value)}
                className="w-full px-4 py-3 bg-[#0b0e14] border-2 border-[#00f0ff] text-white font-mono text-sm font-bold focus:outline-none"
              >
                {employeesList.map((emp) => {
                  const idVal = emp.employee_id || emp.id;
                  return (
                    <option key={idVal} value={idVal} className="bg-[#141923] text-white">
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

        {/* TAB 2: NEW EMPLOYEE DETAILS (ALL NEEDED INPUTS) */}
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
                    className="w-full px-3 py-2 bg-[#0b0e14] border border-[#2a3442] focus:border-[#00ff66] text-xs font-mono outline-none text-white"
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
                    className="w-full px-3 py-2 bg-[#0b0e14] border border-[#2a3442] focus:border-[#00ff66] text-xs font-mono outline-none text-white"
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
                    className="w-full px-3 py-2 bg-[#0b0e14] border border-[#2a3442] focus:border-[#00ff66] text-xs font-mono outline-none text-white"
                  >
                    <option value="Sedentary">Sedentary</option>
                    <option value="Lightly Active">Lightly Active</option>
                    <option value="Moderately Active">Moderately Active</option>
                    <option value="Very Active">Very Active</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section B: Wearables & Physiological Metrics */}
            <div className="bg-[#182230] p-4 border border-[#2a3442] space-y-4">
              <h3 className="text-xs font-bold text-[#00f0ff] uppercase tracking-wider border-b border-gray-700 pb-2 flex items-center gap-2">
                <Heart size={16} />
                SECTION 2: WEARABLE & PHYSIOLOGICAL METRICS
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-300 uppercase mb-1">Heart Rate (BPM)</label>
                  <input
                    type="number"
                    value={formData.heart_rate}
                    onChange={(e) => handleInputChange('heart_rate', e.target.value)}
                    className="w-full px-3 py-2 bg-[#0b0e14] border border-[#2a3442] focus:border-[#00f0ff] text-xs font-mono outline-none text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-300 uppercase mb-1">Sleep Hours (hrs/night)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.sleep_hours}
                    onChange={(e) => handleInputChange('sleep_hours', e.target.value)}
                    className="w-full px-3 py-2 bg-[#0b0e14] border border-[#2a3442] focus:border-[#00f0ff] text-xs font-mono outline-none text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-300 uppercase mb-1">Daily Steps</label>
                  <input
                    type="number"
                    value={formData.step_count}
                    onChange={(e) => handleInputChange('step_count', e.target.value)}
                    className="w-full px-3 py-2 bg-[#0b0e14] border border-[#2a3442] focus:border-[#00f0ff] text-xs font-mono outline-none text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-300 uppercase mb-1">Calorie Intake (kcal)</label>
                  <input
                    type="number"
                    value={formData.calories_burned}
                    onChange={(e) => handleInputChange('calories_burned', e.target.value)}
                    className="w-full px-3 py-2 bg-[#0b0e14] border border-[#2a3442] focus:border-[#00f0ff] text-xs font-mono outline-none text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-300 uppercase mb-1">Stress Level (1-10)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    max="10"
                    value={formData.stress_level}
                    onChange={(e) => handleInputChange('stress_level', e.target.value)}
                    className="w-full px-3 py-2 bg-[#0b0e14] border border-[#2a3442] focus:border-[#00f0ff] text-xs font-mono outline-none text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-300 uppercase mb-1">SpO2 Oxygen (%)</label>
                  <input
                    type="number"
                    value={formData.spo2}
                    onChange={(e) => handleInputChange('spo2', e.target.value)}
                    className="w-full px-3 py-2 bg-[#0b0e14] border border-[#2a3442] focus:border-[#00f0ff] text-xs font-mono outline-none text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-300 uppercase mb-1">Sleep Quality (0-100)</label>
                  <input
                    type="number"
                    value={formData.sleep_quality_score}
                    onChange={(e) => handleInputChange('sleep_quality_score', e.target.value)}
                    className="w-full px-3 py-2 bg-[#0b0e14] border border-[#2a3442] focus:border-[#00f0ff] text-xs font-mono outline-none text-white"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Section C: Clinical & Lifestyle Parameters */}
            <div className="bg-[#182230] p-4 border border-[#2a3442] space-y-4">
              <h3 className="text-xs font-bold text-purple-300 uppercase tracking-wider border-b border-gray-700 pb-2 flex items-center gap-2">
                <Activity size={16} />
                SECTION 3: CLINICAL & LIFESTYLE PARAMETERS
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-300 uppercase mb-1">Systolic BP (mmHg)</label>
                  <input
                    type="number"
                    value={formData.systolic_bp}
                    onChange={(e) => handleInputChange('systolic_bp', e.target.value)}
                    className="w-full px-3 py-2 bg-[#0b0e14] border border-[#2a3442] focus:border-purple-400 text-xs font-mono outline-none text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-300 uppercase mb-1">Diastolic BP (mmHg)</label>
                  <input
                    type="number"
                    value={formData.diastolic_bp}
                    onChange={(e) => handleInputChange('diastolic_bp', e.target.value)}
                    className="w-full px-3 py-2 bg-[#0b0e14] border border-[#2a3442] focus:border-purple-400 text-xs font-mono outline-none text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-300 uppercase mb-1">BMI (kg/m²)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.bmi}
                    onChange={(e) => handleInputChange('bmi', e.target.value)}
                    className="w-full px-3 py-2 bg-[#0b0e14] border border-[#2a3442] focus:border-purple-400 text-xs font-mono outline-none text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-300 uppercase mb-1">Glucose (mg/dL)</label>
                  <input
                    type="number"
                    value={formData.glucose}
                    onChange={(e) => handleInputChange('glucose', e.target.value)}
                    className="w-full px-3 py-2 bg-[#0b0e14] border border-[#2a3442] focus:border-purple-400 text-xs font-mono outline-none text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-300 uppercase mb-1">Workload (hrs/wk)</label>
                  <input
                    type="number"
                    value={formData.workload_hours_per_week}
                    onChange={(e) => handleInputChange('workload_hours_per_week', e.target.value)}
                    className="w-full px-3 py-2 bg-[#0b0e14] border border-[#2a3442] focus:border-purple-400 text-xs font-mono outline-none text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-300 uppercase mb-1">Exercise (hrs/wk)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.physical_activity_hours}
                    onChange={(e) => handleInputChange('physical_activity_hours', e.target.value)}
                    className="w-full px-3 py-2 bg-[#0b0e14] border border-[#2a3442] focus:border-purple-400 text-xs font-mono outline-none text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-300 uppercase mb-1">Water Intake (L/day)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.water_intake_l}
                    onChange={(e) => handleInputChange('water_intake_l', e.target.value)}
                    className="w-full px-3 py-2 bg-[#0b0e14] border border-[#2a3442] focus:border-purple-400 text-xs font-mono outline-none text-white"
                    required
                  />
                </div>
              </div>
            </div>

            {successMsg && (
              <div className="p-3 bg-[#00ff66]/20 border border-[#00ff66] text-[#00ff66] text-xs font-bold text-center">
                {successMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#00ff66] text-black font-black uppercase tracking-widest text-sm border-2 border-white hover:bg-black hover:text-[#00ff66] transition-all shadow-[0_0_20px_rgba(0,255,102,0.4)] flex items-center justify-center gap-2"
            >
              <Zap size={18} />
              <span>{loading ? 'RUNNING XGBOOST & K-MEANS AI MODELS...' : '⚡ COMPUTE AI DIGITAL TWIN & SUBMIT ALL INPUTS'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
