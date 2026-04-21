import { create } from 'zustand';
import type { BodyName, EnergyDataPoint, RunResult, SimulationStatus } from '@/types/physics';
import { 
  INITIAL_CONDITIONS, 
  DEFAULT_DT,
  BODY_NAMES
} from '@/lib/physics/constants';
import type { BodyState } from '@/lib/physics/constants';
import { integrateRK4 } from '@/lib/physics/integrator';
import { computeEnergyWithError } from '@/lib/physics/energy';

interface TrailPoint {
  position: { x: number; y: number; z: number };
}

interface SimulationStore {
  status: SimulationStatus;
  bodies: BodyState[];
  initialBodies: BodyState[];
  dt: number;
  time: number;
  initialEnergy: number;
  currentEnergy: number;
  energyError: number;
  energyHistory: EnergyDataPoint[];
  trails: Record<BodyName, TrailPoint[]>;
  velocities: Record<BodyName, { x: number; y: number; z: number; speed: number }>;
  fps: number;
  runResults: RunResult[];
  isDarkMode: boolean;
  viewMode: '3d' | '2d';

  setDt: (dt: number) => void;
  setBodyMass: (body: BodyName, mass: number) => void;
  setBodyVelocity: (body: BodyName, velocity: { x: number; y: number; z: number }) => void;
  setBodyPosition: (body: BodyName, position: { x: number; y: number; z: number }) => void;
  play: () => void;
  pause: () => void;
  reset: () => void;
  step: () => void;
  setDarkMode: (isDark: boolean) => void;
  setViewMode: (mode: '3d' | '2d') => void;
  addRunResult: (result: RunResult) => void;
  clearRunResults: () => void;
  setFps: (fps: number) => void;
}

function createInitialBodies(): BodyState[] {
  return [
    {
      position: { x: INITIAL_CONDITIONS.SUN.position.x, y: INITIAL_CONDITIONS.SUN.position.y, z: INITIAL_CONDITIONS.SUN.position.z },
      velocity: { x: INITIAL_CONDITIONS.SUN.velocity.x, y: INITIAL_CONDITIONS.SUN.velocity.y, z: INITIAL_CONDITIONS.SUN.velocity.z },
      mass: INITIAL_CONDITIONS.SUN.mass,
      name: BODY_NAMES.SUN,
    },
    {
      position: { x: INITIAL_CONDITIONS.EARTH.position.x, y: INITIAL_CONDITIONS.EARTH.position.y, z: INITIAL_CONDITIONS.EARTH.position.z },
      velocity: { x: INITIAL_CONDITIONS.EARTH.velocity.x, y: INITIAL_CONDITIONS.EARTH.velocity.y, z: INITIAL_CONDITIONS.EARTH.velocity.z },
      mass: INITIAL_CONDITIONS.EARTH.mass,
      name: BODY_NAMES.EARTH,
    },
    {
      position: { x: INITIAL_CONDITIONS.MOON.position.x, y: INITIAL_CONDITIONS.MOON.position.y, z: INITIAL_CONDITIONS.MOON.position.z },
      velocity: { x: INITIAL_CONDITIONS.MOON.velocity.x, y: INITIAL_CONDITIONS.MOON.velocity.y, z: INITIAL_CONDITIONS.MOON.velocity.z },
      mass: INITIAL_CONDITIONS.MOON.mass,
      name: BODY_NAMES.MOON,
    },
  ];
}

function computeVelocities(bodies: BodyState[]) {
  const velocities: Record<BodyName, { x: number; y: number; z: number; speed: number }> = {
    [BODY_NAMES.SUN]: { x: 0, y: 0, z: 0, speed: 0 },
    [BODY_NAMES.EARTH]: { x: 0, y: 0, z: 0, speed: 0 },
    [BODY_NAMES.MOON]: { x: 0, y: 0, z: 0, speed: 0 },
  };

  for (const body of bodies) {
    const speed = Math.sqrt(
      body.velocity.x ** 2 + body.velocity.y ** 2 + body.velocity.z ** 2
    );
    velocities[body.name] = {
      x: body.velocity.x,
      y: body.velocity.y,
      z: body.velocity.z,
      speed,
    };
  }

  return velocities;
}

function createEmptyTrails(): Record<BodyName, TrailPoint[]> {
  return {
    [BODY_NAMES.SUN]: [],
    [BODY_NAMES.EARTH]: [],
    [BODY_NAMES.MOON]: [],
  };
}

export const useSimulationStore = create<SimulationStore>((set, get) => {
  const initialBodies = createInitialBodies();
  const initialEnergy = computeEnergyWithError(initialBodies, 0).total;

  return {
    status: 'idle',
    bodies: initialBodies,
    initialBodies: initialBodies,
    dt: DEFAULT_DT,
    time: 0,
    initialEnergy,
    currentEnergy: initialEnergy,
    energyError: 0,
    energyHistory: [],
    trails: createEmptyTrails(),
    velocities: computeVelocities(initialBodies),
    fps: 60,
    runResults: [],
    isDarkMode: true,
    viewMode: '3d',

    setDt: (dt) => set({ dt }),

    setBodyMass: (body, mass) => set((state) => {
      const bodies = state.bodies.map((b) =>
        b.name === body ? { ...b, mass } : b
      );
      return { bodies };
    }),

    setBodyVelocity: (body, velocity) => set((state) => {
      const bodies = state.bodies.map((b) =>
        b.name === body ? { ...b, velocity } : b
      );
      return { bodies };
    }),

    setBodyPosition: (body, position) => set((state) => {
      const bodies = state.bodies.map((b) =>
        b.name === body ? { ...b, position } : b
      );
      return { bodies };
    }),

    play: () => set({ status: 'running' }),

    pause: () => set({ status: 'paused' }),

    reset: () => {
      const state = get();
      const initialBodies = createInitialBodies();
      set({
        bodies: initialBodies,
        time: 0,
        currentEnergy: state.initialEnergy,
        energyError: 0,
        energyHistory: [],
        trails: createEmptyTrails(),
        velocities: computeVelocities(initialBodies),
        status: 'idle',
      });
    },

    step: () => {
      const state = get();
      const newBodies = integrateRK4(state.bodies, state.dt);
      const newTime = state.time + state.dt;
      const energyMetrics = computeEnergyWithError(newBodies, state.initialEnergy);
      
      const newTrails = { ...state.trails };
      for (const body of newBodies) {
        const trail = [...newTrails[body.name]];
        trail.push({ position: { x: body.position.x, y: body.position.y, z: body.position.z } });
        if (trail.length > 500) {
          trail.shift();
        }
        newTrails[body.name] = trail;
      }

      set({
        bodies: newBodies,
        time: newTime,
        currentEnergy: energyMetrics.total,
        energyError: energyMetrics.energyError,
        energyHistory: [
          ...state.energyHistory,
          {
            time: newTime,
            kinetic: energyMetrics.kinetic,
            potential: energyMetrics.potential,
            total: energyMetrics.total,
            error: energyMetrics.energyError,
          },
        ].slice(-200),
        trails: newTrails,
        velocities: computeVelocities(newBodies),
      });
    },

    setDarkMode: (isDark) => set({ isDarkMode: isDark }),
    setViewMode: (mode) => set({ viewMode: mode }),
    addRunResult: (result) => set((state) => ({
      runResults: [...state.runResults, result],
    })),
    clearRunResults: () => set({ runResults: [] }),
    setFps: (fps) => set({ fps }),
  };
});