import React, { useState, useEffect } from 'react';
import { Navigation, Loader2 } from 'lucide-react';
import { subscribeToLatestTelemetry } from '../utils/satelliteApi';

const CompassDial = () => {
  const [heading, setHeading] = useState(null);

  useEffect(() => {
    const unsubscribe = subscribeToLatestTelemetry((latestData) => {
      if (latestData && latestData.sensor_readings?.Compass) {
        setHeading(latestData.sensor_readings.Compass);
      }
    });
    return () => unsubscribe();
  }, []);

  if (heading === null) {
    return (
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-700 h-full flex flex-col justify-center items-center">
        <Loader2 className="h-8 w-8 text-blue-400 animate-spin" />
        <p className="text-gray-400 mt-4">Awaiting Compass...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-700 h-full flex flex-col items-center justify-center">
      <h3 className="text-xl font-bold text-white mb-4">COMPASS HEADING</h3>
      <div className="relative w-48 h-48">
        {/* Dial Background */}
        <div className="w-full h-full rounded-full bg-gray-800 border-4 border-gray-700 flex items-center justify-center">
          <div className="text-4xl font-bold text-white">{heading.toFixed(0)}°</div>
        </div>
        {/* Cardinal Directions */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-2 text-red-400 font-bold">N</div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 mt-2 text-gray-400">S</div>
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -ml-2 text-gray-400">W</div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 mr-2 text-gray-400">E</div>
        {/* Needle */}
        <div 
          className="absolute top-0 left-1/2 w-full h-full origin-center transition-transform duration-500 ease-in-out"
          style={{ transform: `rotate(${heading}deg)` }}
        >
          <Navigation className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-8 text-red-500" />
        </div>
      </div>
    </div>
  );
};

export default CompassDial;