import React, { useState, useEffect } from 'react';
import { Trees, ShoppingBag, Shield, Flame, Droplets, Apple, CheckCircle2, RefreshCw, UserCheck } from 'lucide-react';

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
            <Trees className="text-[#00f0ff]" size={32} />
            Jungle Survival Store
          </h1>
          <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-bold">
            Trade your points for survival essentials and watch your character thrive!
          </p>
        </div>

        {/* Balance Card + Active Employee Tag */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-[#182230] border border-[#00f0ff] text-right">
            <div className="text-xs font-bold text-white uppercase">{userName}</div>
            <div className="text-[10px] text-[#00f0ff] font-mono">{userDept} • {empId}</div>
          </div>

          <div className="bg-[#121820] border-2 border-[#00ff66] px-5 py-3 text-center shadow-[0_0_15px_rgba(0,255,102,0.2)]">
            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">YOUR BALANCE</div>
            <div className="text-2xl font-black text-[#00ff66] flex items-center justify-center gap-1.5 mt-0.5">
              <span>{jungleData.balance_sp.toLocaleString()}</span>
              <span className="text-xs text-gray-300 font-mono">SP</span>
            </div>
          </div>
        </div>
      </div>

      {message && (
        <div className="p-3 bg-[#00ff66]/10 border border-[#00ff66] text-[#00ff66] text-xs font-bold text-center">
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
                <span className="text-lg font-black text-[#00ff66] flex items-center gap-1">
                  🔥 {itemInfo.cost}
                </span>
              </div>
              <div>
                <h3 className="text-base font-bold text-white uppercase">{itemName}</h3>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">{itemInfo.description}</p>
              </div>
            </div>

            {itemInfo.bought ? (
              <div className="py-2.5 bg-[#00ff66]/20 border border-[#00ff66] text-[#00ff66] text-xs font-bold uppercase tracking-widest text-center flex items-center justify-center gap-1.5">
                <CheckCircle2 size={16} />
                <span>PURCHASED</span>
              </div>
            ) : (
              <button
                onClick={() => handleBuy(itemName)}
                disabled={buying === itemName || jungleData.balance_sp < itemInfo.cost}
                className="w-full py-2.5 bg-[#00f0ff] text-black font-extrabold text-xs uppercase tracking-widest border-2 border-white hover:bg-black hover:text-[#00f0ff] transition-all disabled:opacity-50"
              >
                {buying === itemName ? 'BUYING...' : 'BUY NOW'}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Avatar Progress & Character Transformation (Figures 3.1 & 3.2) */}
      <div className="bg-[#121820] border-2 border-[#00f0ff] p-6 space-y-6 shadow-[0_0_20px_rgba(0,240,255,0.15)]">
        <div className="text-center space-y-1">
          <h2 className="text-lg font-bold text-[#00f0ff] uppercase tracking-wider">
            🌴 {userName}'s Jungle Explorer
          </h2>
          <p className="text-xs text-gray-400 uppercase tracking-widest">
            Watch your character's transformation!
          </p>
          <div className="inline-block mt-2 px-4 py-1 bg-pink-900/40 border border-pink-500 text-pink-300 font-bold text-xs uppercase">
            {jungleData.avatar_status}
          </div>
        </div>

        {/* Explorer Avatar Graphics */}
        <div className="flex flex-col items-center justify-center py-4 space-y-3">
          <div className="w-24 h-24 bg-[#182230] border-4 border-[#00f0ff] rounded-full flex items-center justify-center text-4xl shadow-[0_0_20px_#00f0ff]">
            {jungleData.avatar_status.includes('Thriving') ? '🦸‍♂️' : '🤿'}
          </div>
          <div className="text-xs text-gray-400 text-center italic">
            "Exploring the jungle with {userName} ({empId})..."
          </div>
        </div>

        {/* Progress Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {Object.entries(jungleData.items).map(([itemName, itemInfo]) => (
            <div key={itemName} className="bg-[#182230] p-3 border border-[#2a3442] space-y-1.5">
              <div className="text-xs text-gray-300 font-bold uppercase">{itemName}</div>
              <div className={`text-xs font-bold ${itemInfo.bought ? 'text-[#00ff66]' : 'text-gray-500'}`}>
                {itemInfo.bought ? 'OWNED' : 'NEEDED'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Purchases */}
      <div className="bg-[#121820] border-2 border-[#2a3442] p-5 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <ShoppingBag size={16} className="text-[#00f0ff]" />
          <span>Recent Purchases</span>
        </h3>

        <div className="space-y-2">
          {jungleData.recent_purchases.map((rp, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 bg-[#182230] border border-[#2a3442] text-xs font-mono"
            >
              <span className="text-white font-bold">{rp.item}</span>
              <span className="text-red-400 font-bold">-{rp.cost} pts</span>
              <span className="text-gray-400">{rp.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
