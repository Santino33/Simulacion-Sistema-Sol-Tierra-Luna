import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { Scene3D } from './Scene3D';

interface Canvas3DProps {
  className?: string;
}

export function Canvas3D({ className }: Canvas3DProps) {
  return (
    <Canvas
      className={className}
      camera={{ position: [2, 2, 2], fov: 60 }}
      gl={{ antialias: true }}
    >
      <Suspense fallback={null}>
        <Scene3D />
      </Suspense>
    </Canvas>
  );
}