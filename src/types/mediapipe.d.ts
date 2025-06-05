// Global MediaPipe types used in our application
interface MediaPipeDetection {
  score: number;
  boundingBox: {
    xCenter: number;
    yCenter: number;
    width: number;
    height: number;
  };
  landmarks?: Array<{ x: number; y: number; z: number }>;
}

interface MediaPipeResults {
  detections: MediaPipeDetection[];
  image?: HTMLCanvasElement | HTMLVideoElement | HTMLImageElement;
}

declare module '@mediapipe/face_detection' {
  export interface FaceDetectorOptions {
    modelSelection?: number;
    minDetectionConfidence?: number;
    selfieMode?: boolean;
  }

  export interface FaceDetection {
    boundingBox: {
      xCenter: number;
      yCenter: number;
      width: number;
      height: number;
    };
    landmarks: Array<{ x: number; y: number; z: number }>;
    detections: Array<{
      score: number;
      boundingBox: {
        xCenter: number;
        yCenter: number;
        width: number;
        height: number;
      };
      landmarks: Array<{ x: number; y: number; z: number }>;
    }>;
  }

  export interface Results {
    detections: FaceDetection[];
    image: HTMLCanvasElement | HTMLVideoElement | HTMLImageElement;
  }

  export class FaceDetector {
    constructor(options?: FaceDetectorOptions);
    setOptions(options: FaceDetectorOptions): void;
    send(
      image: HTMLCanvasElement | HTMLVideoElement | HTMLImageElement
    ): Promise<void>;
    onResults(callback: (results: Results) => void): void;
    close(): Promise<void>;
  }
}

declare module '@mediapipe/camera_utils' {
  export class Camera {
    constructor(
      videoElement: HTMLVideoElement,
      options: {
        onFrame?: () => Promise<void>;
        width?: number;
        height?: number;
        facingMode?: string;
      }
    );
    start(): Promise<void>;
    stop(): void;
  }
}

declare module '@mediapipe/drawing_utils' {
  export function drawConnectors(
    canvasCtx: CanvasRenderingContext2D,
    landmarks: Array<{ x: number; y: number }>,
    connections: Array<[number, number]>,
    options?: {
      color?: string;
      lineWidth?: number;
    }
  ): void;

  export function drawLandmarks(
    canvasCtx: CanvasRenderingContext2D,
    landmarks: Array<{ x: number; y: number }>,
    options?: {
      color?: string;
      lineWidth?: number;
      radius?: number;
    }
  ): void;
}
