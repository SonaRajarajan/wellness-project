import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import EmployeeOnboardingModal from './components/EmployeeOnboardingModal';
import HRPinModal from './components/HRPinModal';
import ArchitectureView from './pages/ArchitectureView';
import Login from './pages/Login';
import RivalsMode from './pages/RivalsMode';
import JungleSurvival from './pages/JungleSurvival';
import ExerciseAnalytics from './pages/ExerciseAnalytics';
import DigitalTwin from './pages/DigitalTwin';
import FoodRecommendations from './pages/FoodRecommendations';
import HealthSuggestions from './pages/HealthSuggestions';
import GenAICoach from './pages/GenAICoach';
import Leaderboard from './pages/Leaderboard';
import HRDashboard from './pages/HRDashboard';
import Players from './pages/Players';

function AppContent() {
  const [user, setUser] = useState({
    id: 'EMP001',
    employee_id: 'EMP001',
    name: 'Sona VR',
    department: 'Alpha IT',
    email: 'sona.vr@pixel.com',
    role: 'Lead AI Engineer',
    activity_level: 'Moderately Active'
  });

  const [isOnboardingOpen, setIsOnboardingOpen] = useState(true);

  // HR Security PIN State (HR01S required for privacy protection)
  const [isHrAuthenticated, setIsHrAuthenticated] = useState(() => {
    return sessionStorage.getItem('isHrAuthenticated') === 'true';
  });
  const [isHrPinModalOpen, setIsHrPinModalOpen] = useState(false);
  const [pendingPath, setPendingPath] = useState(null);

  const navigate = useNavigate();

  const handleSelectEmployee = (selectedEmp) => {
    setUser({
      ...selectedEmp,
      id: selectedEmp.employee_id || selectedEmp.id,
      employee_id: selectedEmp.employee_id || selectedEmp.id
    });
  };

  const handleLogout = () => {
    setIsOnboardingOpen(true);
  };

  const handleOpenHrPinModal = (targetPath) => {
    setPendingPath(targetPath || '/hr-dashboard');
    setIsHrPinModalOpen(true);
  };

  const handleHrPinSuccess = () => {
    setIsHrAuthenticated(true);
    sessionStorage.setItem('isHrAuthenticated', 'true');
    setIsHrPinModalOpen(false);
    if (pendingPath) {
      navigate(pendingPath);
      setPendingPath(null);
    }
  };

  const handleLockHr = (targetRoute = '/digital-twin') => {
    setIsHrAuthenticated(false);
    sessionStorage.removeItem('isHrAuthenticated');
    navigate(targetRoute);
  };

  return (
    <div className="min-h-screen cosmic-bg text-white flex flex-col font-mono selection:bg-[#00f0ff] selection:text-black relative overflow-x-hidden">
      {/* BACKGROUND COSMIC CELESTIAL CANVAS & STARS (Inspired by reference image) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-80">
        {/* Ringed Pink Planet Top-Left */}
        <div className="absolute top-12 left-6 md:left-16 text-3xl md:text-5xl floating-ufo select-none">
          🪐
        </div>
        {/* Red Cratered Moon Top-Center */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 text-2xl md:text-4xl pixel-star select-none">
          🌕
        </div>
        {/* Blue/Green Earth Top-Right */}
        <div className="absolute top-10 right-6 md:right-16 text-4xl md:text-6xl select-none opacity-90">
          🌍
        </div>
        {/* Floating UFO */}
        <div className="absolute top-36 left-1/4 text-2xl md:text-3xl floating-ufo select-none">
          🛸
        </div>
        {/* Satellite */}
        <div className="absolute top-48 right-1/4 text-xl md:text-2xl pixel-star-fast select-none">
          🛰️
        </div>

        {/* Twinkling Pixel Stars Matrix */}
        <div className="absolute top-20 left-12 text-[#ff007f] text-xs pixel-star">✦</div>
        <div className="absolute top-28 left-1/3 text-[#4deeea] text-sm pixel-star-fast">✨</div>
        <div className="absolute top-16 right-1/3 text-[#ffe600] text-xs pixel-star">⭐</div>
        <div className="absolute top-44 right-12 text-[#00ff66] text-sm pixel-star">✦</div>
        <div className="absolute top-72 left-20 text-[#ffe600] text-sm pixel-star-fast">✨</div>
        <div className="absolute top-96 right-20 text-[#ff007f] text-xs pixel-star">⭐</div>
      </div>

      <div className="relative z-10 flex-1 flex flex-col">
        <Navbar
          user={user}
          onSelectEmployee={handleSelectEmployee}
          onLogout={handleLogout}
          onOpenOnboarding={() => setIsOnboardingOpen(true)}
          isHrAuthenticated={isHrAuthenticated}
          onOpenHrPinModal={handleOpenHrPinModal}
          onLockHr={handleLockHr}
        />

        <EmployeeOnboardingModal
          isOpen={isOnboardingOpen}
          onClose={() => setIsOnboardingOpen(false)}
          onSelectEmployee={handleSelectEmployee}
        />

        <HRPinModal
          isOpen={isHrPinModalOpen}
          onClose={() => {
            setIsHrPinModalOpen(false);
            setPendingPath(null);
          }}
          onSuccess={handleHrPinSuccess}
        />

        <main className="flex-1 pb-16">
          <Routes>
            <Route path="/" element={<Navigate to="/digital-twin" replace />} />
            <Route path="/architecture" element={<ArchitectureView />} />
            <Route path="/login" element={<Login onLoginSuccess={(u) => setUser(u)} />} />
            <Route path="/rivals" element={<RivalsMode user={user} />} />
            <Route path="/jungle" element={<JungleSurvival user={user} />} />
            <Route path="/exercise" element={<ExerciseAnalytics user={user} />} />
            <Route path="/digital-twin" element={<DigitalTwin user={user} />} />
            <Route path="/food" element={<FoodRecommendations user={user} />} />
            <Route path="/health" element={<HealthSuggestions user={user} />} />
            <Route path="/coach" element={<GenAICoach user={user} />} />
            <Route path="/leaderboard" element={<Navigate to="/hr-dashboard" replace />} />
            <Route
              path="/hr-dashboard"
              element={
                isHrAuthenticated ? (
                  <HRDashboard
                    user={user}
                    onSelectEmployee={handleSelectEmployee}
                    isHrAuthenticated={isHrAuthenticated}
                    onAuthenticateHr={handleHrPinSuccess}
                  />
                ) : (
                  <Navigate to="/digital-twin" replace />
                )
              }
            />
            <Route
              path="/players"
              element={
                isHrAuthenticated ? (
                  <Players
                    user={user}
                    onSelectEmployee={handleSelectEmployee}
                    isHrAuthenticated={isHrAuthenticated}
                    onAuthenticateHr={handleHrPinSuccess}
                  />
                ) : (
                  <Navigate to="/digital-twin" replace />
                )
              }
            />
            <Route path="*" element={<Navigate to="/digital-twin" replace />} />
          </Routes>
        </main>

        {/* PIXEL GROUND PLATFORM & RETRO SNES CONTROLLER FOOTER (Directly matching reference image footer) */}
        <footer className="relative bg-[#090517] border-t-4 border-[#ff007f] pt-6 pb-4 text-center font-mono z-20">
          {/* Pixel Trees & Mushrooms Platform Header */}
          <div className="max-w-4xl mx-auto flex items-center justify-between px-6 -mt-10 mb-4 text-xl select-none">
            <span className="flex items-center gap-1">🌳 🍄 🌻</span>
            <div className="p-3 bg-[#0d0724] border-2 border-[#4deeea] rounded-2xl shadow-[0_0_15px_rgba(77,238,234,0.4)] flex items-center gap-3">
              <span className="text-2xl animate-pulse">🎮</span>
              <span className="text-xs md:text-sm font-black text-[#ffe600] tracking-wider uppercase">
                ONBOARDING SMILEMOTION STELLAR 2026
              </span>
            </div>
            <span className="flex items-center gap-1">🍉 🍄 🌳</span>
          </div>

          <div className="text-xs text-[#4deeea] uppercase tracking-widest font-black">
            PIXEL DASH STELLAR — AI Gamified Employee Wellness Hub
          </div>
          <div className="text-[10px] text-purple-400 mt-1">
            ❤️ 2026 STELLAR EDITION • VIT CHENNAI ❤️
          </div>
        </footer>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

