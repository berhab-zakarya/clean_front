'use client';

import { useEffect, useRef, useState } from 'react';

// Declare the global JEELIZVTOWIDGET type
declare global {
  interface Window {
    JEELIZVTOWIDGET: {
      start: (options: any) => void;
      destroy: () => void;
      enter_adjustMode: () => void;
      exit_adjustMode: () => void;
      load: (sku: string) => void;
    };
  }
}

export default function VTOTestPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const adjustEnterRef = useRef<HTMLDivElement>(null);
  const adjustRef = useRef<HTMLDivElement>(null);
  const changeModelRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState<string>('Initializing...');
  const [customModel, setCustomModel] = useState<string | null>(null);
  const [activeModel, setActiveModel] = useState<string>('rayban_aviator_or_vertFlash');
  const [showTutorial, setShowTutorial] = useState<boolean>(true);

  const toggleLoading = (isLoadingVisible: boolean) => {
    if (loadingRef.current) {
      loadingRef.current.style.display = isLoadingVisible ? 'block' : 'none';
    }
    setIsLoading(isLoadingVisible);
  };

  const enterAdjustMode = () => {
    if (window.JEELIZVTOWIDGET) {
      window.JEELIZVTOWIDGET.enter_adjustMode();
      if (adjustEnterRef.current) adjustEnterRef.current.style.display = 'none';
      if (adjustRef.current) adjustRef.current.style.display = 'block';
      if (changeModelRef.current) changeModelRef.current.style.display = 'none';
    }
  };

  const exitAdjustMode = () => {
    if (window.JEELIZVTOWIDGET) {
      window.JEELIZVTOWIDGET.exit_adjustMode();
      if (adjustEnterRef.current) adjustEnterRef.current.style.display = 'block';
      if (adjustRef.current) adjustRef.current.style.display = 'none';
      if (changeModelRef.current) changeModelRef.current.style.display = 'block';
    }
  };

  const setGlassesModel = (sku: string) => {
    if (window.JEELIZVTOWIDGET) {
      setActiveModel(sku);
      window.JEELIZVTOWIDGET.load(sku);
    }
  };

  const loadCustomModel = (modelPath: string) => {
    if (window.JEELIZVTOWIDGET) {
      console.log('Loading custom model from:', modelPath);
      setStatus('Loading custom model...');
      
      // Update the widget configuration with the new model
      window.JEELIZVTOWIDGET.start({
        placeHolder: containerRef.current,
        canvas: canvasRef.current,
        callbacks: {
          ADJUST_START: null,
          ADJUST_END: null,
          LOADING_START: toggleLoading.bind(null, true),
          LOADING_END: toggleLoading.bind(null, false)
        },
        sku: 'custom_model',
        glassesUrl: modelPath,
        searchImageMask: '/jeeliz/assets/images/target512.jpg',
        searchImageColor: 0xeeeeee,
        searchImageRotationSpeed: -0.001,
        isDebug: true, // Enable debug mode
        isMirror: true, // Mirror the camera feed
        isResponsive: true,
        isAutoResize: true,
        callbackReady: () => {
          console.log('Custom model loaded successfully');
          setStatus('Custom model loaded successfully');
          setIsLoading(false);
          setActiveModel('custom_model');
        },
        onError: (errorLabel: string) => {
          console.error('VTO Widget error:', errorLabel);
          setError(`Error loading model: ${errorLabel}`);
          setIsLoading(false);
        }
      });
    } else {
      console.error('JEELIZVTOWIDGET not initialized');
      setError('Virtual try-on library not initialized');
    }
  };

  useEffect(() => {
    const loadResources = () => {
      return new Promise<void>((resolve, reject) => {
        if (window.JEELIZVTOWIDGET) {
          resolve();
          return;
        }

        // Load CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '/jeeliz/JeelizVTOWidget.css';
        document.head.appendChild(link);

        // Load Script
        const script = document.createElement('script');
        script.src = '/jeeliz/JeelizVTOWidget.js';
        script.async = true;
        setStatus('Loading library...');

        script.onload = () => {
          setStatus('Library loaded successfully');
          resolve();
        };

        script.onerror = () => {
          console.error('Failed to load script');
          setError('Failed to load virtual try-on library');
          reject(new Error('Script loading failed'));
        };

        document.head.appendChild(script);
      });
    };

    const initVTOWidget = () => {
      if (!containerRef.current || !canvasRef.current) return;

      window.JEELIZVTOWIDGET.start({
        placeHolder: containerRef.current,
        canvas: canvasRef.current,
        callbacks: {
          ADJUST_START: null,
          ADJUST_END: null,
          LOADING_START: toggleLoading.bind(null, true),
          LOADING_END: toggleLoading.bind(null, false)
        },
        sku: 'rayban_aviator_or_vertFlash',
        searchImageMask: '/jeeliz/assets/images/target512.jpg',
        searchImageColor: 0xeeeeee,
        searchImageRotationSpeed: -0.001,
        callbackReady: () => {
          setStatus('Virtual try-on ready');
          setIsLoading(false);
        },
        onError: (errorLabel: string) => {
          console.error('VTO Widget error:', errorLabel);
          setError(`Error: ${errorLabel}`);
          setIsLoading(false);
        }
      });
    };

    loadResources()
      .then(() => {
        initVTOWidget();
      })
      .catch(console.error);

    return () => {
      if (window.JEELIZVTOWIDGET?.destroy) {
        window.JEELIZVTOWIDGET.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (customModel) {
      loadCustomModel(customModel);
    }
  }, [customModel]);

  // Define model information
  const models = [
    { 
      id: 'rayban_aviator_or_vertFlash', 
      name: 'Aviator Gold', 
      image: '/jeeliz/assets/thumbnails/rayban_aviator.jpg',
      description: 'Classic aviator style with green flash lenses'
    },
    { 
      id: 'rayban_round_cuivre_pinkBrownDegrade', 
      name: 'Round Copper', 
      image: '/jeeliz/assets/thumbnails/rayban_round.jpg',
      description: 'Round copper frame with pink brown gradient lenses'
    },
    { 
      id: 'carrera_113S_blue', 
      name: 'Carrera Blue', 
      image: '/jeeliz/assets/thumbnails/carrera_blue.jpg',
      description: 'Sporty Carrera frame in striking blue'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
            AR Glasses Try-On
          </h1>
          <p className="text-blue-300 text-xl">Experience our eyewear collection with augmented reality</p>
        </div>

        <div className="bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-indigo-500/30">
          <div className="flex flex-col lg:flex-row">
            {/* Main Display Area */}
            <div className="lg:w-3/4">
              <div
                ref={containerRef}
                className="JeelizVTOWidget relative bg-black rounded-tl-3xl overflow-hidden w-full h-[500px] lg:h-[700px]"
              >
                <canvas
                  ref={canvasRef}
                  className="JeelizVTOWidgetCanvas absolute inset-0 w-full h-full"
                />

                {/* Tutorial overlay */}
                {showTutorial && (
                  <div className="absolute inset-0 bg-black/70 z-30 flex items-center justify-center">
                    <div className="bg-gray-800 rounded-xl max-w-md p-6 text-center border border-indigo-400">
                      <h3 className="text-xl font-bold text-white mb-4">Getting Started</h3>
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-gray-700 p-3 rounded-lg">
                          <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white text-xl mb-2 mx-auto">1</div>
                          <p className="text-gray-200 text-sm">Allow camera access</p>
                        </div>
                        <div className="bg-gray-700 p-3 rounded-lg">
                          <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white text-xl mb-2 mx-auto">2</div>
                          <p className="text-gray-200 text-sm">Face the camera directly</p>
                        </div>
                        <div className="bg-gray-700 p-3 rounded-lg">
                          <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white text-xl mb-2 mx-auto">3</div>
                          <p className="text-gray-200 text-sm">Ensure good lighting</p>
                        </div>
                        <div className="bg-gray-700 p-3 rounded-lg">
                          <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white text-xl mb-2 mx-auto">4</div>
                          <p className="text-gray-200 text-sm">Try different frames</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => setShowTutorial(false)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-colors w-full font-medium"
                      >
                        Start Try-On Experience
                      </button>
                    </div>
                  </div>
                )}

                <div ref={adjustEnterRef} className="JeelizVTOWidgetControls absolute top-4 right-4 z-10">
                  <button
                    className="JeelizVTOWidgetButton JeelizVTOWidgetAdjustEnterButton bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center shadow-lg"
                    onClick={enterAdjustMode}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    Adjust Position
                  </button>
                </div>

                <div ref={adjustRef} className="JeelizVTOWidgetAdjustNotice absolute top-4 left-1/2 transform -translate-x-1/2 bg-gray-800/90 text-white p-4 rounded-lg border border-indigo-400 shadow-lg z-20" style={{display: 'none'}}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                      </svg>
                      <span>Drag glasses to adjust position</span>
                    </div>
                    <button
                      className="JeelizVTOWidgetButton JeelizVTOWidgetAdjustExitButton bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors ml-4 font-medium"
                      onClick={exitAdjustMode}
                    >
                      Done
                    </button>
                  </div>
                </div>

                <div ref={loadingRef} className="JeelizVTOWidgetLoading absolute inset-0 flex items-center justify-center bg-gray-900/95 z-20">
                  <div className="text-center">
                    <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <div className="JeelizVTOWidgetLoadingText text-white text-xl">
                      {status}
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="absolute inset-0 flex items-center justify-center bg-red-900/95 z-20">
                    <div className="text-white text-center p-6 max-w-md">
                      <div className="text-5xl mb-4">⚠️</div>
                      <div className="text-xl mb-6 font-semibold">{error}</div>
                      <div className="space-y-3">
                        <button
                          onClick={() => window.location.reload()}
                          className="w-full px-6 py-3 bg-white text-red-700 rounded-lg hover:bg-gray-100 transition-colors font-semibold flex items-center justify-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                          </svg>
                          Try Again
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar with model selection */}
            <div className="lg:w-1/4 bg-gray-900 p-6 overflow-y-auto">
              <div className="flex flex-col h-full">
                <h2 className="text-2xl font-bold text-white mb-6">Select Your Frame</h2>
                
                <div className="space-y-4 flex-grow">
                  {models.map((model) => (
                    <div 
                      key={model.id}
                      className={`p-3 rounded-xl cursor-pointer transition-all ${activeModel === model.id ? 'bg-indigo-600 border-2 border-indigo-400' : 'bg-gray-800 hover:bg-gray-700'}`}
                      onClick={() => setGlassesModel(model.id)}
                    >
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gray-700 rounded-lg mr-3 flex items-center justify-center overflow-hidden">
                          {/* This would be an actual image in production */}
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-white font-medium">{model.name}</h3>
                          <p className="text-gray-400 text-sm">{model.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Custom model upload */}
                  <div className="bg-gradient-to-r from-indigo-800 to-purple-800 p-4 rounded-xl mt-6">
                    <h3 className="text-white font-medium mb-2">Try Custom Model</h3>
                    <p className="text-blue-200 text-sm mb-3">Upload your own 3D glasses model</p>
                    <button
                      className="w-full bg-white text-indigo-800 hover:bg-gray-100 font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
                      onClick={() => {
                        setCustomModel('/jeeliz/assets/models3D/glasses.glb');
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                      Load Demo Model
                    </button>
                  </div>
                </div>

                {/* System status */}
                <div className="mt-6 p-4 bg-gray-800 rounded-xl">
                  <h3 className="text-lg font-medium text-white mb-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    System Status
                  </h3>
                  <div className="text-sm text-gray-300">
                    <div className="flex items-center justify-between mb-1">
                      <span>Library:</span>
                      <span className={window.JEELIZVTOWIDGET ? 'text-green-400' : 'text-yellow-400'}>
                        {window.JEELIZVTOWIDGET ? '✓ Loaded' : '⟳ Loading'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-1">
                      <span>Status:</span>
                      <span className={isLoading ? 'text-yellow-400' : error ? 'text-red-400' : 'text-green-400'}>
                        {isLoading ? '⟳ Loading' : error ? '✗ Error' : '✓ Ready'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Active frame:</span>
                      <span className="text-indigo-300 font-medium">
                        {models.find(m => m.id === activeModel)?.name || 'Custom Model'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Help button */}
                <button 
                  onClick={() => setShowTutorial(true)}
                  className="mt-4 py-2 px-4 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg flex items-center justify-center transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                  How to Use
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-400">
            © 2025 Virtual Eyewear Try-On | Powered by Jeeliz AR Technology
          </p>
        </div>
      </div>
    </div>
  );
}