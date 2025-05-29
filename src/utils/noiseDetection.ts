import * as tf from '@tensorflow/tfjs';

// Flag to track initialization status
let isInitialized = false;

/**
 * Initialize TensorFlow.js for audio processing
 */
export const initNoiseDetection = async (): Promise<void> => {
  if (isInitialized) {
    console.log('Noise detection already initialized');
    return;
  }

  try {
    // Initialize TensorFlow.js backend
    console.log('Setting up TensorFlow.js backend for audio processing...');
    await tf.setBackend('webgl');
    console.log('TensorFlow backend initialized:', tf.getBackend());
    
    // Pre-warm the system
    tf.tidy(() => {
      // Create and dispose of a small tensor to ensure the backend is ready
      const warmupTensor = tf.zeros([1, 1024]);
      warmupTensor.dispose();
    });
    
    isInitialized = true;
    console.log('Noise detection system initialized');
  } catch (error) {
    console.error('Error initializing noise detection:', error);
    
    // Try with CPU backend as fallback
    try {
      console.log('Trying with CPU backend for audio processing...');
      await tf.setBackend('cpu');
      console.log('TensorFlow CPU backend initialized:', tf.getBackend());
      
      isInitialized = true;
    } catch (fallbackError) {
      console.error('Error initializing noise detection with fallback:', fallbackError);
      throw fallbackError;
    }
  }
};

/**
 * Analyzes audio data for noise patterns
 * This is a simplified version of DTLN-inspired approach
 * @param audioData The audio data to analyze
 * @returns Object with noise detection results
 */
export const detectNoise = async (audioData: Float32Array): Promise<{
  backgroundNoiseDetected: boolean;
  interviewerNoiseDetected: boolean;
  noiseLevel: number;
  signalToNoiseRatio: number;
}> => {
  if (!isInitialized) {
    await initNoiseDetection();
  }

  return tf.tidy(() => {
    // Convert audio data to tensor
    const audioTensor = tf.tensor1d(audioData);
    
    // Compute frequency domain representation (simplified FFT)
    // In a full DTLN implementation, we would use STFT and more complex processing
    const spectralData = tf.spectral.rfft(audioTensor);
    
    // Get magnitudes of frequency components
    const magnitudes = tf.abs(spectralData);
    
    // Calculate statistics for noise detection
    const mean = magnitudes.mean();
    const std = tf.moments(magnitudes).variance.sqrt();
    const max = magnitudes.max();
    
    // Calculate signal-to-noise ratio (simplified)
    const signalPower = max.square();
    const noisePower = mean.square();
    const snr = tf.div(signalPower, noisePower);
    
    // Detect background noise (higher frequency components)
    const highFreqMagnitudes = magnitudes.slice(
      Math.floor(magnitudes.shape[0] * 0.7), // Focus on higher 30% of frequencies
      Math.floor(magnitudes.shape[0] * 0.3)  // Get the last 30%
    );
    const highFreqMean = highFreqMagnitudes.mean();
    
    // Detect interviewer noise (focused on speech frequencies 300-3000 Hz)
    // This is a simplified approximation
    const midFreqStart = Math.floor(magnitudes.shape[0] * 0.1); // ~300Hz
    const midFreqEnd = Math.floor(magnitudes.shape[0] * 0.3);   // ~3000Hz
    const midFreqMagnitudes = magnitudes.slice(midFreqStart, midFreqEnd - midFreqStart);
    const midFreqMean = midFreqMagnitudes.mean();
    const midFreqMax = midFreqMagnitudes.max();
    
    // Get values from tensors
    const meanVal = mean.dataSync()[0];
    const stdVal = std.dataSync()[0];
    const maxVal = max.dataSync()[0];
    const snrVal = snr.dataSync()[0];
    const highFreqMeanVal = highFreqMean.dataSync()[0];
    const midFreqMeanVal = midFreqMean.dataSync()[0];
    const midFreqMaxVal = midFreqMax.dataSync()[0];
    
    // Determine noise thresholds
    // These thresholds would need to be calibrated for your specific use case
    const backgroundNoiseThreshold = 0.05;
    const interviewerNoiseThreshold = 0.1;
    const snrThreshold = 10;
    
    // Detect different types of noise
    const backgroundNoiseDetected = highFreqMeanVal > backgroundNoiseThreshold && snrVal < snrThreshold;
    const interviewerNoiseDetected = midFreqMeanVal > interviewerNoiseThreshold && midFreqMaxVal > maxVal * 0.7;
    
    // Calculate overall noise level (0-100)
    const noiseLevel = Math.min(100, Math.max(0, Math.round((meanVal / 0.2) * 100)));
    
    return {
      backgroundNoiseDetected,
      interviewerNoiseDetected,
      noiseLevel,
      signalToNoiseRatio: snrVal
    };
  });
};

/**
 * Process audio from a microphone stream for noise detection
 * @param stream The microphone MediaStream
 * @returns A function to stop the processing
 */
export const startNoiseDetection = (stream: MediaStream, onNoiseDetected: (result: {
  backgroundNoiseDetected: boolean;
  interviewerNoiseDetected: boolean;
  noiseLevel: number;
  signalToNoiseRatio: number;
}) => void): () => void => {
  // Initialize audio context and analyzer
  const audioContext = new AudioContext();
  const analyser = audioContext.createAnalyser();
  analyser.fftSize = 2048;
  
  // Connect microphone to analyzer
  const source = audioContext.createMediaStreamSource(stream);
  source.connect(analyser);
  
  // Create buffer for audio data
  const dataArray = new Float32Array(analyser.frequencyBinCount);
  
  // Flag to control the loop
  let isRunning = true;
  
  // Process audio data at regular intervals
  const processInterval = setInterval(async () => {
    if (!isRunning) return;
    
    // Get audio data
    analyser.getFloatTimeDomainData(dataArray);
    
    try {
      // Analyze for noise
      const result = await detectNoise(dataArray);
      
      // Call the callback with results
      onNoiseDetected(result);
    } catch (error) {
      console.error('Error in noise detection:', error);
    }
  }, 1000); // Check every second
  
  // Return function to stop processing
  return () => {
    isRunning = false;
    clearInterval(processInterval);
    source.disconnect();
    audioContext.close().catch(err => console.error('Error closing audio context:', err));
  };
};
