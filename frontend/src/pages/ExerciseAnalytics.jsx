import React, { useState } from 'react';
import { Video, Activity, CheckCircle2, AlertCircle, RefreshCw, Play } from 'lucide-react';

export default function ExerciseAnalytics() {
  const [exercise, setExercise] = useState('Squat');
  const [exerciseData, setExerciseData] = useState({
    exercise_type: 'Squat',
    reps_detected: 12,
    min_joint_angle_deg: 92.4,
    form_quality_score: 94.5,
    quality_grade: 'Optimal Biomechanical Control (Grade A)',
    posture_feedback: 'Optimal depth achieved - hips parallel to ground. Excellent form!'
  });
  const [analyzing, setAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      const res = await fetch('http://localhost:8000/api/v1/exercise/squat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exercise_name: exercise, simulate_reps: 12 })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.squat_analysis) setExerciseData(data.squat_analysis);
      }
    } catch (e) {
      console.warn('Using fallback exercise analytics');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-purple-500 pb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-wider text-purple-400 uppercase flex items-center gap-3">
            <Video className="text-[#00f0ff]" size={32} />
            Exercise Motion Analytics
          </h1>
          <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-bold">
            Subsystem 2: Real-time exercise tracking & 3D posture form evaluation (MediaPipe + ST-GCN)
          </p>
        </div>

        <button
          onClick={handleAnalyze}
          disabled={analyzing}
          className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white font-extrabold text-xs uppercase tracking-widest border-2 border-white hover:bg-black hover:text-purple-400 transition-all shadow-[0_0_12px_rgba(168,85,247,0.4)]"
        >
          <RefreshCw size={14} className={analyzing ? 'animate-spin' : ''} />
          <span>{analyzing ? 'ANALYZING POSE...' : 'RUN EXERCISE CV ANALYZER'}</span>
        </button>
      </div>

      {/* Main Video & Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Mock Computer Vision Camera Feed Container */}
        <div className="md:col-span-2 bg-[#121820] border-2 border-[#2a3442] p-4 flex flex-col justify-between space-y-4 relative overflow-hidden group">
          <div className="aspect-video bg-slate-900 border border-[#00f0ff]/40 flex flex-col items-center justify-center relative p-6">
            {/* Skeletal Keypoints Overlay Graphic */}
            <div className="absolute inset-0 bg-[radial-gradient(#00f0ff_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />

            <div className="z-10 text-center space-y-3">
              <div className="w-16 h-16 mx-auto bg-[#00f0ff]/10 border-2 border-[#00f0ff] rounded-full flex items-center justify-center text-[#00f0ff] animate-pulse">
                <Play size={28} />
              </div>
              <div className="text-xs font-bold text-white uppercase tracking-wider">
                CAM_FEED_01.MP4 — MEDIAPIPE 3D SKELETAL TRACKER ACTIVE
              </div>
              <div className="inline-block px-3 py-1 bg-purple-950 border border-purple-500 text-purple-300 text-[10px] font-mono">
                Keypoints 11, 12, 23, 24, 25, 26 Locked
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs font-mono text-gray-400 border-t border-[#2a3442] pt-3">
            <span>MODE: SQUAT REPETITION COUNTER</span>
            <span className="text-[#00ff66] font-bold">FPS: 30.0 • 1080p</span>
          </div>
        </div>

        {/* Real-time Analysis Card */}
        <div className="bg-[#121820] border-2 border-purple-500 p-5 flex flex-col justify-between space-y-4 shadow-xl">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-purple-300 uppercase tracking-wider border-b border-purple-500/40 pb-2">
              Biomechanical Evaluation
            </h3>

            {/* Reps Counted */}
            <div className="bg-[#182230] p-4 border border-[#2a3442] text-center">
              <div className="text-4xl font-black text-[#00f0ff]">
                {exerciseData.reps_detected}
              </div>
              <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                Repetitions Detected
              </div>
            </div>

            {/* Form Score */}
            <div className="bg-[#182230] p-4 border border-[#2a3442] text-center">
              <div className="text-3xl font-black text-[#00ff66]">
                {exerciseData.form_quality_score}%
              </div>
              <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                Posture Precision Score
              </div>
            </div>

            {/* ST-GCN Quality Grade */}
            <div className="bg-[#182230] p-3 border border-purple-500/40 text-center">
              <div className="text-xs font-bold text-purple-300 uppercase">
                {exerciseData.quality_grade}
              </div>
              <div className="text-[10px] text-gray-400 font-mono mt-0.5">ST-GCN Classifier</div>
            </div>
          </div>

          {/* Feedback Box */}
          <div className="bg-purple-950/40 p-3 border border-purple-500/50 text-xs text-purple-200 font-mono space-y-1">
            <div className="text-[10px] font-bold text-[#00f0ff] uppercase">REAL-TIME FEEDBACK</div>
            <p className="leading-relaxed">{exerciseData.posture_feedback}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
