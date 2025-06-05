// Global type definitions

interface MediaPipeConfig {
  faceDetection?: {
    modelPath?: string;
    wasmPath?: string;
  }
}

interface Window {
  MEDIAPIPE_CONFIG?: {
    faceDetection?: {
      wasmPath?: string;
      modelPath?: string;
    };
  };
  
  // MediaPipe global objects
  FaceDetection?: any;
  MediaPipeComponents?: {
    faceDetector?: any;
  };
  
  // MediaPipe initializer function
  initializeMediaPipeFaceDetector?: () => Promise<any>;
}
