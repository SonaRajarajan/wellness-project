import React, { useState, useEffect } from 'react';
import { Users, Search, Filter, ShieldCheck, ExternalLink, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Players({ user, onSelectEmployee }) {
  const [players, setPlayers] = useState([
    { id: 'EMP001', employee_id: 'EMP001', name: 'Sona VR', email: 'sona.vr@pixel.com', department: 'Alpha IT', points: 3450, tier_badge: 'Alpha IT - 57 pts' },
    { id: 'EMP002', employee_id: 'EMP002', name: 'Priya Kapoor', email: 'priya.kapoor@pixel.com', department: 'Beta IT', points: 3120, tier_badge: 'Beta IT - 41 pts' },
    { id: 'EMP003', employee_id: 'EMP003', name: 'Kavya Patel', email: 'kavya.patel@pixel.com', department: 'Engineering', points: 2890, tier_badge: 'Engineering - 40 pts' },
    { id: 'EMP004', employee_id: 'EMP004', name: 'Raj Verma', email: 'raj.verma@pixel.com', department: 'Operations', points: 3361, tier_badge: 'Operations - 57 pts' },
    { id: 'EMP005', employee_id: 'EMP005', name: 'Amit Sharma', email: 'amit.sharma@pixel.com', department: 'Design', points: 2820, tier_badge: 'Design - 41 pts' }
  ]);

  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('All Departments');
  const navigate = useNavigate();

  const fetchPlayers = async () => {
    try {
      let url = 'http://localhost:8000/api/v1/players?';
      if (search) url += `search=${encodeURIComponent(search)}&`;
      if (department && department !== 'All Departments') url += `department=${encodeURIComponent(department)}`;

      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data.players && data.players.length > 0) setPlayers(data.players);
      }
    } catch (e) {
      console.warn('Using default players list fallback');
    }
  };

  useEffect(() => {
    fetchPlayers();
  }, [search, department]);

  const handleViewPlayerProfile = (player) => {
    if (onSelectEmployee) {
      onSelectEmployee(player);
    }
    // Navigate immediately to Digital Twin profile dashboard
    navigate('/digital-twin');
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header (Figure 7.2) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-[#00f0ff] pb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-wider text-[#00f0ff] uppercase flex items-center gap-3">
            <Users className="text-[#00ff66]" size={32} />
            Players Directory & Dashboard Access
          </h1>
          <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-bold">
            Select any registered player to switch and inspect their active Digital Twin profile dashboard
          </p>
        </div>

        <button
          onClick={() => navigate('/digital-twin')}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#00ff66] text-black font-black text-xs uppercase tracking-widest border-2 border-white hover:bg-black hover:text-[#00ff66] transition-all shadow-[0_0_10px_#00ff66]"
        >
          <span>GO TO ACTIVE PROFILE</span>
          <ExternalLink size={14} />
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={16} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search players by name, email, department..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#121820] border-2 border-[#2a3442] text-white text-xs font-mono focus:border-[#00f0ff] outline-none"
          />
        </div>

        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="px-4 py-2.5 bg-[#121820] border-2 border-[#2a3442] text-white text-xs font-mono focus:border-[#00f0ff] outline-none"
        >
          <option value="All Departments">All Departments</option>
          <option value="Alpha IT">Alpha IT</option>
          <option value="Beta IT">Beta IT</option>
          <option value="Engineering">Engineering</option>
          <option value="Operations">Operations</option>
          <option value="Design">Design</option>
          <option value="HR">HR</option>
          <option value="Sales">Sales</option>
          <option value="Finance">Finance</option>
        </select>
      </div>

      {/* Player Grid Cards (Figure 7.2) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {players.map((p) => {
          const empIdVal = p.employee_id || p.id;
          const isSelected = (user?.employee_id || user?.id) === empIdVal;
          return (
            <div
              key={empIdVal}
              className={`bg-[#121820] border-2 p-5 text-center space-y-4 hover:border-[#00f0ff] shadow-lg transition-all group ${
                isSelected ? 'border-[#00f0ff] shadow-[0_0_15px_rgba(0,240,255,0.3)]' : 'border-[#2a3442]'
              }`}
            >
              {/* Avatar Circle */}
              <div className="w-16 h-16 mx-auto bg-[#182230] border-2 border-[#00f0ff] rounded-full flex items-center justify-center text-[#00f0ff] font-extrabold text-xl group-hover:scale-110 transition-transform">
                👤
              </div>

              <div>
                <h3 className="text-base font-bold text-white uppercase group-hover:text-[#00f0ff] transition-colors">
                  {p.name}
                </h3>
                <div className="text-[11px] text-gray-400 font-mono mt-0.5">{p.email || `${p.name.toLowerCase().replace(/\s+/g, '.')}@pixel.com`}</div>
              </div>

              {/* Department & Badge */}
              <div className="py-1 px-3 bg-[#182230] border border-[#2a3442] inline-block text-[10px] text-[#00ff66] font-bold uppercase">
                {p.tier_badge || `${p.department} - ${p.points || 2800} XP`}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => handleViewPlayerProfile(p)}
                  className="w-full py-2 bg-[#00f0ff] border border-white text-xs font-black uppercase tracking-wider text-black hover:bg-black hover:text-[#00f0ff] transition-all flex items-center justify-center gap-1.5"
                >
                  <Eye size={14} />
                  <span>VIEW DASHBOARD</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
