import React, { useState, useEffect } from 'react';
import { Swords, Users, User, Flame, Award, RefreshCw, Shield, PlusCircle, CheckCircle2, BookOpen, Settings, Target, Calendar, Zap, ArrowRight, Trophy } from 'lucide-react';
import { getEmployeeAvatar } from '../utils/avatars';

const ALL_DEPARTMENTS = ['Alpha IT', 'Beta IT', 'Operations', 'Data Science', 'Design', 'Engineering', 'HR', 'Sales', 'Finance'];

export default function RivalsMode({ user }) {
  const empId = user?.employee_id || user?.id || 'EMP001';
  const userName = user?.name || 'Sona VR';
  const userDept = user?.department || 'Alpha IT';

  const isCurrentEmployee = (p) => {
    if (!p) return false;
    const nameStr = typeof p === 'string' ? p : p.name;
    const idStr = typeof p === 'object' ? (p.employee_id || p.id) : '';

    if (nameStr && userName && nameStr.trim().toLowerCase() === userName.trim().toLowerCase()) return true;
    if (idStr && empId && idStr.trim().toLowerCase() === empId.trim().toLowerCase()) return true;
    return false;
  };

  const [activeTab, setActiveTab] = useState('active');
  const [rivalsData, setRivalsData] = useState({
    team_vs_team: [
      {
        id: 'team-1',
        team_a: userDept,
        team_a_pts: 14250,
        team_b: userDept === 'Beta IT' ? 'Operations' : 'Beta IT',
        team_b_pts: 11400,
        target_pts: 15000,
        ends_date: '2026-09-25',
        status: 'ACTIVE'
      }
    ],
    player_vs_player: [
      {
        id: 'pvp-1',
        player_a: userName,
        player_a_pts: 3450,
        player_b: userName === 'Priya Kapoor' ? 'Sona VR' : 'Priya Kapoor',
        player_b_pts: 3120,
        target_pts: 3500,
        ends_date: '2026-09-22',
        status: 'ACTIVE'
      }
    ]
  });

  const [playersList, setPlayersList] = useState([
    { id: 'EMP002', employee_id: 'EMP002', name: 'Priya Kapoor', department: 'Beta IT' },
    { id: 'EMP003', employee_id: 'EMP003', name: 'Kavya Patel', department: 'Engineering' },
    { id: 'EMP004', employee_id: 'EMP004', name: 'Raj Verma', department: 'Operations' },
    { id: 'EMP005', employee_id: 'EMP005', name: 'Amit Sharma', department: 'Design' },
    { id: 'EMP006', employee_id: 'EMP006', name: 'Neha Gupta', department: 'HR' },
    { id: 'EMP007', employee_id: 'EMP007', name: 'Vikram Singh', department: 'Sales' },
    { id: 'EMP008', employee_id: 'EMP008', name: 'Ananya Reddy', department: 'Finance' }
  ]);

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Create Rival Form State
  const [challengeType, setChallengeType] = useState('team');
  const [opponent, setOpponent] = useState('Beta IT');
  const [targetPts, setTargetPts] = useState(500);
  const [durationDays, setDurationDays] = useState(7);

  const fetchRivals = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/api/v1/gamification/rivals?employee_id=${empId}`);
      if (res.ok) {
        const data = await res.json();
        setRivalsData(data);
      }
    } catch (e) {
      console.warn('Using default rivals fallback data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRivals();
    
    fetch('http://localhost:8000/api/v1/players')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.players && data.players.length > 0) {
          const filtered = data.players.filter((p) => !isCurrentEmployee(p));
          if (filtered.length > 0) {
            setPlayersList(filtered);
          }
        }
      })
      .catch(() => {});
  }, [empId, userName, user]);

  // Keep opponent valid when logged-in user or challenge type changes
  useEffect(() => {
    if (challengeType === 'pvp') {
      const validPlayers = playersList.filter((p) => !isCurrentEmployee(p));
      if (!opponent || isCurrentEmployee(opponent) || !validPlayers.some((p) => p.name === opponent)) {
        if (validPlayers.length > 0) {
          setOpponent(validPlayers[0].name);
        } else {
          setOpponent(userName === 'Priya Kapoor' ? 'Sona VR' : 'Priya Kapoor');
        }
      }
    } else if (challengeType === 'team') {
      if (!opponent || opponent.toLowerCase() === userDept.toLowerCase()) {
        const validDepts = ALL_DEPARTMENTS.filter((d) => d.toLowerCase() !== userDept.toLowerCase());
        setOpponent(validDepts[0] || 'Beta IT');
      }
    }
  }, [userName, empId, userDept, challengeType, playersList]);

  const handleCreateRival = (e) => {
    e.preventDefault();
    if (isCurrentEmployee(opponent)) {
      alert(`Invalid opponent selection: ${userName} cannot challenge themselves!`);
      return;
    }
    setSuccessMsg(`Successfully created new ${challengeType === 'team' ? 'Team vs Team' : 'Player vs Player'} challenge against ${opponent}!`);
    
    if (challengeType === 'team') {
      const newTeamRival = {
        id: `team-${Date.now()}`,
        team_a: userDept,
        team_a_pts: 0,
        team_b: opponent,
        team_b_pts: 0,
        target_pts: parseInt(targetPts) || 500,
        ends_date: new Date(Date.now() + (parseInt(durationDays) || 7) * 86400000).toISOString().split('T')[0],
        status: 'ACTIVE'
      };
      setRivalsData((prev) => ({
        ...prev,
        team_vs_team: [newTeamRival, ...prev.team_vs_team]
      }));
    } else {
      const newPvpRival = {
        id: `pvp-${Date.now()}`,
        player_a: userName,
        player_a_pts: 0,
        player_b: opponent,
        player_b_pts: 0,
        target_pts: parseInt(targetPts) || 500,
        ends_date: new Date(Date.now() + (parseInt(durationDays) || 7) * 86400000).toISOString().split('T')[0],
        status: 'ACTIVE'
      };
      setRivalsData((prev) => ({
        ...prev,
        player_vs_player: [newPvpRival, ...prev.player_vs_player]
      }));
    }

    setTimeout(() => {
      setActiveTab('active');
      setSuccessMsg('');
    }, 1500);
  };

  const handleTypeSelect = (type) => {
    setChallengeType(type);
    if (type === 'team') {
      const validDepts = ALL_DEPARTMENTS.filter((d) => d.toLowerCase() !== userDept.toLowerCase());
      setOpponent(validDepts[0] || 'Beta IT');
    } else {
      const validPlayers = playersList.filter((p) => !isCurrentEmployee(p));
      if (validPlayers.length > 0) {
        setOpponent(validPlayers[0].name);
      } else {
        setOpponent(userName === 'Priya Kapoor' ? 'Sona VR' : 'Priya Kapoor');
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6 selection:bg-[#00f0ff] selection:text-black">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-[#00f0ff] pb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-wider text-[#00f0ff] uppercase flex items-center gap-3">
            <Swords className="text-[#00ff66]" size={34} />
            Rivals Mode
          </h1>
          <p className="text-xs text-gray-300 mt-1 uppercase tracking-widest font-bold">
            Cross-Team challenges and competitive battles
          </p>
        </div>

        <button
          onClick={fetchRivals}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#121c2b] border-2 border-[#00f0ff] text-[#00f0ff] text-xs font-black uppercase tracking-wider hover:bg-[#00f0ff] hover:text-black transition-all shadow-[0_0_12px_rgba(0,240,255,0.3)]"
        >
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          <span>REFRESH STANDINGS</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-3 border-b-2 border-[#2a3442] pb-3">
        <button
          onClick={() => setActiveTab('active')}
          className={`px-6 py-3 text-xs md:text-sm font-black uppercase tracking-wider border-2 transition-all flex items-center gap-2 ${
            activeTab === 'active'
              ? 'bg-[#00f0ff] text-black border-white shadow-[0_0_15px_#00f0ff]'
              : 'bg-[#121820] text-gray-300 border-[#2a3442] hover:border-[#00f0ff] hover:text-white'
          }`}
        >
          <Swords size={16} />
          <span>Active Rivalries ({rivalsData.team_vs_team.length + rivalsData.player_vs_player.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('rules')}
          className={`px-6 py-3 text-xs md:text-sm font-black uppercase tracking-wider border-2 transition-all flex items-center gap-2 ${
            activeTab === 'rules'
              ? 'bg-[#00f0ff] text-black border-white shadow-[0_0_15px_#00f0ff]'
              : 'bg-[#121820] text-gray-300 border-[#2a3442] hover:border-[#00f0ff] hover:text-white'
          }`}
        >
          <BookOpen size={16} />
          <span>Challenge Rules</span>
        </button>

        <button
          onClick={() => setActiveTab('create')}
          className={`px-6 py-3 text-xs md:text-sm font-black uppercase tracking-wider border-2 transition-all flex items-center gap-2 ${
            activeTab === 'create'
              ? 'bg-[#00ff66] text-black border-white shadow-[0_0_15px_#00ff66]'
              : 'bg-[#121820] text-[#00ff66] border-[#00ff66]/50 hover:bg-[#00ff66] hover:text-black'
          }`}
        >
          <PlusCircle size={16} />
          <span>+ Create Rival</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 bg-[#00ff66]/15 border-2 border-[#00ff66] text-[#00ff66] text-sm font-black uppercase tracking-wider text-center flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(0,255,102,0.3)]">
          <CheckCircle2 size={20} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* VIEW 1: ACTIVE RIVALRIES */}
      {activeTab === 'active' && (
        <div className="space-y-6">
          {/* Team vs Team Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-base font-black uppercase text-[#00ff66] tracking-widest border-l-4 border-[#00ff66] pl-4 py-1.5 bg-[#00ff66]/5 border-y border-[#00ff66]/20">
              <Users size={20} />
              <span>Team vs Team Rivalries</span>
            </div>

            {rivalsData.team_vs_team.map((tvt) => {
              const progressA = Math.min(100, Math.round((tvt.team_a_pts / tvt.target_pts) * 100));
              const progressB = Math.min(100, Math.round((tvt.team_b_pts / tvt.target_pts) * 100));
              return (
                <div
                  key={tvt.id}
                  className="bg-[#121820] border-2 border-[#2a3442] p-6 relative overflow-hidden shadow-xl hover:border-[#00f0ff] transition-all space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-[#2a3442] pb-3">
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-gray-300">
                      <Target size={14} className="text-[#00f0ff]" />
                      <span>TARGET: <strong className="text-[#00ff66] font-black">{tvt.target_pts} PTS</strong></span>
                    </div>
                    <span className="px-3 py-1 bg-[#00ff66]/20 border border-[#00ff66] text-[#00ff66] text-xs font-black uppercase tracking-widest">
                      {tvt.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-6 text-center py-2">
                    {/* Team A */}
                    <div className="bg-[#182230] p-5 border-2 border-[#00f0ff]/60 space-y-2">
                      <div className="w-12 h-12 mx-auto bg-[#00f0ff]/20 border-2 border-[#00f0ff] flex items-center justify-center text-[#00f0ff]">
                        <Users size={24} />
                      </div>
                      <div className="text-lg font-black text-white uppercase">{tvt.team_a}</div>
                      <div className="text-4xl font-black text-[#00f0ff]">{tvt.team_a_pts}</div>
                      <div className="text-xs text-gray-300 font-black uppercase tracking-wider">POINTS</div>
                      <div className="w-full bg-black h-2.5 border border-[#00f0ff]/40 mt-2">
                        <div className="bg-[#00f0ff] h-full" style={{ width: `${progressA}%` }} />
                      </div>
                    </div>

                    {/* VS Badge */}
                    <div className="space-y-3 py-2">
                      <div className="text-4xl font-black text-[#00f0ff] tracking-widest drop-shadow-[0_0_10px_#00f0ff]">VS</div>
                      <div className="text-xs text-gray-300 font-bold uppercase tracking-wider">
                        Ends: <span className="text-[#00f0ff] font-black">{tvt.ends_date}</span>
                      </div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black/80 border border-[#00ff66] text-xs font-mono text-[#00ff66] font-bold">
                        <Trophy size={14} />
                        <span>Winner Reward: +250 SP</span>
                      </div>
                    </div>

                    {/* Team B */}
                    <div className="bg-[#182230] p-5 border-2 border-[#00ff66]/60 space-y-2">
                      <div className="w-12 h-12 mx-auto bg-[#00ff66]/20 border-2 border-[#00ff66] flex items-center justify-center text-[#00ff66]">
                        <Shield size={24} />
                      </div>
                      <div className="text-lg font-black text-white uppercase">{tvt.team_b}</div>
                      <div className="text-4xl font-black text-[#00ff66]">{tvt.team_b_pts}</div>
                      <div className="text-xs text-gray-300 font-black uppercase tracking-wider">POINTS</div>
                      <div className="w-full bg-black h-2.5 border border-[#00ff66]/40 mt-2">
                        <div className="bg-[#00ff66] h-full" style={{ width: `${progressB}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Player vs Player Section */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-3 text-base font-black uppercase text-[#00f0ff] tracking-widest border-l-4 border-[#00f0ff] pl-4 py-1.5 bg-[#00f0ff]/5 border-y border-[#00f0ff]/20">
              <User size={20} />
              <span>Player vs Player Duels</span>
            </div>

            {rivalsData.player_vs_player.map((pvp) => {
              const progressA = Math.min(100, Math.round((pvp.player_a_pts / pvp.target_pts) * 100));
              const progressB = Math.min(100, Math.round((pvp.player_b_pts / pvp.target_pts) * 100));
              return (
                <div
                  key={pvp.id}
                  className="bg-[#121820] border-2 border-[#2a3442] p-6 relative overflow-hidden shadow-xl hover:border-[#00f0ff] transition-all space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-[#2a3442] pb-3">
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-gray-300">
                      <Target size={14} className="text-[#00ff66]" />
                      <span>TARGET: <strong className="text-[#00ff66] font-black">{pvp.target_pts} PTS</strong></span>
                    </div>
                    <span className="px-3 py-1 bg-[#00ff66]/20 border border-[#00ff66] text-[#00ff66] text-xs font-black uppercase tracking-widest">
                      {pvp.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-6 text-center py-2">
                    {/* Player A */}
                    <div className="bg-[#182230] p-5 border-2 border-[#00f0ff]/60 space-y-2">
                      <div className="w-12 h-12 mx-auto bg-[#00f0ff] text-black font-black flex items-center justify-center rounded-full text-lg shadow-[0_0_10px_#00f0ff]">
                        {pvp.player_a.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="text-lg font-black text-white uppercase">{pvp.player_a}</div>
                      <div className="text-4xl font-black text-[#00f0ff]">{pvp.player_a_pts}</div>
                      <div className="text-xs text-gray-300 font-black uppercase tracking-wider">POINTS</div>
                      <div className="w-full bg-black h-2.5 border border-[#00f0ff]/40 mt-2">
                        <div className="bg-[#00f0ff] h-full" style={{ width: `${progressA}%` }} />
                      </div>
                    </div>

                    {/* VS Badge */}
                    <div className="space-y-3 py-2">
                      <div className="text-4xl font-black text-[#00f0ff] tracking-widest drop-shadow-[0_0_10px_#00f0ff]">VS</div>
                      <div className="text-xs text-gray-300 font-bold uppercase tracking-wider">
                        Ends: <span className="text-[#00f0ff] font-black">{pvp.ends_date}</span>
                      </div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black/80 border border-[#00ff66] text-xs font-mono text-[#00ff66] font-bold">
                        <Trophy size={14} />
                        <span>Winner Reward: +250 SP</span>
                      </div>
                    </div>

                    {/* Player B */}
                    <div className="bg-[#182230] p-5 border-2 border-[#00ff66]/60 space-y-2">
                      <div className="w-12 h-12 mx-auto bg-[#00ff66] text-black font-black flex items-center justify-center rounded-full text-lg shadow-[0_0_10px_#00ff66]">
                        {pvp.player_b.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="text-lg font-black text-white uppercase">{pvp.player_b}</div>
                      <div className="text-4xl font-black text-[#00ff66]">{pvp.player_b_pts}</div>
                      <div className="text-xs text-gray-300 font-black uppercase tracking-wider">POINTS</div>
                      <div className="w-full bg-black h-2.5 border border-[#00ff66]/40 mt-2">
                        <div className="bg-[#00ff66] h-full" style={{ width: `${progressB}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: CHALLENGE RULES */}
      {activeTab === 'rules' && (
        <div className="bg-[#121820] border-2 border-[#00f0ff] p-6 md:p-8 space-y-6 shadow-2xl">
          <div className="flex items-center gap-3 border-b-2 border-[#2a3442] pb-4">
            <BookOpen size={28} className="text-[#00f0ff]" />
            <div>
              <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-wider">
                Rivals Mode Rules & Multipliers
              </h2>
              <p className="text-sm text-gray-300 font-bold uppercase tracking-wider">
                Adaptive Difficulty Formula & Points Calculation Guidelines
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-sm">
            <div className="bg-[#182230] p-5 border-2 border-[#2a3442] space-y-3">
              <h3 className="text-base font-black text-[#00f0ff] uppercase flex items-center gap-2">
                <Zap size={18} />
                <span>1. Adaptive Difficulty Multiplier D(T, t)</span>
              </h3>
              <p className="text-gray-200 leading-relaxed font-bold">
                Rivals battles dynamically adapt based on participant department health tiers:
              </p>
              <div className="bg-black/80 p-4 border border-[#00ff66]/60 text-[#00ff66] font-mono text-base font-black tracking-wider text-center">
                D(T, t) = 1.0 + 0.05 * min(5, Target_Points / 100)
              </div>
              <p className="text-gray-300 text-xs font-bold leading-relaxed">
                Underperforming teams receive a temporary boost to ensure balanced and fair competition.
              </p>
            </div>

            <div className="bg-[#182230] p-5 border-2 border-[#2a3442] space-y-3">
              <h3 className="text-base font-black text-[#00f0ff] uppercase flex items-center gap-2">
                <Trophy size={18} />
                <span>2. Victory & Point Distribution</span>
              </h3>
              <ul className="space-y-3 text-gray-200 font-bold">
                <li className="flex items-center gap-2">
                  <span className="text-[#00ff66] font-black">•</span>
                  <span>Team vs Team Target: Minimum <strong className="text-[#00ff66] font-black">500 Points</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#00ff66] font-black">•</span>
                  <span>Player vs Player Target: Minimum <strong className="text-[#00ff66] font-black">300 Points</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#00ff66] font-black">•</span>
                  <span>Winner Reward: <strong className="text-[#00ff66] font-black">+250 Survival Points (SP)</strong> for Jungle Store balance</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#ffee00] font-black">•</span>
                  <span>Validation: MediaPipe AI verifies workout repetitions</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: ENHANCED COMPACT CREATE RIVAL FORM */}
      {activeTab === 'create' && (
        <div className="max-w-3xl mx-auto bg-[#121820] border-2 border-[#00f0ff] p-6 space-y-6 shadow-[0_0_25px_rgba(0,240,255,0.15)] rounded-lg">
          {/* Header */}
          <div className="flex items-center gap-3 border-b-2 border-[#2a3442] pb-4">
            <div className="w-12 h-12 bg-[#00f0ff]/20 border-2 border-[#00f0ff] flex items-center justify-center text-[#00f0ff] shadow-[0_0_12px_#00f0ff] rounded-md">
              <PlusCircle size={26} />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-black text-[#00f0ff] uppercase tracking-wider flex items-center gap-2">
                CREATE NEW RIVAL CHALLENGE
              </h2>
              <p className="text-xs md:text-sm text-gray-300 font-mono font-bold tracking-wide mt-0.5">
                Challenge another department or employee to a wellness duel & win Survival Points (SP)
              </p>
            </div>
          </div>

          <form onSubmit={handleCreateRival} className="space-y-6">
            {/* Step 1: Challenge Type */}
            <div className="space-y-2.5">
              <label className="block text-xs md:text-sm font-black text-gray-200 uppercase tracking-wider flex items-center gap-2">
                <Swords size={18} className="text-[#00f0ff]" />
                <span>1. SELECT CHALLENGE TYPE</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <button
                  type="button"
                  onClick={() => handleTypeSelect('team')}
                  className={`p-4 border-2 text-left transition-all flex items-center justify-between rounded-md cursor-pointer ${
                    challengeType === 'team'
                      ? 'bg-[#00f0ff] text-black border-white shadow-[0_0_15px_rgba(0,240,255,0.4)] scale-[1.01]'
                      : 'bg-[#182230] text-gray-300 border-[#2a3442] hover:border-[#00f0ff]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Users size={24} className={challengeType === 'team' ? 'text-black' : 'text-[#00f0ff]'} />
                    <div>
                      <div className="text-sm md:text-base font-black uppercase">TEAM VS TEAM</div>
                      <div className={`text-xs font-mono font-bold ${challengeType === 'team' ? 'text-black/80' : 'text-gray-400'}`}>
                        Department wide battle
                      </div>
                    </div>
                  </div>
                  {challengeType === 'team' && (
                    <span className="px-2.5 py-1 bg-black text-[#00f0ff] text-[10px] font-black uppercase tracking-widest rounded-sm">
                      SELECTED
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleTypeSelect('pvp')}
                  className={`p-4 border-2 text-left transition-all flex items-center justify-between rounded-md cursor-pointer ${
                    challengeType === 'pvp'
                      ? 'bg-[#00f0ff] text-black border-white shadow-[0_0_15px_rgba(0,240,255,0.4)] scale-[1.01]'
                      : 'bg-[#182230] text-gray-300 border-[#2a3442] hover:border-[#00f0ff]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <User size={24} className={challengeType === 'pvp' ? 'text-black' : 'text-[#00f0ff]'} />
                    <div>
                      <div className="text-sm md:text-base font-black uppercase">PLAYER VS PLAYER</div>
                      <div className={`text-xs font-mono font-bold ${challengeType === 'pvp' ? 'text-black/80' : 'text-gray-400'}`}>
                        1-on-1 employee duel
                      </div>
                    </div>
                  </div>
                  {challengeType === 'pvp' && (
                    <span className="px-2.5 py-1 bg-black text-[#00f0ff] text-[10px] font-black uppercase tracking-widest rounded-sm">
                      SELECTED
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Step 2: Select Opponent */}
            <div className="space-y-2.5">
              <label className="block text-xs md:text-sm font-black text-gray-200 uppercase tracking-wider flex items-center gap-2">
                <Shield size={18} className="text-[#00f0ff]" />
                <span>2. SELECT OPPONENT ({challengeType === 'team' ? 'DEPARTMENT' : 'PLAYER'})</span>
              </label>

              {challengeType === 'team' ? (
                <select
                  value={opponent}
                  onChange={(e) => setOpponent(e.target.value)}
                  className="w-full px-4 py-3 bg-[#182230] border-2 border-[#00f0ff] text-white text-sm md:text-base font-mono font-bold focus:ring-2 focus:ring-[#00f0ff] outline-none cursor-pointer rounded-md"
                >
                  {ALL_DEPARTMENTS
                    .filter((d) => d.toLowerCase() !== userDept.toLowerCase())
                    .map((dept) => (
                      <option key={dept} value={dept} className="bg-[#121820] text-white">
                        {dept} Department
                      </option>
                    ))}
                </select>
              ) : (
                <select
                  value={opponent}
                  onChange={(e) => setOpponent(e.target.value)}
                  className="w-full px-4 py-3 bg-[#182230] border-2 border-[#00f0ff] text-white text-sm md:text-base font-mono font-bold focus:ring-2 focus:ring-[#00f0ff] outline-none cursor-pointer rounded-md"
                >
                  {playersList
                    .filter((p) => !isCurrentEmployee(p))
                    .map((p) => (
                      <option key={p.employee_id || p.id} value={p.name} className="bg-[#121820] text-white">
                        {p.name} ({p.department || 'Employee'}) - {p.employee_id || p.id}
                      </option>
                    ))}
                </select>
              )}
            </div>

            {/* Step 3: Target Points & Duration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Target Points */}
              <div className="space-y-2.5">
                <label className="block text-xs md:text-sm font-black text-gray-200 uppercase tracking-wider flex items-center gap-2">
                  <Target size={18} className="text-[#00ff66]" />
                  <span>TARGET POINTS</span>
                </label>
                <input
                  type="number"
                  value={targetPts}
                  onChange={(e) => setTargetPts(e.target.value)}
                  min="100"
                  step="50"
                  className="w-full px-4 py-3 bg-[#182230] border-2 border-[#00ff66] text-white text-base md:text-lg font-mono font-black focus:ring-2 focus:ring-[#00ff66] outline-none rounded-md"
                />
                {/* Presets */}
                <div className="flex flex-wrap gap-2 pt-0.5">
                  {[300, 500, 1000, 2500].map((pt) => (
                    <button
                      key={pt}
                      type="button"
                      onClick={() => setTargetPts(pt)}
                      className={`px-3 py-1.5 text-xs font-mono font-bold border transition-all cursor-pointer rounded-sm ${
                        parseInt(targetPts) === pt
                          ? 'bg-[#00ff66] text-black border-white font-black'
                          : 'bg-[#182230] text-gray-300 border-[#2a3442] hover:border-[#00ff66]'
                      }`}
                    >
                      {pt} PTS
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration Days */}
              <div className="space-y-2.5">
                <label className="block text-xs md:text-sm font-black text-gray-200 uppercase tracking-wider flex items-center gap-2">
                  <Calendar size={18} className="text-[#ffee00]" />
                  <span>DURATION (DAYS)</span>
                </label>
                <input
                  type="number"
                  value={durationDays}
                  onChange={(e) => setDurationDays(e.target.value)}
                  min="1"
                  max="30"
                  className="w-full px-4 py-3 bg-[#182230] border-2 border-[#ffee00] text-white text-base md:text-lg font-mono font-black focus:ring-2 focus:ring-[#ffee00] outline-none rounded-md"
                />
                {/* Presets */}
                <div className="flex flex-wrap gap-2 pt-0.5">
                  {[3, 7, 14, 30].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDurationDays(d)}
                      className={`px-3 py-1.5 text-xs font-mono font-bold border transition-all cursor-pointer rounded-sm ${
                        parseInt(durationDays) === d
                          ? 'bg-[#ffee00] text-black border-white font-black'
                          : 'bg-[#182230] text-gray-300 border-[#2a3442] hover:border-[#ffee00]'
                      }`}
                    >
                      {d} DAYS
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* LIVE BATTLE PREVIEW CARD */}
            <div className="bg-[#182230] border-2 border-[#00f0ff] p-4 space-y-3 rounded-md">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-gray-300">
                <span className="uppercase flex items-center gap-1.5 text-[#00f0ff] font-bold">
                  <Zap size={15} /> LIVE CHALLENGE SUMMARY PREVIEW
                </span>
                <span className="text-[#00ff66] font-black uppercase text-xs">REWARD: +250 SP</span>
              </div>
              <div className="flex items-center justify-between bg-black/60 p-3.5 border border-[#2a3442] rounded-sm">
                <div className="text-sm md:text-base font-black text-white uppercase">
                  {challengeType === 'team' ? userDept : userName}
                </div>
                <div className="text-xl font-black text-[#00f0ff] px-3">VS</div>
                <div className="text-sm md:text-base font-black text-[#00ff66] uppercase">
                  {opponent}
                </div>
              </div>
              <div className="flex justify-between text-xs md:text-sm font-mono text-gray-300 font-bold px-1">
                <span>Target: <strong className="text-[#00ff66] font-black">{targetPts} Points</strong></span>
                <span>Duration: <strong className="text-[#ffee00] font-black">{durationDays} Days</strong></span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 bg-[#00ff66] text-black font-black uppercase text-sm md:text-base tracking-widest border-2 border-white hover:bg-black hover:text-[#00ff66] transition-all shadow-[0_0_20px_rgba(0,255,102,0.5)] flex items-center justify-center gap-2.5 cursor-pointer rounded-md"
            >
              <Swords size={20} />
              <span>+ LAUNCH RIVAL CHALLENGE</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
