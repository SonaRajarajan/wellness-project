import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Swords, Trees, Video, User, Utensils, HeartPulse, Bot, Trophy, Users, LayoutDashboard, Building2, UserCheck, UserPlus, Lock, Unlock } from 'lucide-react';

const DEFAULT_EMPLOYEES = [
  { id: 'EMP001', employee_id: 'EMP001', name: 'Sona VR', department: 'Alpha IT', role: 'Lead AI Engineer' },
  { id: 'EMP002', employee_id: 'EMP002', name: 'Priya Kapoor', department: 'Beta IT', role: 'Data Analyst' },
  { id: 'EMP003', employee_id: 'EMP003', name: 'Kavya Patel', department: 'Engineering', role: 'DevOps Engineer' },
  { id: 'EMP004', employee_id: 'EMP004', name: 'Raj Verma', department: 'Operations', role: 'Ops Manager' },
  { id: 'EMP005', employee_id: 'EMP005', name: 'Amit Sharma', department: 'Design', role: 'UI/UX Designer' }
];

export default function Navbar({ user, onSelectEmployee, onLogout, onOpenOnboarding, isHrAuthenticated, onOpenHrPinModal, onLockHr }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [employeesList, setEmployeesList] = useState(DEFAULT_EMPLOYEES);

  // Fetch all registered employees dynamically from backend API /api/v1/players
  useEffect(() => {
    fetch('http://localhost:8000/api/v1/players')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.players && data.players.length > 0) {
          setEmployeesList(data.players);
        }
      })
      .catch(() => {});
  }, []);

  // Feature section links for Employee Dashboard (personal features only)
  const sectionLinks = [
    { path: '/digital-twin', label: 'Digital Twin', icon: User },
    { path: '/rivals', label: 'Rivals', icon: Swords },
    { path: '/jungle', label: 'Jungle', icon: Trees },
    { path: '/exercise', label: 'Exercise CV', icon: Video },
    { path: '/food', label: 'Food Recs', icon: Utensils },
    { path: '/health', label: 'Health Tasks', icon: HeartPulse },
    { path: '/coach', label: 'GenAI Coach', icon: Bot },
  ];

  const currentEmpId = user?.employee_id || user?.id || 'EMP001';
  const userName = user?.name || 'Sona VR';
  const userDept = user?.department || 'Alpha IT';

  const handleDropdownChange = (e) => {
    const selectedId = e.target.value;
    const found = employeesList.find((emp) => (emp.employee_id || emp.id) === selectedId);
    if (found && onSelectEmployee) {
      onSelectEmployee(found);
    }
  };

  const handleEmployeeDashboardClick = (e) => {
    e.preventDefault();
    if (isHrAuthenticated && onLockHr) {
      onLockHr('/digital-twin');
    } else {
      navigate('/digital-twin');
    }
  };

  const handleSectionLinkClick = (e, targetPath) => {
    if (isHrAuthenticated && onLockHr) {
      e.preventDefault();
      onLockHr(targetPath);
    }
  };

  const handleHrDashboardClick = (e) => {
    e.preventDefault();
    if (!isHrAuthenticated) {
      if (onOpenHrPinModal) onOpenHrPinModal('/hr-dashboard');
    } else {
      navigate('/hr-dashboard');
    }
  };

  return (
    <nav className="bg-[#0b071e]/90 backdrop-blur-md border-b-4 border-[#ff007f] px-4 py-3 sticky top-0 z-50 shadow-[0_0_30px_rgba(255,0,127,0.3)] font-mono">
      <div className="max-w-7xl mx-auto flex flex-col space-y-3">
        {/* TOP BAR: Brand Logo + Prominent 2 Dashboard Buttons + Active Profile / HR Switcher */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-3 pb-2 border-b border-[#2b1b54]">
          {/* Logo & Pixel HP Meter */}
          <div className="flex items-center gap-4">
            <Link to="/digital-twin" onClick={(e) => handleSectionLinkClick(e, '/digital-twin')} className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 bg-[#ff007f] text-white font-black text-lg flex items-center justify-center border-2 border-white shadow-[0_0_15px_#ff007f] font-pixel">
                👾
              </div>
              <div>
                <span className="text-base md:text-lg font-black tracking-widest text-[#ffe600] font-pixel group-hover:text-[#00f0ff] transition-colors drop-shadow-[0_0_8px_#ffe600]">
                  PIXEL DASH
                </span>
                <span className="text-[10px] text-[#00f0ff] block -mt-0.5 font-mono tracking-widest">
                  STELLAR 2026 HUB
                </span>
              </div>
            </Link>

            {/* Retro Pixel HP Energy Meter */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-[#0d0724] border-2 border-[#00ff66] rounded-full shadow-[0_0_10px_rgba(0,255,102,0.3)] text-xs font-mono">
              <span className="text-red-500 animate-pulse">❤️</span>
              <span className="text-[10px] text-[#00ff66] font-bold">HP</span>
              <div className="w-16 h-2.5 bg-[#090517] border border-[#00ff66] rounded-sm overflow-hidden">
                <div className="h-full w-4/5 bg-gradient-to-r from-[#00ff66] via-[#ffe600] to-[#ff007f]" />
              </div>
              <span className="text-[10px] text-white font-black">80%</span>
            </div>
          </div>

          {/* 🌟 PROMINENT DASHBOARD BUTTONS 🌟 */}
          <div className="flex items-center gap-2.5">
            {/* Employee Dashboard Button (Auto-locks HR mode when clicked) */}
            <button
              onClick={handleEmployeeDashboardClick}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-black uppercase tracking-wider transition-all cursor-pointer font-silkscreen ${
                location.pathname !== '/hr-dashboard'
                  ? 'bg-[#00f0ff] text-black border-2 border-white shadow-[0_0_15px_#00f0ff] scale-105'
                  : 'bg-[#120a2e] text-[#00f0ff] border-2 border-[#00f0ff]/60 hover:bg-[#00f0ff] hover:text-black'
              }`}
            >
              <LayoutDashboard size={16} />
              <span>EMPLOYEE TWIN</span>
            </button>

            {/* HR Enterprise Dashboard Button (Protected by HR01S PIN) */}
            <button
              onClick={handleHrDashboardClick}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-black uppercase tracking-wider transition-all cursor-pointer font-silkscreen ${
                location.pathname === '/hr-dashboard'
                  ? 'bg-[#00ff66] text-black border-2 border-white shadow-[0_0_15px_#00ff66] scale-105'
                  : 'bg-[#120a2e] text-[#00ff66] border-2 border-[#00ff66]/60 hover:bg-[#00ff66] hover:text-black'
              }`}
            >
              <Building2 size={16} />
              <span>HR COMMAND</span>
              {isHrAuthenticated ? (
                <span className="ml-1 px-1.5 py-0.5 bg-black/60 text-[9px] text-[#00ff66] border border-[#00ff66] font-mono">
                  UNLOCKED
                </span>
              ) : (
                <Lock size={13} className="text-red-400 animate-pulse ml-0.5" />
              )}
            </button>
          </div>

          {/* 🌟 USER / HR SWITCHER & ONBOARDING 🌟 */}
          <div className="flex flex-wrap items-center gap-2">
            {isHrAuthenticated ? (
              <>
                <button
                  onClick={() => onLockHr('/digital-twin')}
                  title="Lock HR Security Mode"
                  className="flex items-center gap-1 px-2.5 py-1.5 bg-red-950 border-2 border-red-500 text-red-300 hover:bg-red-600 hover:text-white text-xs font-bold font-mono transition-all cursor-pointer shadow-[0_0_10px_rgba(239,68,68,0.4)]"
                >
                  <Lock size={12} />
                  <span>LOCK HR</span>
                </button>

                <div className="flex items-center gap-1.5 bg-[#120a2e] border-2 border-[#00f0ff] px-2.5 py-1.5 rounded-lg shadow-[0_0_10px_rgba(0,240,255,0.3)]">
                  <UserCheck size={15} className="text-[#00f0ff]" />
                  <select
                    value={currentEmpId}
                    onChange={handleDropdownChange}
                    className="bg-transparent text-white font-mono text-xs font-bold focus:outline-none cursor-pointer pr-1 max-w-[180px]"
                  >
                    {employeesList.map((emp) => {
                      const empIdVal = emp.employee_id || emp.id;
                      return (
                        <option key={empIdVal} value={empIdVal} className="bg-[#120a2e] text-white">
                          {empIdVal} — {emp.name}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2 bg-[#120a2e] border-2 border-[#00f0ff]/60 px-3 py-1.5 rounded-lg text-xs font-mono shadow-[0_0_10px_rgba(0,240,255,0.2)]">
                <UserCheck size={15} className="text-[#00f0ff]" />
                <span className="text-[#00ff66] font-bold">{userName}</span>
                <span className="text-[#ffe600] text-[10px]">({currentEmpId})</span>
              </div>
            )}

            <button
              onClick={onOpenOnboarding}
              className="flex items-center gap-1 px-3 py-1.5 bg-[#ff007f] text-white border-2 border-white hover:bg-white hover:text-[#ff007f] font-black text-xs uppercase tracking-wider transition-all shadow-[0_0_12px_rgba(255,0,127,0.5)] cursor-pointer font-silkscreen"
            >
              <UserPlus size={14} />
              <span>ONBOARD</span>
            </button>

            <button
              onClick={onLogout}
              className="px-2.5 py-1.5 bg-red-950/80 border border-red-500 text-red-300 hover:bg-red-600 hover:text-white text-xs font-bold transition-all cursor-pointer font-mono"
            >
              EXIT
            </button>
          </div>
        </div>

        {/* BOTTOM ROW: Employee Personal Feature Section Navigation Links (Hidden on HR Dashboard) */}
        {location.pathname !== '/hr-dashboard' && (
          <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
            {sectionLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={(e) => handleSectionLinkClick(e, link.path)}
                  className={`flex items-center gap-1.5 px-3 py-1 border-2 text-[11px] font-bold uppercase tracking-wider transition-all font-silkscreen ${
                    isActive
                      ? 'bg-[#ff007f] text-white border-white shadow-[0_0_12px_#ff007f] scale-105'
                      : 'bg-[#120a2e] text-gray-300 border-[#2b1b54] hover:border-[#00f0ff] hover:text-[#00f0ff]'
                  }`}
                >
                  <Icon size={12} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
}

