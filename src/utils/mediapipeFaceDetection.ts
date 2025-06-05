// MediaPipe face detection implementation
// Uses global MediaPipe objects loaded via script tags in index.html

// Define interfaces for MediaPipe objects
interface MediaPipeDetection {
  boundingBox: {
    xCenter: number;
    yCenter: number;
    width: number;
    height: number;
  };
  score: number;
}

interface MediaPipeResults {
  detections?: MediaPipeDetection[];
}

interface MediaPipeFaceDetector {
  setOptions: (options: any) => void;
  onResults: (callback: (results: MediaPipeResults) => void) => void;
  send: (input: HTMLCanvasElement | HTMLVideoElement) => void;
}

// Declare global MediaPipe objects
declare global {
  interface Window {
    initializeMediaPipeFaceDetector?: () => Promise<any>;
    MediaPipeComponents?: {
      faceDetector?: any;
    };
  }
}

// Define the detection result type
interface FaceDetectionResult {
  faceCount: number;
  noFaceDetected: boolean;
  multipleFacesDetected: boolean;
  predictions: MediaPipeDetection[] | null;
}

// Internal state for face detection
interface FaceDetectionState {
  detector: MediaPipeFaceDetector | null;
  modelLoaded: boolean;
  facePresent: boolean;
  consecutiveNoFaceFrames: number;
  consecutiveFaceFrames: number;
  lastFaceLostTime: number | null;
  lastDetectionTime: number;
  lastDetectionResult: FaceDetectionResult | null;
  onFaceLost: ((duration: number) => void) | null;
  onFaceReturned: (() => void) | null;
}

// Initialize state
const state: FaceDetectionState = {
  detector: null,
  modelLoaded: false,
  facePresent: false,
  consecutiveNoFaceFrames: 0,
  consecutiveFaceFrames: 0,
  lastFaceLostTime: null,
  lastDetectionTime: 0,
  lastDetectionResult: {
    faceCount: 0,
    noFaceDetected: true,
    multipleFacesDetected: false,
    predictions: null,
  },
  onFaceLost: null,
  onFaceReturned: null
};

/**
 * Set callbacks for face detection events
 */
export const setFaceDetectionCallbacks = (callbacks: {
  onFaceLost?: (duration: number) => void;
  onFaceReturned?: () => void;
}): void => {
  state.onFaceLost = callbacks.onFaceLost || null;
  state.onFaceReturned = callbacks.onFaceReturned || null;
  console.log('Face detection callbacks set');
};

/**
 * Initialize face detection by loading MediaPipe FaceDetector
 */
export const initFaceDetection = async (): Promise<boolean> => {
  try {
    // If detector is already loaded, return success
    if (state.modelLoaded && state.detector) {
      console.log('Face detection model already loaded');
      return true;
    }
    
    // Clear any previous state
    state.modelLoaded = false;
    state.detector = null;
    
    console.log('Initializing MediaPipe Face Detection...');
    
    // Check if the global initializer function exists
    if (!window.initializeMediaPipeFaceDetector) {
      console.error('MediaPipe initializer not found. Make sure mediapipe-loader.js is loaded.');
      return false;
    }
    
    try {
      // Initialize MediaPipe face detector using the global function
      await window.initializeMediaPipeFaceDetector();
      
      // Get the detector from global object
      const faceDetector = window.MediaPipeComponents?.faceDetector;
      
      if (!faceDetector) {
        throw new Error('Failed to initialize MediaPipe face detector');
      }
      
      // Try to set selfie mode if supported
      try {
        faceDetector.setOptions({
          selfieMode: true,
          modelSelection: 0,
          minDetectionConfidence: 0.3
        });
      } catch (e) {
        console.warn('Failed to set additional MediaPipe options:', e);
      }
      
      // Store the detector in our state
      state.detector = faceDetector;
      console.log('MediaPipe Face Detection model loaded successfully');
      
      // Reset state variables
      state.facePresent = false;
      state.consecutiveNoFaceFrames = 0;
      state.consecutiveFaceFrames = 0;
      state.lastFaceLostTime = null;
      state.modelLoaded = true;
      
      return true;
    } catch (initError) {
      console.error('Error initializing MediaPipe face detector:', initError);
      return false;
    }
  } catch (error) {
    console.error('Failed to initialize face detection:', error);
    state.modelLoaded = false;
    state.detector = null;
    return false;
  }
};

/**
 * Handle changes in face presence with debouncing to reduce flickering
 */
