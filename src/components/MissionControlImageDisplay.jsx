import React, { useEffect, useState } from "react";
// 1. Import new icons
import { Camera, X, Calendar, Droplets, Thermometer, Zap, Layers3, Activity, Repeat,Loader2  } from 'lucide-react';
import { subscribeToLatestTelemetry } from "../utils/satelliteApi";

const MissionControlImageDisplay = () => {
  const [telemetryData, setTelemetryData] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToLatestTelemetry((latestData) => {
      if (latestData && latestData.sensor_readings) {
        
        // 2. CALCULATE THE NEW METRICS
        const { Ax, Ay, Az, Gx, Gy, Gz } = latestData.sensor_readings;
        const gForce = Math.sqrt(Ax**2 + Ay**2 + Az**2);
        const rotationSpeed = Math.sqrt(Gx**2 + Gy**2 + Gz**2);

        const formattedData = {
          imgSrc: `data:image/jpeg;base64,${latestData.image_base64}`,
          timestamp: latestData.capture_timestamp,
          humidity: latestData.sensor_readings.H,
          temperature: latestData.sensor_readings.T,
          pressure: latestData.sensor_readings.P, // Add pressure
          pitch: latestData.sensor_readings.Pitch, // Add orientation
          roll: latestData.sensor_readings.Roll,
          yaw: latestData.sensor_readings.Yaw,
          vibration: gForce, // Add motion data
          rotation: rotationSpeed,
        };
        setTelemetryData(formattedData);
      }
    });
    return () => unsubscribe();
  }, []);

  if (!telemetryData) {
    return (
      <div className="bg-gray-900 rounded-xl border border-gray-700 h-full flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 text-blue-400 animate-spin" />
        <p className="text-gray-400 mt-4">Loading Observation...</p>
      </div>
    );
  }

  return (
    <>
      {/* --- Main Card (now with Pressure) --- */}
      <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-700 h-full flex flex-col">
        {/* ... Card Header ... */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center"><Camera className="h-5 w-5 mr-2" /><span className="font-semibold">STATION OBSERVATION</span></div>
            <div className="flex items-center text-sm"><div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>LIVE</div>
          </div>
        </div>
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none"></div>
          <img src={telemetryData.imgSrc} alt="Latest from station camera" className="w-full h-48 object-cover cursor-pointer" onClick={() => setShowModal(true)} />
          <div className="absolute bottom-4 left-4 text-white">
            <div className="text-xs opacity-75">CAPTURED</div>
            <div className="font-mono text-sm">{new Date(telemetryData.timestamp).toLocaleString()}</div>
          </div>
        </div>
        {/* 3. Add Pressure to the main card view */}
        <div className="p-4 grid grid-cols-3 gap-4 text-white">
          <div className="flex items-center">
            <Droplets className="h-5 w-5 text-blue-400 mr-2" />
            <div>
              <div className="text-xs text-gray-400">Humidity</div>
              <div className="text-lg font-bold">{telemetryData.humidity.toFixed(1)}%</div>
            </div>
          </div>
          <div className="flex items-center">
            <Thermometer className="h-5 w-5 text-red-400 mr-2" />
            <div>
              <div className="text-xs text-gray-400">Temp</div>
              <div className="text-lg font-bold">{telemetryData.temperature.toFixed(1)}°C</div>
            </div>
          </div>
          <div className="flex items-center">
            <Zap className="h-5 w-5 text-yellow-400 mr-2" />
            <div>
              <div className="text-xs text-gray-400">Pressure</div>
              <div className="text-lg font-bold">{telemetryData.pressure.toFixed(1)} hPa</div>
            </div>
          </div>
        </div>
      </div> 

      {/* --- Modal with All the New Details --- */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 shadow-2xl animate-fade-in-up">
            {/* ... Modal Header and Image ... */}
            <div className="h-1.5 bg-gradient-to-r from-cyan-500 to-blue-500"></div>
            <button className="absolute right-4 top-4 z-10 rounded-full bg-gray-700/50 p-1.5 text-gray-300 transition-all hover:bg-gray-600 hover:text-white" onClick={() => setShowModal(false)}><X className="h-5 w-5" /></button>
            <div className="relative overflow-hidden"><img src={telemetryData.imgSrc} alt="Station camera detail" className="w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent"></div></div>
            
            <div className="p-6">
              {/* --- SECTION: Environmental --- */}
              <h3 className="mb-2 text-xl font-bold text-white">Capture Context</h3>
              <div className="space-y-3 p-4 bg-gray-800/50 rounded-lg">
                <div className="flex items-center justify-between"><span className="flex items-center text-gray-400"><Calendar className="mr-2 h-4 w-4" />Timestamp</span><span className="font-medium text-white">{new Date(telemetryData.timestamp).toLocaleString()}</span></div>
                <div className="flex items-center justify-between"><span className="flex items-center text-gray-400"><Thermometer className="mr-2 h-4 w-4" />Temperature</span><span className="font-medium text-white">{telemetryData.temperature.toFixed(1)}°C</span></div>
                <div className="flex items-center justify-between"><span className="flex items-center text-gray-400"><Droplets className="mr-2 h-4 w-4" />Humidity</span><span className="font-medium text-white">{telemetryData.humidity.toFixed(1)}%</span></div>
                <div className="flex items-center justify-between"><span className="flex items-center text-gray-400"><Zap className="mr-2 h-4 w-4" />Pressure</span><span className="font-medium text-white">{telemetryData.pressure.toFixed(1)} hPa</span></div>
              </div>

              {/* --- SECTION: Motion --- */}
              <h3 className="mb-2 mt-4 text-xl font-bold text-white">Motion Snapshot</h3>
              <div className="space-y-3 p-4 bg-gray-800/50 rounded-lg">
                <div className="flex items-center justify-between"><span className="flex items-center text-gray-400"><Activity className="mr-2 h-4 w-4" />Vibration</span><span className="font-medium text-white">{telemetryData.vibration.toFixed(2)} G</span></div>
                <div className="flex items-center justify-between"><span className="flex items-center text-gray-400"><Repeat className="mr-2 h-4 w-4" />Rotation</span><span className="font-medium text-white">{telemetryData.rotation.toFixed(2)} °/s</span></div>
              </div>

              {/* --- SECTION: Orientation --- */}
              <h3 className="mb-2 mt-4 text-xl font-bold text-white">Orientation</h3>
              <div className="space-y-3 p-4 bg-gray-800/50 rounded-lg">
                <div className="flex items-center justify-between"><span className="flex items-center text-gray-400"><Layers3 className="mr-2 h-4 w-4" />Pitch</span><span className="font-medium text-white">{telemetryData.pitch.toFixed(1)}°</span></div>
                <div className="flex items-center justify-between"><span className="flex items-center text-gray-400"><Layers3 className="mr-2 h-4 w-4 rotate-90" />Roll</span><span className="font-medium text-white">{telemetryData.roll.toFixed(1)}°</span></div>
              </div>

              <button className="mt-6 w-full rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 py-3 font-medium text-white transition-all hover:from-cyan-500 hover:to-blue-500 active:scale-[0.98]" onClick={() => setShowModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MissionControlImageDisplay;