import type { Vector3, BodyState, DerivativeState } from '@/types/physics';
import { GRAVITATIONAL_CONSTANT } from './constants';

export function integrateRK4(
  bodies: BodyState[],
  dt: number
): BodyState[] {
  const positions = bodies.map(b => b.position);
  const velocities = bodies.map(b => b.velocity);
  const masses = bodies.map(b => b.mass);

  const state: DerivativeState = { positions, velocities };

  const k1 = computeDerivativesWithMasses(state, masses);

  const state2: DerivativeState = {
    positions: positions.map((p, i) => ({
      x: p.x + k1.positions[i].x * dt / 2,
      y: p.y + k1.positions[i].y * dt / 2,
      z: p.z + k1.positions[i].z * dt / 2,
    })),
    velocities: velocities.map((v, i) => ({
      x: v.x + k1.velocities[i].x * dt / 2,
      y: v.y + k1.velocities[i].y * dt / 2,
      z: v.z + k1.velocities[i].z * dt / 2,
    })),
  };
  const k2 = computeDerivativesWithMasses(state2, masses);

  const state3: DerivativeState = {
    positions: positions.map((p, i) => ({
      x: p.x + k2.positions[i].x * dt / 2,
      y: p.y + k2.positions[i].y * dt / 2,
      z: p.z + k2.positions[i].z * dt / 2,
    })),
    velocities: velocities.map((v, i) => ({
      x: v.x + k2.velocities[i].x * dt / 2,
      y: v.y + k2.velocities[i].y * dt / 2,
      z: v.z + k2.velocities[i].z * dt / 2,
    })),
  };
  const k3 = computeDerivativesWithMasses(state3, masses);

  const state4: DerivativeState = {
    positions: positions.map((p, i) => ({
      x: p.x + k3.positions[i].x * dt,
      y: p.y + k3.positions[i].y * dt,
      z: p.z + k3.positions[i].z * dt,
    })),
    velocities: velocities.map((v, i) => ({
      x: v.x + k3.velocities[i].x * dt,
      y: v.y + k3.velocities[i].y * dt,
      z: v.z + k3.velocities[i].z * dt,
    })),
  };
  const k4 = computeDerivativesWithMasses(state4, masses);

  const newBodies = bodies.map((body, i) => ({
    ...body,
    position: {
      x: body.position.x + (dt / 6) * (
        k1.positions[i].x + 2 * k2.positions[i].x + 2 * k3.positions[i].x + k4.positions[i].x
      ),
      y: body.position.y + (dt / 6) * (
        k1.positions[i].y + 2 * k2.positions[i].y + 2 * k3.positions[i].y + k4.positions[i].y
      ),
      z: body.position.z + (dt / 6) * (
        k1.positions[i].z + 2 * k2.positions[i].z + 2 * k3.positions[i].z + k4.positions[i].z
      ),
    },
    velocity: {
      x: body.velocity.x + (dt / 6) * (
        k1.velocities[i].x + 2 * k2.velocities[i].x + 2 * k3.velocities[i].x + k4.velocities[i].x
      ),
      y: body.velocity.y + (dt / 6) * (
        k1.velocities[i].y + 2 * k2.velocities[i].y + 2 * k3.velocities[i].y + k4.velocities[i].y
      ),
      z: body.velocity.z + (dt / 6) * (
        k1.velocities[i].z + 2 * k2.velocities[i].z + 2 * k3.velocities[i].z + k4.velocities[i].z
      ),
    },
  }));

  return newBodies;
}

function computeDerivativesWithMasses(
  state: DerivativeState,
  masses: number[]
): DerivativeState {
  const { positions, velocities } = state;
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

  return {
    positions: velocities.map((v: Vector3) => ({ x: v.x, y: v.y, z: v.z })),
    velocities: accelerations,
  };
}