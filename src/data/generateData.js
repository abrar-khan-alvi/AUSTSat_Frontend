export const generateSatelliteData = () => {
  // Generate axis values
  const acceleration = {
    x: -0.1 + Math.random() * 0.2,
    y: -0.1 + Math.random() * 0.2,
    z: -0.1 + Math.random() * 0.2,
  };
  const magnetic_field = {
    x: -60 + Math.random() * 120,
    y: -60 + Math.random() * 120,
    z: -60 + Math.random() * 120,
  };
  const gyroscope = {
    x: -5 + Math.random() * 10,
    y: -5 + Math.random() * 10,
    z: -5 + Math.random() * 10,
  };

  // Calculate magnitudes
  const acceleration_magnitude = Math.sqrt(
    acceleration.x ** 2 + acceleration.y ** 2 + acceleration.z ** 2
  );
  const magnetic_field_magnitude = Math.sqrt(
    magnetic_field.x ** 2 + magnetic_field.y ** 2 + magnetic_field.z ** 2
  );
  const gyroscope_magnitude = Math.sqrt(
    gyroscope.x ** 2 + gyroscope.y ** 2 + gyroscope.z ** 2
  );

  return {
    temperature: -20 + Math.random() * 80,
    humidity: 20 + Math.random() * 60,
    pressure: 0.1 + Math.random() * 10,
    orientation: {
      yaw: Math.random() * 360,
      pitch: -180 + Math.random() * 360,
      roll: -180 + Math.random() * 360,
    },
    acceleration,
    magnetic_field,
    gyroscope,
    // Add magnitudes for charting
    accelerometer: acceleration_magnitude,
    magnetometer: magnetic_field_magnitude,
    gyroscope_value: gyroscope_magnitude,
    altitude: 400 + Math.random() * 200,
    velocity: 7.5 + Math.random() * 0.5,
    battery: 85 + Math.random() * 15,
    signal_strength: 70 + Math.random() * 30,
    solar_panel_efficiency: 85 + Math.random() * 15,
    timestamp: new Date().toISOString(),
    image_url: `https://picsum.photos/800/600?random=${Math.floor(Math.random() * 1000)}`,
    status: Math.random() > 0.1 ? 'OPERATIONAL' : 'WARNING',
  };
};

export const generateOrbitalData = (count = 50) => {
  const data = [];
  for (let i = count; i >= 0; i--) {
    const timestamp = new Date(Date.now() - i * 2 * 60 * 1000);
    const baseData = generateSatelliteData();
    data.push({
      ...baseData,
      timestamp: timestamp.toISOString(),
      time: timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit'}),
      orbit_position: (i * 7.2) % 360,
    });
  }
  return data;
};