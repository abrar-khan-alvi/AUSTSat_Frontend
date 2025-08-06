import React, { useState, useEffect } from 'react';
import { Satellite, ArrowRight } from 'lucide-react';
import logo from '../assets/logo.png'; // Add your project logo in /assets and import it

const LandingPage = ({ onEnter }) => {
  const [bootSequence, setBootSequence] = useState([]);
  const [showButton, setShowButton] = useState(false);

const steps = [
    "Initializing Mission Control Interface...",
    "Establishing secure uplink to AUSTSat 2.O...",
    "Calibrating telemetry sensors...",
    "Loading orbital mechanics module...",
    "All systems nominal. Ready for command.",
  ];

  useEffect(() => {
    // Clear any existing sequences first
    setBootSequence([]);
    
    // Add steps one by one with delay
    steps.forEach((step, index) => {
      setTimeout(() => {
        setBootSequence(prev => [...new Set([...prev, step])]); // Use Set to prevent duplicates
      }, (index + 1) * 700);
    });
    
    // Show button after sequence completes
    setTimeout(() => setShowButton(true), (steps.length + 1) * 700);

    // Cleanup function to handle component unmount
    return () => {
      setBootSequence([]);
      setShowButton(false);
    };
  }, []); 

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white p-4 font-mono overflow-hidden">
      <div className="absolute inset-0 z-0 bg-grid opacity-10"></div>
      <div className="relative z-10 text-left w-full max-w-2xl bg-black bg-opacity-30 backdrop-blur-sm p-8 rounded-lg border border-blue-500/30 shadow-2xl shadow-blue-500/10">
        <div className="flex items-center mb-6">
          <img src={logo} alt="AUST Satellite Lab Logo" className="h-12 w-12 mr-4" />
          <div>
            <h1 className="text-3xl font-bold text-gray-100">AUST SATELLITE LAB</h1>
            <p className="text-lg text-blue-300">Ground Control Terminal</p>
          </div>
        </div>

        <div className="mb-6 text-sm text-gray-300 leading-relaxed">
          <p className="mb-2">
            Welcome to the AUST Satellite Lab — a pioneering student-led initiative dedicated to advancing nano-satellite research and telemetry visualization from space. Our mission is to inspire innovation, promote real-time space data interaction, and equip future engineers with hands-on satellite systems experience.
          </p>
          <p className="text-blue-400 font-semibold">Proudly developed by Team AUSTSat at Ahsanullah University of Science & Technology.</p>
        </div>

        <div className="h-48 bg-black/50 p-4 rounded-md overflow-y-auto text-green-400 text-sm">
          {bootSequence.map((line, index) => (
            <p key={index} className="animate-fade-in-up">{`> ${line}`}</p>
          ))}
        </div>

        {showButton && (
          <button
            onClick={onEnter}
            className="group mt-6 w-full inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-blue-600 to-purple-700 rounded-lg transition-all duration-300 hover:from-blue-500 hover:to-purple-600 hover:shadow-2xl hover:scale-105 animate-fade-in"
          >
            Enter Mission Control
            <ArrowRight className="ml-3 h-6 w-6 transform transition-transform duration-300 group-hover:translate-x-2" />
          </button>
        )}
      </div>
    </div>
  );
};

export default LandingPage;
