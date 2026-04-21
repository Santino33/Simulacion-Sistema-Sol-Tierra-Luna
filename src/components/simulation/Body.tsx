import * as THREE from 'three';
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import type { BodyName } from '@/types/physics';
import { SCALE_FACTOR, BODY_NAMES } from '@/lib/physics/constants';

interface BodyProps {
  name: BodyName;
  position: { x: number; y: number; z: number };
  color: string;
  trailColor: string;
  trail: { position: { x: number; y: number; z: number } }[];
  isSun?: boolean;
}

export function Body({ name, position, color, trailColor, trail, isSun }: BodyProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  const scale = useMemo(() => {
    if (isSun) return 0.1;
    if (name === BODY_NAMES.EARTH) return 0.04;
    return 0.015;
  }, [name, isSun]);

  const scaledPosition = useMemo(() => 
    new THREE.Vector3(
      position.x * SCALE_FACTOR,
      position.z * SCALE_FACTOR,
      position.y * SCALE_FACTOR
    ), [position]
  );

  const trailPoints = useMemo(() => {
    return trail.map(t => new THREE.Vector3(
      t.position.x * SCALE_FACTOR,
      t.position.z * SCALE_FACTOR,
      t.position.y * SCALE_FACTOR
    ));
  }, [trail]);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.copy(scaledPosition);
    }
  });

  return (
    <group>
      <mesh ref={meshRef} position={scaledPosition.toArray()}>
        <sphereGeometry args={[scale, 32, 32]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color}
          emissiveIntensity={isSun ? 0.8 : 0.2}
        />
      </mesh>
      
      {trailPoints.length > 1 && (
        <Line
          points={trailPoints}
          color={trailColor}
          lineWidth={isSun ? 1 : 1.5}
          transparent
          opacity={0.6}
        />
      )}
    </group>
  );
}