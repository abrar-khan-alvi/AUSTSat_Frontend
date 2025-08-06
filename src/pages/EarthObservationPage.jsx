import React, { useEffect, useState } from "react";
// 1. IMPORT ALL THE ICONS WE'LL NEED
import { Eye, X, ZoomIn, ZoomOut, Calendar, Thermometer, Droplets, Zap, Layers3, Activity, Repeat, Loader2 } from "lucide-react";
import { subscribeToImageGallery } from "../utils/fetchLastestImage.js";

const EarthObservationPage = () => {
  const [images, setImages] = useState([]);
  const [modalImage, setModalImage] = useState(null);
  // 2. ADD STATE FOR ZOOM FUNCTIONALITY
  const [zoom, setZoom] = useState(1);

useEffect(() => {
  const unsubscribe = subscribeToImageGallery((fetchedImages) => {
    // Filter out any malformed data
    const validImages = fetchedImages.filter(img => 
      img && 
      img.image_base64 && 
      img.sensor_readings &&
      img.sensor_readings.capture_timestamp
    );
    setImages(validImages);
  });
  return () => unsubscribe();
}, []);
  // Handlers for the modal
  const openModal = (img) => {
    setModalImage(img);
    setZoom(1); // Reset zoom every time a new image is opened
  };

  const closeModal = () => {
    setModalImage(null);
  };

  const handleZoomIn = () => setZoom(prev => prev + 0.2);
  const handleZoomOut = () => setZoom(prev => Math.max(0.5, prev - 0.2)); // Prevent zooming out too much

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-blue-800 to-purple-900 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">STATION OBSERVATION GALLERY</h1>
            <p className="text-blue-200 mt-2">A chronological log of all captured images and sensor data</p>
          </div>
          <div className="text-right">
            <div className="flex items-center text-green-400 text-sm mb-1"><Eye className="h-4 w-4 mr-1" />{images.length} Images Captured</div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {images.length === 0 ? (
          <div className="col-span-full text-center text-gray-400 py-16">
            <Loader2 className="h-8 w-8 mx-auto animate-spin mb-4" />
            <p className="text-lg">Loading gallery or no images found...</p>
          </div>
        ) : (
          images.filter(img => img && img.image_base64).map((img, index) => (
            <div
              key={img.capture_timestamp || index}
              className="bg-gray-900 rounded-xl overflow-hidden border border-gray-700 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-blue-500"
              onClick={() => openModal(img)}
            >
              <div className="relative">
                <img src={`data:image/jpeg;base64,${img.image_base64}`} alt={`Observation ${index + 1}`} className="w-full h-48 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
              </div>
              <div className="p-4">
                <div className="text-blue-400 text-xs font-semibold mb-1">CAPTURED</div>
                <div className="text-gray-300 font-mono text-sm">{new Date(img.sensor_readings.capture_timestamp).toLocaleDateString()}</div>
                <div className="text-gray-400 font-mono text-xs">{new Date(img.sensor_readings.capture_timestamp).toLocaleTimeString()}</div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* --- FULLY REVISED MODAL WITH ZOOM AND CORRECT DATA --- */}
      {modalImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-gray-900 rounded-xl max-w-6xl w-full max-h-full overflow-y-auto border border-gray-700 shadow-2xl">
            <div className="sticky top-0 bg-gray-900/80 backdrop-blur-sm z-10 p-4 flex justify-between items-center border-b border-gray-700">
              <h3 className="text-xl font-bold text-white">Image Capture Telemetry</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-white text-3xl font-bold">×</button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
              {/* Image with Zoom Controls */}
              <div className="relative group">
                <div className="w-full h-auto rounded-lg shadow-lg overflow-hidden bg-gray-800">
                    <img
                      src={`data:image/jpeg;base64,${modalImage.image_base64}`}
                      alt="Full resolution"
                      className="w-full h-full object-contain transition-transform duration-300"
                      style={{ transform: `scale(${zoom})` }}
                    />
                </div>
                <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={handleZoomIn} className="bg-gray-700/80 p-2 rounded-full text-white hover:bg-gray-600"><ZoomIn size={20}/></button>
                    <button onClick={handleZoomOut} className="bg-gray-700/80 p-2 rounded-full text-white hover:bg-gray-600"><ZoomOut size={20}/></button>
                </div>
              </div>
              {/* All Telemetry Data */}
              <div className="space-y-4">
                <div className="bg-gray-800 p-4 rounded-lg">
                  <div className="text-gray-400 text-sm flex items-center"><Calendar className="mr-2 h-4 w-4" />Captured At</div>
                  <div className="text-white font-mono text-lg">{new Date(modalImage.sensor_readings.capture_timestamp).toLocaleString()}</div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-blue-300 mb-2">Environmental</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="bg-gray-800 p-3 rounded-lg text-center"><div className="text-gray-400 text-xs">Temperature</div><div className="text-red-400 font-bold text-lg">{modalImage.sensor_readings?.T?.toFixed(1) ?? '--'} °C</div></div>
                    <div className="bg-gray-800 p-3 rounded-lg text-center"><div className="text-gray-400 text-xs">Humidity</div><div className="text-blue-400 font-bold text-lg">{modalImage.sensor_readings?.H?.toFixed(1) ?? '--'} %</div></div>
                    <div className="bg-gray-800 p-3 rounded-lg text-center"><div className="text-gray-400 text-xs">Pressure</div><div className="text-yellow-400 font-bold text-lg">{modalImage.sensor_readings?.P?.toFixed(1) ?? '--'} hPa</div></div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-blue-300 mb-2">Orientation</h4>
                  <div className="bg-gray-800 p-4 rounded-lg"><div className="text-white font-mono text-lg flex justify-around"><span>Y: {modalImage.sensor_readings?.Yaw?.toFixed(1) ?? '--'}°</span><span>P: {modalImage.sensor_readings?.Pitch?.toFixed(1) ?? '--'}°</span><span>R: {modalImage.sensor_readings?.Roll?.toFixed(1) ?? '--'}°</span></div></div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-blue-300 mb-2">Motion Snapshot</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-gray-800 p-3 rounded-lg"><div className="text-gray-400 text-xs flex items-center"><Activity className="mr-2 h-4 w-4"/>Acceleration (X/Y/Z)</div><div className="text-white font-mono">{modalImage.sensor_readings?.Ax?.toFixed(2)} / {modalImage.sensor_readings?.Ay?.toFixed(2)} / {modalImage.sensor_readings?.Az?.toFixed(2)} G</div></div>
                    <div className="bg-gray-800 p-3 rounded-lg"><div className="text-gray-400 text-xs flex items-center"><Repeat className="mr-2 h-4 w-4"/>Gyroscope (X/Y/Z)</div><div className="text-white font-mono">{modalImage.sensor_readings?.Gx?.toFixed(2)} / {modalImage.sensor_readings?.Gy?.toFixed(2)} / {modalImage.sensor_readings?.Gz?.toFixed(2)} °/s</div></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EarthObservationPage;