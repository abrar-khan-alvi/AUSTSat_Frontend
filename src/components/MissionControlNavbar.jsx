import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Satellite, BarChart3, Images, Wifi, WifiOff, Clock, Menu, X } from 'lucide-react';

const navItems = [
  { id: 'mission-control', label: 'Mission Control', icon: Satellite, path: '/mission-control' },
  { id: 'telemetry', label: 'Telemetry', icon: BarChart3, path: '/telemetry' },
  { id: 'earth-observation', label: 'Earth Observation', icon: Images, path: '/earth-observation' }
];

const MissionControlNavbar = ({ connectionStatus, lastUpdate }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-gradient-to-r from-gray-900 via-slate-900 to-gray-900 border-b border-gray-700 shadow-2xl backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main navbar content */}
        <div className="flex justify-between items-center h-16">
          {/* Logo and brand */}
          <div className="flex items-center flex-shrink-0">
            <Satellite className="h-8 w-8 text-blue-400 mr-3 animate-pulse" />
            <div className="hidden sm:block">
              <div className="text-xl font-bold text-white tracking-wide">AUST SATELLITE LAB</div>
              <div className="text-xs text-gray-400 font-medium">Nano Satellite Mission Control</div>
            </div>
            <div className="sm:hidden">
              <div className="text-lg font-bold text-white tracking-wide">AUST SAT</div>
              <div className="text-xs text-gray-400">Mission Control</div>
            </div>
          </div>

          {/* Desktop navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map(({ id, label, icon: Icon, path }) => (
              <Link
                key={id}
                to={path}
                className={`flex items-center px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 transform hover:scale-105 ${
                  location.pathname === path
                    ? 'bg-blue-500 bg-opacity-20 text-blue-400 shadow-lg border border-blue-500 border-opacity-30'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800 hover:bg-opacity-50'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                <span className="whitespace-nowrap">{label}</span>
              </Link>
            ))}
          </div>

          {/* Status indicators - Desktop */}
          <div className="hidden md:flex items-center space-x-4 text-sm">
            <div className="flex items-center bg-gray-800 bg-opacity-50 px-3 py-1.5 rounded-full backdrop-blur-sm">
              {connectionStatus ? 
                <Wifi className="h-4 w-4 text-green-400 mr-2 animate-pulse" /> : 
                <WifiOff className="h-4 w-4 text-red-400 mr-2" />
              }
              <span className={`font-medium ${connectionStatus ? 'text-green-400' : 'text-red-400'}`}>
                {connectionStatus ? 'CONNECTED' : 'OFFLINE'}
              </span>
            </div>
            <div className="text-gray-400 flex items-center bg-gray-800 bg-opacity-50 px-3 py-1.5 rounded-full backdrop-blur-sm">
              <Clock className="h-4 w-4 mr-2" />
              <span className="font-mono text-xs">{lastUpdate}</span>
            </div>
          </div>

          {/* Mobile status indicator */}
          <div className="md:hidden flex items-center space-x-3">
            <div className="flex items-center">
              {connectionStatus ? 
                <Wifi className="h-4 w-4 text-green-400" /> : 
                <WifiOff className="h-4 w-4 text-red-400" />
              }
            </div>
            
            {/* Mobile menu button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden inline-flex items-center justify-center p-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-colors duration-300"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`lg:hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen 
            ? 'max-h-96 opacity-100 pb-4' 
            : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <div className="space-y-2 pt-2">
            {navItems.map(({ id, label, icon: Icon, path }) => (
              <Link
                key={id}
                to={path}
                onClick={closeMobileMenu}
                className={`flex items-center px-4 py-3 rounded-lg font-medium text-base transition-all duration-300 ${
                  location.pathname === path
                    ? 'bg-blue-500 bg-opacity-20 text-blue-400 shadow-lg border border-blue-500 border-opacity-30'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800 hover:bg-opacity-50'
                }`}
              >
                <Icon className="h-5 w-5 mr-3" />
                <span>{label}</span>
              </Link>
            ))}
            
            {/* Mobile status section */}
            <div className="pt-4 border-t border-gray-700 space-y-3">
              <div className="flex items-center justify-between px-4 py-2 bg-gray-800 bg-opacity-50 rounded-lg">
                <div className="flex items-center">
                  {connectionStatus ? 
                    <Wifi className="h-4 w-4 text-green-400 mr-2 animate-pulse" /> : 
                    <WifiOff className="h-4 w-4 text-red-400 mr-2" />
                  }
                  <span className={`font-medium ${connectionStatus ? 'text-green-400' : 'text-red-400'}`}>
                    {connectionStatus ? 'CONNECTED' : 'OFFLINE'}
                  </span>
                </div>
              </div>
              <div className="flex items-center px-4 py-2 bg-gray-800 bg-opacity-50 rounded-lg">
                <Clock className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-gray-400 font-mono text-sm">{lastUpdate}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default MissionControlNavbar;