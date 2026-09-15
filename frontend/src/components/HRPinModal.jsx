import React, { useState } from 'react';
import { Lock, ShieldAlert, KeyRound, ArrowRight, X, Eye, EyeOff } from 'lucide-react';

export default function HRPinModal({ isOpen, onClose, onSuccess }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [showPin, setShowPin] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pin.trim().toUpperCase() === 'HR01S') {
      setError('');
      setPin('');
      if (onSuccess) onSuccess();
    } else {
      setError('ACCESS DENIED: Invalid Security PIN. Authorized HR PIN required.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <div className="w-full max-w-md bg-[#121820] border-2 border-red-500 p-6 shadow-[0_0_50px_rgba(239,68,68,0.5)] relative text-white my-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white bg-[#182230] p-1.5 border border-[#2a3442] hover:border-red-500 transition-all cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Icon & Title */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-3 bg-red-500/10 border-2 border-red-500 rounded-full flex items-center justify-center text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]">
            <Lock size={30} />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-950/80 border border-red-500 text-red-400 text-[10px] font-bold uppercase tracking-widest mb-2">
            <ShieldAlert size={13} />
            RESTRICTED PRIVACY PORTAL
          </div>

          <h2 className="text-xl font-black text-white uppercase tracking-wider">
            HR SECURITY PIN REQUIRED
          </h2>
          <p className="text-xs text-gray-400 mt-1 font-mono">
            Enter authorized executive PIN to access workforce employee analytics & player directory.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase font-bold text-red-400 tracking-wider mb-2 flex items-center gap-1.5">
              <KeyRound size={14} />
              ENTER EXECUTIVE HR PIN (HR01S)
            </label>

            <div className="relative">
              <input
                type={showPin ? "text" : "password"}
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError('');
                }}
                placeholder="Enter PIN..."
                className="w-full px-4 py-3 bg-[#0b0e14] border-2 border-red-500 text-white font-mono text-center text-lg font-black tracking-widest focus:outline-none focus:border-[#00f0ff] uppercase placeholder:normal-case placeholder:text-gray-600"
                autoFocus
                required
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-white"
              >
                {showPin ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-950/80 border border-red-500 text-red-400 text-xs font-bold font-mono text-center">
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-red-600 text-white font-black uppercase tracking-widest text-xs border-2 border-white hover:bg-black hover:text-red-400 transition-all shadow-[0_0_20px_rgba(239,68,68,0.5)] flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>VERIFY PIN & UNLOCK PORTAL</span>
            <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
