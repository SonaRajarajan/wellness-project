import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Swords, Trees, Video, User, Utensils, HeartPulse, Bot, Trophy, Users, LayoutDashboard, Building2, UserCheck } from 'lucide-react';

const DEFAULT_EMPLOYEES = [
  { id: 'EMP001', employee_id: 'EMP001', name: 'Sona VR', department: 'Alpha IT', role: 'Lead AI Engineer' },
  { id: 'EMP002', employee_id: 'EMP002', name: 'Priya Kapoor', department: 'Beta IT', role: 'Data Analyst' },
  { id: 'EMP003', employee_id: 'EMP003', name: 'Kavya Patel', department: 'Engineering', role: 'DevOps Engineer' },
  { id: 'EMP004', employee_id: 'EMP004', name: 'Raj Verma', department: 'Operations', role: 'Ops Manager' },
  { id: 'EMP005', employee_id: 'EMP005', name: 'Amit Sharma', department: 'Design', role: 'UI/UX Designer' },
  { id: 'EMP039', employee_id: 'EMP039', name: 'Vikram Singh', department: 'Sales', role: 'Sales Lead' },
  { id: 'EMP096', employee_id: 'EMP096', name: 'Deepika Bhat', department: 'Finance', role: 'Financial Analyst' },
  { id: 'EMP012', employee_id: 'EMP012', name: 'Neha Gupta', department: 'HR', role: 'HR Specialist' },
  { id: 'EMP024', employee_id: 'EMP024', name: 'Ananya Reddy', department: 'Finance', role: 'Risk Officer' },
  { id: 'EMP055', employee_id: 'EMP055', name: 'Rohan Mehta', department: 'Alpha IT', role: 'Full Stack Dev' }
];

export default function Navbar({ user, onSelectEmployee, onLogout }) {
  const location = useLocation();
  const [employeesList, setEmployeesList] = useState(DEFAULT_EMPLOYEES);

  // Fetch all 130 registered employees dynamically from backend API /api/v1/players
  useEffect(() => {
    fetch('http://localhost:8000/api/v1/players')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.players && data.players.length > 0) {
          setEmployeesList(data.players);
        }
      })
      .catch((err) => {
        console.warn('Using default employee list fallback');
      });
  }, []);

  // Feature section links
  const sectionLinks = [
    { path: '/rivals', label: 'Rivals', icon: Swords },
    { path: '/jungle', label: 'Jungle', icon: Trees },
    { path: '/exercise', label: 'Exercise CV', icon: Video },
    { path: '/digital-twin', label: 'Digital Twin', icon: User },
    { path: '/food', label: 'Food Recs', icon: Utensils },
    { path: '/health', label: 'Health Tasks', icon: HeartPulse },
    { path: '/coach', label: 'GenAI Coach', icon: Bot },
    { path: '/leaderboard', label: 'Leaderboard', icon: Trophy },
    { path: '/players', label: 'Players', icon: Users },
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

  return (
    <nav className="bg-[#0e131b] border-b-2 border-[#00f0ff] px-4 py-3 sticky top-0 z-50 shadow-[0_4px_25px_rgba(0,240,255,0.2)]">
      <div className="max-w-7xl mx-auto flex flex-col space-y-3">
        {/* TOP BAR: Brand Logo + Prominent 2 Dashboard Buttons + Employee Selector Dropdown */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 pb-2 border-b border-[#2a3442]">
          {/* Logo */}
          <Link to="/rivals" className="flex items-center gap-2.5 group">
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
            {/* Employee Dashboard Button */}
            <Link
              to="/rivals"
              className={`flex items-center gap-2 px-4 py-2 text-xs md:text-sm font-black uppercase tracking-wider border-2 transition-all shadow-md ${
                location.pathname === '/rivals' || location.pathname === '/digital-twin'
                  ? 'bg-[#00f0ff] text-black border-white shadow-[0_0_15px_#00f0ff] scale-105'
                  : 'bg-[#141c28] text-[#00f0ff] border-[#00f0ff]/60 hover:bg-[#00f0ff] hover:text-black hover:scale-105'
              }`}
            >
              <LayoutDashboard size={18} />
              <span>📱 EMPLOYEE DASHBOARD</span>
            </Link>

            {/* HR Enterprise Dashboard Button */}
            <Link
              to="/hr-dashboard"
              className={`flex items-center gap-2 px-4 py-2 text-xs md:text-sm font-black uppercase tracking-wider border-2 transition-all shadow-md ${
                location.pathname === '/hr-dashboard'
                  ? 'bg-[#00ff66] text-black border-white shadow-[0_0_15px_#00ff66] scale-105'
                  : 'bg-[#14261d] text-[#00ff66] border-[#00ff66]/60 hover:bg-[#00ff66] hover:text-black hover:scale-105'
              }`}
            >
              <Building2 size={18} />
              <span>🏢 HR DASHBOARD</span>
            </Link>
          </div>

          {/* 🌟 SELECT EMPLOYEE DROPDOWN 🌟 */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[#16202e] border-2 border-[#00f0ff] px-3 py-1.5 rounded shadow-[0_0_10px_rgba(0,240,255,0.3)]">
              <UserCheck size={16} className="text-[#00f0ff]" />
              <select
                value={currentEmpId}
                onChange={handleDropdownChange}
                className="bg-transparent text-white font-mono text-xs font-bold focus:outline-none cursor-pointer pr-2 max-w-[220px]"
              >
                {employeesList.map((emp) => {
                  const empIdVal = emp.employee_id || emp.id;
                  return (
                    <option key={empIdVal} value={empIdVal} className="bg-[#141923] text-white">
                      {empIdVal} — {emp.name} ({emp.department})
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="text-right hidden sm:block">
              <div className="text-xs text-[#00ff66] font-extrabold font-mono">{userName}</div>
              <div className="text-[10px] text-gray-400 font-mono">{userDept}</div>
            </div>

            <button
              onClick={onLogout}
              className="px-3 py-1.5 bg-red-900/70 border border-red-500 text-red-300 hover:bg-red-600 hover:text-white text-xs font-bold transition-all"
            >
              LOGOUT
            </button>
          </div>
        </div>

        {/* BOTTOM ROW: Feature Section Navigation Links */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
          {sectionLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-1 px-2.5 py-1 border text-[11px] font-semibold uppercase tracking-wider transition-all ${
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
