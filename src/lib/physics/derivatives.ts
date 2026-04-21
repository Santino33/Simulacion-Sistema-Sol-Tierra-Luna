import { GRAVITATIONAL_CONSTANT } from './constants';
import type { Vector3, DerivativeState } from '@/types/physics';

export function computeAccelerations(
  positions: Vector3[],
  masses: number[]
): Vector3[] {
  const n = positions.length;
  const accelerations: Vector3[] = [];

  for (let i = 0; i < n; i++) {
    let ax = 0, ay = 0, az = 0;

    for (let j = 0; j < n; j++) {
      if (i === j) continue;

      const dx = positions[j].x - positions[i].x;
      const dy = positions[j].y - positions[i].y;
      const dz = positions[j].z - positions[i].z;

      const distSq = dx * dx + dy * dy + dz * dz;
      const dist = Math.sqrt(distSq);
      const distCubed = dist * dist * dist;

      const factor = GRAVITATIONAL_CONSTANT * masses[j] / distCubed;

      ax += factor * dx;
      ay += factor * dy;
      az += factor * dz;
    }

    accelerations.push({ x: ax, y: ay, z: az });
  }

  return accelerations;
}

export function computeDerivatives(
  state: DerivativeState
): DerivativeState {
  const accelerations = computeAccelerations(
    state.positions,
    state.positions.map(() => 1)
  );

  return {
    positions: [...state.velocities],
    velocities: accelerations,
  };
}