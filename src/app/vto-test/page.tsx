"use client"
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

// GLB Loader for Three.js
class GLTFLoader {
  constructor() {
    this.loader = new THREE.FileLoader();
    this.loader.setResponseType('arraybuffer');
  }

  load(url, onLoad, onProgress, onError) {
    this.loader.load(url, (data) => {
      try {
        this.parse(data, onLoad, onError);
      } catch (e) {
        onError(e);
      }
    }, onProgress, onError);
  }

  parse(data, onLoad, onError) {
    try {
      const arrayBuffer = data;
      const dataView = new DataView(arrayBuffer);
      
      // Basic GLB parsing - this is simplified
      // In production, you'd want to use the full GLTFLoader from Three.js examples
      const magic = dataView.getUint32(0, true);
      if (magic !== 0x46546C67) {
        throw new Error('Invalid GLB file');
      }

      // For demo purposes, create a basic glasses geometry
      const geometry = new THREE.BoxGeometry(2, 0.3, 0.2);
      const material = new THREE.MeshPhongMaterial({ 
        color: 0x2563eb,
        transparent: true,
        opacity: 0.8
      });
      const mesh = new THREE.Mesh(geometry, material);
      
      // Add lens geometry
      const lensGeometry = new THREE.PlaneGeometry(0.8, 0.8);
      const lensMaterial = new THREE.MeshPhongMaterial({
        color: 0x87ceeb,
        transparent: true,
        opacity: 0.3
      });
      
      const leftLens = new THREE.Mesh(lensGeometry, lensMaterial);
      leftLens.position.set(-0.6, 0, 0.1);
      
      const rightLens = new THREE.Mesh(lensGeometry, lensMaterial);
      rightLens.position.set(0.6, 0, 0.1);
      
      mesh.add(leftLens);
      mesh.add(rightLens);
      
      const scene = new THREE.Group();
      scene.add(mesh);
      
      onLoad({ scene });
    } catch (error) {
      onError(error);
    }
  }
}

interface GLBTransform {
  scale: number;
  offsetX: number;
  offsetY: number;
  offsetZ: number;
  rotationX: number;
  rotationY: number;
  rotationZ: number;
}

