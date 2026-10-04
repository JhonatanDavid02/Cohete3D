import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';

export function EnvironmentEffects() {
  const dustRef = useRef<THREE.Points>(null);

  // Floating space atmosphere particles / launch complex air dust
  const particleCount = 200;
  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const vel = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 26;
      pos[i * 3 + 1] = 0.5 + Math.random() * 12;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 26;

      vel[i * 3 + 0] = (Math.random() - 0.5) * 0.08;
      vel[i * 3 + 1] = 0.05 + Math.random() * 0.12;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.08;
    }
    return { positions: pos, velocities: vel };
  }, []);

  useFrame((_, delta) => {
    if (!dustRef.current) return;
    const dt = Math.min(delta, 0.05);
    const pos = dustRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < particleCount; i++) {
      pos[i * 3 + 0] += velocities[i * 3 + 0] * dt;
      pos[i * 3 + 1] += velocities[i * 3 + 1] * dt;
      pos[i * 3 + 2] += velocities[i * 3 + 2] * dt;

      // Wrap around boundary bounds
      if (pos[i * 3 + 1] > 13) {
        pos[i * 3 + 1] = 0.5;
        pos[i * 3 + 0] = (Math.random() - 0.5) * 26;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 26;
      }
    }
    dustRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <group>
      {/* Deep Space Starfield */}
      <Stars
        radius={120}
        depth={60}
        count={2800}
        factor={3.8}
        saturation={0.5}
        fade
        speed={0.8}
      />

      {/* Floating Atmosphere Air Particles */}
      <points ref={dustRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.07}
          color="#93c5fd"
          transparent
          opacity={0.45}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Subtle Atmospheric Fog for depth cueing */}
      <fogExp2 attach="fog" args={['#040711', 0.024]} />
    </group>
  );
}