const handleFacePresenceChange = (faceDetected: boolean): void => {
  try {
    const currentTime = Date.now();
    
    console.log(`Face detection status: ${faceDetected ? 'DETECTED' : 'NOT DETECTED'}, current state: ${state.facePresent ? 'present' : 'absent'}`);
    
    // Update consecutive frame counters
    if (faceDetected) {
      state.consecutiveFaceFrames++;
      state.consecutiveNoFaceFrames = 0;
      console.log(`Consecutive frames with face: ${state.consecutiveFaceFrames}`);
    } else {
      state.consecutiveNoFaceFrames++;
      state.consecutiveFaceFrames = 0;
      console.log(`Consecutive frames without face: ${state.consecutiveNoFaceFrames}`);
    }
    
    // Make face detection more responsive with lower thresholds
    const REQUIRED_NO_FACE_FRAMES = 1; // Immediately trigger on first no-face frame
    const REQUIRED_FACE_FRAMES = 1;    // Immediately confirm on first face frame
    
    if (state.facePresent && state.consecutiveNoFaceFrames >= REQUIRED_NO_FACE_FRAMES) {
      state.facePresent = false;
      state.lastFaceLostTime = currentTime;
      console.log('Face lost event triggered after multiple consecutive no-face frames');
      
      if (state.onFaceLost) {
        try {
          state.onFaceLost(0);
        } catch (e) {
          console.error('Error in onFaceLost callback:', e);
        }
      }
    }
    
    if (!state.facePresent && state.consecutiveFaceFrames >= REQUIRED_FACE_FRAMES) {
      state.facePresent = true;
      if (state.lastFaceLostTime) {
        const duration = currentTime - state.lastFaceLostTime;
        console.log(`Face returned after ${duration}ms`);
        
        if (state.onFaceReturned) {
          try {
            state.onFaceReturned();
          } catch (e) {
            console.error('Error in onFaceReturned callback:', e);
          }
        }
      } else {
        console.log('Face detected initially');
        
        if (state.onFaceReturned) {
          try {
            state.onFaceReturned();
          } catch (e) {
            console.error('Error in onFaceReturned callback:', e);
          }
        }
      }
    }
  } catch (error) {
    console.error('Error in handleFacePresenceChange:', error);
  }
};

/**
 * Detect faces in a video element using MediaPipe FaceDetector
 */
export const detectFaces = async (videoElement: HTMLVideoElement): Promise<{
  faceCount: number;
  noFaceDetected: boolean;
  multipleFacesDetected: boolean;
  predictions: MediaPipeDetection[] | null;
}> => {
  // Default response for errors
  const errorResponse = {
    faceCount: 0,
    noFaceDetected: true,
    multipleFacesDetected: false,
    predictions: null,
  };

  // Throttle detection to avoid overwhelming the browser but keep it responsive
  const now = Date.now();
  if (now - state.lastDetectionTime < 100) { // Reduce throttling to 100ms for more responsive detection
    return state.lastDetectionResult || errorResponse; // Return last result if available instead of error
  }
  state.lastDetectionTime = now;

  // Basic validation checks
  if (!state.detector || !state.modelLoaded) {
    console.error('MediaPipe FaceDetector not loaded');
    return errorResponse;
  }
  
  if (!videoElement) {
    console.error('Video element is null');
    return errorResponse;
  }
  
  // Check if video is ready and playing
  if (videoElement.readyState < 2 || videoElement.paused) {
    console.warn('Video not ready or paused');
    return errorResponse;
  }

  // Check video dimensions
  if (videoElement.videoWidth === 0 || videoElement.videoHeight === 0) {
    console.error('Video has zero dimensions - cannot detect faces');
    return errorResponse;
  }
  
  try {
    // Create a canvas with the video dimensions
    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    
    // Get 2D context
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) {
      throw new Error('Could not get canvas context');
    }
    
    // Draw video frame to canvas
    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    
    // Create a promise to get results from the detector with a timeout
    let detections: MediaPipeDetection[] = [];
    
    await Promise.race([
      new Promise<void>((resolve) => {
        if (!state.detector) {
          resolve();
          return;
        }
        
        // Set up a one-time results handler
        const resultsHandler = (results: MediaPipeResults) => {
          if (results.detections) {
            detections = results.detections;
          }
          resolve();
        };
        
        state.detector.onResults(resultsHandler);
        
        // Send the canvas to the detector
        try {
          state.detector.send(canvas);
        } catch (e) {
          console.error('Error sending canvas to detector:', e);
          resolve(); // Resolve anyway to prevent hanging
        }
      }),
      // Add a timeout to prevent hanging if MediaPipe doesn't respond
      new Promise<void>((resolve) => setTimeout(resolve, 1000))
    ]);
    
    // Process results
    const faceCount = detections.length;
    const noFaceDetected = faceCount === 0;
    const multipleFacesDetected = faceCount > 1;
    
    // Enhanced debug logging with more details
    console.log(`Face detection: ${faceCount} face(s) found`);
    
    // Log specific details based on face count
    if (faceCount === 1) {
      // Single face - show confidence and position
      const face = detections[0];
      const confidence = face.score !== undefined ? face.score.toFixed(2) : 'N/A';
      console.log(`Single face detected with confidence: ${confidence}`);
      
      if (face.boundingBox) {
        const box = face.boundingBox;
        console.log(`Face position: x=${Math.round(box.xCenter)}, y=${Math.round(box.yCenter)}, width=${Math.round(box.width)}, height=${Math.round(box.height)}`);
      }
    } else if (faceCount > 1) {
      // Multiple faces - show count and individual confidences
      console.log(`Multiple faces detected: ${faceCount}`);
      detections.forEach((face, index) => {
        const confidence = face.score !== undefined ? face.score.toFixed(2) : 'N/A';
        console.log(`Face #${index + 1} confidence: ${confidence}`);
      });
    } else {
      // No faces
      console.log('No faces detected in the current frame');
    }
    
    // Update internal state
    handleFacePresenceChange(!noFaceDetected);
    
    // Create the detection result
    const detectionResult = {
      faceCount,
      noFaceDetected,
      multipleFacesDetected,
      predictions: detections,
    };
    
    // Store the result for future reference
    state.lastDetectionResult = detectionResult;
    
    // Return results
    return detectionResult;
  } catch (error) {
    console.error('Error in face detection:', error);
    return errorResponse;
  }
};

/**
 * Check if face is currently present
 */
export const isFacePresent = (): boolean => {
  return state.facePresent;
};
