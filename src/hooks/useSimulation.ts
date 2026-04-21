import { useEffect, useRef, useCallback } from 'react';
import { useSimulationStore } from '@/stores/simulationStore';

export function useSimulation() {
  const status = useSimulationStore((state) => state.status);
  const step = useSimulationStore((state) => state.step);
  const setFps = useSimulationStore((state) => state.setFps);

  const frameCountRef = useRef<number>(0);
  const fpsTimeRef = useRef<number>(0);
  const animationRef = useRef<number | null>(null);

  const animate = useCallback((currentTime: number) => {
    step();

    frameCountRef.current++;
    if (currentTime - fpsTimeRef.current >= 1000) {
      setFps(frameCountRef.current);
      frameCountRef.current = 0;
      fpsTimeRef.current = currentTime;
    }

    animationRef.current = requestAnimationFrame(animate);
  }, [step, setFps]);

  useEffect(() => {
    if (status === 'running') {
      animationRef.current = requestAnimationFrame(animate);
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [status, animate]);

  return {
    status,
  };
}