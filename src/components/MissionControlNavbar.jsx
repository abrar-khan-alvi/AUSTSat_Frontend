import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Satellite, BarChart3, Images, Wifi, WifiOff, Clock } from 'lucide-react';

const navItems = [
  { id: 'mission-control', label: 'Mission Control', icon: Satellite, path: '/mission-control' },
  { id: 'telemetry', label: 'Telemetry', icon: BarChart3, path: '/telemetry' },
  { id: 'earth-observation', label: 'Earth Observation', icon: Images, path: '/earth-observation' }
];

const MissionControlNavbar = ({ connectionStatus, lastUpdate }) => {
  const location = useLocation();

  return (
    <nav className="bg-gray-900 border-b border-gray-700 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <div className="flex items-center py-4">
              <Satellite className="h-8 w-8 text-blue-400 mr-3 animate-pulse" />
              <div>
                <div className="text-xl font-bold text-white">AUST SATELLITE LAB</div>
                <div className="text-xs text-gray-400">Nano Satellite Mission Control</div>
              </div>
            </div>
            {navItems.map(({ id, label, icon: Icon, path }) => (
              <Link
                key={id}
                to={path}
                className={`flex items-center py-4 px-4 border-b-2 transition-all duration-300 ${
                  location.pathname === path
                    ? 'border-blue-400 text-blue-400 bg-blue-900 bg-opacity-20'
                    : 'border-transparent text-gray-300 hover:text-white hover:border-gray-600'
                }`}
              >
                <Icon className="h-5 w-5 mr-2" />
                {label}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center">
              {connectionStatus ? 
                <Wifi className="h-4 w-4 text-green-400 mr-2" /> : 
                <WifiOff className="h-4 w-4 text-red-400 mr-2" />
              }
              <span className={connectionStatus ? 'text-green-400' : 'text-red-400'}>
                {connectionStatus ? 'CONNECTED' : 'DISCONNECTED'}
              </span>
            </div>
            <div className="text-gray-400 flex items-center">
              <Clock className="h-4 w-4 inline mr-2" />
              {lastUpdate}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default MissionControlNavbar;