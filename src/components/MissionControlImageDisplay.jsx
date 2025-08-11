import React, { useEffect, useState, useMemo } from "react";
import { Camera, X, Calendar, Droplets, Thermometer, Zap, Layers3, Activity, Repeat, Loader2, Maximize } from 'lucide-react';
import { subscribeToLatestTelemetry } from "../utils/satelliteApi";

// --- Sub-component for Attitude Indicator (Artificial Horizon) ---
const AttitudeIndicator = ({ pitch, roll }) => {
  // Clamp pitch to prevent the horizon from moving too far
  const pitchOffset = Math.max(-45, Math.min(45, pitch));

  return (
    <div className="relative w-36 h-36 rounded-full bg-gradient-to-b from-blue-500 to-amber-700 overflow-hidden border-4 border-gray-600 mx-auto">
      {/* Moving Horizon */}
      <div
        className="w-full h-full transition-transform duration-300 ease-in-out"
        style={{ transform: `rotate(${-roll}deg)` }}
      >
        <div
          className="absolute w-full h-1/2 bg-sky-400 top-0 transition-transform duration-300 ease-in-out"
          style={{ transform: `translateY(${(pitchOffset / 90) * 100}%)` }}
        />
        <div
          className="absolute w-full h-1/2 bg-yellow-800 bottom-0 transition-transform duration-300 ease-in-out"
          style={{ transform: `translateY(${(pitchOffset / 90) * 100}%)` }}
        />
        {/* Horizon Line */}
        <div 
            className="absolute top-1/2 left-0 w-full h-0.5 bg-white/80 transition-transform duration-300 ease-in-out" 
            style={{ transform: `translateY(${(pitchOffset / 90) * 50}%)` }}
        />
      </div>

      {/* Static Airplane Symbol */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="w-16 h-8 flex items-center">
            <div className="w-6 h-0.5 bg-yellow-300"></div>
            <div className="w-4 h-4 border-2 border-yellow-300 bg-gray-800/50 rounded-full mx-1"></div>
            <div className="w-6 h-0.5 bg-yellow-300"></div>
        </div>
      </div>
      <div className="absolute text-center w-full bottom-2 text-white font-bold text-xs">
          ROLL: {roll.toFixed(0)}°
      </div>
      <div className="absolute text-center h-full top-0 left-2 text-white font-bold text-xs flex items-center transform -rotate-90">
          PITCH: {pitch.toFixed(0)}°
      </div>
    </div>
  );
};


// --- Sub-component for a simple data bar ---
const StatBar = ({ label, value, max, unit, colorClass }) => (
    <div>
        <div className="flex justify-between items-baseline mb-1">
            <span className="text-gray-400 text-sm">{label}</span>
            <span className="font-mono text-white">{value.toFixed(2)} {unit}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
                className={`${colorClass} h-2 rounded-full transition-all duration-300`}
                style={{ width: `${(value / max) * 100}%`}}
            />
        </div>
    </div>
)


// --- Main Component ---
const MissionControlImageDisplay = () => {
  const [telemetryData, setTelemetryData] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToLatestTelemetry((latestData) => {
      if (latestData && latestData.sensor_readings) {
        const { Ax, Ay, Az, Gx, Gy, Gz } = latestData.sensor_readings;
        // G-Force: Using 2G as a reasonable max for vibration visualization
        const gForce = Math.sqrt(Ax**2 + Ay**2 + Az**2); 
        // Rotation Speed: Using 360dps as a max for visualization
        const rotationSpeed = Math.sqrt(Gx**2 + Gy**2 + Gz**2);

        setTelemetryData({
          imgSrc: `data:image/jpeg;base64,${latestData.image_base64}`,
          timestamp: latestData.sensor_readings.capture_timestamp,
          humidity: latestData.sensor_readings.H,
          temperature: latestData.sensor_readings.T,
          pressure: latestData.sensor_readings.P,
          pitch: latestData.sensor_readings.Pitch,
          roll: latestData.sensor_readings.Roll,
          vibration: gForce,
          rotation: rotationSpeed,
        });
      }
    });
    return () => unsubscribe();
  }, []);

  if (!telemetryData) {
    return (
      <div className="bg-gray-900 rounded-xl border border-gray-700 h-full flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 text-blue-400 animate-spin" />
        <p className="text-gray-400 mt-4">Awaiting Observation...</p>
      </div>
    );
  }

  return (
    <>
      {/* --- Main HUD-Style Card --- */}
      <div
        className="group relative bg-gray-900 rounded-xl overflow-hidden border border-gray-700 h-full flex flex-col cursor-pointer"
        onClick={() => setShowModal(true)}
      >
        <img src={telemetryData.imgSrc} alt="Latest from station camera" className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10"></div>
        
        {/* Center Hover Prompt */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30 backdrop-blur-sm">
            <div className="text-center border-2 border-white/50 rounded-lg p-4">
                <Maximize className="h-8 w-8 text-white mx-auto"/>
                <p className="text-white font-semibold mt-2">VIEW DETAILS</p>
            </div>
        </div>

        {/* Top Header */}
        <div className="relative p-4 flex items-center justify-between text-white">
            <div className="flex items-center backdrop-blur-sm bg-black/20 px-2 py-1 rounded"><Camera className="h-5 w-5 mr-2" /><span className="font-semibold text-sm">STATION OBSERVATION</span></div>
            <div className="flex items-center text-sm backdrop-blur-sm bg-black/20 px-2 py-1 rounded"><div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>LIVE</div>
        </div>

        {/* Bottom Data Overlay */}
        <div className="relative mt-auto p-4 text-white">
            <div className="font-mono text-sm">{new Date(telemetryData.timestamp).toLocaleString()}</div>
            <div className="text-xs opacity-75">CAPTURE TIMESTAMP</div>
            
            <div className="mt-4 grid grid-cols-3 gap-4 text-center backdrop-blur-sm bg-black/20 p-2 rounded-lg">
                <div className="flex items-center justify-center gap-2"><Droplets className="h-4 w-4 text-blue-300" /><span>{telemetryData.humidity.toFixed(1)}%</span></div>
                <div className="flex items-center justify-center gap-2"><Thermometer className="h-4 w-4 text-red-300" /><span>{telemetryData.temperature.toFixed(1)}°C</span></div>
                <div className="flex items-center justify-center gap-2"><Zap className="h-4 w-4 text-yellow-300" /><span>{telemetryData.pressure.toFixed(0)}hPa</span></div>
            </div>
        </div>
      </div> 

      {/* --- Detailed Modal --- */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={() => setShowModal(false)}>
          <div 
            className="relative w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-0 overflow-hidden rounded-2xl bg-gray-900 border border-gray-700 shadow-2xl animate-fade-in-up"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
          >
            {/* Left side: Image */}
            <div className="relative h-64 md:h-auto">
                <img src={telemetryData.imgSrc} alt="Station camera detail" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <h3 className="text-white text-lg font-bold">Observation Snapshot</h3>
                    <p className="text-gray-300 font-mono text-sm">{new Date(telemetryData.timestamp).toLocaleString()}</p>
                </div>
            </div>

            {/* Right side: Data Visualizations */}
            <div className="p-6 bg-gray-800/50 flex flex-col justify-between">
                <div>
                    <h3 className="mb-4 text-xl font-bold text-white flex items-center"><Layers3 className="mr-2 text-cyan-400"/>Orientation</h3>
                    <AttitudeIndicator pitch={telemetryData.pitch} roll={telemetryData.roll} />
                    
                    <h3 className="mb-4 mt-6 text-xl font-bold text-white flex items-center"><Activity className="mr-2 text-cyan-400"/>Motion Analysis</h3>
                    <div className="space-y-4">
                        <StatBar label="Vibration" value={telemetryData.vibration} max={2} unit="G" colorClass="bg-red-500" />
                        <StatBar label="Rotation" value={telemetryData.rotation} max={360} unit="°/s" colorClass="bg-purple-500"/>
                    </div>

                    <h3 className="mb-4 mt-6 text-xl font-bold text-white flex items-center"><Thermometer className="mr-2 text-cyan-400"/>Environment</h3>
                    <div className="grid grid-cols-3 gap-4 text-center p-3 bg-gray-900/70 rounded-lg">
                        <div><div className="text-2xl font-bold text-blue-300">{telemetryData.humidity.toFixed(1)}<span className="text-sm">%</span></div><div className="text-xs text-gray-400">Humidity</div></div>
                        <div><div className="text-2xl font-bold text-red-300">{telemetryData.temperature.toFixed(1)}<span className="text-sm">°C</span></div><div className="text-xs text-gray-400">Temp</div></div>
                        <div><div className="text-2xl font-bold text-yellow-300">{telemetryData.pressure.toFixed(0)}<span className="text-sm">hPa</span></div><div className="text-xs text-gray-400">Pressure</div></div>
                    </div>
                </div>

                <button className="mt-6 w-full rounded-lg bg-blue-600 py-3 font-medium text-white transition-all hover:bg-blue-500 active:scale-[0.98]" onClick={() => setShowModal(false)}>Close</button>
            </div>
            <button className="absolute right-4 top-4 z-10 rounded-full bg-gray-700/50 p-1.5 text-gray-300 transition-all hover:bg-gray-600 hover:text-white" onClick={() => setShowModal(false)}><X className="h-5 w-5" /></button>
          </div>
        </div>
      )}
    </>
  );
};

export default MissionControlImageDisplay;