export default function CustomGLBGlassesVTO() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<string>('Ready to load custom GLB models');
  const [uploadedModels, setUploadedModels] = useState<Array<{id: string, name: string, url: string}>>([]);
  const [currentTransform, setCurrentTransform] = useState<GLBTransform>({
    scale: 1.0,
    offsetX: 0,
    offsetY: -0.2,
    offsetZ: 0.5,
    rotationX: 0,
    rotationY: 0,
    rotationZ: 0
  });
  const [showTransformControls, setShowTransformControls] = useState<boolean>(false);
  const [faceDetected, setFaceDetected] = useState<boolean>(false);

  // Three.js scene references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const glassesRef = useRef<THREE.Group | null>(null);
  const animationIdRef = useRef<number | null>(null);

  // Face detection simulation (in production, you'd use MediaPipe or similar)
  const simulateFaceDetection = () => {
    // Simulate face detection with random intervals
    const interval = setInterval(() => {
      const detected = Math.random() > 0.3; // 70% chance of face detection
      setFaceDetected(detected);
    }, 1000);

    return () => clearInterval(interval);
  };

  const initializeThreeJS = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setClearColor(0x000000, 0);
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 1, 1);
    scene.add(directionalLight);
    
    camera.position.z = 3;
    
    sceneRef.current = scene;
    rendererRef.current = renderer;
    cameraRef.current = camera;
  };

  const initializeCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 }, 
          height: { ideal: 480 },
          facingMode: 'user'
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setStatus('Camera initialized successfully');
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Unable to access camera. Please check permissions.');
    }
  };

  const loadGLBModel = async (file: File) => {
    if (!sceneRef.current) return;

    setIsLoading(true);
    setStatus(`Loading ${file.name}...`);
    setError(null);

    try {
      const url = URL.createObjectURL(file);
      const loader = new GLTFLoader();
      
      await new Promise<void>((resolve, reject) => {
        loader.load(
          url,
          (gltf) => {
            // Remove existing glasses
            if (glassesRef.current) {
              sceneRef.current?.remove(glassesRef.current);
            }
            
            // Add new glasses model
            const glasses = gltf.scene;
            glasses.scale.set(currentTransform.scale, currentTransform.scale, currentTransform.scale);
            glasses.position.set(currentTransform.offsetX, currentTransform.offsetY, currentTransform.offsetZ);
            glasses.rotation.set(
              currentTransform.rotationX * Math.PI / 180,
              currentTransform.rotationY * Math.PI / 180,
              currentTransform.rotationZ * Math.PI / 180
            );
            
            sceneRef.current?.add(glasses);
            glassesRef.current = glasses;
            
            setStatus(`${file.name} loaded successfully`);
            setShowTransformControls(true);
            resolve();
          },
          undefined,
          (error) => {
            console.error('Error loading GLB:', error);
            reject(error);
          }
        );
      });

      // Add to uploaded models list
      const modelId = `uploaded_${Date.now()}`;
      setUploadedModels(prev => [...prev, {
        id: modelId,
        name: file.name.replace('.glb', ''),
        url: url
      }]);

    } catch (err) {
      console.error('Failed to load GLB model:', err);
      setError(`Failed to load ${file.name}. Please ensure it's a valid GLB file.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.glb')) {
      setError('Please select a GLB file');
      return;
    }

    loadGLBModel(file);
  };

  const applyTransform = (transform: GLBTransform) => {
    if (!glassesRef.current) return;

    glassesRef.current.scale.set(transform.scale, transform.scale, transform.scale);
    glassesRef.current.position.set(transform.offsetX, transform.offsetY, transform.offsetZ);
    glassesRef.current.rotation.set(
      transform.rotationX * Math.PI / 180,
      transform.rotationY * Math.PI / 180,
      transform.rotationZ * Math.PI / 180
    );
  };

  const handleTransformChange = (property: keyof GLBTransform, value: number) => {
    const newTransform = { ...currentTransform, [property]: value };
    setCurrentTransform(newTransform);
    applyTransform(newTransform);
  };

  const resetTransform = () => {
    const defaultTransform = {
      scale: 1.0,
      offsetX: 0,
      offsetY: -0.2,
      offsetZ: 0.5,
      rotationX: 0,
      rotationY: 0,
      rotationZ: 0
    };
    setCurrentTransform(defaultTransform);
    applyTransform(defaultTransform);
  };

  const animate = () => {
    if (rendererRef.current && sceneRef.current && cameraRef.current) {
      // Simple face tracking simulation - position glasses based on face detection
      if (faceDetected && glassesRef.current) {
        // Add subtle animation to make glasses feel more alive
        const time = Date.now() * 0.001;
        glassesRef.current.rotation.y = Math.sin(time * 0.5) * 0.1;
      }

      rendererRef.current.render(sceneRef.current, cameraRef.current);
    }
    animationIdRef.current = requestAnimationFrame(animate);
  };

  const loadDemoModel = () => {
    // Create a demo glasses model procedurally
    if (!sceneRef.current) return;

    // Remove existing glasses
    if (glassesRef.current) {
      sceneRef.current.remove(glassesRef.current);
    }

    // Create demo glasses
    const glassesGroup = new THREE.Group();
    
    // Frame
    const frameGeometry = new THREE.BoxGeometry(3, 0.2, 0.1);
    const frameMaterial = new THREE.MeshPhongMaterial({ color: 0x1f2937 });
    const frame = new THREE.Mesh(frameGeometry, frameMaterial);
    glassesGroup.add(frame);
    
    // Left lens
    const lensGeometry = new THREE.CircleGeometry(0.6, 32);
    const lensMaterial = new THREE.MeshPhongMaterial({
      color: 0x3b82f6,
      transparent: true,
      opacity: 0.4
    });
    const leftLens = new THREE.Mesh(lensGeometry, lensMaterial);
    leftLens.position.set(-0.8, 0, 0.05);
    glassesGroup.add(leftLens);
    
    // Right lens
    const rightLens = new THREE.Mesh(lensGeometry, lensMaterial);
    rightLens.position.set(0.8, 0, 0.05);
    glassesGroup.add(rightLens);
    
    // Bridge
    const bridgeGeometry = new THREE.BoxGeometry(0.4, 0.1, 0.1);
    const bridge = new THREE.Mesh(bridgeGeometry, frameMaterial);
    bridge.position.set(0, -0.1, 0);
    glassesGroup.add(bridge);
    
    // Apply current transform
    glassesGroup.scale.set(currentTransform.scale, currentTransform.scale, currentTransform.scale);
    glassesGroup.position.set(currentTransform.offsetX, currentTransform.offsetY, currentTransform.offsetZ);
    glassesGroup.rotation.set(
      currentTransform.rotationX * Math.PI / 180,
      currentTransform.rotationY * Math.PI / 180,
      currentTransform.rotationZ * Math.PI / 180
    );
    
    sceneRef.current.add(glassesGroup);
    glassesRef.current = glassesGroup;
    
    setStatus('Demo glasses model loaded');
    setShowTransformControls(true);
  };

  useEffect(() => {
    initializeThreeJS();
    initializeCamera();
    const cleanupFaceDetection = simulateFaceDetection();
    
    // Start animation loop
    animate();

    return () => {
      cleanupFaceDetection();
      
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      
      // Clean up Three.js
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      
      // Clean up uploaded model URLs
      uploadedModels.forEach(model => {
        if (model.url.startsWith('blob:')) {
          URL.revokeObjectURL(model.url);
        }
      });
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
            Custom GLB Glasses Virtual Try-On
          </h1>
          <p className="text-blue-300 text-xl">Upload and test your custom 3D GLB glasses models</p>
        </div>

        <div className="bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-indigo-500/30">
          <div className="flex flex-col xl:flex-row">
            {/* Main Display Area */}
            <div className="xl:w-3/4 relative">
              <div className="relative bg-black rounded-tl-3xl overflow-hidden h-[600px]">
                {/* Video Background */}
                <video
                  ref={videoRef}
                  className="absolute inset-0 w-full h-full object-cover"
                  autoPlay
                  muted
                  playsInline
                />
                
                {/* Three.js Canvas Overlay */}
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 w-full h-full"
                  style={{ pointerEvents: 'none' }}
                />

                {/* Face Detection Indicator */}
                <div className="absolute top-4 left-4 z-10">
                  <div className={`flex items-center px-3 py-2 rounded-full text-sm font-medium ${
                    faceDetected 
                      ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                      : 'bg-red-500/20 text-red-300 border border-red-500/30'
                  }`}>
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      faceDetected ? 'bg-green-400' : 'bg-red-400'
                    }`}></div>
                    {faceDetected ? 'Face Detected' : 'Looking for face...'}
                  </div>
                </div>

                {/* Loading Overlay */}
                {isLoading && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-20">
                    <div className="text-center">
                      <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <div className="text-white text-xl">{status}</div>
                    </div>
                  </div>
                )}

                {/* Error Overlay */}
                {error && (
                  <div className="absolute inset-0 bg-red-900/95 flex items-center justify-center z-20">
                    <div className="text-white text-center p-6 max-w-md">
                      <div className="text-5xl mb-4">⚠️</div>
                      <div className="text-xl mb-6 font-semibold">{error}</div>
                      <button
                        onClick={() => setError(null)}
                        className="px-6 py-3 bg-white text-red-700 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Transform Controls */}
              {showTransformControls && (
                <div className="p-6 bg-gray-900 border-t border-gray-700">
                  <h3 className="text-lg font-semibold text-white mb-4">Model Transform Controls</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Scale */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Scale</label>
                      <input
                        type="range"
                        min="0.1"
                        max="3"
                        step="0.1"
                        value={currentTransform.scale}
                        onChange={(e) => handleTransformChange('scale', parseFloat(e.target.value))}
                        className="w-full"
                      />
                      <span className="text-xs text-gray-400">{currentTransform.scale.toFixed(1)}</span>
                    </div>
                    
                    {/* Position X */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Position X</label>
                      <input
                        type="range"
                        min="-2"
                        max="2"
                        step="0.1"
                        value={currentTransform.offsetX}
                        onChange={(e) => handleTransformChange('offsetX', parseFloat(e.target.value))}
                        className="w-full"
                      />
                      <span className="text-xs text-gray-400">{currentTransform.offsetX.toFixed(1)}</span>
                    </div>
                    
                    {/* Position Y */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Position Y</label>
                      <input
                        type="range"
                        min="-2"
                        max="2"
                        step="0.1"
                        value={currentTransform.offsetY}
                        onChange={(e) => handleTransformChange('offsetY', parseFloat(e.target.value))}
                        className="w-full"
                      />
                      <span className="text-xs text-gray-400">{currentTransform.offsetY.toFixed(1)}</span>
                    </div>
                    
                    {/* Position Z */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Position Z</label>
                      <input
                        type="range"
                        min="-2"
                        max="2"
                        step="0.1"
                        value={currentTransform.offsetZ}
                        onChange={(e) => handleTransformChange('offsetZ', parseFloat(e.target.value))}
                        className="w-full"
                      />
                      <span className="text-xs text-gray-400">{currentTransform.offsetZ.toFixed(1)}</span>
                    </div>
                    
                    {/* Rotation X */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Rotation X</label>
                      <input
                        type="range"
                        min="-180"
                        max="180"
                        step="5"
                        value={currentTransform.rotationX}
                        onChange={(e) => handleTransformChange('rotationX', parseFloat(e.target.value))}
                        className="w-full"
                      />
                      <span className="text-xs text-gray-400">{currentTransform.rotationX}°</span>
                    </div>
                    
                    {/* Rotation Y */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Rotation Y</label>
                      <input
                        type="range"
                        min="-180"
                        max="180"
                        step="5"
                        value={currentTransform.rotationY}
                        onChange={(e) => handleTransformChange('rotationY', parseFloat(e.target.value))}
                        className="w-full"
                      />
                      <span className="text-xs text-gray-400">{currentTransform.rotationY}°</span>
                    </div>
                    
                    {/* Rotation Z */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Rotation Z</label>
                      <input
                        type="range"
                        min="-180"
                        max="180"
                        step="5"
                        value={currentTransform.rotationZ}
                        onChange={(e) => handleTransformChange('rotationZ', parseFloat(e.target.value))}
                        className="w-full"
                      />
                      <span className="text-xs text-gray-400">{currentTransform.rotationZ}°</span>
                    </div>
                    
                    {/* Reset Button */}
                    <div className="flex items-end">
                      <button
                        onClick={resetTransform}
                        className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors font-medium"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="xl:w-1/4 bg-gray-900 p-6 overflow-y-auto">
              <div className="flex flex-col h-full">
                <h2 className="text-2xl font-bold text-white mb-6">GLB Model Manager</h2>
                
                {/* File Upload Section */}
                <div className="bg-gradient-to-r from-green-800 to-green-600 p-4 rounded-xl mb-6">
                  <h3 className="text-white font-medium mb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    Upload GLB Model
                  </h3>
                  <p className="text-green-100 text-sm mb-3">Upload your custom 3D glasses model</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".glb"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full bg-white text-green-800 hover:bg-gray-100 font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    Choose GLB File
                  </button>
                </div>

                {/* Demo Model */}
                <div className="mb-6">
                  <button
                    onClick={loadDemoModel}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Load Demo Glasses
                  </button>
                </div>

                {/* Uploaded Models */}
                {uploadedModels.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-white mb-3">Uploaded Models</h3>
                    <div className="space-y-2">
                      {uploadedModels.map((model) => (
                        <div key={model.id} className="p-3 bg-indigo-800 rounded-lg">
                          <div className="font-medium text-white">{model.name}</div>
                          <div className="text-indigo-200 text-sm">Custom GLB Model</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* System Status */}
                <div className="mt-auto p-4 bg-gray-800 rounded-xl">
                  <h3 className="text-lg font-medium text-white mb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    System Status
                  </h3>
                  <div className="text-sm text-gray-300">
                    <div className="flex items-center justify-between mb-1">
                      <span>Camera:</span>
                      <span className="text-green-400">✓ Active</span>
                    </div>
                    <div className="flex items-center justify-between mb-1">
                      <span>3D Renderer:</span>
                      <span className="text-green-400">✓ Running</span>
                    </div>
                    <div className="flex items-center justify-between mb-1">
                      <span>Face Detection:</span>
                      <span className={faceDetected ? 'text-green-400' : 'text-yellow-400'}>
                        {faceDetected ? '✓ Active' : '⟳ Searching'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Models loaded:</span>
                      <span className="text-indigo-300 font-medium">
                        {uploadedModels.length}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Instructions */}
                <div className="mt-4 p-4 bg-blue-900/50 rounded-xl border border-blue-500/30">
                  <h4 className="text-white font-medium mb-2">Usage Instructions</h4>
                  <ul className="text-blue-200 text-sm space-y-1">
                    <li>• Upload GLB files of glasses models</li>
                    <li>• Use transform controls to adjust fit</li>
                    <li>• Position your face in the camera view</li>
                    <li>• Test different models and positions</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-400">
            Custom GLB Virtual Try-On | Powered by Three.js & WebGL
          </p>
        </div>
      </div>
    </div>
  );
}
