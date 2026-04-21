export const GRAVITATIONAL_CONSTANT = 6.67430e-11;

export const BODY_MASSES = {
  SUN: 1.989e30,
  EARTH: 5.972e24,
  MOON: 7.348e22,
} as const;

export const BODY_NAMES = {
  SUN: 'Sol',
  EARTH: 'Tierra',
  MOON: 'Luna',
} as const;

export type BodyName = typeof BODY_NAMES.SUN | typeof BODY_NAMES.EARTH | typeof BODY_NAMES.MOON;

export const ASTRONOMICAL_UNIT = 1.495978707e11;

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

export interface EnergyMetrics {
  kinetic: number;
  potential: number;
  total: number;
  energyError: number;
}

export interface InitialBodyState {
  position: { x: number; y: number; z: number };
  velocity: { x: number; y: number; z: number };
  mass: number;
  name: BodyName;
}

export const INITIAL_CONDITIONS: Record<'SUN' | 'EARTH' | 'MOON', InitialBodyState> = {
  SUN: {
    position: { x: 0, y: 0, z: 0 },
    velocity: { x: 0, y: 0, z: 0 },
    mass: BODY_MASSES.SUN,
    name: BODY_NAMES.SUN,
  },
  EARTH: {
    position: { x: ASTRONOMICAL_UNIT, y: 0, z: 0 },
    velocity: { x: 0, y: 2.978e4, z: 0 },
    mass: BODY_MASSES.EARTH,
    name: BODY_NAMES.EARTH,
  },
  MOON: {
    position: { x: ASTRONOMICAL_UNIT + 3.844e8, y: 0, z: 0 },
    velocity: { x: 0, y: 3.022e4, z: 0 },
    mass: BODY_MASSES.MOON,
    name: BODY_NAMES.MOON,
  },
};

export const COLORS = {
  SUN: '#FDB813',
  EARTH: '#4A90D9',
  MOON: '#C0C0C0',
  TRAIL_SUN: 'rgba(253, 184, 19, 0.4)',
  TRAIL_EARTH: 'rgba(74, 144, 217, 0.4)',
  TRAIL_MOON: 'rgba(192, 192, 192, 0.4)',
} as const;

export const DEFAULT_DT = 3600;

export const DT_LIMITS = {
  MIN: 1,
  MAX: 2592000,
} as const;

export const SCALE_FACTOR = 1 / ASTRONOMICAL_UNIT;

export const MAX_TRAIL_POINTS = 500;