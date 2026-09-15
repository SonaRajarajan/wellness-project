import React, { useState, useEffect } from 'react';
import { Trophy, Award, Medal, Crown } from 'lucide-react';

export default function Leaderboard() {
  const [filter, setFilter] = useState('podium');
  const [leaderboardData, setLeaderboardData] = useState({
    podium: [
      { rank: 1, department: 'Operations', score: 57, badge: 'CHAMPION', color: 'gold' },
      { rank: 2, department: 'Alpha IT', score: 41, badge: 'RUNNER-UP', color: 'silver' },
      { rank: 3, department: 'Beta IT', score: 40, badge: 'THIRD PLACE', color: 'bronze' }
    ],
    full_rankings: [
      { rank: 1, department: 'Operations', score: 57, points: 4800, members: 14 },
      { rank: 2, department: 'Alpha IT', score: 41, points: 3950, members: 18 },
      { rank: 3, department: 'Beta IT', score: 40, points: 3820, members: 12 },
      { rank: 4, department: 'Data Science', score: 38, points: 3500, members: 10 },
      { rank: 5, department: 'Design', score: 34, points: 3100, members: 8 },
      { rank: 6, department: 'HR', score: 31, points: 2900, members: 6 }
    ]
  });

  useEffect(() => {
    fetch('http://localhost:8000/api/v1/gamification/leaderboard')
      .then((res) => res.json())
      .then((data) => {
        if (data.podium) setLeaderboardData(data);
      })
      .catch((e) => console.warn('Using default leaderboard data'));
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2 border-b-2 border-[#ffee00] pb-4">
        <h1 className="text-2xl md:text-3xl font-black tracking-wider text-[#ffee00] uppercase flex items-center justify-center gap-3">
          <Trophy className="text-[#ffee00]" size={36} />
          Leaderboard
        </h1>
        <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">
          Hall of Fame - Top performers ranked by points
        </p>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {['Inter-Department', 'Intra-Department', 'Podium View', 'Full Rankings'].map((tabKey) => {
          const isSelected = (filter === 'podium' && tabKey === 'Podium View') || (filter === 'full' && tabKey === 'Full Rankings');
          return (
            <button
              key={tabKey}
              onClick={() => setFilter(tabKey === 'Full Rankings' ? 'full' : 'podium')}
              className={`px-5 py-2 text-xs font-black uppercase tracking-wider border-2 transition-all ${
                isSelected
                  ? 'bg-[#ffee00] text-black border-white shadow-[0_0_12px_#ffee00]'
                  : 'bg-[#121820] text-gray-400 border-[#2a3442] hover:border-[#ffee00]'
              }`}
            >
              {tabKey}
            </button>
          );
        })}
      </div>

      {/* Podium Display View (Figure 4.1) */}
      {filter === 'podium' ? (
        <div className="bg-[#121820] border-2 border-[#ffee00] p-6 md:p-10 shadow-[0_0_25px_rgba(255,238,0,0.15)] space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end justify-center pt-8 max-w-4xl mx-auto">
            {/* 2nd Place (Left) */}
            <div className="order-2 md:order-1 bg-[#182230] border-2 border-slate-400 p-5 text-center space-y-3 shadow-lg">
              <div className="w-12 h-12 mx-auto bg-slate-400 text-black font-extrabold text-xl flex items-center justify-center rounded-full shadow-[0_0_10px_#94a3b8]">
                2
              </div>
              <Medal className="mx-auto text-slate-300" size={32} />
              <div>
                <div className="text-lg font-bold text-white uppercase">
                  {leaderboardData.podium[1]?.department || 'Alpha IT'}
                </div>
                <div className="text-3xl font-black text-slate-300 mt-1">
                  {leaderboardData.podium[1]?.score || 41}
                </div>
                <div className="text-[10px] text-gray-400 font-mono mt-0.5">PTS</div>
              </div>
              <div className="py-1 px-3 bg-slate-800 text-slate-300 text-[10px] font-black uppercase tracking-widest border border-slate-500">
                RUNNER-UP
              </div>
            </div>

            {/* 1st Place (Center - Elevated) */}
            <div className="order-1 md:order-2 bg-[#1c2736] border-4 border-[#ffee00] p-6 text-center space-y-4 shadow-[0_0_20px_#ffee00] -translate-y-4">
              <div className="w-14 h-14 mx-auto bg-[#ffee00] text-black font-black text-2xl flex items-center justify-center rounded-full shadow-[0_0_15px_#ffee00]">
                1
              </div>
              <Crown className="mx-auto text-[#ffee00]" size={40} />
              <div>
                <div className="text-xl font-black text-white uppercase">
                  {leaderboardData.podium[0]?.department || 'Operations'}
                </div>
                <div className="text-4xl font-black text-[#ffee00] mt-1">
                  {leaderboardData.podium[0]?.score || 57}
                </div>
                <div className="text-[10px] text-gray-400 font-mono mt-0.5">PTS</div>
              </div>
              <div className="py-1.5 px-4 bg-[#ffee00] text-black text-xs font-black uppercase tracking-widest border-2 border-white">
                CHAMPION
              </div>
            </div>

            {/* 3rd Place (Right) */}
            <div className="order-3 bg-[#182230] border-2 border-amber-600 p-5 text-center space-y-3 shadow-lg">
              <div className="w-12 h-12 mx-auto bg-amber-600 text-white font-extrabold text-xl flex items-center justify-center rounded-full shadow-[0_0_10px_#d97706]">
                3
              </div>
              <Award className="mx-auto text-amber-500" size={32} />
              <div>
                <div className="text-lg font-bold text-white uppercase">
                  {leaderboardData.podium[2]?.department || 'Beta IT'}
                </div>
                <div className="text-3xl font-black text-amber-500 mt-1">
                  {leaderboardData.podium[2]?.score || 40}
                </div>
                <div className="text-[10px] text-gray-400 font-mono mt-0.5">PTS</div>
              </div>
              <div className="py-1 px-3 bg-amber-950 text-amber-400 text-[10px] font-black uppercase tracking-widest border border-amber-600">
                THIRD PLACE
              </div>
            </div>
          </div>

          <div className="text-center pt-4">
            <button
              onClick={() => setFilter('full')}
              className="px-6 py-2.5 bg-[#ffee00] text-black font-black uppercase text-xs tracking-widest border-2 border-white hover:bg-black hover:text-[#ffee00] transition-all shadow-[0_0_10px_#ffee00]"
            >
              View Full Rankings
            </button>
          </div>
        </div>
      ) : (
        /* Full Rankings Table View */
        <div className="bg-[#121820] border-2 border-[#2a3442] p-5 space-y-4">
          <h3 className="text-sm font-bold text-[#ffee00] uppercase tracking-wider">
            Full Department Rankings
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead>
                <tr className="border-b-2 border-[#ffee00] text-[#ffee00] uppercase">
                  <th className="p-3">Rank</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Score</th>
                  <th className="p-3">Points</th>
                  <th className="p-3">Members</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a3442]">
                {leaderboardData.full_rankings.map((r) => (
                  <tr key={r.rank} className="hover:bg-[#182230] transition-colors">
                    <td className="p-3 font-bold text-white">#{r.rank}</td>
                    <td className="p-3 font-bold text-[#00f0ff] uppercase">{r.department}</td>
                    <td className="p-3 font-black text-[#00ff66]">{r.score}</td>
                    <td className="p-3 text-gray-300">{r.points.toLocaleString()} pts</td>
                    <td className="p-3 text-gray-400">{r.members} active</td>
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
