declare module '@tensorflow-models/blazeface' {
  export interface NormalizedFace {
    topLeft: [number, number];
    bottomRight: [number, number];
    landmarks?: Array<[number, number]>;
    probability?: number;
  }

  export interface BlazeFaceModel {
    estimateFaces: (
      input: HTMLVideoElement | HTMLImageElement | HTMLCanvasElement,
      returnTensors: boolean
    ) => Promise<NormalizedFace[]>;
  }

  export function load(config?: {
    maxFaces?: number;
    inputWidth?: number;
    inputHeight?: number;
    iouThreshold?: number;
    scoreThreshold?: number;
  }): Promise<BlazeFaceModel>;
}
