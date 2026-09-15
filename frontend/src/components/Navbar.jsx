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
    <nav className="bg-[#0e131b] border-b-2 border-[#00f0ff] px-4 py-3 sticky top-0 z-50 shadow-[0_4px_25px_rgba(0,240,255,0.2)] font-mono">
      <div className="max-w-7xl mx-auto flex flex-col space-y-3">
        {/* TOP BAR: Brand Logo + Prominent 2 Dashboard Buttons + Active Profile / HR Switcher */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 pb-2 border-b border-[#2a3442]">
          {/* Logo */}
          <Link to="/digital-twin" onClick={(e) => handleSectionLinkClick(e, '/digital-twin')} className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-[#00f0ff] text-black font-black text-lg flex items-center justify-center border-2 border-white shadow-[0_0_12px_#00f0ff]">
              PD
            </div>
            <div>
              <span className="text-xl font-black tracking-widest text-[#00f0ff] group-hover:text-white transition-colors">
                PIXEL DASH
              </span>
              <span className="text-[10px] text-gray-400 block -mt-1 font-mono tracking-widest">
                AI WORKFORCE WELLNESS
              </span>
            </div>
          </Link>

          {/* 🌟 PROMINENT DASHBOARD BUTTONS 🌟 */}
          <div className="flex items-center gap-3">
            {/* Employee Dashboard Button (Auto-locks HR mode when clicked) */}
            <button
              onClick={handleEmployeeDashboardClick}
              className={`flex items-center gap-2 px-4 py-2 text-xs md:text-sm font-black uppercase tracking-wider border-2 transition-all shadow-md cursor-pointer ${
                location.pathname !== '/hr-dashboard'
                  ? 'bg-[#00f0ff] text-black border-white shadow-[0_0_15px_#00f0ff] scale-105'
                  : 'bg-[#141c28] text-[#00f0ff] border-[#00f0ff]/60 hover:bg-[#00f0ff] hover:text-black hover:scale-105'
              }`}
            >
              <LayoutDashboard size={18} />
              <span>📱 EMPLOYEE DASHBOARD</span>
            </button>

            {/* HR Enterprise Dashboard Button (Protected by HR01S PIN) */}
            <button
              onClick={handleHrDashboardClick}
              className={`flex items-center gap-2 px-4 py-2 text-xs md:text-sm font-black uppercase tracking-wider border-2 transition-all shadow-md cursor-pointer ${
                location.pathname === '/hr-dashboard'
                  ? 'bg-[#00ff66] text-black border-white shadow-[0_0_15px_#00ff66] scale-105'
                  : 'bg-[#14261d] text-[#00ff66] border-[#00ff66]/60 hover:bg-[#00ff66] hover:text-black hover:scale-105'
              }`}
            >
              <Building2 size={18} />
              <span>🏢 HR DASHBOARD</span>
              {isHrAuthenticated ? (
                <span className="ml-1 px-1.5 py-0.5 bg-black/40 text-[10px] text-[#00ff66] border border-[#00ff66] rounded font-mono">
                  VERIFIED
                </span>
              ) : (
                <Lock size={14} className="text-red-400 animate-pulse ml-1" />
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
                  className="flex items-center gap-1 px-2.5 py-1.5 bg-red-950/80 border border-red-500 text-red-300 hover:bg-red-600 hover:text-white text-[11px] font-bold font-mono transition-all cursor-pointer shadow-[0_0_10px_rgba(239,68,68,0.4)]"
                >
                  <Lock size={12} />
                  <span>LOCK HR</span>
                </button>

                <div className="flex items-center gap-1.5 bg-[#16202e] border-2 border-[#00f0ff] px-2.5 py-1.5 rounded shadow-[0_0_10px_rgba(0,240,255,0.3)]">
                  <UserCheck size={16} className="text-[#00f0ff]" />
                  <select
                    value={currentEmpId}
                    onChange={handleDropdownChange}
                    className="bg-transparent text-white font-mono text-xs font-bold focus:outline-none cursor-pointer pr-1 max-w-[180px]"
                  >
                    {employeesList.map((emp) => {
                      const empIdVal = emp.employee_id || emp.id;
                      return (
                        <option key={empIdVal} value={empIdVal} className="bg-[#141923] text-white">
                          {empIdVal} — {emp.name}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2 bg-[#16202e] border border-[#00f0ff]/50 px-3 py-1.5 rounded text-xs font-mono">
                <UserCheck size={16} className="text-[#00f0ff]" />
                <span className="text-[#00ff66] font-bold">{userName}</span>
                <span className="text-gray-400 text-[10px]">({currentEmpId})</span>
              </div>
            )}

            <button
              onClick={onOpenOnboarding}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#00ff66]/10 border-2 border-[#00ff66] text-[#00ff66] hover:bg-[#00ff66] hover:text-black font-black text-xs uppercase tracking-wider transition-all shadow-[0_0_12px_rgba(0,255,102,0.3)] cursor-pointer"
            >
              <UserPlus size={15} />
              <span>⚡ ONBOARD</span>
            </button>

            <button
              onClick={onLogout}
              className="px-3 py-1.5 bg-red-900/70 border border-red-500 text-red-300 hover:bg-red-600 hover:text-white text-xs font-bold transition-all cursor-pointer"
            >
              LOGOUT
            </button>
          </div>
        </div>

        {/* BOTTOM ROW: Employee Personal Feature Section Navigation Links */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
          {sectionLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={(e) => handleSectionLinkClick(e, link.path)}
                className={`flex items-center gap-1 px-3 py-1 border text-[11px] font-semibold uppercase tracking-wider transition-all ${
                  isActive
                    ? 'bg-[#182638] text-[#00f0ff] border-[#00f0ff] font-bold shadow-[0_0_6px_#00f0ff]'
                    : 'bg-[#141923] text-gray-400 border-[#2a3442] hover:border-gray-400 hover:text-white'
                }`}
              >
                <Icon size={13} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

