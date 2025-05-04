import { useState, useRef, Suspense, useEffect } from 'react';
import { Upload, X, FileBox } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment } from '@react-three/drei';
import * as THREE from 'three';

interface Model3DFile {
  id: string;
  file: File;
  type: string;
  name: string;
  url: string;
}

function LoadingSpinner() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-gray-500">Loading model...</div>
    </div>
  );
}

function ModelViewer({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  
  useEffect(() => {
    if (scene) {
      // Center the model
      const box = new THREE.Box3().setFromObject(scene);
      const center = box.getCenter(new THREE.Vector3());
      scene.position.sub(center);
      
      // Scale the model
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 2 / maxDim;
      scene.scale.multiplyScalar(scale);
    }
  }, [scene]);

  return (
    <>
      <primitive object={scene} castShadow receiveShadow />
      {/* Remove Environment component and use basic lighting */}
      <ambientLight intensity={0.8} />
      <directionalLight 
        position={[5, 5, 5]} 
        intensity={1} 
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight 
        position={[-5, -5, -5]} 
        intensity={0.2} 
      />
      
    </>
  );
}

export default function Model3DUpload() {
  const [models, setModels] = useState<Model3DFile[]>([]);
  const [selectedModel, setSelectedModel] = useState<Model3DFile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    const validFiles = files.filter(file => 
      file.type === 'model/gltf-binary' || // GLB
      file.type === 'model/vnd.usdz+zip' || // USDZ
      file.name.endsWith('.glb') || 
      file.name.endsWith('.usdz')
    );

    const newModels = validFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      type: file.name.split('.').pop() || '',
      name: file.name,
      url: URL.createObjectURL(file)
    }));

    setModels(prev => [...prev, ...newModels]);
  };

  const removeModel = (id: string) => {
    setModels(prev => {
      const modelToRemove = prev.find(model => model.id === id);
      if (modelToRemove) {
        URL.revokeObjectURL(modelToRemove.url);
      }
      return prev.filter(model => model.id !== id);
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-6">3D Models</h2>

      <div className="space-y-6">
        {/* Upload Area */}
        <div 
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept=".glb,.usdz,model/gltf-binary,model/vnd.usdz+zip"
            className="hidden"
            multiple
          />
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm font-medium text-gray-900">Click to upload 3D models</p>
          <p className="mt-1 text-xs text-gray-500">GLB or USDZ files up to 100MB</p>
        </div>

        {/* Model Preview */}
        {selectedModel && selectedModel.type === 'glb' && (
          <div className="relative w-full h-[500px] border rounded-lg overflow-hidden bg-gray-100">
            <Canvas
              camera={{ position: [3, 3, 3], fov: 50 }}
              shadows
              gl={{ preserveDrawingBuffer: true }}
            >
              <ambientLight intensity={0.5} />
              <directionalLight
                position={[5, 5, 5]}
                intensity={1}
                castShadow
              />
              <Suspense fallback={null}>
                <ModelViewer url={selectedModel.url} />
              </Suspense>
              <OrbitControls
                makeDefault
                enableDamping
                dampingFactor={0.05}
                minDistance={2}
                maxDistance={10}
                enablePan={true}
                enableZoom={true}
              />
            </Canvas>

            {/* Controls Helper */}
            <div className="absolute bottom-4 left-4 bg-black/50 text-white text-xs p-3 rounded-lg space-y-1">
              <p className="font-medium">Model Controls:</p>
              <p>🖱️ Left Click + Drag: Rotate</p>
              <p>🖱️ Right Click + Drag: Pan</p>
              <p>🖱️ Scroll: Zoom In/Out</p>
            </div>
          </div>
        )}

        {/* Model List */}
        {models.length > 0 && (
          <div className="space-y-4">
            {models.map(model => (
              <div 
                key={model.id}
                className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition-colors ${
                  selectedModel?.id === model.id ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 hover:bg-gray-100'
                }`}
                onClick={() => setSelectedModel(model)}
              >
                <div className="flex items-center space-x-3">
                  <FileBox className="h-6 w-6 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{model.name}</p>
                    <p className="text-xs text-gray-500 uppercase">{model.type}</p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (selectedModel?.id === model.id) {
                      setSelectedModel(null);
                    }
                    removeModel(model.id);
                  }}
                  className="p-1 hover:bg-gray-200 rounded-full"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}