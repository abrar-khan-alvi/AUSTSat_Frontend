import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MissionControlNavbar from './components/MissionControlNavbar';
import LandingPage from './pages/LandingPage';
import MissionControlPage from './pages/MissionControlPage';
import TelemetryPage from './pages/TelemetryPage';
import EarthObservationPage from './pages/EarthObservationPage';

const App = () => {
  const [isAppEntered, setIsAppEntered] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(true);

  useEffect(() => {
    if (!isAppEntered) return;

    // Simulate the connection status update
    const interval = setInterval(() => {
      setConnectionStatus(Math.random() > 0.05);  // Randomly change the connection status
    }, 6000);

    return () => clearInterval(interval);  // Clean up the interval on unmount
  }, [isAppEntered]);

  // Display the landing page until the user enters the app
  if (!isAppEntered) return <LandingPage onEnter={() => setIsAppEntered(true)} />;

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-gray-200">
        <MissionControlNavbar connectionStatus={connectionStatus} lastUpdate={new Date().toLocaleTimeString()} />
        <main className="w-full mx-auto py-8 px-4">
          <Routes>
            <Route path="/" element={<Navigate to="/mission-control" replace />} />
            <Route path="/mission-control" element={<MissionControlPage />} />
            <Route path="/telemetry" element={<TelemetryPage />} />
            <Route path="/earth-observation" element={<EarthObservationPage />} />
            <Route path="*" element={<div className="text-white">404 - Page Not Found</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
