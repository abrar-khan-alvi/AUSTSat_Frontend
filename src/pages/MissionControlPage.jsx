import React, { useState, useEffect } from 'react';
import { subscribeToLatestTelemetry } from '../utils/satelliteApi'; 
import SatelliteStatusCard from '../components/SatelliteStatusCard';
import OrientationVisualizer from '../components/OrientationVisualizer';
import CompassDial from '../components/CompassDial';
import MissionControlImageDisplay from '../components/MissionControlImageDisplay';
import { Thermometer, Zap, Droplets, Gauge, CheckCircle, Loader2, X } from 'lucide-react';

// --- Creator Modal Component ---
const CreatorsModal = ({ onClose }) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-gray-800 text-white rounded-2xl shadow-xl p-8 max-w-2xl w-full relative transform transition-all duration-300 ease-in-out"
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <X size={28} />
        </button>

        <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
          The Team
        </h2>
        
        <div className="flex flex-col sm:flex-row justify-center items-center gap-10">
          {/* Creator 1 */}
          <a href="https://www.linkedin.com/in/abrar-khan-alvi-a218b0234/" target="_blank" rel="noopener noreferrer" className="text-center group">
            <img 
              src="/profile.jpg" 
              alt="Abrar Khan Alvi" 
              className="w-32 h-32 rounded-full mx-auto border-4 border-gray-600 group-hover:border-purple-400 group-hover:scale-105 transition-all duration-300" 
            />
            <h3 className="mt-4 text-xl font-semibold">Abrar Khan Alvi</h3>
            <p className="text-blue-300 group-hover:underline">Connect on LinkedIn</p>
          </a>
          
          {/* Creator 2 */}
          <a href="https://www.linkedin.com/in/hm-ziyad-09154b234/" target="_blank" rel="noopener noreferrer" className="text-center group">
            <img 
              src="/profile1.jpg"
              alt="HM Ziyad" 
              className="w-32 h-32 rounded-full mx-auto border-4 border-gray-600 group-hover:border-purple-400 group-hover:scale-105 transition-all duration-300" 
            />
            <h3 className="mt-4 text-xl font-semibold">HM Ziyad</h3>
            <p className="text-blue-300 group-hover:underline">Connect on LinkedIn</p>
          </a>
        </div>
      </div>
    </div>
  );
};


const MissionControlPage = () => {
  const [currentData, setCurrentData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToLatestTelemetry((latestData) => {
      if (latestData && latestData.sensor_readings) {
        const { Ax = 0, Ay = 0, Az = 0 } = latestData.sensor_readings;
        const gForce = Math.sqrt(Ax**2 + Ay**2 + Az**2);
        
        const formattedData = {
          temperature: latestData.sensor_readings.T?.toFixed(1) ?? 'N/A',
          pressure: latestData.sensor_readings.P?.toFixed(1) ?? 'N/A',
          humidity: latestData.sensor_readings.H?.toFixed(1) ?? 'N/A',
          stability: gForce.toFixed(2),
          status: 'OPERATIONAL',
        };
        setCurrentData(formattedData);
      }
    });
    return () => unsubscribe();
  }, []);

  if (!currentData) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <div className="text-center">
          <Loader2 className="h-12 w-12 mx-auto text-blue-400 animate-spin mb-4" />
          <h1 className="text-3xl font-bold">Connecting to Ground Station...</h1>
          <p className="text-blue-300">Awaiting initial telemetry data.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-8 px-4 md:px-8 pb-8">
        {/* --- Top Header --- */}
        <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-xl p-8 border border-gray-700">
          <div className="flex flex-col md:flex-row items-center justify-between">
            {/* Left Side: Title */}
            <div className="mb-6 md:mb-0 text-center md:text-left">
              <h1 className="text-4xl font-bold text-white mb-2">GROUND STATION MONITOR</h1>
              <p className="text-blue-200">Real-time environmental and stability monitoring</p>
            </div>

            {/* Right Side: Status & Button */}
            <div className="flex flex-col items-center md:items-end">
              <div className="text-right">
                <div className="text-sm text-blue-200">SYSTEM STATUS</div>
                <div className="text-2xl font-bold flex items-center text-green-400">
                  <CheckCircle className="h-6 w-6 mr-2" />
                  OPERATIONAL
                </div>
              </div>
              
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-4 px-5 py-2 text-blue-200 border border-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors duration-300 font-semibold"
              >
                Brain Behind the Programming
              </button>
            </div>
          </div>
        </div>
        
        {/* --- Top 4 Cards --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <SatelliteStatusCard title="Temperature" value={currentData.temperature} unit="°C" icon={Thermometer} color="orange" />
          <SatelliteStatusCard title="Pressure" value={currentData.pressure} unit="hPa" icon={Zap} color="blue" />
          <SatelliteStatusCard title="Humidity" value={currentData.humidity} unit="%" icon={Droplets} color="teal" />
          <SatelliteStatusCard title="Stability" value={currentData.stability} unit="G" icon={Gauge} color="purple" />
        </div>
        
        {/* --- Bottom 3 Panels --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <OrientationVisualizer />
          <CompassDial />
          <MissionControlImageDisplay />
        </div>
      </div>

      {/* --- Render Modal --- */}
      {isModalOpen && <CreatorsModal onClose={() => setIsModalOpen(false)} />}
    </>
  );
};

export default MissionControlPage;