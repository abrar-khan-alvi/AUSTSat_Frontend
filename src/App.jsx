import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MissionControlNavbar from './components/MissionControlNavbar';
import LandingPage from './pages/LandingPage';
import MissionControlPage from './pages/MissionControlPage';
import TelemetryPage from './pages/TelemetryPage';
import EarthObservationPage from './pages/EarthObservationPage';
import { generateSatelliteData, generateOrbitalData } from './data/generateData';

const App = () => {
  const [isAppEntered, setIsAppEntered] = useState(false);
  const [currentData, setCurrentData] = useState(generateSatelliteData());
  const [orbitalData, setOrbitalData] = useState(generateOrbitalData());
  const [imageGallery, setImageGallery] = useState([]);
  const [modalImage, setModalImage] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState(true);

  useEffect(() => {
    if (!isAppEntered) return;
    const interval = setInterval(() => {
      const newData = generateSatelliteData();
      setCurrentData(newData);
      setConnectionStatus(Math.random() > 0.05);
      setOrbitalData(prev => [...prev.slice(1), {
        ...newData,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        orbit_position: (prev[prev.length - 1]?.orbit_position + 7.2) % 360,
      }]);
      setImageGallery(prev => [newData, ...prev.slice(0, 15)]);
    }, 6000);
    return () => clearInterval(interval);
  }, [isAppEntered]);

  useEffect(() => {
    if (!isAppEntered) return;
    setImageGallery(Array.from({ length: 16 }, () => generateSatelliteData()));
  }, [isAppEntered]);

  if (!isAppEntered) return <LandingPage onEnter={() => setIsAppEntered(true)} />;

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-gray-200">
        <MissionControlNavbar connectionStatus={connectionStatus} lastUpdate={new Date().toLocaleTimeString()} />
        <main className="w-full mx-auto py-8 px-4">
          <Routes>
            <Route path="/" element={<Navigate to="/mission-control" replace />} />
            <Route path="/mission-control" element={<MissionControlPage currentData={currentData} />} />
            <Route path="/telemetry" element={<TelemetryPage orbitalData={orbitalData} />} />
            <Route path="/earth-observation" element={<EarthObservationPage imageGallery={imageGallery} setModalImage={setModalImage} />} />
            <Route path="*" element={<div className="text-white">404 - Page Not Found</div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;