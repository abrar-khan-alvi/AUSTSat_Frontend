import React, { useState, useEffect } from "react";
import { subscribeToImageGallery } from "../utils/satelliteApi"; // Use the gallery function to get all historical data
import TelemetryChart from "../components/TelemetryChart";
import { Loader2 } from "lucide-react";

const TelemetryPage = () => {
  // State to hold the full history of telemetry, formatted for our charts and table
  const [telemetryHistory, setTelemetryHistory] = useState([]);

useEffect(() => {
  const unsubscribe = subscribeToImageGallery((fetchedLogs) => {
    if (fetchedLogs && fetchedLogs.length > 0) {
      const formattedData = fetchedLogs
        .filter(log => 
          log && 
          log.sensor_readings && 
          log.sensor_readings.capture_timestamp // Ensure timestamp exists
        )
        .map(log => {
          // Calculate magnitude for multi-axis sensors
          const { Ax = 0, Ay = 0, Az = 0, Gx = 0, Gy = 0, Gz = 0 } = log.sensor_readings;
          const gForce = Math.sqrt(Ax**2 + Ay**2 + Az**2);
          const rotationSpeed = Math.sqrt(Gx**2 + Gy**2 + Gz**2);

          return {
            time: new Date(log.sensor_readings.capture_timestamp).toLocaleString(),
            timestamp: log.sensor_readings.capture_timestamp,
            temperature: log.sensor_readings.T ?? null,
            pressure: log.sensor_readings.P ?? null,
            humidity: log.sensor_readings.H ?? null,
            g_force: gForce,
            rotation_speed: rotationSpeed,
            compass: log.sensor_readings.Compass ?? null,
          };
        });

      setTelemetryHistory(formattedData);
    }
  });

  return () => unsubscribe();
}, []);

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700">
        <h1 className="text-3xl font-bold text-white">HISTORICAL TELEMETRY ANALYSIS</h1>
        <p className="text-gray-300 mt-2">Visualizing sensor data logs from the Ground Station over time</p>
      </div>
      
      {telemetryHistory.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Loader2 className="h-8 w-8 mx-auto animate-spin mb-4" />
          <p>Loading telemetry history...</p>
        </div>
      ) : (
        <>
          {/* --- RECONFIGURED CHARTS --- */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <TelemetryChart data={telemetryHistory} dataKey="g_force" title="Stability (G-Force)" color="#F472B6" unit="G" />
            <TelemetryChart data={telemetryHistory} dataKey="rotation_speed" title="Rotation Speed" color="#8B5CF6" unit="°/s" />
            <TelemetryChart data={telemetryHistory} dataKey="compass" title="Compass Heading" color="#34D399" unit="°" />
            <TelemetryChart data={telemetryHistory} dataKey="temperature" title="Temperature" color="#EF4444" unit="°C" />
            <TelemetryChart data={telemetryHistory} dataKey="pressure" title="Barometric Pressure" color="#F59E42" unit="hPa" />
            <TelemetryChart data={telemetryHistory} dataKey="humidity" title="Humidity" color="#3B82F6" unit="%" />
          </div>

          {/* --- REBUILT REAL-TIME LOG TABLE --- */}
          <div className="bg-gray-900 rounded-xl border border-gray-700 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
              <h3 className="text-lg font-semibold text-white">RECENT TELEMETRY LOGS (Newest First)</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Timestamp</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Temp (°C)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Pressure (hPa)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Humidity (%)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Stability (G)</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-900 divide-y divide-gray-700">
                  {telemetryHistory.slice(-10).reverse().map((data, index) => (
                    <tr key={index} className="hover:bg-gray-800 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 font-mono">{data.time}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{data.temperature?.toFixed(1) ?? '--'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{data.pressure?.toFixed(1) ?? '--'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{data.humidity?.toFixed(1) ?? '--'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{data.g_force?.toFixed(2) ?? '--'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TelemetryPage;