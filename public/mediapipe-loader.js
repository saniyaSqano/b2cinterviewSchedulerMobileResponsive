// MediaPipe loader script
(function() {
  // Create global MediaPipe object if it doesn't exist
  window.MediaPipeComponents = window.MediaPipeComponents || {};
  
  // Load required scripts
  const loadScript = (src) => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
      document.head.appendChild(script);
    });
  };
  
  // Function to initialize MediaPipe face detector
  window.initializeMediaPipeFaceDetector = async function() {
    try {
      // If already initialized, return the existing detector
      if (window.MediaPipeComponents.faceDetector) {
        console.log('MediaPipe Face Detector already initialized');
        return window.MediaPipeComponents.faceDetector;
      }
      
      // Load required scripts if not already loaded
      if (!window.FaceDetection) {
        console.log('Loading MediaPipe Face Detection script...');
        await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/face_detection@0.4.1646425229/face_detection.js');
        
        // Wait a bit for the script to initialize
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      // Check if MediaPipe is available
      if (!window.FaceDetection) {
        throw new Error('MediaPipe Face Detection failed to load');
      }
      
      console.log('Creating MediaPipe Face Detector...');
      
      // Create a simple detector object that matches our interface
      const faceDetector = {
        _callbacks: [],
        _options: {
          modelSelection: 0,
          minDetectionConfidence: 0.3,
          selfieMode: true
        },
        
        // Create the actual detector
        _createDetector: async function() {
          if (!this._detector && window.FaceDetection) {
            this._detector = new window.FaceDetection.FaceDetector(this._options);
            console.log('MediaPipe Face Detector created with options:', this._options);
          }
          return this._detector;
        },
        
        // Set options
        setOptions: function(options) {
          this._options = { ...this._options, ...options };
          if (this._detector) {
            this._detector.setOptions(this._options);
          }
        },
        
        // Register callback for results
        onResults: function(callback) {
          this._callbacks.push(callback);
        },
        
        // Send input to detector
        send: async function(input) {
          try {
            // Make sure detector is created
            const detector = await this._createDetector();
            
            if (!detector) {
              console.error('Face detector not available');
              return;
            }
            
            // Process the input
            const results = await detector.detectForVideo(input, Date.now());
            
            // Call all registered callbacks with results
            this._callbacks.forEach(callback => {
              try {
                callback(results);
              } catch (e) {
                console.error('Error in face detection callback:', e);
              }
            });
          } catch (e) {
            console.error('Error in face detection:', e);
          }
        }
      };
      
      // Store in global object
      window.MediaPipeComponents.faceDetector = faceDetector;
      console.log('MediaPipe Face Detector initialized successfully');
      
      return faceDetector;
    } catch (error) {
      console.error('Error initializing MediaPipe Face Detector:', error);
      throw error;
    }
  };
  
  // Start loading the script immediately
  loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/face_detection@0.4.1646425229/face_detection.js')
    .then(() => console.log('MediaPipe Face Detection script loaded'))
    .catch(err => console.error('Failed to load MediaPipe Face Detection script:', err));
})();
