export type BodyName = 'Sol' | 'Tierra' | 'Luna';

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface BodyState {
  position: Vector3;
  velocity: Vector3;
  mass: number;
  name: BodyName;
}

export interface SimulationState {
  bodies: BodyState[];
  time: number;
}

export interface EnergyMetrics {
  kinetic: number;
  potential: number;
  total: number;
  energyError: number;
}

export interface VelocityData {
  body: BodyName;
  speed: number;
  vx: number;
  vy: number;
  vz: number;
}

export interface EnergyDataPoint {
  time: number;
  kinetic: number;
  potential: number;
  total: number;
  error: number;
}

export interface RunResult {
  id: string;
  dt: number;
  finalEnergy: number;
  energyError: number;
  steps: number;
  timeElapsed: number;
}

export interface DerivativeState {
  positions: Vector3[];
  velocities: Vector3[];
}

export type SimulationStatus = 'idle' | 'running' | 'paused';