import React from 'react';

// Futuristic Satellite Status Card
const SatelliteStatusCard = ({ title, value, unit, icon: Icon, color = "blue", status = "normal" }) => {
  const getStatusColor = (status) => {
    switch(status) {
      case 'critical': return 'from-red-600 to-red-800';
      case 'warning': return 'from-yellow-500 to-orange-600';
      case 'optimal': return 'from-green-500 to-emerald-600';
      default: return `from-${color}-500 to-${color}-700`;
    }
  };

  return (
    <div className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${getStatusColor(status)} p-6 text-white transform transition-all duration-300 hover:scale-105 hover:shadow-2xl`}>
      <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
        <div className="absolute inset-0 bg-white rounded-full animate-ping"></div>
      </div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          {Icon && <Icon className="h-8 w-8" />}
          <div className={`w-3 h-3 rounded-full ${status === 'optimal' ? 'bg-green-300' : status === 'warning' ? 'bg-yellow-300' : status === 'critical' ? 'bg-red-300' : 'bg-white'} animate-pulse`}></div>
        </div>
        <h3 className="text-sm font-medium opacity-90 uppercase tracking-wider">{title}</h3>
        <p className="text-3xl font-bold mt-1">{value} <span className="text-lg opacity-75">{unit}</span></p>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white bg-opacity-20">
        <div className="h-full bg-white bg-opacity-40 animate-pulse"></div>
      </div>
    </div>
  );
};

export default SatelliteStatusCard;