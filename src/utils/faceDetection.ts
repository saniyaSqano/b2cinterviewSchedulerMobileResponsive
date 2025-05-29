import * as tf from '@tensorflow/tfjs';
import * as blazeface from '@tensorflow-models/blazeface';

let model: blazeface.BlazeFaceModel | null = null;
let isInitializing = false;

/**
 * Initialize the BlazeFace model for face detection
 */
export const initFaceDetection = async (): Promise<void> => {
  // Prevent multiple simultaneous initializations
  if (isInitializing) {
    console.log('Face detection initialization already in progress');
    return;
  }
  
  if (model) {
    console.log('Face detection model already loaded');
    return;
  }
  
  isInitializing = true;
  
  try {
    // First, explicitly set up TensorFlow.js backend
    console.log('Setting up TensorFlow.js backend...');
    await tf.setBackend('webgl');  // Try WebGL first for better performance
    console.log('TensorFlow backend initialized:', tf.getBackend());
    
    // Then load the model
    console.log('Loading BlazeFace model...');
    model = await blazeface.load();
    console.log('Face detection model loaded successfully');
  } catch (error) {
    console.error('Error initializing face detection:', error);
    
    // Try with CPU backend as fallback
    try {
      console.log('Trying with CPU backend as fallback...');
      await tf.setBackend('cpu');
      console.log('TensorFlow CPU backend initialized:', tf.getBackend());
      
      model = await blazeface.load();
      console.log('Face detection model loaded successfully with CPU backend');
    } catch (fallbackError) {
      console.error('Error loading face detection model with fallback:', fallbackError);
      throw fallbackError;
    }
  } finally {
    isInitializing = false;
  }
};

/**
 * Detect faces in a video element
 * @param videoElement The video element to detect faces in
 * @returns Object with detection results
 */
export const detectFaces = async (videoElement: HTMLVideoElement): Promise<{
  faceCount: number;
  noFaceDetected: boolean;
  multipleFacesDetected: boolean;
  predictions: blazeface.NormalizedFace[] | null;
}> => {
  // Ensure TensorFlow backend is initialized
  if (!tf.getBackend()) {
    console.warn('TensorFlow backend not initialized. Setting up WebGL...');
    try {
      await tf.setBackend('webgl');
      console.log('TensorFlow backend initialized:', tf.getBackend());
    } catch (err) {
      console.warn('WebGL backend failed, trying CPU:', err);
      try {
        await tf.setBackend('cpu');
        console.log('TensorFlow CPU backend initialized:', tf.getBackend());
      } catch (cpuErr) {
        console.error('Failed to initialize any TensorFlow backend:', cpuErr);
        return {
          faceCount: 0,
          noFaceDetected: true,
          multipleFacesDetected: false,
          predictions: null,
        };
      }
    }
  }

  // Ensure model is loaded
  if (!model) {
    console.warn('Face detection model not loaded. Initializing...');
    try {
      await initFaceDetection();
      
      // If model still not loaded, return early
      if (!model) {
        console.error('Failed to initialize face detection model');
        return {
          faceCount: 0,
          noFaceDetected: true,
          multipleFacesDetected: false,
          predictions: null,
        };
      }
    } catch (error) {
      console.error('Error initializing face detection:', error);
      return {
        faceCount: 0,
        noFaceDetected: true,
        multipleFacesDetected: false,
        predictions: null,
      };
    }
  }

  // Check video element
  if (!videoElement) {
    console.error('Video element is null or undefined');
    return {
      faceCount: 0,
      noFaceDetected: true,
      multipleFacesDetected: false,
      predictions: null,
    };
  }
  
  // Check if video is ready and has dimensions
  if (videoElement.readyState < 2 || videoElement.videoWidth === 0 || videoElement.videoHeight === 0) {
    console.warn(`Video element not ready for processing. ReadyState: ${videoElement.readyState}, Width: ${videoElement.videoWidth}, Height: ${videoElement.videoHeight}`);
    return {
      faceCount: 0,
      noFaceDetected: true,
      multipleFacesDetected: false,
      predictions: null,
    };
  }

  try {
    console.log('Running face detection on video element:', {
      width: videoElement.videoWidth,
      height: videoElement.videoHeight,
      readyState: videoElement.readyState,
      currentTime: videoElement.currentTime,
      paused: videoElement.paused,
      ended: videoElement.ended,
      srcObject: videoElement.srcObject ? 'Present' : 'None'
    });
    
    // Create a canvas element to capture the current frame
    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      console.error('Failed to get canvas context');
      return {
        faceCount: 0,
        noFaceDetected: true,
        multipleFacesDetected: false,
        predictions: null,
      };
    }
    
    // Draw the current video frame to the canvas
    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
    
    // Run face detection on the canvas instead of directly on the video
    // This can be more reliable in some browsers
    const predictions = await model.estimateFaces(canvas, false);
    
    const faceCount = predictions.length;
    const noFaceDetected = faceCount === 0;
    const multipleFacesDetected = faceCount > 1;

    console.log('Face detection results:', { faceCount, noFaceDetected, multipleFacesDetected });
    
    if (predictions.length > 0) {
      console.log('Face detection details:', predictions);
    }

    return {
      faceCount,
      noFaceDetected,
      multipleFacesDetected,
      predictions,
    };
  } catch (error) {
    console.error('Error during face detection:', error);
    return {
      faceCount: 0,
      noFaceDetected: true,
      multipleFacesDetected: false,
      predictions: null,
    };
  }
};
