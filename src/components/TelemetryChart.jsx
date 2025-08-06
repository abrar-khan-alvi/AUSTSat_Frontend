import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

// Advanced Telemetry Chart
const TelemetryChart = ({ data, dataKey, title, color, unit }) => (
  <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <div className="flex items-center text-green-400 text-sm">
        <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
        TELEMETRY
      </div>
    </div>
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data}>
        <defs>
          <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
            <stop offset="95%" stopColor={color} stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis dataKey="time" stroke="#6B7280" />
        <YAxis stroke="#6B7280" unit={unit} />
        <Tooltip 
          contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
          labelStyle={{ color: '#E5E7EB' }}
          formatter={(value) => `${Number(value).toFixed(2)} ${unit}`}
        />
        <Line 
          type="monotone" 
          dataKey={dataKey} 
          stroke={color} 
          strokeWidth={3}
          fill={`url(#gradient-${dataKey})`}
          dot={false}
          activeDot={{ r: 6, stroke: color, strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default TelemetryChart;