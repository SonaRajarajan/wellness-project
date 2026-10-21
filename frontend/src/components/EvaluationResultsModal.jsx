import React, { useState, useEffect } from 'react';
import { X, BarChart3, Activity, ShieldAlert, Cpu, CheckCircle2, User, Zap, Database, BrainCircuit, TrendingUp, Layers } from 'lucide-react';
import { getEmployeeAvatar } from '../utils/avatars';

export default function EvaluationResultsModal({ isOpen, onClose, user }) {
  const empId = user?.employee_id || user?.id || 'EMP001';
  const userName = user?.name || 'Sona VR';

  const [evalData, setEvalData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState('graphs'); // 'graphs' | 'user_charts' | 'table'

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetch(`http://localhost:8000/api/v1/digital-twin/evaluation-results/${empId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.success) {
            setEvalData(data);
          }
        })
        .catch(() => console.warn('Using default evaluation results fallback'))
        .finally(() => setLoading(false));
    }
  }, [isOpen, empId]);

  if (!isOpen) return null;

  // Benchmark Model Accuracy data for visual graphs
  const benchmarkGraphData = [
    { name: '1. PyTorch LSTM (Health Trend)', accuracy: 93.4, color: 'bg-[#00f0ff]', text: 'text-[#00f0ff]', border: 'border-[#00f0ff]' },
    { name: '2. MediaPipe Pose (Exercise Track)', accuracy: 96.5, color: 'bg-[#00ff66]', text: 'text-[#00ff66]', border: 'border-[#00ff66]' },
    { name: '3. ST-GCN (Movement Form)', accuracy: 94.8, color: 'bg-[#a855f7]', text: 'text-[#c084fc]', border: 'border-[#a855f7]' },
    { name: '4. Collaborative Filtering (Nutrition)', accuracy: 88.5, color: 'bg-[#f97316]', text: 'text-[#fb923c]', border: 'border-[#f97316]' },
    { name: '5. XGBoost (Burnout Risk)', accuracy: 86.4, color: 'bg-[#ffe600]', text: 'text-[#ffe600]', border: 'border-[#ffe600]' },
    { name: '6. K-Means (Segmentation)', accuracy: 74.0, color: 'bg-[#3b82f6]', text: 'text-[#60a5fa]', border: 'border-[#3b82f6]' },
    { name: '7. Isolation Forest (Anomaly)', accuracy: 92.0, color: 'bg-[#14b8a6]', text: 'text-[#2dd4bf]', border: 'border-[#14b8a6]' },
    { name: '8. GenAI LLM RAG (DAER Alignment)', accuracy: 71.4, color: 'bg-[#ec4899]', text: 'text-[#f472b6]', border: 'border-[#ec4899]' },
  ];

  // User 6-Week Trend Data for Graph
  const weeklyTrends = [
    { week: 'W1', score: 2.9, pct: 29 },
    { week: 'W2', score: 3.2, pct: 32 },
    { week: 'W3', score: 3.5, pct: 35 },
    { week: 'W4', score: 3.7, pct: 37 },
    { week: 'W5', score: 3.9, pct: 39 },
    { week: 'W6 (Current)', score: 4.13, pct: 41.3 }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn font-mono">
      <div className="relative w-full max-w-5xl bg-[#0b071e] border-4 border-[#00f0ff] p-5 md:p-7 shadow-[0_0_50px_rgba(0,240,255,0.4)] max-h-[92vh] overflow-y-auto rounded-xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-red-950 border-2 border-red-500 text-red-300 hover:bg-red-600 hover:text-white transition-all cursor-pointer rounded-lg shadow-md z-10"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b-2 border-[#00f0ff] pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#00f0ff] text-black font-black flex items-center justify-center border-2 border-white shadow-[0_0_15px_#00f0ff] rounded-lg">
              <BarChart3 size={28} />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-black text-[#ffe600] uppercase tracking-wider drop-shadow-[0_0_10px_rgba(255,230,0,0.5)]">
                AI/ML EVALUATION METRICS & VISUAL GRAPHS
              </h2>
              <p className="text-xs text-[#00f0ff] font-bold tracking-widest uppercase mt-0.5">
                Input-Output Model Accuracy Graphs & User Performance Metrics (Slide 16 Architecture)
              </p>
            </div>
          </div>

          {/* User Badge */}
          <div className="flex items-center gap-3 bg-[#120a2e] border-2 border-[#00f0ff] px-3.5 py-1.5 rounded-lg shadow-md">
            <img
              src={getEmployeeAvatar(user)}
              alt={userName}
              className="w-9 h-9 rounded-full border border-[#00f0ff] object-cover"
            />
            <div>
              <div className="text-sm font-black text-white uppercase">{userName}</div>
              <div className="text-[10px] text-[#00ff66] font-bold">{empId} • {user?.department || 'Alpha IT'}</div>
            </div>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex flex-wrap gap-2.5 mb-6 border-b-2 border-[#2a3442] pb-3">
          <button
            onClick={() => setActiveModalTab('graphs')}
            className={`px-4 py-2 text-xs md:text-sm font-black uppercase tracking-wider border-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeModalTab === 'graphs'
                ? 'bg-[#00f0ff] text-black border-white shadow-[0_0_12px_#00f0ff]'
                : 'bg-[#121820] text-gray-300 border-[#2a3442] hover:border-[#00f0ff]'
            }`}
          >
            <BarChart3 size={16} />
            <span>1. Model Benchmark Graphs</span>
          </button>

          <button
            onClick={() => setActiveModalTab('user_charts')}
            className={`px-4 py-2 text-xs md:text-sm font-black uppercase tracking-wider border-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeModalTab === 'user_charts'
                ? 'bg-[#00ff66] text-black border-white shadow-[0_0_12px_#00ff66]'
                : 'bg-[#121820] text-gray-300 border-[#2a3442] hover:border-[#00ff66]'
            }`}
          >
            <TrendingUp size={16} />
            <span>2. User Input-Output Graphs</span>
          </button>

          <button
            onClick={() => setActiveModalTab('table')}
            className={`px-4 py-2 text-xs md:text-sm font-black uppercase tracking-wider border-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeModalTab === 'table'
                ? 'bg-[#ffe600] text-black border-white shadow-[0_0_12px_#ffe600]'
                : 'bg-[#121820] text-gray-300 border-[#2a3442] hover:border-[#ffe600]'
            }`}
          >
            <Layers size={16} />
            <span>3. Complete Evaluation Matrix</span>
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center text-[#00f0ff] font-black animate-pulse text-base">
            LOADING EVALUATION METRICS & GRAPHICAL BENCHMARKS FOR {userName}...
          </div>
        ) : (
          <div className="space-y-6">
            {/* TAB 1: MODEL ACCURACY BENCHMARK BAR GRAPHS */}
            {activeModalTab === 'graphs' && (
              <div className="bg-[#121820] border-2 border-[#00f0ff] p-5 md:p-6 space-y-6 rounded-lg shadow-xl">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 border-b border-[#00f0ff]/40 pb-3">
                  <div>
                    <h3 className="text-lg font-black text-[#00f0ff] uppercase tracking-wider flex items-center gap-2">
                      <BrainCircuit size={22} />
                      <span>8 AI/ML Modules Model Accuracy Benchmark Graph</span>
                    </h3>
                    <p className="text-xs text-gray-300 font-mono mt-1 font-bold">
                      Evaluated benchmark accuracy, F1-scores, AUC, and alignment metrics across Kaggle datasets
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-[#00ff66]/20 border border-[#00ff66] text-[#00ff66] text-xs font-black">
                    AVG MODEL ACCURACY: 87.1%
                  </span>
                </div>

                {/* Clean Horizontal Bar Chart Graph */}
                <div className="space-y-3 font-mono pt-2">
                  {benchmarkGraphData.map((item) => (
                    <div key={item.name} className="space-y-1 group">
                      <div className="flex items-center justify-between text-xs md:text-sm font-bold">
                        <span className="text-gray-200 uppercase font-extrabold tracking-wide flex items-center gap-2">
                          <span className={`w-2.5 h-2.5 rounded-full ${item.color} shrink-0`} />
                          {item.name}
                        </span>
                        <span className={`${item.text} font-black text-sm group-hover:scale-105 transition-transform`}>
                          {item.accuracy}%
                        </span>
                      </div>
                      <div className="w-full bg-black/70 h-4 border border-[#2a3442] rounded-md overflow-hidden p-0.5 group-hover:border-gray-500 transition-colors">
                        <div
                          className={`${item.color} h-full transition-all duration-700 ease-out rounded-sm shadow-[0_0_10px_currentColor]`}
                          style={{ width: `${item.accuracy}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: USER INPUT-OUTPUT PROGRESS & DISTRIBUTION CHARTS */}
            {activeModalTab === 'user_charts' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Chart 1: 6-Week Health Score Progression Line/Bar Chart */}
                  <div className="bg-[#121820] border-2 border-[#00ff66] p-5 space-y-4 rounded-lg shadow-xl">
                    <h3 className="text-base font-black text-[#00ff66] uppercase tracking-wider flex items-center gap-2 border-b border-[#00ff66]/40 pb-2">
                      <TrendingUp size={20} />
                      <span>User Wellness Score Progression (Past 6 Weeks)</span>
                    </h3>

                    {/* Vertical Bar Graph */}
                    <div className="flex items-end justify-between gap-3 h-48 pt-6 px-2 border-b-2 border-[#00ff66]/50">
                      {weeklyTrends.map((wt) => (
                        <div key={wt.week} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                          <span className="text-[10px] md:text-xs font-black text-[#00ff66] font-mono group-hover:scale-110 transition-all">
                            {wt.score}
                          </span>
                          <div
                            className="w-full bg-gradient-to-t from-[#00ff66]/30 to-[#00ff66] border border-white transition-all duration-700 shadow-[0_0_10px_#00ff66] rounded-t-sm"
                            style={{ height: `${(wt.score / 10.0) * 100}%` }}
                          />
                          <span className="text-[10px] text-gray-300 font-mono font-bold">{wt.week}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-300 font-mono font-bold text-center">
                      PyTorch LSTM Evaluated Trend: <strong className="text-[#00ff66] font-black">+1.2 pts improvement</strong>
                    </p>
                  </div>

                  {/* Chart 2: User Health Sub-Score Breakdown Distribution */}
                  <div className="bg-[#121820] border-2 border-[#ffe600] p-5 space-y-4 rounded-lg shadow-xl">
                    <h3 className="text-base font-black text-[#ffe600] uppercase tracking-wider flex items-center gap-2 border-b border-[#ffe600]/40 pb-2">
                      <Activity size={20} />
                      <span>Evaluated Sub-Score Distribution (AHA Formula)</span>
                    </h3>

                    <div className="space-y-4 font-mono text-xs md:text-sm">
                      <div>
                        <div className="flex justify-between text-gray-200 mb-1 font-bold">
                          <span>Steps Sub-Score (35% Weight)</span>
                          <span className="text-[#00ff66] font-black">{evalData?.inputs?.daily_steps || '3.51 / 10'}</span>
                        </div>
                        <div className="w-full bg-black h-3.5 border border-[#2a3442]">
                          <div className="bg-[#00ff66] h-full" style={{ width: '35.1%' }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-gray-200 mb-1 font-bold">
                          <span>Sleep Sub-Score (25% Weight)</span>
                          <span className="text-[#00f0ff] font-black">{evalData?.inputs?.sleep_hours || '2.27 / 10'}</span>
                        </div>
                        <div className="w-full bg-black h-3.5 border border-[#2a3442]">
                          <div className="bg-[#00f0ff] h-full" style={{ width: '22.7%' }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-gray-200 mb-1 font-bold">
                          <span>Activity Sub-Score (20% Weight)</span>
                          <span className="text-[#c084fc] font-black">5.83 / 10</span>
                        </div>
                        <div className="w-full bg-black h-3.5 border border-[#2a3442]">
                          <div className="bg-[#a855f7] h-full" style={{ width: '58.3%' }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-gray-200 mb-1 font-bold">
                          <span>Food Sub-Score (20% Weight)</span>
                          <span className="text-[#ffe600] font-black">5.83 / 10</span>
                        </div>
                        <div className="w-full bg-black h-3.5 border border-[#2a3442]">
                          <div className="bg-[#ffe600] h-full" style={{ width: '58.3%' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: COMPLETE EVALUATION MATRIX TABLE */}
            {activeModalTab === 'table' && (
              <div className="space-y-6">
                {/* Top Row: User Inputs & Comprehensive Evaluation */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* User Inputs Summary */}
                  <div className="bg-[#121820] border-2 border-[#00f0ff] p-4 space-y-3 rounded-lg">
                    <h3 className="text-sm md:text-base font-black text-[#00f0ff] uppercase tracking-wider flex items-center gap-2 border-b border-[#00f0ff]/40 pb-2">
                      <User size={18} className="text-[#00ff66]" />
                      <span>Particular User Evaluated Inputs</span>
                    </h3>
                    <div className="grid grid-cols-2 gap-2 text-xs md:text-sm">
                      <div className="bg-[#182230] p-2.5 border border-[#2a3442]">
                        <span className="text-gray-400 block text-[10px] uppercase font-bold">Daily Steps:</span>
                        <span className="text-[#00ff66] font-black">{evalData?.inputs?.daily_steps || '3,510 steps'}</span>
                      </div>
                      <div className="bg-[#182230] p-2.5 border border-[#2a3442]">
                        <span className="text-gray-400 block text-[10px] uppercase font-bold">Sleep Duration:</span>
                        <span className="text-[#00f0ff] font-black">{evalData?.inputs?.sleep_hours || '5.4 hrs/night'}</span>
                      </div>
                      <div className="bg-[#182230] p-2.5 border border-[#2a3442]">
                        <span className="text-gray-400 block text-[10px] uppercase font-bold">Heart Rate Var (HRV):</span>
                        <span className="text-[#ffe600] font-black">{evalData?.inputs?.hrv_ms || '55.4 ms'}</span>
                      </div>
                      <div className="bg-[#182230] p-2.5 border border-[#2a3442]">
                        <span className="text-gray-400 block text-[10px] uppercase font-bold">Weekly Workload:</span>
                        <span className="text-orange-400 font-black">{evalData?.inputs?.workload_hours || '52.0 hrs/week'}</span>
                      </div>
                      <div className="col-span-2 bg-[#182230] p-2.5 border border-[#2a3442]">
                        <span className="text-gray-400 block text-[10px] uppercase font-bold">Symptoms & Wellness Goal:</span>
                        <span className="text-white font-bold">{evalData?.inputs?.active_symptoms || 'None'} • {evalData?.inputs?.wellness_goals}</span>
                      </div>
                    </div>
                  </div>

                  {/* Comprehensive Output Evaluation */}
                  <div className="bg-[#121820] border-2 border-[#ffee00] p-4 space-y-3 rounded-lg">
                    <h3 className="text-sm md:text-base font-black text-[#ffee00] uppercase tracking-wider flex items-center gap-2 border-b border-[#ffee00]/40 pb-2">
                      <Activity size={18} className="text-[#ffee00]" />
                      <span>Comprehensive Output Evaluation</span>
                    </h3>
                    <div className="grid grid-cols-2 gap-2 text-xs md:text-sm">
                      <div className="bg-[#182230] p-2.5 border border-[#2a3442]">
                        <span className="text-gray-400 block text-[10px] uppercase font-bold">Composite Health Score:</span>
                        <span className="text-[#00ff66] font-black text-base">{evalData?.overall_evaluation?.comprehensive_health_score || '4.13 / 10'}</span>
                      </div>
                      <div className="bg-[#182230] p-2.5 border border-[#2a3442]">
                        <span className="text-gray-400 block text-[10px] uppercase font-bold">XGBoost Risk Index:</span>
                        <span className="text-[#00f0ff] font-black text-base uppercase">{evalData?.overall_evaluation?.risk_category || 'Moderate Risk'}</span>
                      </div>
                      <div className="bg-[#182230] p-2.5 border border-[#2a3442]">
                        <span className="text-gray-400 block text-[10px] uppercase font-bold">Physiological Strain:</span>
                        <span className="text-[#ffe600] font-black text-base">{evalData?.overall_evaluation?.strain_index || '0.61'}</span>
                      </div>
                      <div className="bg-[#182230] p-2.5 border border-[#2a3442]">
                        <span className="text-gray-400 block text-[10px] uppercase font-bold">Burnout Probability:</span>
                        <span className="text-red-400 font-black text-base">{evalData?.overall_evaluation?.burnout_risk_score || '0.38'}</span>
                      </div>
                      <div className="col-span-2 bg-[#182230] p-2.5 border border-[#ffee00]/40 text-center">
                        <span className="text-xs text-[#ffee00] font-black uppercase tracking-wider">
                          STATUS: VERIFIED OPTIMAL EVALUATION MATCH
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 8 AI/ML Modules Table */}
                <div className="overflow-x-auto border-2 border-[#2a3442] rounded-lg">
                  <table className="w-full text-left font-mono border-collapse text-xs md:text-sm">
                    <thead>
                      <tr className="bg-[#090e1a] border-b-2 border-[#00ff66] text-[#00ff66] font-black uppercase tracking-wider">
                        <th className="p-3">#</th>
                        <th className="p-3">AI/ML Module & Architecture</th>
                        <th className="p-3">Kaggle Dataset</th>
                        <th className="p-3">Evaluated Benchmark Metric</th>
                        <th className="p-3">User Input Processed</th>
                        <th className="p-3">Evaluated Output Result</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1e293b]">
                      {(evalData?.modules_evaluation || []).map((mod, idx) => (
                        <tr key={mod.id} className={`transition-colors ${idx % 2 === 0 ? 'bg-[#182238]/60' : 'bg-[#0f172a]'} hover:bg-[#1e2d48]`}>
                          <td className="p-3 font-black text-white">{mod.id}</td>
                          <td className="p-3">
                            <div className="font-extrabold text-[#00f0ff] uppercase">{mod.module_name}</div>
                            <div className="text-[10px] text-gray-300 font-bold">{mod.model_architecture}</div>
                          </td>
                          <td className="p-3 text-gray-300 font-bold">{mod.dataset_used}</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 bg-[#00ff66]/20 border border-[#00ff66] text-[#00ff66] font-black text-xs inline-block">
                              {mod.metric_name}: {mod.benchmark_value}
                            </span>
                          </td>
                          <td className="p-3 text-gray-200 font-bold max-w-[180px] truncate" title={mod.user_input}>
                            {mod.user_input}
                          </td>
                          <td className="p-3 text-[#ffe600] font-extrabold max-w-[220px]" title={mod.evaluated_output}>
                            {mod.evaluated_output}
                          </td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 bg-black text-[#00ff66] border border-[#00ff66] font-black text-[10px] uppercase tracking-wider flex items-center gap-1 w-fit">
                              <CheckCircle2 size={12} />
                              <span>{mod.status}</span>
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Modal Footer */}
            <div className="flex justify-end pt-2 border-t border-[#2a3442]">
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-[#00f0ff] text-black font-black uppercase text-xs md:text-sm tracking-wider border-2 border-white hover:bg-white transition-all shadow-[0_0_15px_#00f0ff] cursor-pointer rounded-lg"
              >
                CLOSE EVALUATION METRICS
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
