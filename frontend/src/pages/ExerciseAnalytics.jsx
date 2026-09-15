import React, { useState, useRef } from 'react';
import { Video, Activity, CheckCircle2, AlertCircle, RefreshCw, Upload, Play, FileVideo } from 'lucide-react';

export default function ExerciseAnalytics() {
  const [exercise, setExercise] = useState('Squat');
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [exerciseData, setExerciseData] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const fileInputRef = useRef(null);
  const videoRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
      setExerciseData(null); // Clear previous evaluation results when a new video is selected
      const url = URL.createObjectURL(file);
      setVideoPreviewUrl(url);

      // Automatically play video in background when file is loaded
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.currentTime = 0;
          videoRef.current.play().catch(() => {});
          setIsPlaying(true);
        }
      }, 250);
    }
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    
    // Play video in background while analyzing
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }

    try {
      if (videoFile) {
        // Upload video file to FastAPI backend for MediaPipe & ST-GCN analysis
        const formData = new FormData();
        formData.append('video', videoFile);
        formData.append('exercise_type', exercise);
        formData.append('employee_id', 'EMP001');

        const res = await fetch('http://localhost:8000/api/v1/exercise-analysis/upload-video', {
          method: 'POST',
          body: formData
        });

        if (res.ok) {
          const data = await res.json();
          setExerciseData({
            exercise_type: data.exercise_type || exercise,
            reps_detected: data.reps_detected,
            min_joint_angle_deg: data.min_joint_angle_deg,
            form_quality_score: data.form_quality_score,
            quality_grade: data.stgcn_movement_quality || data.quality_grade,
            posture_feedback: Array.isArray(data.posture_feedback) ? data.posture_feedback.join(' ') : data.posture_feedback,
            total_frames_analyzed: data.total_frames_analyzed || 90,
            calories_burned_est: data.calories_burned_est,
            duration_seconds: data.duration_seconds
          });
        }
      } else {
        // Evaluate default simulated video landmark sequence
        const res = await fetch('http://localhost:8000/api/v1/exercise-analysis/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ employee_id: 'EMP001', exercise_type: exercise })
        });
        if (res.ok) {
          const data = await res.json();
          setExerciseData({
            exercise_type: data.exercise_type || exercise,
            reps_detected: data.reps_detected,
            min_joint_angle_deg: 92.4,
            form_quality_score: data.form_quality_score,
            quality_grade: data.stgcn_movement_quality,
            posture_feedback: Array.isArray(data.posture_feedback) ? data.posture_feedback.join(' ') : data.posture_feedback,
            total_frames_analyzed: 90,
            calories_burned_est: data.calories_burned_est,
            duration_seconds: 24.0
          });
        }
      }
    } catch (e) {
      console.warn('Backend API connection warning', e);
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

        <div className="flex items-center gap-3">
          <select
            value={exercise}
            onChange={(e) => {
              setExercise(e.target.value);
              setExerciseData(null);
            }}
            className="bg-[#121820] text-purple-300 font-bold text-xs uppercase px-3 py-2.5 border-2 border-purple-500/60 rounded focus:outline-none"
          >
            <option value="Squat">Squat</option>
            <option value="Pushup">Pushup</option>
            <option value="Lunge">Lunge</option>
            <option value="Bicep Curl">Bicep Curl</option>
          </select>

          <button
            onClick={handleAnalyze}
            disabled={analyzing}
            className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white font-extrabold text-xs uppercase tracking-widest border-2 border-white hover:bg-black hover:text-purple-400 transition-all shadow-[0_0_12px_rgba(168,85,247,0.4)]"
          >
            <RefreshCw size={14} className={analyzing ? 'animate-spin' : ''} />
            <span>{analyzing ? 'ANALYZING POSE...' : videoFile ? 'ANALYZE UPLOADED VIDEO' : 'RUN EXERCISE CV ANALYZER'}</span>
          </button>
        </div>
      </div>

      {/* Main Video & Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Computer Vision Video Player & File Upload Box */}
        <div className="md:col-span-2 bg-[#121820] border-2 border-[#2a3442] p-4 flex flex-col justify-between space-y-4 relative overflow-hidden group">
          
          {/* File Upload Trigger Row */}
          <div className="flex items-center justify-between bg-[#182230] p-3 border border-purple-500/30">
            <div className="flex items-center gap-3">
              <FileVideo className="text-[#00f0ff]" size={20} />
              <div>
                <div className="text-xs font-bold text-white uppercase">
                  {videoFile ? videoFile.name : 'No exercise video uploaded yet'}
                </div>
                <div className="text-[10px] text-gray-400">
                  {videoFile ? `${(videoFile.size / (1024 * 1024)).toFixed(2)} MB • ${videoFile.type}` : 'Upload MP4, MOV, AVI, or WEBM video for AI pose model evaluation'}
                </div>
              </div>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="video/*"
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 bg-[#00f0ff]/10 border border-[#00f0ff] text-[#00f0ff] font-bold text-xs uppercase hover:bg-[#00f0ff] hover:text-black transition-all"
            >
              <Upload size={14} />
              <span>{videoFile ? 'Change Video' : 'Upload Video'}</span>
            </button>
          </div>

          {/* Video Container / Preview */}
          <div className="aspect-video bg-slate-900 border border-[#00f0ff]/40 flex flex-col items-center justify-center relative p-2 overflow-hidden">
            {videoPreviewUrl ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <video
                  ref={videoRef}
                  src={videoPreviewUrl}
                  controls
                  autoPlay
                  loop
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  className="w-full h-full object-contain z-10 rounded border border-[#00f0ff]/30"
                />

                {/* AI Scanning & Pose HUD Overlay on Playing Video */}
                {analyzing && (
                  <div className="absolute inset-0 z-20 pointer-events-none bg-purple-950/30 flex flex-col justify-between p-4 border-2 border-[#00f0ff]/80 animate-pulse">
                    <div className="flex items-center justify-between bg-black/80 backdrop-blur px-3 py-1.5 rounded border border-[#00f0ff]/40">
                      <span className="text-[10px] font-mono text-[#00f0ff] uppercase flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#00ff66] animate-ping" />
                        MEDIAPIPE 3D LANDMARK MESH SCANNER ACTIVE
                      </span>
                      <span className="text-[10px] font-mono text-purple-300">EXTRACTING 33 KEYPOINTS...</span>
                    </div>

                    <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-[#00f0ff] to-transparent shadow-[0_0_15px_#00f0ff] animate-bounce" />

                    <div className="bg-black/90 backdrop-blur p-2 border border-purple-500/60 text-center">
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        ST-GCN SPATIO-TEMPORAL GRAPH CONVOLUTION CLASSIFYING REPS & POSTURE FORM...
                      </span>
                    </div>
                  </div>
                )}

                {/* Post-Analysis AI Overlay Badge on Playing Video */}
                {exerciseData && !analyzing && (
                  <div className="absolute top-4 left-4 z-20 pointer-events-none bg-black/85 border border-[#00ff66] px-3.5 py-2.5 rounded shadow-xl backdrop-blur space-y-1">
                    <div className="text-[10px] font-mono text-[#00ff66] font-bold uppercase flex items-center gap-1.5">
                      <CheckCircle2 size={13} />
                      AI BIOMECHANICAL EVALUATION COMPLETE
                    </div>
                    <div className="text-xs font-extrabold text-white flex items-center gap-3">
                      <span>REPS: <span className="text-[#00f0ff] font-black text-sm">{exerciseData.reps_detected}</span></span>
                      <span>SCORE: <span className="text-[#00ff66] font-black text-sm">{exerciseData.form_quality_score}%</span></span>
                      <span>ANGLE: <span className="text-purple-300 font-black text-sm">{exerciseData.min_joint_angle_deg}°</span></span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className="absolute inset-0 bg-[radial-gradient(#00f0ff_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
                <div className="z-10 text-center space-y-3 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <div className="w-16 h-16 mx-auto bg-[#00f0ff]/10 border-2 border-[#00f0ff] rounded-full flex items-center justify-center text-[#00f0ff] animate-pulse">
                    <Play size={28} />
                  </div>
                  <div className="text-xs font-bold text-white uppercase tracking-wider">
                    CAM_FEED_01.MP4 — MEDIAPIPE 3D SKELETAL TRACKER READY
                  </div>
                  <div className="inline-block px-3 py-1 bg-purple-950 border border-purple-500 text-purple-300 text-[10px] font-mono">
                    Click 'Upload Video' above or click here to test an exercise video
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="flex items-center justify-between text-xs font-mono text-gray-400 border-t border-[#2a3442] pt-3">
            <span>MODE: {exercise.toUpperCase()} REPETITION COUNTER</span>
            <span className="text-[#00ff66] font-bold">MEDIAPIPE POSE 3D • 33 LANDMARKS</span>
          </div>
        </div>

        {/* Real-time Biomechanical Analysis Results Card */}
        <div className="bg-[#121820] border-2 border-purple-500 p-5 flex flex-col justify-between space-y-4 shadow-xl">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-purple-300 uppercase tracking-wider border-b border-purple-500/40 pb-2 flex items-center justify-between">
              <span>Biomechanical Evaluation</span>
              <Activity className="text-[#00f0ff]" size={18} />
            </h3>

            {/* Reps Counted */}
            <div className="bg-[#182230] p-4 border border-[#2a3442] text-center">
              <div className="text-4xl font-black text-[#00f0ff]">
                {exerciseData ? exerciseData.reps_detected : '--'}
              </div>
              <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                Repetitions Detected
              </div>
            </div>

            {/* Form Score */}
            <div className="bg-[#182230] p-4 border border-[#2a3442] text-center">
              <div className="text-3xl font-black text-[#00ff66]">
                {exerciseData ? `${exerciseData.form_quality_score}%` : '--'}
              </div>
              <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                Posture Precision Score
              </div>
            </div>

            {/* Min Joint Flexion Angle */}
            <div className="bg-[#182230] p-3 border border-[#2a3442] text-center flex items-center justify-around">
              <div>
                <div className="text-xl font-bold text-white">
                  {exerciseData ? `${exerciseData.min_joint_angle_deg}°` : '--'}
                </div>
                <div className="text-[9px] text-gray-400 uppercase font-mono">Min Flexion Angle</div>
              </div>
              <div className="w-px h-8 bg-gray-700" />
              <div>
                <div className="text-xl font-bold text-[#00f0ff]">
                  {exerciseData ? `${exerciseData.calories_burned_est} kcal` : '--'}
                </div>
                <div className="text-[9px] text-gray-400 uppercase font-mono">Calories Burned</div>
              </div>
            </div>

            {/* ST-GCN Quality Grade */}
            <div className="bg-[#182230] p-3 border border-purple-500/40 text-center">
              <div className="text-xs font-bold text-purple-300 uppercase">
                {exerciseData ? exerciseData.quality_grade : 'Awaiting Video Analysis...'}
              </div>
              <div className="text-[10px] text-gray-400 font-mono mt-0.5">ST-GCN Classifier</div>
            </div>
          </div>

          {/* Feedback Box */}
          <div className="bg-purple-950/40 p-3 border border-purple-500/50 text-xs text-purple-200 font-mono space-y-1">
            <div className="text-[10px] font-bold text-[#00f0ff] uppercase flex items-center justify-between">
              <span>REAL-TIME AI FEEDBACK</span>
              <CheckCircle2 size={12} className={exerciseData ? 'text-[#00ff66]' : 'text-gray-500'} />
            </div>
            <p className="leading-relaxed">
              {exerciseData
                ? exerciseData.posture_feedback
                : 'Upload your exercise video and click "ANALYZE UPLOADED VIDEO" to compute MediaPipe landmarks, rep counts, and ST-GCN posture evaluation.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
