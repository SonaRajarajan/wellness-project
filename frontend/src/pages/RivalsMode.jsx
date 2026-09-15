import React, { useState, useEffect } from 'react';
import { Swords, Users, User, Flame, Award, RefreshCw, Shield, PlusCircle, CheckCircle2, BookOpen } from 'lucide-react';

export default function RivalsMode({ user }) {
  const empId = user?.employee_id || user?.id || 'EMP001';
  const userName = user?.name || 'Sona VR';
  const userDept = user?.department || 'Alpha IT';

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
        ends_date: '2026-09-15',
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
        ends_date: '2026-09-12',
        status: 'ACTIVE'
      }
    ]
  });

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
  }, [empId, user]);

  const handleCreateRival = (e) => {
    e.preventDefault();
    setSuccessMsg(`Successfully created new ${challengeType === 'team' ? 'Team vs Team' : 'Player vs Player'} challenge against ${opponent}!`);
    
    if (challengeType === 'team') {
      const newTeamRival = {
        id: `team-${Date.now()}`,
        team_a: 'Alpha IT',
        team_a_pts: 0,
        team_b: opponent,
        team_b_pts: 0,
        target_pts: parseInt(targetPts),
        ends_date: new Date(Date.now() + durationDays * 86400000).toISOString().split('T')[0],
        status: 'ACTIVE'
      };
      setRivalsData({
        ...rivalsData,
        team_vs_team: [newTeamRival, ...rivalsData.team_vs_team]
      });
    } else {
      const newPvpRival = {
        id: `pvp-${Date.now()}`,
        player_a: 'Sona VR',
        player_a_pts: 0,
        player_b: opponent,
        player_b_pts: 0,
        target_pts: parseInt(targetPts),
        ends_date: new Date(Date.now() + durationDays * 86400000).toISOString().split('T')[0],
        status: 'ACTIVE'
      };
      setRivalsData({
        ...rivalsData,
        player_vs_player: [newPvpRival, ...rivalsData.player_vs_player]
      });
    }

    setTimeout(() => {
      setActiveTab('active');
      setSuccessMsg('');
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-[#00f0ff] pb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-wider text-[#00f0ff] uppercase flex items-center gap-3">
            <Swords className="text-[#00ff66]" size={32} />
            Rivals Mode
          </h1>
          <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-bold">
            Cross-Team challenges and competitive battles
          </p>
        </div>

        <button
          onClick={fetchRivals}
          className="flex items-center gap-2 px-4 py-2 bg-[#18202c] border border-[#00f0ff] text-[#00f0ff] text-xs font-bold hover:bg-[#00f0ff] hover:text-black transition-all"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          <span>REFRESH STANDINGS</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-3 border-b border-[#2a3442] pb-3">
        <button
          onClick={() => setActiveTab('active')}
          className={`px-5 py-2 text-xs font-black uppercase tracking-wider border-2 transition-all ${
            activeTab === 'active'
              ? 'bg-[#00f0ff] text-black border-white shadow-[0_0_10px_#00f0ff]'
              : 'bg-[#121820] text-gray-400 border-[#2a3442] hover:border-[#00f0ff]'
          }`}
        >
          Active Rivalries ({rivalsData.team_vs_team.length + rivalsData.player_vs_player.length})
        </button>

        <button
          onClick={() => setActiveTab('rules')}
          className={`px-5 py-2 text-xs font-black uppercase tracking-wider border-2 transition-all ${
            activeTab === 'rules'
              ? 'bg-[#00f0ff] text-black border-white shadow-[0_0_10px_#00f0ff]'
              : 'bg-[#121820] text-gray-400 border-[#2a3442] hover:border-[#00f0ff]'
          }`}
        >
          Challenge Rules
        </button>

        <button
          onClick={() => setActiveTab('create')}
          className={`px-5 py-2 text-xs font-black uppercase tracking-wider border-2 transition-all ${
            activeTab === 'create'
              ? 'bg-[#00f0ff] text-black border-white shadow-[0_0_10px_#00f0ff]'
              : 'bg-[#121820] text-gray-400 border-[#2a3442] hover:border-[#00f0ff]'
          }`}
        >
          + Create Rival
        </button>
      </div>

      {successMsg && (
        <div className="p-3 bg-[#00ff66]/10 border border-[#00ff66] text-[#00ff66] text-xs font-bold text-center flex items-center justify-center gap-2">
          <CheckCircle2 size={16} />
          {successMsg}
        </div>
      )}

      {/* VIEW 1: ACTIVE RIVALRIES */}
      {activeTab === 'active' && (
        <div className="space-y-6">
          {/* Team vs Team Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold uppercase text-[#00ff66] tracking-widest border-l-4 border-[#00ff66] pl-3 py-1">
              <Users size={18} />
              <span>Team vs Team</span>
            </div>

            {rivalsData.team_vs_team.map((tvt) => (
              <div
                key={tvt.id}
                className="bg-[#121820] border-2 border-[#2a3442] p-5 relative overflow-hidden shadow-lg hover:border-[#00f0ff] transition-all"
              >
                <span className="absolute top-3 right-3 px-2.5 py-0.5 bg-[#00ff66]/20 border border-[#00ff66] text-[#00ff66] text-[10px] font-bold uppercase">
                  {tvt.status}
                </span>

                <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-6 text-center py-2">
                  {/* Team A */}
                  <div className="bg-[#182230] p-4 border border-[#2a3442]">
                    <div className="w-10 h-10 mx-auto mb-2 bg-[#00f0ff]/10 border border-[#00f0ff] flex items-center justify-center text-[#00f0ff] font-bold text-lg">
                      ⚙️
                    </div>
                    <div className="text-base font-bold text-white uppercase">{tvt.team_a}</div>
                    <div className="text-2xl font-black text-[#00f0ff] mt-1">{tvt.team_a_pts}</div>
                    <div className="text-[10px] text-gray-400 uppercase tracking-widest mt-0.5">PTS</div>
                  </div>

                  {/* VS Badge */}
                  <div className="space-y-2">
                    <div className="text-2xl font-black text-pink-500 tracking-widest">VS</div>
                    <div className="text-xs text-gray-300 font-bold">
                      Ends: <span className="text-[#00f0ff]">{tvt.ends_date}</span>
                    </div>
                    <div className="inline-block px-3 py-1 bg-black/60 border border-[#2a3442] text-xs font-mono text-[#00ff66]">
                      ≥ {tvt.target_pts} pts Challenge
                    </div>
                  </div>

                  {/* Team B */}
                  <div className="bg-[#182230] p-4 border border-[#2a3442]">
                    <div className="w-10 h-10 mx-auto mb-2 bg-purple-500/10 border border-purple-400 flex items-center justify-center text-purple-400 font-bold text-lg">
                      🛡️
                    </div>
                    <div className="text-base font-bold text-white uppercase">{tvt.team_b}</div>
                    <div className="text-2xl font-black text-[#00ff66] mt-1">{tvt.team_b_pts}</div>
                    <div className="text-[10px] text-gray-400 uppercase tracking-widest mt-0.5">PTS</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Player vs Player Section */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-2 text-sm font-bold uppercase text-[#00f0ff] tracking-widest border-l-4 border-[#00f0ff] pl-3 py-1">
              <User size={18} />
              <span>Player vs Player</span>
            </div>

            {rivalsData.player_vs_player.map((pvp) => (
              <div
                key={pvp.id}
                className="bg-[#121820] border-2 border-[#2a3442] p-5 relative overflow-hidden shadow-lg hover:border-[#00f0ff] transition-all"
              >
                <span className="absolute top-3 right-3 px-2.5 py-0.5 bg-[#00ff66]/20 border border-[#00ff66] text-[#00ff66] text-[10px] font-bold uppercase">
                  {pvp.status}
                </span>

                <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-6 text-center py-2">
                  {/* Player A */}
                  <div className="bg-[#182230] p-4 border border-[#2a3442]">
                    <div className="w-10 h-10 mx-auto mb-2 bg-[#00f0ff] text-black font-extrabold flex items-center justify-center rounded-full text-sm">
                      {pvp.player_a.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="text-base font-bold text-white uppercase">{pvp.player_a}</div>
                    <div className="text-2xl font-black text-[#00f0ff] mt-1">{pvp.player_a_pts}</div>
                    <div className="text-[10px] text-gray-400 uppercase tracking-widest mt-0.5">PTS</div>
                  </div>

                  {/* VS Badge */}
                  <div className="space-y-2">
                    <div className="text-2xl font-black text-pink-500 tracking-widest">VS</div>
                    <div className="text-xs text-gray-300 font-bold">
                      Ends: <span className="text-[#00f0ff]">{pvp.ends_date}</span>
                    </div>
                    <div className="inline-block px-3 py-1 bg-black/60 border border-[#2a3442] text-xs font-mono text-[#00ff66]">
                      ≥ {pvp.target_pts} pts Challenge
                    </div>
                  </div>

                  {/* Player B */}
                  <div className="bg-[#182230] p-4 border border-[#2a3442]">
                    <div className="w-10 h-10 mx-auto mb-2 bg-[#00ff66] text-black font-extrabold flex items-center justify-center rounded-full text-sm">
                      {pvp.player_b.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="text-base font-bold text-white uppercase">{pvp.player_b}</div>
                    <div className="text-2xl font-black text-[#00ff66] mt-1">{pvp.player_b_pts}</div>
                    <div className="text-[10px] text-gray-400 uppercase tracking-widest mt-0.5">PTS</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 2: CHALLENGE RULES */}
      {activeTab === 'rules' && (
        <div className="bg-[#121820] border-2 border-[#00f0ff] p-6 md:p-8 space-y-6 shadow-xl">
          <div className="flex items-center gap-3 border-b border-[#2a3442] pb-4">
            <BookOpen size={24} className="text-[#00f0ff]" />
            <div>
              <h2 className="text-lg font-black text-white uppercase tracking-wider">
                Rivals Mode Official Rules & Multipliers
              </h2>
              <p className="text-xs text-gray-400 font-mono">
                Adaptive Difficulty Formula & Points Calculation Guidelines
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
            <div className="bg-[#182230] p-4 border border-[#2a3442] space-y-3">
              <h3 className="text-sm font-bold text-[#00ff66] uppercase">1. Adaptive Difficulty Multiplier D(T, t)</h3>
              <p className="text-gray-300 leading-relaxed">
                Rivals battles dynamically adapt based on participant department health tiers:
              </p>
              <div className="bg-black/60 p-3 border border-[#00ff66]/40 text-[#00ff66] font-mono">
                D(T, t) = 1.0 + 0.05 * min(5, Target_Points / 100)
              </div>
              <p className="text-gray-400 text-[11px]">
                Underperforming teams receive a temporary boost to ensure fair competition.
              </p>
            </div>

            <div className="bg-[#182230] p-4 border border-[#2a3442] space-y-3">
              <h3 className="text-sm font-bold text-[#00f0ff] uppercase">2. Victory & Point Distribution</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Team vs Team Target: Minimum <span className="text-[#00f0ff] font-bold">500 Points</span></li>
                <li>• Player vs Player Target: Minimum <span className="text-[#00f0ff] font-bold">300 Points</span></li>
                <li>• Winner Bonus: <span className="text-[#00ff66] font-bold">+250 Survival Points (SP)</span> awarded to Jungle Store balance</li>
                <li>• Anti-Cheating: MediaPipe computer vision verifies workout repetitions</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: CREATE RIVAL FORM */}
      {activeTab === 'create' && (
        <div className="bg-[#121820] border-2 border-[#00ff66] p-6 md:p-8 space-y-6 shadow-xl">
          <div className="flex items-center gap-3 border-b border-[#2a3442] pb-4">
            <PlusCircle size={24} className="text-[#00ff66]" />
            <div>
              <h2 className="text-lg font-black text-white uppercase tracking-wider">
                Create New Rival Challenge
              </h2>
              <p className="text-xs text-gray-400 font-mono">
                Challenge another department or employee to a wellness duel
              </p>
            </div>
          </div>

          <form onSubmit={handleCreateRival} className="space-y-6 max-w-xl">
            <div>
              <label className="block text-xs uppercase font-bold text-gray-300 mb-2">
                Challenge Type
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => { setChallengeType('team'); setOpponent('Beta IT'); }}
                  className={`py-2.5 px-4 border text-xs font-bold uppercase transition-all ${
                    challengeType === 'team'
                      ? 'bg-[#00ff66] text-black border-white shadow-[0_0_10px_#00ff66]'
                      : 'bg-[#182230] text-gray-400 border-[#2a3442]'
                  }`}
                >
                  Team vs Team
                </button>

                <button
                  type="button"
                  onClick={() => { setChallengeType('pvp'); setOpponent('Priya Kapoor'); }}
                  className={`py-2.5 px-4 border text-xs font-bold uppercase transition-all ${
                    challengeType === 'pvp'
                      ? 'bg-[#00f0ff] text-black border-white shadow-[0_0_10px_#00f0ff]'
                      : 'bg-[#182230] text-gray-400 border-[#2a3442]'
                  }`}
                >
                  Player vs Player
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase font-bold text-gray-300 mb-2">
                Select Opponent ({challengeType === 'team' ? 'Department' : 'Player'})
              </label>
              {challengeType === 'team' ? (
                <select
                  value={opponent}
                  onChange={(e) => setOpponent(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#182230] border-2 border-[#2a3442] text-white text-xs font-mono focus:border-[#00ff66] outline-none"
                >
                  <option value="Beta IT">Beta IT</option>
                  <option value="Operations">Operations</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Design">Design</option>
                </select>
              ) : (
                <select
                  value={opponent}
                  onChange={(e) => setOpponent(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#182230] border-2 border-[#2a3442] text-white text-xs font-mono focus:border-[#00f0ff] outline-none"
                >
                  <option value="Priya Kapoor">Priya Kapoor (Alpha IT)</option>
                  <option value="Kavya Patel">Kavya Patel (Beta IT)</option>
                  <option value="Aditya Sharma">Aditya Sharma (Alpha IT)</option>
                  <option value="Raj Verma">Raj Verma (Operations)</option>
                </select>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase font-bold text-gray-300 mb-2">
                  Target Points
                </label>
                <input
                  type="number"
                  value={targetPts}
                  onChange={(e) => setTargetPts(e.target.value)}
                  min="100"
                  step="50"
                  className="w-full px-4 py-2.5 bg-[#182230] border-2 border-[#2a3442] text-white text-xs font-mono focus:border-[#00ff66] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-bold text-gray-300 mb-2">
                  Duration (Days)
                </label>
                <input
                  type="number"
                  value={durationDays}
                  onChange={(e) => setDurationDays(e.target.value)}
                  min="1"
                  max="30"
                  className="w-full px-4 py-2.5 bg-[#182230] border-2 border-[#2a3442] text-white text-xs font-mono focus:border-[#00ff66] outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#00ff66] text-black font-black uppercase text-xs tracking-widest border-2 border-white hover:bg-black hover:text-[#00ff66] transition-all shadow-[0_0_15px_#00ff66]"
            >
              + LAUNCH RIVAL CHALLENGE
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
