import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Swords, Trees, Video, User, Utensils, HeartPulse, Bot, Trophy, Users, LayoutDashboard, Building2, UserCheck, UserPlus, Lock, Unlock, Sparkles, Heart, BarChart3 } from 'lucide-react';
import { getEmployeeAvatar } from '../utils/avatars';

const DEFAULT_EMPLOYEES = [
  { id: 'EMP001', employee_id: 'EMP001', name: 'Sona VR', department: 'Alpha IT', role: 'Lead AI Engineer' },
  { id: 'EMP002', employee_id: 'EMP002', name: 'Priya Kapoor', department: 'Beta IT', role: 'Data Analyst' },
  { id: 'EMP003', employee_id: 'EMP003', name: 'Kavya Patel', department: 'Engineering', role: 'DevOps Engineer' },
  { id: 'EMP004', employee_id: 'EMP004', name: 'Raj Verma', department: 'Operations', role: 'Ops Manager' },
  { id: 'EMP005', employee_id: 'EMP005', name: 'Amit Sharma', department: 'Design', role: 'UI/UX Designer' }
];

export default function Navbar({ user, onSelectEmployee, onLogout, onOpenOnboarding, isHrAuthenticated, onOpenHrPinModal, onLockHr, onOpenEvaluationResultsModal }) {
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

  // Feature section links for Employee Dashboard with DISTINCT colors per tab, Jungle at the last
  const sectionLinks = [
    {
      path: '/digital-twin',
      label: 'Digital Twin',
      icon: User,
      activeClass: 'bg-[#00f0ff] text-black border-white shadow-[0_0_18px_#00f0ff]',
      inactiveClass: 'bg-[#08182b] text-[#00f0ff] border-[#00f0ff]/60 hover:bg-[#00f0ff] hover:text-black'
    },
    {
      path: '/rivals',
      label: 'Rivals',
      icon: Swords,
      activeClass: 'bg-[#00ff66] text-black border-white shadow-[0_0_18px_#00ff66]',
      inactiveClass: 'bg-[#072417] text-[#00ff66] border-[#00ff66]/60 hover:bg-[#00ff66] hover:text-black'
    },
    {
      path: '/exercise',
      label: 'Exercise CV',
      icon: Video,
      activeClass: 'bg-[#a855f7] text-white border-white shadow-[0_0_18px_#a855f7]',
      inactiveClass: 'bg-[#1c072e] text-[#c084fc] border-[#a855f7]/60 hover:bg-[#a855f7] hover:text-white'
    },
    {
      path: '/food',
      label: 'Food Recs',
      icon: Utensils,
      activeClass: 'bg-[#f97316] text-black border-white shadow-[0_0_18px_#f97316]',
      inactiveClass: 'bg-[#2b1207] text-[#fb923c] border-[#f97316]/60 hover:bg-[#f97316] hover:text-black'
    },
    {
      path: '/health',
      label: 'Health Tasks',
      icon: HeartPulse,
      activeClass: 'bg-[#14b8a6] text-black border-white shadow-[0_0_18px_#14b8a6]',
      inactiveClass: 'bg-[#072524] text-[#2dd4bf] border-[#14b8a6]/60 hover:bg-[#14b8a6] hover:text-black'
    },
    {
      path: '/coach',
      label: 'GenAI Coach',
      icon: Bot,
      activeClass: 'bg-[#3b82f6] text-white border-white shadow-[0_0_18px_#3b82f6]',
      inactiveClass: 'bg-[#07172e] text-[#60a5fa] border-[#3b82f6]/60 hover:bg-[#3b82f6] hover:text-white'
    },
    {
      path: '/jungle',
      label: 'Jungle',
      icon: Trees,
      activeClass: 'bg-[#ffe600] text-black border-white shadow-[0_0_18px_#ffe600]',
      inactiveClass: 'bg-[#242007] text-[#ffe600] border-[#ffe600]/60 hover:bg-[#ffe600] hover:text-black'
    },
    {
      path: '/evaluation-results',
      label: 'Model Accuracy',
      icon: BarChart3,
      activeClass: 'bg-[#ff0055] text-white border-white shadow-[0_0_18px_#ff0055]',
      inactiveClass: 'bg-[#250714] text-[#ff3377] border-[#ff0055]/60 hover:bg-[#ff0055] hover:text-white'
    },
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
    <nav className="bg-[#0b071e]/95 backdrop-blur-md border-b-4 border-[#00f0ff] sticky top-0 z-50 shadow-[0_0_30px_rgba(0,240,255,0.3)] font-mono">
      {/* 🌟 TOP PORTAL WELCOME BANNER 🌟 */}
      <div className="bg-[#050314] border-b-2 border-[#00f0ff]/40 py-2 px-4 flex items-center justify-between gap-2 relative">
        <div className="hidden lg:block w-28"></div> {/* spacer for perfect centering */}
        <div className="text-center flex-1">
          <div className="text-xs sm:text-sm text-[#00f0ff] font-bold tracking-[0.2em] uppercase font-mono">
            WELCOME TO YOUR PERSONAL WELLNESS PORTAL:
          </div>
          <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-[#ffe600] tracking-widest uppercase font-mono mt-0.5 drop-shadow-[0_0_15px_rgba(255,230,0,0.7)] whitespace-nowrap overflow-hidden text-ellipsis">
            EMPLOYEE WELLNESS & DIGITAL TWIN
          </div>
        </div>
        <button
          onClick={() => navigate('/evaluation-results')}
          title="View Model Evaluation Metrics & Results for Particular User"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#00f0ff] text-black border-2 border-white hover:bg-white hover:text-black font-black text-xs md:text-sm uppercase tracking-wider transition-all shadow-[0_0_12px_#00f0ff] cursor-pointer font-mono shrink-0"
        >
          <BarChart3 size={16} />
          <span>RESULT</span>
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-col space-y-2.5">
        {/* TOP BAR: Brand Logo + Prominent 2 Dashboard Buttons + Active Profile / HR Switcher */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-3 pb-2 border-b border-[#2b1b54]">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <Link to="/digital-twin" onClick={(e) => handleSectionLinkClick(e, '/digital-twin')} className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 bg-[#00f0ff] text-black font-black text-lg flex items-center justify-center border-2 border-white shadow-[0_0_15px_#00f0ff] rounded-lg">
                <Sparkles size={20} className="text-black" />
              </div>
              <div>
                <span className="text-lg md:text-xl font-black tracking-widest text-[#ffe600] font-pixel group-hover:text-[#00f0ff] transition-colors">
                  PIXEL DASH
                </span>
                <span className="text-xs text-[#00f0ff] block -mt-0.5 font-mono tracking-widest font-bold">
                  STELLAR HUB
                </span>
              </div>
            </Link>
          </div>

          {/* 🌟 PROMINENT DASHBOARD BUTTONS 🌟 */}
          <div className="flex items-center gap-2.5">
            {/* Employee Dashboard Button (Only visible if employee is selected) */}
            {user && (user.id || user.employee_id) && (
              <button
                onClick={handleEmployeeDashboardClick}
                className={`flex items-center gap-2 px-3.5 py-1.5 text-xs md:text-sm font-bold uppercase tracking-wider transition-all cursor-pointer font-mono ${
                  location.pathname !== '/hr-dashboard'
                    ? 'bg-[#00f0ff] text-black border-2 border-white shadow-[0_0_12px_#00f0ff] scale-105'
                    : 'bg-[#120a2e] text-[#00f0ff] border-2 border-[#00f0ff]/60 hover:bg-[#00f0ff] hover:text-black'
                }`}
              >
                <LayoutDashboard size={16} />
                <span>EMPLOYEE TWIN</span>
              </button>
            )}

            {/* HR Enterprise Dashboard Button (Protected by HR01S PIN) */}
            <button
              onClick={handleHrDashboardClick}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs md:text-sm font-bold uppercase tracking-wider transition-all cursor-pointer font-mono ${
                location.pathname === '/hr-dashboard'
                  ? 'bg-[#00ff66] text-black border-2 border-white shadow-[0_0_12px_#00ff66] scale-105'
                  : 'bg-[#120a2e] text-[#00ff66] border-2 border-[#00ff66]/60 hover:bg-[#00ff66] hover:text-black'
              }`}
            >
              <Building2 size={16} />
              <span>HR COMMAND</span>
              {isHrAuthenticated ? (
                <span className="ml-1 px-1.5 py-0.5 bg-black/60 text-[10px] text-[#00ff66] border border-[#00ff66] font-mono">
                  UNLOCKED
                </span>
              ) : (
                <Lock size={14} className="text-red-400 animate-pulse ml-0.5" />
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
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-red-950 border-2 border-red-500 text-red-300 hover:bg-red-600 hover:text-white text-xs md:text-sm font-bold font-mono transition-all cursor-pointer shadow-[0_0_10px_rgba(239,68,68,0.4)]"
                >
                  <Lock size={14} />
                  <span>LOCK HR</span>
                </button>

                <div className="flex items-center gap-2 bg-[#120a2e] border-2 border-[#00f0ff] px-3 py-1.5 rounded-lg shadow-[0_0_10px_rgba(0,240,255,0.3)]">
                  <img
                    src={getEmployeeAvatar(user)}
                    alt={userName}
                    className="w-7 h-7 rounded-full border border-[#00f0ff] object-cover"
                  />
                  <select
                    value={currentEmpId}
                    onChange={handleDropdownChange}
                    className="bg-transparent text-white font-mono text-xs md:text-sm font-bold focus:outline-none cursor-pointer pr-1 max-w-[190px]"
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
            ) : user && (user.id || user.employee_id) ? (
              <div className="flex items-center gap-2 bg-[#120a2e] border-2 border-[#00f0ff]/60 px-3 py-1.5 rounded-lg text-xs md:text-sm font-mono shadow-[0_0_10px_rgba(0,240,255,0.2)]">
                <img
                  src={getEmployeeAvatar(user)}
                  alt={userName}
                  className="w-7 h-7 rounded-full border border-[#00f0ff] object-cover"
                />
                <span className="text-[#00ff66] font-extrabold">{userName}</span>
                <span className="text-[#ffe600] text-xs md:text-sm font-bold">({currentEmpId})</span>
              </div>
            ) : null}

            {/* 🏆 LEADERBOARD TROPHY CUP ICON BUTTON */}
            <button
              onClick={() => navigate('/leaderboard')}
              title="Workforce Leaderboard"
              className="flex items-center justify-center p-2 bg-[#120a2e] border-2 border-[#ffee00] text-[#ffee00] hover:bg-[#ffee00] hover:text-black transition-all shadow-[0_0_15px_rgba(255,230,0,0.5)] cursor-pointer rounded-lg"
            >
              <Trophy size={20} className="stroke-[2.5]" />
            </button>

            <button
              onClick={onOpenOnboarding}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#00f0ff] text-black border-2 border-white hover:bg-white hover:text-black font-bold text-xs md:text-sm uppercase tracking-wider transition-all shadow-[0_0_12px_rgba(0,240,255,0.5)] cursor-pointer font-mono"
            >
              <UserPlus size={16} />
              <span>ONBOARD</span>
            </button>

            {user && (
              <button
                onClick={onLogout}
                className="px-3 py-1.5 bg-red-950/80 border border-red-500 text-red-300 hover:bg-red-600 hover:text-white text-xs md:text-sm font-bold transition-all cursor-pointer font-mono"
              >
                EXIT
              </button>
            )}
          </div>
        </div>

        {/* BOTTOM ROW: Employee Personal Feature Section Navigation Links (Only shown when an employee is selected) */}
        {user && (user.id || user.employee_id) && location.pathname !== '/hr-dashboard' && (
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            {sectionLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={(e) => handleSectionLinkClick(e, link.path)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 border-2 text-xs md:text-sm font-bold uppercase tracking-wider transition-all font-mono rounded-sm ${
                    isActive
                      ? `${link.activeClass} scale-105`
                      : `${link.inactiveClass} hover:scale-105`
                  }`}
                >
                  <Icon size={16} />
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

