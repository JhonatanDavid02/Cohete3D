export type ThrustMode = 'idle' | 'standby' | 'test';

export type CameraPreset = 'default' | 'rocket' | 'engine' | 'tower' | 'top' | 'tracking';

export type LaunchPhase =
  | 'standby'     // On pad, waiting
  | 'countdown'   // T-3, T-2, T-1
  | 'ignition'    // T-0 engine start, building thrust, subtle pre-liftoff vibration
  | 'liftoff'     // Clamps & umbilical arms release, initial vertical motion
  | 'ascent'      // Climbing through sky, smoke trail, smooth camera tracking
  | 'cruising';   // High altitude reached, steady cruise

export interface LaunchState {
  phase: LaunchPhase;
  countdown: number; // 3, 2, 1, 0
  rocketY: number;   // Current height above pad
  velocity: number;  // Current climb speed
  armRetract: number;// 0 (attached) to 1 (fully retracted)
  clampOpen: number; // 0 (clamped) to 1 (released)
}

export interface SceneConfig {
  thrustMode: ThrustMode;
  floodlights: boolean;
  autoRotate: boolean;
  cameraPreset: CameraPreset;
  launchState: LaunchState;
}
