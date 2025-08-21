import React, { useState, useEffect } from 'react';
import { subscribeToLatestTelemetry } from '../utils/satelliteApi'; 

// Components
import SatelliteStatusCard from '../components/SatelliteStatusCard';
import OrientationVisualizer from '../components/OrientationVisualizer';
import CompassDial from '../components/CompassDial';
import MissionControlImageDisplay from '../components/MissionControlImageDisplay';
import { Thermometer, Zap, Droplets, Gauge, CheckCircle, Loader2 } from 'lucide-react';

const MissionControlPage = () => {
  const [currentData, setCurrentData] = useState(null);

  useEffect(() => {
    const unsubscribe = subscribeToLatestTelemetry((latestData) => {
      // Add a robust check to ensure the necessary data structure exists
      if (latestData && latestData.sensor_readings) {
        
        // --- Calculate G-Force for the Stability Card ---
        // Use default values (0) if Ax, Ay, or Az are missing
        const { Ax = 0, Ay = 0, Az = 0 } = latestData.sensor_readings;
        const gForce = Math.sqrt(Ax**2 + Ay**2 + Az**2);
        
        // Safely access sensor readings and format them
        const formattedData = {
          // Use optional chaining (?.) before .toFixed()
          // Use the nullish coalescing operator (??) to provide a default value
          temperature: latestData.sensor_readings.T?.toFixed(1) ?? 'N/A',
          pressure: latestData.sensor_readings.P?.toFixed(1) ?? 'N/A',
          humidity: latestData.sensor_readings.H?.toFixed(1) ?? 'N/A',
          stability: gForce.toFixed(2), // gForce is safe because we defaulted Ax,Ay,Az to 0
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
    <div className="space-y-8 px-4 md:px-8">
      {/* --- Top Header --- */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-xl p-8 border border-gray-700">
        <div className="flex flex-col sm:flex-row items-center justify-between">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-4xl font-bold text-white mb-2">GROUND STATION MONITOR</h1>
            <p className="text-blue-200">Real-time environmental and stability monitoring</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-blue-200">SYSTEM STATUS</div>
            <div className="text-2xl font-bold flex items-center text-green-400">
              <CheckCircle className="h-6 w-6 mr-2" />
              OPERATIONAL
            </div>
          </div>
        </div>
      </div>
      
      {/* --- NEW Top 4 Cards --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <SatelliteStatusCard title="Temperature" value={currentData.temperature} unit="°C" icon={Thermometer} color="orange" />
        <SatelliteStatusCard title="Pressure" value={currentData.pressure} unit="hPa" icon={Zap} color="blue" />
        <SatelliteStatusCard title="Humidity" value={currentData.humidity} unit="%" icon={Droplets} color="teal" />
        <SatelliteStatusCard title="Stability" value={currentData.stability} unit="G" icon={Gauge} color="purple" />
      </div>
      
      {/* --- NEW Bottom 3 Panels --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <OrientationVisualizer />
        <CompassDial />
        <MissionControlImageDisplay />
      </div>
    </div>
  );
};

export default MissionControlPage;
