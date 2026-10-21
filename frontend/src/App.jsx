import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import EmployeeOnboardingModal from './components/EmployeeOnboardingModal';
import HRPinModal from './components/HRPinModal';
import EvaluationResultsModal from './components/EvaluationResultsModal';
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
import EvaluationResults from './pages/EvaluationResults';

function AppContent() {
  const [user, setUser] = useState(null);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(true);
  const [isEvalResultsModalOpen, setIsEvalResultsModalOpen] = useState(false);

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
    setIsOnboardingOpen(false);
    navigate('/digital-twin');
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
      {/* BACKGROUND COSMIC CELESTIAL CANVAS & STARS */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-80">
        {/* Geometric Starfield Accents */}
        <div className="absolute top-20 left-12 text-[#00f0ff] text-xs pixel-star">✦</div>
        <div className="absolute top-28 left-1/3 text-[#4deeea] text-sm pixel-star-fast">✦</div>
        <div className="absolute top-16 right-1/3 text-[#ffe600] text-xs pixel-star">✦</div>
        <div className="absolute top-44 right-12 text-[#00ff66] text-sm pixel-star">✦</div>
        <div className="absolute top-72 left-20 text-[#ffe600] text-sm pixel-star-fast">✦</div>
        <div className="absolute top-96 right-20 text-[#00f0ff] text-xs pixel-star">✦</div>
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
          onOpenEvaluationResultsModal={() => setIsEvalResultsModalOpen(true)}
        />

        <EmployeeOnboardingModal
          isOpen={isOnboardingOpen}
          onClose={() => {
            setIsOnboardingOpen(false);
            navigate('/leaderboard');
          }}
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

        <EvaluationResultsModal
          isOpen={isEvalResultsModalOpen}
          onClose={() => setIsEvalResultsModalOpen(false)}
          user={user}
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
            <Route path="/leaderboard" element={<Leaderboard user={user} />} />
            <Route path="/evaluation-results" element={<EvaluationResults user={user} />} />
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

        {/* FOOTER */}
        <footer className="relative bg-[#090517] border-t-4 border-[#00f0ff] pt-6 pb-4 text-center font-mono z-20">
          <div className="max-w-4xl mx-auto flex items-center justify-center px-6 -mt-10 mb-4">
            <div className="p-3 bg-[#0d0724] border-2 border-[#00f0ff] rounded-2xl shadow-[0_0_15px_rgba(0,240,255,0.4)] flex items-center gap-3">
              <span className="text-xs md:text-sm font-black text-[#ffe600] tracking-wider uppercase">
                EMPLOYEE WELLNESS & DIGITAL TWIN PORTAL
              </span>
            </div>
          </div>

          <div className="text-xs text-[#00f0ff] uppercase tracking-widest font-black">
            PIXEL DASH STELLAR — AI Gamified Employee Wellness Hub
          </div>
          <div className="text-[10px] text-purple-400 mt-1 uppercase tracking-wider font-bold">
            STELLAR EDITION • VIT CHENNAI
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

