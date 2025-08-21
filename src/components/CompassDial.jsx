import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { subscribeToLatestTelemetry } from '../utils/satelliteApi';

// Helper to get cardinal direction from heading
const getCardinalDirection = (angle) => {
  if (angle === null) return '';
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return directions[Math.round(angle / 45) % 8];
};

const CompassDial = () => {
  const [heading, setHeading] = useState(null);

  useEffect(() => {
    // This is the mock subscription. In a real app, it would connect to a WebSocket or API.
    const unsubscribe = subscribeToLatestTelemetry((latestData) => {
      if (latestData && typeof latestData.sensor_readings?.Compass === 'number') {
        setHeading(latestData.sensor_readings.Compass);
      }
    });
    
    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, []);

  // Loading state while waiting for the first telemetry packet
  if (heading === null) {
    return (
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-700 h-full flex flex-col justify-center items-center">
        <Loader2 className="h-8 w-8 text-blue-400 animate-spin" />
        <p className="text-gray-400 mt-4">Awaiting Compass...</p>
      </div>
    );
  }
  
  // The main component with the new visualization
  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-700 h-full flex flex-col items-center justify-around">
      <h3 className="text-xl font-bold text-white text-center">COMPASS HEADING</h3>
      
      <div className="relative w-48 h-48 md:w-56 md:h-56">
        {/* --- Static Pointer --- */}
        {/* This triangle always points down at the top of the circle */}
        <div className="absolute top-[-4px] left-1/2 -translate-x-1/2 z-10">
           <div className="w-0 h-0 
             border-l-[10px] border-l-transparent
             border-r-[10px] border-r-transparent
             border-t-[15px] border-t-red-500">
           </div>
        </div>

        {/* --- Rotating Dial --- */}
        {/* The entire dial rotates opposite to the heading */}
        <div
          className="w-full h-full rounded-full bg-gray-800 border-4 border-gray-700 relative transition-transform duration-500 ease-in-out"
          style={{ transform: `rotate(${-heading}deg)` }}
        >
          {/* Major Tick Marks & Cardinal Directions */}
          {['N', 'E', 'S', 'W'].map((dir, i) => (
            <div key={dir} className="absolute inset-0" style={{ transform: `rotate(${i * 90}deg)` }}>
              <div className={`absolute top-[6px] left-1/2 -translate-x-1/2 font-bold text-lg ${dir === 'N' ? 'text-red-400' : 'text-gray-300'}`}>
                {dir}
              </div>
              <div className="absolute top-0 left-1/2 w-0.5 h-4 -translate-x-1/2 bg-white" />
            </div>
          ))}

          {/* Minor Tick Marks (every 30 degrees) */}
          {Array.from({ length: 12 }).map((_, i) => {
             // Avoid drawing over the major N, E, S, W ticks
             if (i % 3 === 0) return null;
             return (
                <div key={i} className="absolute inset-0" style={{ transform: `rotate(${i * 30}deg)` }}>
                  <div className="absolute top-0 left-1/2 w-px h-2.5 -translate-x-1/2 bg-gray-500" />
                </div>
             )
          })}
        </div>
      </div>

      {/* --- Digital Readout --- */}
      {/* This stays static below the dial for a clear numerical reading */}
      <div className="text-center">
        <span className="text-5xl font-bold text-white tracking-wider">
          {heading?.toFixed(0)?.padStart(3, '0') ?? 'N/A'}
        </span>
        <span className="text-5xl font-light text-gray-500">°</span>
        <span className="ml-3 text-2xl font-semibold text-blue-400">
          {getCardinalDirection(heading)}
        </span>
      </div>
    </div>
  );
};

export default CompassDial;