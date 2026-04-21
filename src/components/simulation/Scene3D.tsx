import { useRef } from 'react';
import { OrbitControls, Stars } from '@react-three/drei';
import { Body } from './Body';
import { useSimulationStore } from '@/stores/simulationStore';
import { COLORS, BODY_NAMES } from '@/lib/physics/constants';

export function Scene3D() {
  const controlsRef = useRef(null);

  const bodies = useSimulationStore((state) => state.bodies);
  const trails = useSimulationStore((state) => state.trails);

  const sunBody = bodies.find((b) => b.name === BODY_NAMES.SUN);
  const earthBody = bodies.find((b) => b.name === BODY_NAMES.EARTH);
  const moonBody = bodies.find((b) => b.name === BODY_NAMES.MOON);

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 0, 0]} intensity={2} color={COLORS.SUN} />
      <directionalLight position={[10, 10, 5]} intensity={0.5} />

      <Stars radius={100} depth={50} count={5000} factor={4} fade speed={1} />

      <gridHelper args={[10, 20, '#333333', '#222222']} position={[0, 0, 0]} />

      {sunBody && (
        <Body
          name={sunBody.name}
          position={sunBody.position}
          color={COLORS.SUN}
          trailColor={COLORS.TRAIL_SUN}
          trail={trails[BODY_NAMES.SUN]}
          isSun
        />
      )}

      {earthBody && (
        <Body
          name={earthBody.name}
          position={earthBody.position}
          color={COLORS.EARTH}
          trailColor={COLORS.TRAIL_EARTH}
          trail={trails[BODY_NAMES.EARTH]}
        />
      )}

      {moonBody && (
        <Body
          name={moonBody.name}
          position={moonBody.position}
          color={COLORS.MOON}
          trailColor={COLORS.TRAIL_MOON}
          trail={trails[BODY_NAMES.MOON]}
        />
      )}

      <OrbitControls
        ref={controlsRef}
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={0.5}
        maxDistance={10}
        target={[0, 0, 0]}
      />

      <axesHelper args={[1]} />
    </>
  );
}