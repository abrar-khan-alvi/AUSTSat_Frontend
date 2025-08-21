import React, { useState, useEffect } from 'react';
import { Compass } from 'lucide-react';
import { Loader2 } from 'lucide-react'; // A nice loading spinner icon
import { subscribeToLatestTelemetry } from '../utils/satelliteApi'; // Adjust this path if needed

// This component now fetches its own data and will no longer need an `orientation` prop.
const OrientationVisualizer = () => {
  // State to hold the orientation data { yaw, pitch, roll }
  // Starts as null to indicate that we are waiting for data.
  const [orientation, setOrientation] = useState(null);

  useEffect(() => {
    // When the component mounts, subscribe to the latest telemetry data.
    const unsubscribe = subscribeToLatestTelemetry((latestData) => {
      // Check if we received valid data with sensor readings
      if (latestData && latestData.sensor_readings) {
        // Create the orientation object our UI needs
        const newOrientation = {
          // Use the ?? operator to default to 0 if a value is missing,
          // which is safer for a component that expects numbers.
          yaw: latestData.sensor_readings.Yaw ?? 0,
          pitch: latestData.sensor_readings.Pitch ?? 0,
          roll: latestData.sensor_readings.Roll ?? 0,
        };
        // Update the state, which will trigger a re-render with the new values
        setOrientation(newOrientation);
      }
    });

    // Return the unsubscribe function to be called when the component is unmounted.
    // This is crucial for preventing memory leaks.
    return () => unsubscribe();
  }, []); // The empty dependency array ensures this effect runs only once.

  // --- LOADING STATE ---
  // If orientation data hasn't arrived yet, display a loading indicator.
  // This prevents the "Cannot destructure property 'yaw'..." error.
  if (!orientation) {
    return (
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-700 h-full flex flex-col justify-center items-center">
        <Loader2 className="h-8 w-8 text-blue-400 animate-spin" />
        <p className="text-gray-400 mt-4">Awaiting Orientation Data...</p>
      </div>
    );
  }

  // --- RENDER LOGIC ---
  // This part only runs AFTER `orientation` has been loaded with data.
  const { yaw, pitch, roll } = orientation;

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-700 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Satellite Orientation</h3>
        <Compass className="h-6 w-6 text-blue-400" />
      </div>
      
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-400">{yaw?.toFixed(1) ?? 0}°</div>
          <div className="text-sm text-gray-400">YAW</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-400">{pitch?.toFixed(1) ?? 0}°</div>
          <div className="text-sm text-gray-400">PITCH</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-400">{roll?.toFixed(1) ?? 0}°</div>
          <div className="text-sm text-gray-400">ROLL</div>
        </div>
      </div>

      <div className="relative flex-grow h-48 bg-gray-800 rounded-lg overflow-hidden perspective-1000">
        <div className="absolute inset-0 flex items-center justify-center">
          <div 
            className="relative transform transition-transform duration-500 ease-in-out preserve-3d"
            style={{
              transform: `rotateX(${pitch}deg) rotateY(${yaw}deg) rotateZ(${roll}deg)`
            }}
          >
            {/* Main satellite body - ALL YOUR AMAZING CSS STYLING IS UNTOUCHED */}
            <div className="relative">
              {/* Central body */}
              <div className="w-12 h-16 bg-gradient-to-b from-gray-300 to-gray-600 rounded-sm shadow-lg relative">
                <div className="absolute inset-1 bg-gradient-to-b from-blue-400 to-blue-600 rounded-sm opacity-80"></div>
                <div className="absolute top-2 left-2 w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                <div className="absolute top-2 right-2 w-1 h-1 bg-green-400 rounded-full"></div>
                <div className="absolute bottom-2 left-1 right-1 h-1 bg-yellow-400 rounded-sm"></div>
              </div>
              
              {/* Solar panels - left */}
              <div className="absolute top-2 -left-8 w-6 h-12 bg-gradient-to-r from-blue-900 to-blue-700 rounded-sm shadow-md">
                <div className="grid grid-cols-2 gap-0.5 p-0.5 h-full">
                  <div className="bg-blue-500 rounded-sm opacity-80"></div>
                  <div className="bg-blue-600 rounded-sm opacity-80"></div>
                  <div className="bg-blue-500 rounded-sm opacity-80"></div>
                  <div className="bg-blue-600 rounded-sm opacity-80"></div>
                  <div className="bg-blue-500 rounded-sm opacity-80"></div>
                  <div className="bg-blue-600 rounded-sm opacity-80"></div>
                </div>
              </div>
              
              {/* Solar panels - right */}
              <div className="absolute top-2 -right-8 w-6 h-12 bg-gradient-to-l from-blue-900 to-blue-700 rounded-sm shadow-md">
                <div className="grid grid-cols-2 gap-0.5 p-0.5 h-full">
                  <div className="bg-blue-500 rounded-sm opacity-80"></div>
                  <div className="bg-blue-600 rounded-sm opacity-80"></div>
                  <div className="bg-blue-500 rounded-sm opacity-80"></div>
                  <div className="bg-blue-600 rounded-sm opacity-80"></div>
                  <div className="bg-blue-500 rounded-sm opacity-80"></div>
                  <div className="bg-blue-600 rounded-sm opacity-80"></div>
                </div>
              </div>
              
              {/* Communication dish */}
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <div className="w-4 h-4 bg-gradient-to-br from-gray-200 to-gray-400 rounded-full shadow-sm">
                  <div className="w-full h-full bg-white bg-opacity-30 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                  </div>
                </div>
              </div>
              
              {/* Antenna */}
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                <div className="w-0.5 h-4 bg-gray-400"></div>
                <div className="w-2 h-0.5 bg-gray-400 -mt-2 ml-0.5"></div>
              </div>
              
              {/* Thruster indicators */}
              <div className="absolute bottom-0 left-0 w-1 h-2 bg-orange-400 rounded-b-full opacity-60"></div>
              <div className="absolute bottom-0 right-0 w-1 h-2 bg-orange-400 rounded-b-full opacity-60"></div>
            </div>
          </div>
        </div>
        
        {/* Reference grid */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-600 opacity-30"></div>
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-600 opacity-30"></div>
        </div>
        
        <div className="absolute top-2 left-2 text-xs text-gray-400">3D SATELLITE MODEL</div>
        
        {/* Orientation indicators */}
        <div className="absolute bottom-2 right-2 text-xs text-gray-400">
          <div className="flex flex-col space-y-1">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-px bg-blue-400"></div>
              <span>YAW</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-px bg-green-400"></div>
              <span>PITCH</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-px bg-purple-400"></div>
              <span>ROLL</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrientationVisualizer;