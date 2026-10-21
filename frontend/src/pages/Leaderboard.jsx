import React, { useState, useEffect } from 'react';
import { Trophy, Award, Medal, Crown, Building2, Users, User, Star } from 'lucide-react';

export default function Leaderboard() {
  const [filter, setFilter] = useState('podium'); // 'inter' | 'intra' | 'podium' | 'full'
  const [selectedDept, setSelectedDept] = useState('Alpha IT');

  const [leaderboardData, setLeaderboardData] = useState({
    podium: [
      { rank: 1, department: 'Operations', score: 57, badge: 'CHAMPION', color: 'gold' },
      { rank: 2, department: 'Alpha IT', score: 41, badge: 'RUNNER-UP', color: 'silver' },
      { rank: 3, department: 'Beta IT', score: 40, badge: 'THIRD PLACE', color: 'bronze' }
    ],
    inter_department: [
      { rank: 1, department: 'Operations', score: 57, points: 14250, members: 14, avg_wellness: 8.5 },
      { rank: 2, department: 'Alpha IT', score: 41, points: 13800, members: 18, avg_wellness: 8.1 },
      { rank: 3, department: 'Beta IT', score: 40, points: 11400, members: 12, avg_wellness: 7.8 },
      { rank: 4, department: 'Data Science', score: 38, points: 10500, members: 10, avg_wellness: 7.6 },
      { rank: 5, department: 'Design', score: 34, points: 9100, members: 8, avg_wellness: 7.2 },
      { rank: 6, department: 'HR', score: 31, points: 8900, members: 6, avg_wellness: 7.0 }
    ],
    intra_department: {
      'Alpha IT': [
        { rank: 1, employee_id: 'EMP001', name: 'Sona VR', role: 'Lead AI Engineer', points: 1450, level: 12, badge: '👑 MVP' },
        { rank: 2, employee_id: 'EMP018', name: 'Aarav Mehta', role: 'Senior Dev', points: 1320, level: 10, badge: '🥈 Star' },
        { rank: 3, employee_id: 'EMP019', name: 'Rohan Das', role: 'Backend Dev', points: 1210, level: 9, badge: '🥉 Pro' },
        { rank: 4, employee_id: 'EMP022', name: 'Meera Joshi', role: 'Cloud Arch', points: 1080, level: 8, badge: '⚡ Achiever' }
      ],
      'Beta IT': [
        { rank: 1, employee_id: 'EMP002', name: 'Priya Kapoor', role: 'Data Analyst', points: 1380, level: 11, badge: '👑 MVP' },
        { rank: 2, employee_id: 'EMP020', name: 'Neha Gupta', role: 'QA Lead', points: 1240, level: 9, badge: '🥈 Star' },
        { rank: 3, employee_id: 'EMP023', name: 'Vikram Seth', role: 'Database Eng', points: 1150, level: 8, badge: '🥉 Pro' }
      ],
      'Operations': [
        { rank: 1, employee_id: 'EMP004', name: 'Raj Verma', role: 'Ops Manager', points: 1580, level: 14, badge: '👑 MVP' },
        { rank: 2, employee_id: 'EMP1001', name: 'Amit Singh', role: 'Ops Specialist', points: 1410, level: 11, badge: '🥈 Star' },
        { rank: 3, employee_id: 'EMP024', name: 'Ananya Roy', role: 'Process Analyst', points: 1290, level: 10, badge: '🥉 Pro' }
      ],
      'Design': [
        { rank: 1, employee_id: 'EMP005', name: 'Amit Sharma', role: 'UI/UX Designer', points: 1290, level: 10, badge: '👑 MVP' },
        { rank: 2, employee_id: 'EMP025', name: 'Siddharth Nair', role: 'Motion Designer', points: 1180, level: 9, badge: '🥈 Star' }
      ],
      'Engineering': [
        { rank: 1, employee_id: 'EMP003', name: 'Kavya Patel', role: 'DevOps Engineer', points: 1390, level: 11, badge: '👑 MVP' },
        { rank: 2, employee_id: 'EMP026', name: 'Tariq Khan', role: 'Systems Engineer', points: 1220, level: 9, badge: '🥈 Star' }
      ]
    },
    full_rankings: [
      { rank: 1, department: 'Operations', score: 57, points: 14250, members: 14 },
      { rank: 2, department: 'Alpha IT', score: 41, points: 13800, members: 18 },
      { rank: 3, department: 'Beta IT', score: 40, points: 11400, members: 12 },
      { rank: 4, department: 'Data Science', score: 38, points: 10500, members: 10 },
      { rank: 5, department: 'Design', score: 34, points: 9100, members: 8 },
      { rank: 6, department: 'HR', score: 31, points: 8900, members: 6 }
    ]
  });

  useEffect(() => {
    fetch('http://localhost:8000/api/v1/gamification/leaderboard')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.podium) {
          setLeaderboardData((prev) => ({ ...prev, ...data }));
        }
      })
      .catch((e) => console.warn('Using default leaderboard data'));
  }, []);

  const tabs = [
    { key: 'inter', label: 'INTER-DEPARTMENT' },
    { key: 'intra', label: 'INTRA-DEPARTMENT' },
    { key: 'podium', label: 'PODIUM VIEW' },
    { key: 'full', label: 'FULL RANKINGS' }
  ];

  const availableDepts = Object.keys(leaderboardData.intra_department || {});
  const currentIntraEmployees = leaderboardData.intra_department[selectedDept] || [];

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2 border-b-2 border-[#ffee00] pb-4">
        <h1 className="text-2xl md:text-4xl font-black tracking-wider text-[#ffee00] uppercase flex items-center justify-center gap-3 drop-shadow-[0_0_15px_rgba(255,230,0,0.5)]">
          <Trophy className="text-[#ffee00]" size={40} />
          Workforce Leaderboard
        </h1>
        <p className="text-xs md:text-sm text-gray-300 uppercase tracking-widest font-extrabold">
          Hall of Fame — Ranked by Wellness Score & Activity Points
        </p>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {tabs.map((tab) => {
          const isSelected = filter === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-5 py-2.5 text-xs md:text-sm font-black uppercase tracking-wider border-2 transition-all cursor-pointer font-mono ${
                isSelected
                  ? 'bg-[#ffee00] text-black border-white shadow-[0_0_15px_#ffee00] scale-105'
                  : 'bg-[#121820] text-gray-300 border-[#2a3442] hover:border-[#ffee00] hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* 1. INTER-DEPARTMENT VIEW (Department vs Department) */}
      {filter === 'inter' && (
        <div className="bg-[#0f172a] border-2 border-[#00f0ff] p-6 space-y-5 shadow-[0_0_25px_rgba(0,240,255,0.2)] rounded-lg">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 border-b-2 border-[#00f0ff]/50 pb-4">
            <div>
              <h3 className="text-xl md:text-2xl font-black text-[#00f0ff] uppercase tracking-wider flex items-center gap-2">
                <Building2 size={24} />
                Inter-Department Competition Rankings
              </h3>
              <p className="text-xs md:text-sm text-gray-300 font-mono mt-1 font-bold">
                Comparative performance breakdown across enterprise departments
              </p>
            </div>
            <span className="px-3.5 py-1.5 bg-[#00f0ff]/20 border border-[#00f0ff] text-[#00f0ff] text-xs md:text-sm font-mono font-black rounded">
              6 DEPARTMENTS ACTIVE
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono border-collapse">
              <thead>
                <tr className="border-b-2 border-[#00f0ff] text-[#00f0ff] text-xs md:text-sm font-black uppercase tracking-wider bg-[#090e1a]">
                  <th className="p-4">Rank</th>
                  <th className="p-4">Department</th>
                  <th className="p-4">Gamification Score</th>
                  <th className="p-4">Total Points</th>
                  <th className="p-4">Avg Wellness Score</th>
                  <th className="p-4">Active Roster</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e293b]">
                {(leaderboardData.inter_department || leaderboardData.full_rankings).map((dept, idx) => (
                  <tr key={dept.department} className={`transition-colors ${idx % 2 === 0 ? 'bg-[#1e293b]/60' : 'bg-[#0f172a]'} hover:bg-[#334155]`}>
                    <td className="p-4 font-black text-base md:text-lg text-white">
                      {dept.rank === 1 ? '🥇 #1' : dept.rank === 2 ? '🥈 #2' : dept.rank === 3 ? '🥉 #3' : `#${dept.rank}`}
                    </td>
                    <td className="p-4 font-extrabold text-[#ffe600] text-base md:text-lg uppercase flex items-center gap-2">
                      <Building2 size={18} className="text-[#00f0ff]" />
                      {dept.department}
                    </td>
                    <td className="p-4 font-black text-[#00ff66] text-lg md:text-xl">{dept.score} pts</td>
                    <td className="p-4 text-white font-extrabold text-sm md:text-base">{dept.points?.toLocaleString()} SP</td>
                    <td className="p-4 text-[#00f0ff] font-extrabold text-sm md:text-base">{dept.avg_wellness || 8.0} / 10</td>
                    <td className="p-4 text-gray-200 font-bold text-sm">{dept.members} members</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. INTRA-DEPARTMENT VIEW (Employee vs Employee within Department) */}
      {filter === 'intra' && (
        <div className="bg-[#0f172a] border-2 border-[#00ff66] p-6 space-y-6 shadow-[0_0_25px_rgba(0,255,102,0.2)] rounded-lg">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b-2 border-[#00ff66]/50 pb-4">
            <div>
              <h3 className="text-xl md:text-2xl font-black text-[#00ff66] uppercase tracking-wider flex items-center gap-2">
                <Users size={24} />
                Intra-Department Employee Standings
              </h3>
              <p className="text-xs md:text-sm text-gray-300 font-mono mt-1 font-bold">
                Individual employee rankings within selected department
              </p>
            </div>

            {/* Department Switcher Dropdown */}
            <div className="flex items-center gap-2 bg-[#090e1a] border-2 border-[#00ff66] px-3.5 py-2 rounded-lg shadow-md">
              <span className="text-xs text-gray-300 font-mono font-black uppercase">Select Dept:</span>
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="bg-transparent text-[#00ff66] font-mono text-sm md:text-base font-black focus:outline-none cursor-pointer pr-2"
              >
                {availableDepts.map((d) => (
                  <option key={d} value={d} className="bg-[#0f172a] text-white">
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Individual Employee Leaderboard Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono border-collapse">
              <thead>
                <tr className="border-b-2 border-[#00ff66] text-[#00ff66] text-xs md:text-sm font-black uppercase tracking-wider bg-[#090e1a]">
                  <th className="p-4">Rank</th>
                  <th className="p-4">Employee</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Activity Points</th>
                  <th className="p-4">Level</th>
                  <th className="p-4">Badge</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e293b]">
                {currentIntraEmployees.map((emp, idx) => (
                  <tr key={emp.employee_id} className={`transition-colors ${idx % 2 === 0 ? 'bg-[#1e293b]/60' : 'bg-[#0f172a]'} hover:bg-[#334155]`}>
                    <td className="p-4 font-black text-base md:text-lg text-white">
                      {emp.rank === 1 ? '🥇 #1' : emp.rank === 2 ? '🥈 #2' : emp.rank === 3 ? '🥉 #3' : `#${emp.rank}`}
                    </td>
                    <td className="p-4">
                      <div className="font-black text-white text-base md:text-lg">{emp.name}</div>
                      <div className="text-xs text-[#00f0ff] font-extrabold">{emp.employee_id}</div>
                    </td>
                    <td className="p-4 text-gray-200 font-extrabold text-sm md:text-base">{emp.role}</td>
                    <td className="p-4 font-black text-[#ffe600] text-lg md:text-xl">{emp.points.toLocaleString()} SP</td>
                    <td className="p-4 text-[#00ff66] font-black text-sm md:text-base">Lvl {emp.level}</td>
                    <td className="p-4 font-black text-base">{emp.badge}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. PODIUM DISPLAY VIEW */}
      {filter === 'podium' && (
        <div className="bg-[#0f172a] border-2 border-[#ffee00] p-6 md:p-10 shadow-[0_0_30px_rgba(255,238,0,0.2)] space-y-8 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end justify-center pt-8 max-w-4xl mx-auto">
            {/* 2nd Place (Left) */}
            <div className="order-2 md:order-1 bg-[#1e293b] border-2 border-slate-300 p-6 text-center space-y-3 shadow-xl rounded-lg">
              <div className="w-14 h-14 mx-auto bg-slate-300 text-black font-black text-2xl flex items-center justify-center rounded-full shadow-[0_0_12px_#cbd5e1]">
                2
              </div>
              <Medal className="mx-auto text-slate-300" size={36} />
              <div>
                <div className="text-xl font-black text-white uppercase">
                  {leaderboardData.podium[1]?.department || 'Alpha IT'}
                </div>
                <div className="text-4xl font-black text-slate-200 mt-1">
                  {leaderboardData.podium[1]?.score || 41}
                </div>
                <div className="text-xs text-gray-300 font-mono font-bold mt-0.5">PTS</div>
              </div>
              <div className="py-1.5 px-3 bg-slate-800 text-slate-200 text-xs font-black uppercase tracking-widest border border-slate-400">
                RUNNER-UP
              </div>
            </div>

            {/* 1st Place (Center - Elevated) */}
            <div className="order-1 md:order-2 bg-[#1e293b] border-4 border-[#ffee00] p-7 text-center space-y-4 shadow-[0_0_25px_#ffee00] -translate-y-4 rounded-lg">
              <div className="w-16 h-16 mx-auto bg-[#ffee00] text-black font-black text-3xl flex items-center justify-center rounded-full shadow-[0_0_18px_#ffee00]">
                1
              </div>
              <Crown className="mx-auto text-[#ffee00]" size={44} />
              <div>
                <div className="text-2xl font-black text-white uppercase">
                  {leaderboardData.podium[0]?.department || 'Operations'}
                </div>
                <div className="text-5xl font-black text-[#ffee00] mt-1 drop-shadow-[0_0_10px_rgba(255,230,0,0.5)]">
                  {leaderboardData.podium[0]?.score || 57}
                </div>
                <div className="text-xs text-gray-300 font-mono font-bold mt-0.5">PTS</div>
              </div>
              <div className="py-2 px-4 bg-[#ffee00] text-black text-xs md:text-sm font-black uppercase tracking-widest border-2 border-white shadow-md">
                CHAMPION
              </div>
            </div>

            {/* 3rd Place (Right) */}
            <div className="order-3 bg-[#1e293b] border-2 border-amber-500 p-6 text-center space-y-3 shadow-xl rounded-lg">
              <div className="w-14 h-14 mx-auto bg-amber-500 text-white font-black text-2xl flex items-center justify-center rounded-full shadow-[0_0_12px_#f59e0b]">
                3
              </div>
              <Award className="mx-auto text-amber-400" size={36} />
              <div>
                <div className="text-xl font-black text-white uppercase">
                  {leaderboardData.podium[2]?.department || 'Beta IT'}
                </div>
                <div className="text-4xl font-black text-amber-400 mt-1">
                  {leaderboardData.podium[2]?.score || 40}
                </div>
                <div className="text-xs text-gray-300 font-mono font-bold mt-0.5">PTS</div>
              </div>
              <div className="py-1.5 px-3 bg-amber-950 text-amber-300 text-xs font-black uppercase tracking-widest border border-amber-500">
                THIRD PLACE
              </div>
            </div>
          </div>

          <div className="text-center pt-4 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setFilter('inter')}
              className="px-5 py-2.5 bg-[#00f0ff] text-black font-black uppercase text-xs md:text-sm tracking-widest border-2 border-white hover:bg-white transition-all shadow-[0_0_12px_#00f0ff] cursor-pointer font-mono"
            >
              Inter-Department Rankings
            </button>
            <button
              onClick={() => setFilter('intra')}
              className="px-5 py-2.5 bg-[#00ff66] text-black font-black uppercase text-xs md:text-sm tracking-widest border-2 border-white hover:bg-white transition-all shadow-[0_0_12px_#00ff66] cursor-pointer font-mono"
            >
              Intra-Department Rankings
            </button>
            <button
              onClick={() => setFilter('full')}
              className="px-5 py-2.5 bg-[#ffee00] text-black font-black uppercase text-xs md:text-sm tracking-widest border-2 border-white hover:bg-white transition-all shadow-[0_0_12px_#ffee00] cursor-pointer font-mono"
            >
              View Full Rankings
            </button>
          </div>
        </div>
      )}

      {/* 4. FULL RANKINGS VIEW */}
      {filter === 'full' && (
        <div className="bg-[#0f172a] border-2 border-[#ffee00] p-6 space-y-5 shadow-[0_0_25px_rgba(255,238,0,0.2)] rounded-lg">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 border-b-2 border-[#ffee00]/50 pb-4">
            <div>
              <h3 className="text-xl md:text-2xl font-black text-[#ffee00] uppercase tracking-wider flex items-center gap-2">
                <Trophy size={24} />
                Full Department Rankings
              </h3>
              <p className="text-xs md:text-sm text-gray-300 font-mono mt-1 font-bold">
                Complete Leaderboard standings ordered by score
              </p>
            </div>
            <span className="px-3.5 py-1.5 bg-[#ffee00]/20 border border-[#ffee00] text-[#ffee00] text-xs md:text-sm font-mono font-black rounded">
              {leaderboardData.full_rankings.length} DEPARTMENTS TOTAL
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono border-collapse">
              <thead>
                <tr className="border-b-2 border-[#ffee00] text-[#ffee00] text-xs md:text-sm font-black uppercase tracking-wider bg-[#090e1a]">
                  <th className="p-4">Rank</th>
                  <th className="p-4">Department</th>
                  <th className="p-4">Score</th>
                  <th className="p-4">Points</th>
                  <th className="p-4">Active Members</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e293b]">
                {leaderboardData.full_rankings.map((r, idx) => (
                  <tr key={r.rank} className={`transition-colors ${idx % 2 === 0 ? 'bg-[#1e293b]/60' : 'bg-[#0f172a]'} hover:bg-[#334155]`}>
                    <td className="p-4 font-black text-base md:text-lg text-white">
                      {r.rank === 1 ? '🥇 #1' : r.rank === 2 ? '🥈 #2' : r.rank === 3 ? '🥉 #3' : `#${r.rank}`}
                    </td>
                    <td className="p-4 font-extrabold text-[#00f0ff] text-base md:text-lg uppercase">{r.department}</td>
                    <td className="p-4 font-black text-[#00ff66] text-lg md:text-xl">{r.score} pts</td>
                    <td className="p-4 text-[#ffe600] font-extrabold text-sm md:text-base">{r.points.toLocaleString()} SP</td>
                    <td className="p-4 text-gray-200 font-extrabold text-sm md:text-base">{r.members} active</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
