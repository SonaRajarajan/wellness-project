import React, { useState, useEffect } from 'react';
import { Trees, ShoppingBag, Shield, Flame, Droplets, Apple, CheckCircle2, RefreshCw, UserCheck, Sparkles } from 'lucide-react';
import { getEmployeeAvatar } from '../utils/avatars';

export default function JungleSurvival({ user }) {
  const empId = user?.employee_id || user?.id || 'EMP001';
  const userName = user?.name || 'Sona VR';
  const userDept = user?.department || 'Alpha IT';

  const [jungleData, setJungleData] = useState({
    balance_sp: (user?.points || 2500),
    avatar_status: 'Struggling to survive',
    items: {
      'Firewood': { bought: true, cost: 100, description: 'Keep your campfire burning bright' },
      'Shelter': { bought: false, cost: 250, description: 'Protect yourself from the elements' },
      'Fresh Water': { bought: false, cost: 75, description: 'Crystal clear sweet spring water' },
      'Jungle Fruit': { bought: false, cost: 150, description: 'Delicious tropical energy' }
    },
    recent_purchases: [
      { item: 'Firewood', cost: 100, time: '2 min ago' },
      { item: 'Fresh Water', cost: 75, time: '1 hour ago' },
      { item: 'Shelter', cost: 250, time: 'Yesterday' }
    ]
  });

  const [buying, setBuying] = useState('');
  const [message, setMessage] = useState('');

  const fetchJungleData = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/gamification/jungle-survival?employee_id=${empId}`);
      if (res.ok) {
        const data = await res.json();
        setJungleData(data);
      }
    } catch (e) {
      console.warn('Using default jungle survival state');
    }
  };

  useEffect(() => {
    fetchJungleData();
  }, [empId, user]);

  const handleBuy = async (itemName) => {
    setBuying(itemName);
    setMessage('');
    try {
      const res = await fetch('http://localhost:8000/api/v1/gamification/jungle-survival/buy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item_name: itemName, employee_id: empId })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessage(data.message);
        setJungleData({
          ...jungleData,
          balance_sp: data.new_balance,
          avatar_status: data.avatar_status,
          items: data.items,
          recent_purchases: data.recent_purchases
        });
      } else {
        setMessage(data.detail || 'Could not purchase item');
      }
    } catch (e) {
      // Local state fallback
      const item = jungleData.items[itemName];
      if (item && jungleData.balance_sp >= item.cost) {
        const newBal = jungleData.balance_sp - item.cost;
        const newItems = { ...jungleData.items, [itemName]: { ...item, bought: true } };
        setJungleData({
          ...jungleData,
          balance_sp: newBal,
          items: newItems,
          recent_purchases: [{ item: itemName, cost: item.cost, time: 'Just now' }, ...jungleData.recent_purchases]
        });
        setMessage(`Successfully bought ${itemName}!`);
      }
    } finally {
      setBuying('');
    }
  };

  const getItemIcon = (name) => {
    switch (name) {
      case 'Firewood': return <Flame className="text-orange-500" size={28} />;
      case 'Shelter': return <Shield className="text-[#00f0ff]" size={28} />;
      case 'Fresh Water': return <Droplets className="text-blue-400" size={28} />;
      case 'Jungle Fruit': return <Apple className="text-red-400" size={28} />;
      default: return <ShoppingBag className="text-emerald-400" size={28} />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-[#00ff66] pb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-wider text-[#00ff66] uppercase flex items-center gap-3">
            <Trees className="text-[#00f0ff]" size={36} />
            <span>Jungle Survival Store</span>
          </h1>
          <p className="text-sm md:text-base text-gray-200 mt-1 uppercase tracking-wider font-bold">
            Trade your points for survival essentials and watch your character thrive!
          </p>
        </div>

        {/* Balance Card + Active Employee Tag */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-[#182230] border border-[#00f0ff] text-right">
            <div className="text-sm font-black text-white uppercase">{userName}</div>
            <div className="text-xs text-[#00f0ff] font-mono font-bold">{userDept} • {empId}</div>
          </div>

          <div className="bg-[#121820] border-2 border-[#00ff66] px-5 py-3 text-center shadow-[0_0_15px_rgba(0,255,102,0.2)]">
            <div className="text-xs text-gray-300 font-black uppercase tracking-wider">YOUR BALANCE</div>
            <div className="text-2xl md:text-3xl font-black text-[#00ff66] flex items-center justify-center gap-1.5 mt-0.5">
              <span>{jungleData.balance_sp.toLocaleString()}</span>
              <span className="text-sm text-gray-300 font-mono font-bold">SP</span>
            </div>
          </div>
        </div>
      </div>

      {message && (
        <div className="p-3 bg-[#00ff66]/10 border border-[#00ff66] text-[#00ff66] text-sm font-black text-center">
          {message}
        </div>
      )}

      {/* Store Catalog Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(jungleData.items).map(([itemName, itemInfo]) => (
          <div
            key={itemName}
            className={`bg-[#121820] border-2 p-5 flex flex-col justify-between space-y-4 shadow-lg transition-all ${
              itemInfo.bought
                ? 'border-[#00ff66] shadow-[0_0_10px_rgba(0,255,102,0.2)]'
                : 'border-[#2a3442] hover:border-[#00f0ff]'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                {getItemIcon(itemName)}
                <span className="text-xl font-black text-[#00ff66] flex items-center gap-1">
                  <Flame size={20} /> {itemInfo.cost}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-black text-white uppercase">{itemName}</h3>
                <p className="text-sm text-gray-300 mt-1 leading-relaxed font-bold">{itemInfo.description}</p>
              </div>
            </div>

            {itemInfo.bought ? (
              <div className="py-2.5 bg-[#00ff66]/20 border border-[#00ff66] text-[#00ff66] text-sm font-black uppercase tracking-wider text-center flex items-center justify-center gap-1.5">
                <CheckCircle2 size={18} />
                <span>PURCHASED</span>
              </div>
            ) : (
              <button
                onClick={() => handleBuy(itemName)}
                disabled={buying === itemName || jungleData.balance_sp < itemInfo.cost}
                className="w-full py-2.5 bg-[#00f0ff] text-black font-black text-sm uppercase tracking-wider border-2 border-white hover:bg-black hover:text-[#00f0ff] transition-all disabled:opacity-50"
              >
                {buying === itemName ? 'BUYING...' : 'BUY NOW'}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Avatar Progress & Character Transformation (Figures 3.1 & 3.2) */}
      <div className="bg-[#121826] border-2 border-[#00f0ff]/80 rounded-2xl p-6 md:p-8 space-y-6 shadow-[0_0_30px_rgba(0,240,255,0.2)] relative overflow-hidden">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-1 bg-[#00f0ff]/10 border border-[#00f0ff] rounded-full text-xs font-mono font-extrabold text-[#00f0ff] uppercase tracking-widest">
            <Sparkles size={14} /> LEVEL 12 SURVIVAL MASTER
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-wide flex items-center justify-center gap-2">
            <Trees size={28} className="text-[#00ff66]" />
            <span>{userName.toUpperCase()}'S JUNGLE EXPLORER</span>
          </h2>
          <div className="inline-block px-5 py-1.5 bg-purple-950/80 border-2 border-purple-400 text-purple-200 font-extrabold text-sm md:text-base uppercase tracking-wider rounded-lg shadow-lg">
            {jungleData.avatar_status}
          </div>
        </div>

        {/* 🌟 ENHANCED RPG CHARACTER SHOWCASE 🌟 */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 py-4">
          {/* Avatar Image in RPG Card Frame */}
          <div className="relative group">
            <div className="w-44 h-44 md:w-52 md:h-52 rounded-2xl bg-gradient-to-b from-[#0e1726] to-[#080d16] border-4 border-[#00f0ff] p-3 shadow-[0_0_35px_rgba(0,240,255,0.35)] flex items-center justify-center relative overflow-hidden transition-all group-hover:shadow-[0_0_50px_rgba(0,240,255,0.6)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.15)_0%,transparent_70%)]" />
              <img
                src={getEmployeeAvatar(user || empId, userName)}
                alt={userName}
                className="w-full h-full object-contain relative z-10 drop-shadow-[0_10px_15px_rgba(0,0,0,0.8)]"
              />
            </div>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#00ff66] text-black font-extrabold text-xs uppercase tracking-widest rounded-full border-2 border-white shadow-lg whitespace-nowrap z-20">
              ACTIVE EXPLORER
            </div>
          </div>

          {/* Character Stats & Vitals */}
          {(() => {
            const itemsArr = Object.values(jungleData.items || {});
            const totalCount = itemsArr.length || 4;
            const ownedCount = itemsArr.filter((i) => i.bought).length;
            const healthPct = Math.round((ownedCount / totalCount) * 100);
            const missingItem = Object.entries(jungleData.items || {}).find(([_, info]) => !info.bought)?.[0];

            return (
              <div className="w-full max-w-sm space-y-4 font-mono">
                {/* Health Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-[#00ff66] flex items-center gap-1">
                      <Shield size={14} className={healthPct < 100 ? "text-amber-400" : "text-[#00ff66]"} /> HEALTH
                    </span>
                    <span className="text-white font-extrabold">{healthPct} / 100</span>
                  </div>
                  <div className="w-full h-3 bg-[#0a101b] border border-gray-700 rounded-full overflow-hidden p-0.5">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        healthPct >= 100
                          ? 'bg-[#00ff66] shadow-[0_0_8px_#00ff66]'
                          : healthPct >= 50
                          ? 'bg-amber-400 shadow-[0_0_8px_#f59e0b]'
                          : 'bg-red-500 shadow-[0_0_8px_#ef4444]'
                      }`}
                      style={{ width: `${healthPct}%` }}
                    />
                  </div>
                </div>

                {/* Energy / Stamina Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-[#00f0ff] flex items-center gap-1">
                      <Flame size={14} className="text-[#00f0ff]" /> STAMINA
                    </span>
                    <span className="text-white font-extrabold">{healthPct}%</span>
                  </div>
                  <div className="w-full h-3 bg-[#0a101b] border border-[#00f0ff]/50 rounded-full overflow-hidden p-0.5">
                    <div
                      className="h-full bg-[#00f0ff] rounded-full transition-all duration-500 shadow-[0_0_8px_#00f0ff]"
                      style={{ width: `${healthPct}%` }}
                    />
                  </div>
                </div>

                {/* Survival Quote / Status */}
                <div className="bg-[#16202e] p-3.5 rounded-xl border border-gray-800 text-xs md:text-sm text-gray-300 italic text-center font-medium">
                  {missingItem
                    ? `"Exploring the jungle with ${userName}. ${missingItem} is needed to reach 100% Health!"`
                    : `"Exploring the deep jungle with ${userName} (${empId}). Fully equipped for survival!"`}
                </div>
              </div>
            );
          })()}
        </div>

        {/* Progress Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {Object.entries(jungleData.items).map(([itemName, itemInfo]) => (
            <div
              key={itemName}
              className={`p-5 rounded-xl border flex flex-col items-center justify-center space-y-3 transition-all shadow-md ${
                itemInfo.bought
                  ? 'bg-[#13241b] border-[#00ff66]/70 shadow-[0_0_15px_rgba(0,255,102,0.2)]'
                  : 'bg-[#141b27] border-gray-800 hover:border-gray-700'
              }`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center border ${
                itemInfo.bought
                  ? 'bg-[#00ff66]/15 border-[#00ff66]/50 shadow-[0_0_10px_rgba(0,255,102,0.3)]'
                  : 'bg-gray-800/40 border-gray-700'
              }`}>
                {getItemIcon(itemName)}
              </div>
              <div className="text-sm md:text-base font-extrabold text-white tracking-wide uppercase">
                {itemName}
              </div>
              <div className={`text-xs font-mono font-extrabold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 ${
                itemInfo.bought
                  ? 'bg-[#00ff66]/20 text-[#00ff66] border border-[#00ff66]/50'
                  : 'bg-gray-800/80 text-gray-400 border border-gray-700'
              }`}>
                {itemInfo.bought ? '✓ OWNED' : '🔒 NEEDED'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Purchases */}
      <div className="bg-[#121820] border-2 border-[#2a3442] p-5 space-y-4">
        <h3 className="text-base md:text-lg font-black text-white uppercase tracking-wider flex items-center gap-2">
          <ShoppingBag size={20} className="text-[#00f0ff]" />
          <span>Recent Purchases</span>
        </h3>

        <div className="space-y-2">
          {jungleData.recent_purchases.map((rp, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3.5 bg-[#182230] border border-[#2a3442] text-sm md:text-base font-mono"
            >
              <span className="text-white font-black">{rp.item}</span>
              <span className="text-red-400 font-black">-{rp.cost} pts</span>
              <span className="text-gray-300 font-bold">{rp.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
