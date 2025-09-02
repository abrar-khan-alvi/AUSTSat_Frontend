import React, { useState, useEffect, useRef } from 'react';
import { Compass, Loader2 } from 'lucide-react';
import { subscribeToLatestTelemetry } from '../utils/satelliteApi'; 

const OrientationVisualizer = () => {
  const [orientation, setOrientation] = useState(null);
  const [threeLoaded, setThreeLoaded] = useState(false);
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const satelliteGroupRef = useRef(null);
  const animationIdRef = useRef(null);
  const targetQuaternionRef = useRef(null);

  // Load Three.js from CDN
  useEffect(() => {
    const loadThreeJS = () => {
      if (window.THREE) {
        setThreeLoaded(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
      script.onload = () => setThreeLoaded(true);
      script.onerror = () => console.error('Failed to load Three.js');
      document.head.appendChild(script);
    };
    loadThreeJS();
  }, []);

  // Subscribe to Firebase data
  useEffect(() => {
    const unsubscribe = subscribeToLatestTelemetry((latestData) => {
      if (latestData && latestData.sensor_readings) {
        const newOrientation = {
          yaw: latestData.sensor_readings.Yaw ?? 0,
          pitch: latestData.sensor_readings.Pitch ?? 0,
          roll: latestData.sensor_readings.Roll ?? 0,
        };
        setOrientation(newOrientation);
      }
    });
    return () => unsubscribe();
  }, []);

  // Initialize Three.js scene
  useEffect(() => {
    if (!mountRef.current || !threeLoaded || !window.THREE) return;
    const THREE = window.THREE;
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e);
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 0, 5); // Closer camera for compact view

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    mountRef.current.appendChild(renderer.domElement);

    targetQuaternionRef.current = new THREE.Quaternion();

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4); 
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1); 
    directionalLight.position.set(5, 5, 5); 
    directionalLight.castShadow = true; 
    directionalLight.shadow.mapSize.width = 1024; // Reduced for performance
    directionalLight.shadow.mapSize.height = 1024; 
    scene.add(directionalLight);
    const pointLight = new THREE.PointLight(0x4a90e2, 0.5, 100); 
    pointLight.position.set(-5, 0, 5); 
    scene.add(pointLight);

    // Satellite group
    const satelliteGroup = new THREE.Group(); 
    scene.add(satelliteGroup);

    // Smaller satellite body
    const bodyGeometry = new THREE.BoxGeometry(0.6, 1.2, 0.5); 
    const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0x4a90e2, transparent: true, opacity: 0.9 }); 
    const satelliteBody = new THREE.Mesh(bodyGeometry, bodyMaterial); 
    satelliteBody.castShadow = true; 
    satelliteGroup.add(satelliteBody);

    // Smaller solar panels
    const panelGeometry = new THREE.BoxGeometry(1.2, 1.8, 0.06); 
    const panelMaterial = new THREE.MeshLambertMaterial({ color: 0x1e3a8a, transparent: true, opacity: 0.8 });
    const leftPanel = new THREE.Mesh(panelGeometry, panelMaterial); 
    leftPanel.position.set(-1.2, 0, 0); 
    leftPanel.castShadow = true; 
    satelliteGroup.add(leftPanel);
    const rightPanel = new THREE.Mesh(panelGeometry, panelMaterial); 
    rightPanel.position.set(1.2, 0, 0); 
    rightPanel.castShadow = true; 
    satelliteGroup.add(rightPanel);

    // Smaller solar cells
    const cellGeometry = new THREE.BoxGeometry(0.18, 0.24, 0.02); 
    const cellMaterial = new THREE.MeshLambertMaterial({ color: 0x3b82f6 });
    for (let i = 0; i < 3; i++) { 
      for (let j = 0; j < 4; j++) { 
        const cell = new THREE.Mesh(cellGeometry, cellMaterial); 
        cell.position.set(-1.2, 0.6 - j * 0.3, 0.04 + i * 0.02); 
        satelliteGroup.add(cell); 
      }
    }
    for (let i = 0; i < 3; i++) { 
      for (let j = 0; j < 4; j++) { 
        const cell = new THREE.Mesh(cellGeometry, cellMaterial); 
        cell.position.set(1.2, 0.6 - j * 0.3, 0.04 + i * 0.02); 
        satelliteGroup.add(cell); 
      }
    }

    // Smaller dish
    const dishGeometry = new THREE.SphereGeometry(0.24, 12, 6, 0, Math.PI * 2, 0, Math.PI * 0.5); 
    const dishMaterial = new THREE.MeshPhongMaterial({ color: 0xe5e7eb, shininess: 100 }); 
    const dish = new THREE.Mesh(dishGeometry, dishMaterial); 
    dish.position.set(0, 0.9, 0); 
    dish.rotation.x = Math.PI; 
    dish.castShadow = true; 
    satelliteGroup.add(dish);

    // Smaller antenna
    const antennaGeometry = new THREE.CylinderGeometry(0.015, 0.015, 0.6); 
    const antennaMaterial = new THREE.MeshLambertMaterial({ color: 0x9ca3af }); 
    const antenna = new THREE.Mesh(antennaGeometry, antennaMaterial); 
    antenna.position.set(0, -0.9, 0); 
    satelliteGroup.add(antenna);

    // Smaller thrusters
    const thrusterGeometry = new THREE.ConeGeometry(0.06, 0.18, 6); 
    const thrusterMaterial = new THREE.MeshLambertMaterial({ color: 0xf97316, transparent: true, opacity: 0.7 });
    const leftThruster = new THREE.Mesh(thrusterGeometry, thrusterMaterial); 
    leftThruster.position.set(-0.18, -0.72, -0.3); 
    leftThruster.rotation.x = Math.PI; 
    satelliteGroup.add(leftThruster);
    const rightThruster = new THREE.Mesh(thrusterGeometry, thrusterMaterial); 
    rightThruster.position.set(0.18, -0.72, -0.3); 
    rightThruster.rotation.x = Math.PI; 
    satelliteGroup.add(rightThruster);

    // Smaller lights
    const lightGeometry = new THREE.SphereGeometry(0.03, 6, 6);
    const redLight = new THREE.Mesh(lightGeometry, new THREE.MeshLambertMaterial({ color: 0xef4444, emissive: 0x440000 })); 
    redLight.position.set(-0.12, 0.48, 0.27); 
    satelliteGroup.add(redLight);
    const greenLight = new THREE.Mesh(lightGeometry, new THREE.MeshLambertMaterial({ color: 0x22c55e, emissive: 0x004400 })); 
    greenLight.position.set(0.12, 0.48, 0.27); 
    satelliteGroup.add(greenLight);

    // Smaller grid
    const gridHelper = new THREE.GridHelper(6, 12, 0x444444, 0x222222); 
    gridHelper.position.y = -2; 
    scene.add(gridHelper);

    // Store refs
    sceneRef.current = scene;
    rendererRef.current = renderer;
    satelliteGroupRef.current = satelliteGroup;

    let animationId;
    // Animation loop
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      // Slerp (spherical linear interpolation) for smooth rotation
      if (targetQuaternionRef.current && !satelliteGroup.quaternion.equals(targetQuaternionRef.current)) {
        // The '0.1' is the interpolation factor. Higher is faster, lower is smoother.
        satelliteGroup.quaternion.slerp(targetQuaternionRef.current, 0.1);
      }
      
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current) return;
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current);
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) mountRef.current.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [threeLoaded]);

  // Update satellite orientation
  useEffect(() => {
    if (orientation && targetQuaternionRef.current && window.THREE) {
      const { yaw, pitch, roll } = orientation;
      const THREE = window.THREE;
      
      const euler = new THREE.Euler(
        THREE.MathUtils.degToRad(pitch),
        THREE.MathUtils.degToRad(yaw),
        THREE.MathUtils.degToRad(roll),
        'YXZ'
      );

      // Set the target quaternion. The animation loop will handle the rest.
      targetQuaternionRef.current.setFromEuler(euler);
    }
  }, [orientation]);

  if (!threeLoaded || !orientation) {
    return (
      <div className="bg-gray-900 rounded-xl p-3 border border-gray-700 h-full flex flex-col justify-center items-center">
        <Loader2 className="h-6 w-6 text-blue-400 animate-spin" />
        <p className="text-gray-400 mt-2 text-sm">
          {!threeLoaded ? "Loading 3D..." : "Awaiting Data..."}
        </p>
      </div>
    );
  }

  const { yaw, pitch, roll } = orientation;

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-700 h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-white">Satellite Orientation</h3>
        <Compass className="h-5 w-5 text-blue-400" />
      </div>
      
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="text-center">
          <div className="text-lg font-bold text-blue-400">{yaw?.toFixed(1) ?? 0}°</div>
          <div className="text-xs text-gray-400">YAW</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-green-400">{pitch?.toFixed(1) ?? 0}°</div>
          <div className="text-xs text-gray-400">PITCH</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-purple-400">{roll?.toFixed(1) ?? 0}°</div>
          <div className="text-xs text-gray-400">ROLL</div>
        </div>
      </div>
      
      <div className="relative flex-grow bg-gray-800 rounded-lg overflow-hidden">
        <div ref={mountRef} className="w-full h-full" style={{ minHeight: '200px' }}/>
        <div className="absolute top-1 left-1 text-xs text-gray-400">3D MODEL</div>
        <div className="absolute bottom-1 right-1 text-xs text-gray-400">
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
        <div className="absolute top-1 right-1 text-xs text-gray-500">
          <div className="bg-black bg-opacity-50 p-1 rounded text-xs">Real-time</div>
        </div>
      </div>
    </div>
  );
};

export default OrientationVisualizer;