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

  const handleLockHr = () => {
    setIsHrAuthenticated(false);
    sessionStorage.removeItem('isHrAuthenticated');
  };

  return (
    <div className="min-h-screen bg-[#0b0e14] text-white flex flex-col font-mono selection:bg-[#00f0ff] selection:text-black">
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

      <main className="flex-1 pb-12">
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
          <Route
            path="/hr-dashboard"
            element={
              <HRDashboard
                user={user}
                onSelectEmployee={handleSelectEmployee}
                isHrAuthenticated={isHrAuthenticated}
                onAuthenticateHr={handleHrPinSuccess}
              />
            }
          />
          <Route
            path="/players"
            element={
              <Players
                user={user}
                onSelectEmployee={handleSelectEmployee}
                isHrAuthenticated={isHrAuthenticated}
                onAuthenticateHr={handleHrPinSuccess}
              />
            }
          />
          <Route path="*" element={<Navigate to="/digital-twin" replace />} />
        </Routes>
      </main>

      <footer className="bg-[#10151d] border-t border-[#2a3442] py-4 text-center text-xs text-gray-500 font-mono">
        PIXEL DASH — AI Powered Gamified Employee Wellness Hub (VIT Chennai)
      </footer>
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

