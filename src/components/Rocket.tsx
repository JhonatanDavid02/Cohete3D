import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import type { LaunchPhase, ThrustMode } from '../types';

interface RocketProps {
  thrustMode: ThrustMode;
  rocketY: number;
  launchPhase: LaunchPhase;
}

export function Rocket({ thrustMode, rocketY, launchPhase }: RocketProps) {
  const rocketGroup = useRef<THREE.Group>(null);

  // Micro-vibration calculation during pre-liftoff and flight
  useFrame((state) => {
    if (!rocketGroup.current) return;
    const t = state.clock.getElapsedTime();

    let vibX = 0;
    let vibZ = 0;
    let vibY = 0;
    let vibRotZ = 0;

    // Phase 3: Pre-liftoff subtle vibration (engines ignited, vehicle still clamped)
    if (launchPhase === 'ignition') {
      // Fast, subtle, physically believable mechanical vibration
      vibX = Math.sin(t * 75) * 0.0045;
      vibZ = Math.cos(t * 85) * 0.0045;
      vibY = Math.sin(t * 110) * 0.003;
      vibRotZ = Math.sin(t * 60) * 0.001;
    } else if (launchPhase === 'liftoff') {
      // Initial release transition
      vibX = Math.sin(t * 65) * 0.0035;
      vibZ = Math.cos(t * 75) * 0.0035;
      vibY = 0;
      vibRotZ = Math.sin(t * 50) * 0.0008;
    } else if (launchPhase === 'ascent') {
      // Atmospheric high-thrust flight
      vibX = Math.sin(t * 50) * 0.0025;
      vibZ = Math.cos(t * 55) * 0.0025;
      vibY = 0;
      vibRotZ = Math.sin(t * 35) * 0.0005;
    } else if (launchPhase === 'cruising') {
      // Smooth stable cruise
      vibX = 0;
      vibZ = 0;
      vibY = 0;
      vibRotZ = 0;
    } else if (thrustMode === 'test') {
      vibX = Math.sin(t * 70) * 0.006;
      vibZ = Math.cos(t * 85) * 0.006;
      vibY = Math.sin(t * 90) * 0.004;
      vibRotZ = Math.sin(t * 50) * 0.001;
    } else if (thrustMode === 'standby') {
      vibX = Math.sin(t * 35) * 0.002;
      vibZ = Math.cos(t * 40) * 0.002;
      vibY = 0;
      vibRotZ = 0;
    }

    rocketGroup.current.position.set(vibX, rocketY + vibY, vibZ);
    rocketGroup.current.rotation.z = vibRotZ;
    rocketGroup.current.rotation.x = -vibRotZ * 0.6;
  });

  const isHighThrust =
    launchPhase === 'ignition' ||
    launchPhase === 'liftoff' ||
    launchPhase === 'ascent' ||
    launchPhase === 'cruising' ||
    thrustMode === 'test';

  const isStandbyThrust =
    (launchPhase === 'standby' && thrustMode === 'standby') ||
    launchPhase === 'countdown';

  return (
    <group ref={rocketGroup}>
      {/* ================= MAIN FUSELAGE ================= */}
      {/* Lower Stage Body */}
      <mesh position={[0, 3.4, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.82, 0.86, 2.4, 36]} />
        <meshStandardMaterial
          color="#eaeef2"
          roughness={0.25}
          metalness={0.2}
        />
      </mesh>

      {/* Interstage Ring (Carbon Fiber / Titanium separation band) */}
      <mesh position={[0, 4.65, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.825, 0.825, 0.2, 36]} />
        <meshStandardMaterial
          color="#1e222a"
          roughness={0.4}
          metalness={0.8}
        />
      </mesh>

      {/* Upper Stage Body */}
      <mesh position={[0, 5.85, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.78, 0.82, 2.2, 36]} />
        <meshStandardMaterial
          color="#eaeef2"
          roughness={0.22}
          metalness={0.2}
        />
      </mesh>

      {/* Aerodynamic Transition Collar */}
      <mesh position={[0, 7.0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.74, 0.78, 0.3, 36]} />
        <meshStandardMaterial
          color="#2a303d"
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>

      {/* Nose Cone / Crew Fairing */}
      <mesh position={[0, 7.95, 0]} castShadow receiveShadow>
        <coneGeometry args={[0.74, 1.8, 36]} />
        <meshStandardMaterial
          color="#f4f7fb"
          roughness={0.2}
          metalness={0.25}
        />
      </mesh>

      {/* Nose Cone Heat-Shield Tip */}
      <mesh position={[0, 8.85, 0]} castShadow>
        <coneGeometry args={[0.18, 0.45, 24]} />
        <meshStandardMaterial
          color="#14171d"
          roughness={0.6}
          metalness={0.8}
        />
      </mesh>

      {/* Pitot Static Sensor / Apex Probe */}
      <mesh position={[0, 9.25, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 0.5, 12]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* ================= DETAILS & DECALS ================= */}
      {/* Cockpit / Visual Observation Port */}
      <group position={[0, 7.35, 0.62]} rotation={[0.2, 0, 0]}>
        {/* Outer Bezel */}
        <mesh castShadow>
          <boxGeometry args={[0.42, 0.22, 0.12]} />
          <meshStandardMaterial color="#1a1d24" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Glass Screen with interior cyan HUD glow */}
        <mesh position={[0, 0, 0.06]}>
          <boxGeometry args={[0.36, 0.16, 0.04]} />
          <meshStandardMaterial
            color="#001826"
            emissive="#00d5ff"
            emissiveIntensity={0.6}
            roughness={0.1}
            metalness={0.9}
          />
        </mesh>
      </group>

      {/* Secondary Tech Ports / Side Windows */}
      {[-1, 1].map((dir) => (
        <mesh
          key={dir}
          position={[dir * 0.72, 6.2, 0]}
          rotation={[0, 0, (dir * Math.PI) / 2]}
          castShadow
        >
          <cylinderGeometry args={[0.07, 0.07, 0.06, 16]} />
          <meshStandardMaterial
            color="#141820"
            emissive="#00e5ff"
            emissiveIntensity={0.4}
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>
      ))}

      {/* Vertical Mission Stripes (Aerospace aesthetic) */}
      <mesh position={[0, 5.7, 0.79]} castShadow>
        <boxGeometry args={[0.12, 1.8, 0.02]} />
        <meshStandardMaterial
          color="#ff4400"
          roughness={0.4}
          metalness={0.1}
        />
      </mesh>
      <mesh position={[0.79, 3.4, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <boxGeometry args={[0.1, 1.6, 0.02]} />
        <meshStandardMaterial
          color="#0099ff"
          roughness={0.4}
          metalness={0.1}
        />
      </mesh>

      {/* External Conduit / Fuel Feed Raceways */}
      {[0.75, -0.75].map((angle, idx) => (
        <mesh
          key={idx}
          position={[Math.cos(angle) * 0.83, 3.4, Math.sin(angle) * 0.83]}
          rotation={[0, -angle, 0]}
          castShadow
        >
          <boxGeometry args={[0.05, 2.2, 0.06]} />
          <meshStandardMaterial color="#2d3340" metalness={0.7} roughness={0.3} />
        </mesh>
      ))}

      {/* RCS (Reaction Control Thrusters) Quads */}
      {[0, Math.PI / 2, Math.PI, (Math.PI * 3) / 2].map((angle, idx) => (
        <group
          key={idx}
          position={[Math.sin(angle) * 0.8, 6.6, Math.cos(angle) * 0.8]}
          rotation={[0, angle, 0]}
        >
          <mesh castShadow>
            <boxGeometry args={[0.1, 0.1, 0.06]} />
            <meshStandardMaterial color="#1b1e24" metalness={0.8} />
          </mesh>
          <mesh position={[0, 0, 0.04]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.02, 0.035, 0.05, 12]} />
            <meshStandardMaterial color="#475569" metalness={0.9} />
          </mesh>
        </group>
      ))}

      {/* ================= AERODYNAMIC FINS ================= */}
      {/* 4 Swept Delta Fins at 90-degree offsets */}
      {[0, Math.PI / 2, Math.PI, (Math.PI * 3) / 2].map((angle, idx) => (
        <group key={idx} rotation={[0, angle, 0]} position={[0, 2.5, 0]}>
          {/* Main Fin Blade */}
          <mesh position={[0, 0.45, 1.28]} castShadow receiveShadow>
            <boxGeometry args={[0.07, 1.3, 0.9]} />
            <meshStandardMaterial
              color="#dce3eb"
              roughness={0.3}
              metalness={0.4}
            />
          </mesh>
          {/* Fin Aerodynamic Bevel / Trailing Edge Tip */}
          <mesh position={[0, 0.2, 1.62]} rotation={[-0.35, 0, 0]} castShadow>
            <boxGeometry args={[0.06, 0.9, 0.35]} />
            <meshStandardMaterial
              color="#ff4400"
              roughness={0.35}
              metalness={0.3}
            />
          </mesh>
          {/* Fin Root Fairing Attachment */}
          <mesh position={[0, 0.4, 0.85]} castShadow>
            <boxGeometry args={[0.14, 1.4, 0.18]} />
            <meshStandardMaterial color="#1f242d" roughness={0.4} metalness={0.8} />
          </mesh>
        </group>
      ))}

      {/* ================= ROCKET ENGINE ASSEMBLY ================= */}
      {/* Thrust Puck / Engine Base Heat Shield */}
      <mesh position={[0, 2.18, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.84, 0.82, 0.14, 36]} />
        <meshStandardMaterial
          color="#161920"
          roughness={0.5}
          metalness={0.9}
        />
      </mesh>

      {/* Gimbal Actuator Struts */}
      {[0.4, -0.4].map((offset, i) => (
        <mesh
          key={i}
          position={[offset, 1.95, offset]}
          rotation={[0.15 * (i ? -1 : 1), 0, 0.15 * (i ? 1 : -1)]}
          castShadow
        >
          <cylinderGeometry args={[0.03, 0.03, 0.45, 12]} />
          <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.2} />
        </mesh>
      ))}

      {/* Main Engine Combustion Chamber & Injector Head */}
      <mesh position={[0, 1.95, 0]} castShadow>
        <cylinderGeometry args={[0.42, 0.38, 0.35, 24]} />
        <meshStandardMaterial
          color="#222630"
          roughness={0.3}
          metalness={0.85}
        />
      </mesh>

      {/* Flared Bell Nozzle */}
      <mesh position={[0, 1.55, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.34, 0.65, 0.6, 32, 1, true]} />
        <meshStandardMaterial
          color="#252932"
          roughness={0.25}
          metalness={0.92}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Nozzle Stiffener Ring / Regenerative Cooling Rings */}
      <mesh position={[0, 1.45, 0]}>
        <torusGeometry args={[0.56, 0.028, 12, 32]} />
        <meshStandardMaterial color="#ff5500" roughness={0.3} metalness={0.8} />
      </mesh>
      <mesh position={[0, 1.3, 0]}>
        <torusGeometry args={[0.64, 0.032, 12, 32]} />
        <meshStandardMaterial color="#1a1c23" roughness={0.3} metalness={0.9} />
      </mesh>

      {/* Glowing Combustion Throat (Inside Nozzle) */}
      <mesh position={[0, 1.72, 0]}>
        <cylinderGeometry args={[0.26, 0.32, 0.12, 24]} />
        <meshStandardMaterial
          color="#ff7700"
          emissive={isHighThrust ? '#ff4400' : isStandbyThrust ? '#ff7700' : '#441100'}
          emissiveIntensity={isHighThrust ? 3.8 : isStandbyThrust ? 2.0 : 0.4}
          roughness={0.2}
        />
      </mesh>
    </group>
  );
}
