import { GRAVITATIONAL_CONSTANT } from './constants';

export function computeKineticEnergy(bodies: { velocity: { x: number; y: number; z: number }; mass: number }[]): number {
  let kinetic = 0;

  for (const body of bodies) {
    const vx = body.velocity.x;
    const vy = body.velocity.y;
    const vz = body.velocity.z;
    const speedSq = vx * vx + vy * vy + vz * vz;

    kinetic += 0.5 * body.mass * speedSq;
  }

  return kinetic;
}

export function computePotentialEnergy(bodies: { position: { x: number; y: number; z: number }; mass: number }[]): number {
  let potential = 0;
  const n = bodies.length;

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const dx = bodies[j].position.x - bodies[i].position.x;
      const dy = bodies[j].position.y - bodies[i].position.y;
      const dz = bodies[j].position.z - bodies[i].position.z;

      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

      potential -= GRAVITATIONAL_CONSTANT * bodies[i].mass * bodies[j].mass / dist;
    }
  }

  return potential;
}

export function computeTotalEnergy(bodies: { velocity: { x: number; y: number; z: number }; mass: number; position: { x: number; y: number; z: number } }[]): { kinetic: number; potential: number; total: number; energyError: number } {
  const kinetic = computeKineticEnergy(bodies);
  const potential = computePotentialEnergy(bodies);
  const total = kinetic + potential;

  return {
    kinetic,
    potential,
    total,
    energyError: 0,
  };
}

export function computeEnergyWithError(
  bodies: { velocity: { x: number; y: number; z: number }; mass: number; position: { x: number; y: number; z: number } }[],
  initialEnergy: number
): { kinetic: number; potential: number; total: number; energyError: number } {
  const metrics = computeTotalEnergy(bodies);
  
  if (initialEnergy !== 0) {
    metrics.energyError = Math.abs((metrics.total - initialEnergy) / initialEnergy) * 100;
  }

  return metrics;
}