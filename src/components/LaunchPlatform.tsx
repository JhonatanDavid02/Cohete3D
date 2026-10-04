import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface LaunchPlatformProps {
  clampOpen?: number;
}

export function LaunchPlatform({ clampOpen = 0 }: LaunchPlatformProps) {
  const padLedsGroup = useRef<THREE.Group>(null);
  const trenchLedsGroup = useRef<THREE.Group>(null);

  // Pulse animation for technological platform lights
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (padLedsGroup.current) {
      // Gentle pulsating glow for edge runway LEDs
      const intensity = 0.5 + Math.sin(t * 2.8) * 0.45;
      padLedsGroup.current.children.forEach((child) => {
        const mesh = child as THREE.Mesh;
        if (mesh.material && 'emissiveIntensity' in mesh.material) {
          (mesh.material as THREE.MeshStandardMaterial).emissiveIntensity = intensity;
        }
      });
    }

    if (trenchLedsGroup.current) {
      // Strobe / alternate pulse for blast trench warning LEDs
      const trenchIntensity = 0.6 + Math.cos(t * 4.0) * 0.4;
      trenchLedsGroup.current.children.forEach((child) => {
        const mesh = child as THREE.Mesh;
        if (mesh.material && 'emissiveIntensity' in mesh.material) {
          (mesh.material as THREE.MeshStandardMaterial).emissiveIntensity = trenchIntensity;
        }
      });
    }
  });

  // Array of 24 perimeter LED positions around the elevated platform rim
  const padLeds = useMemo(() => {
    const leds = [];
    const count = 24;
    const radius = 4.15;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const isAmber = i % 4 === 0;
      leds.push({
        x: Math.cos(angle) * radius,
        z: Math.sin(angle) * radius,
        color: isAmber ? '#f59e0b' : '#00e5ff',
      });
    }
    return leds;
  }, []);

  // 12 warning markers around the central flame exhaust trench
  const trenchLeds = useMemo(() => {
    const leds = [];
    const count = 12;
    const radius = 1.62;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      leds.push({
        x: Math.cos(angle) * radius,
        z: Math.sin(angle) * radius,
      });
    }
    return leds;
  }, []);

  // 8 support pillars elevating the platform from the ground apron
  const supportColumns = useMemo(() => {
    const cols = [];
    const count = 8;
    const radius = 3.6;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      cols.push({
        x: Math.cos(angle) * radius,
        z: Math.sin(angle) * radius,
      });
    }
    return cols;
  }, []);

  // 4 rocket hold-down clamp assemblies
  const holdDownClamps = useMemo(() => {
    return [0, Math.PI / 2, Math.PI, (Math.PI * 3) / 2];
  }, []);

  return (
    <group>
      {/* ================= ELEVATED CIRCULAR LAUNCH PAD ================= */}
      {/* Main Elevated Deck */}
      <mesh position={[0, 1.15, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[4.2, 4.25, 0.3, 48]} />
        <meshStandardMaterial
          color="#1e232d"
          roughness={0.4}
          metalness={0.75}
        />
      </mesh>

      {/* Sub-deck Structural Flange / Underside Plate */}
      <mesh position={[0, 0.95, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[4.26, 4.15, 0.12, 48]} />
        <meshStandardMaterial
          color="#12161f"
          roughness={0.6}
          metalness={0.8}
        />
      </mesh>

      {/* Outer Perimeter Guard Bezel */}
      <mesh position={[0, 1.34, 0]}>
        <torusGeometry args={[4.22, 0.04, 12, 48]} />
        <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Perimeter Safety Railing Posts */}
      {padLeds.filter((_, idx) => idx % 2 === 0).map((led, idx) => (
        <mesh key={idx} position={[led.x * 0.99, 1.45, led.z * 0.99]} castShadow>
          <cylinderGeometry args={[0.025, 0.025, 0.32, 8]} />
          <meshStandardMaterial color="#334155" metalness={0.8} />
        </mesh>
      ))}

      {/* Central Flame Exhaust Trench Collar */}
      <mesh position={[0, 1.31, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.58, 1.62, 0.04, 36]} />
        <meshStandardMaterial
          color="#2d3340"
          roughness={0.45}
          metalness={0.65}
        />
      </mesh>

      {/* Hazard Caution Ring around Exhaust Well */}
      <mesh position={[0, 1.305, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.65, 1.95, 36]} />
        <meshStandardMaterial
          color="#d97706"
          roughness={0.5}
          metalness={0.2}
        />
      </mesh>

      {/* Central Flame Exhaust Trench Hole (Recessed Interior Pit) */}
      <mesh position={[0, 0.55, 0]} receiveShadow>
        <cylinderGeometry args={[1.42, 1.42, 1.2, 32, 1, true]} />
        <meshStandardMaterial
          color="#0f1218"
          roughness={0.9}
          metalness={0.3}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Double-sided Flame Deflector Wedge in the Pit */}
      <group position={[0, 0.15, 0]}>
        <mesh rotation={[0, 0, Math.PI / 4]} castShadow receiveShadow>
          <boxGeometry args={[1.6, 0.2, 2.6]} />
          <meshStandardMaterial
            color="#222834"
            roughness={0.35}
            metalness={0.8}
          />
        </mesh>
        <mesh rotation={[0, 0, -Math.PI / 4]} castShadow receiveShadow>
          <boxGeometry args={[1.6, 0.2, 2.6]} />
          <meshStandardMaterial
            color="#222834"
            roughness={0.35}
            metalness={0.8}
          />
        </mesh>
      </group>

      {/* ================= 4 ROCKET HOLD-DOWN CLAMP PADS ================= */}
      {holdDownClamps.map((angle, idx) => (
        <group key={idx} rotation={[0, angle + Math.PI / 4, 0]}>
          {/* Clamp Base Block */}
          <mesh position={[0, 1.42, 1.15]} castShadow receiveShadow>
            <boxGeometry args={[0.34, 0.25, 0.45]} />
            <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
          </mesh>
          {/* Hydraulic Cylinder */}
          <mesh
            position={[0, 1.62, 1.18 + clampOpen * 0.08]}
            rotation={[-0.4 + clampOpen * 0.25, 0, 0]}
            castShadow
          >
            <cylinderGeometry args={[0.07, 0.08, 0.35, 16]} />
            <meshStandardMaterial color="#0284c7" metalness={0.85} roughness={0.25} />
          </mesh>
          {/* Clamp Claw gripping the rocket base (swings back on release) */}
          <mesh
            position={[0, 1.75 - clampOpen * 0.06, 0.98 + clampOpen * 0.25]}
            rotation={[0.4 + clampOpen * 0.65, 0, 0]}
            castShadow
          >
            <boxGeometry args={[0.16, 0.12, 0.25]} />
            <meshStandardMaterial color="#e2e8f0" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>
      ))}

      {/* ================= SUPPORT COLUMNS (Elevating the Pad) ================= */}
      {supportColumns.map((col, idx) => (
        <group key={idx} position={[col.x, 0, col.z]}>
          {/* Heavy Concrete / Steel Column Footing */}
          <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.32, 0.38, 0.2, 16]} />
            <meshStandardMaterial color="#1e293b" roughness={0.7} metalness={0.4} />
          </mesh>
          {/* Structural Pylon Column */}
          <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.2, 0.24, 0.9, 16]} />
            <meshStandardMaterial color="#334155" roughness={0.4} metalness={0.75} />
          </mesh>
          {/* Top Hydraulic / Swivel Joint */}
          <mesh position={[0, 0.98, 0]} castShadow>
            <sphereGeometry args={[0.22, 16, 16]} />
            <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.3} />
          </mesh>
        </group>
      ))}

      {/* Diagonal Truss Cross-braces between columns */}
      {supportColumns.map((col, idx) => {
        const nextCol = supportColumns[(idx + 1) % supportColumns.length];
        const midX = (col.x + nextCol.x) / 2;
        const midZ = (col.z + nextCol.z) / 2;
        const dist = Math.hypot(nextCol.x - col.x, nextCol.z - col.z);
        const angle = Math.atan2(nextCol.z - col.z, nextCol.x - col.x);

        return (
          <group key={`truss-${idx}`} position={[midX, 0.55, midZ]} rotation={[0, -angle, 0]}>
            <mesh castShadow>
              <boxGeometry args={[dist * 0.92, 0.08, 0.08]} />
              <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.5} />
            </mesh>
          </group>
        );
      })}

      {/* ================= ACCESS STAIRWAY & PLATFORM RAMP ================= */}
      <group position={[0, 0, 4.3]} rotation={[0, 0, 0]}>
        {/* Slanted Access Walkway Stairs */}
        <mesh position={[0, 0.6, 0.7]} rotation={[-0.48, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.2, 0.1, 1.8]} />
          <meshStandardMaterial color="#1f2937" metalness={0.8} roughness={0.4} />
        </mesh>
        {/* Walkway Handrails */}
        {[-0.6, 0.6].map((x, i) => (
          <mesh key={i} position={[x, 0.95, 0.7]} rotation={[-0.48, 0, 0]} castShadow>
            <cylinderGeometry args={[0.02, 0.02, 1.8, 8]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.7} />
          </mesh>
        ))}
      </group>

      {/* ================= PLATFORM LIGHTING (PULSING LEDS) ================= */}
      {/* 24 Perimeter Edge Guidance Lights */}
      <group ref={padLedsGroup}>
        {padLeds.map((led, idx) => (
          <mesh key={idx} position={[led.x, 1.34, led.z]}>
            <cylinderGeometry args={[0.04, 0.04, 0.06, 12]} />
            <meshStandardMaterial
              color="#ffffff"
              emissive={led.color}
              emissiveIntensity={0.8}
              toneMapped={false}
            />
          </mesh>
        ))}
      </group>

      {/* 12 Blast Well Caution LEDs */}
      <group ref={trenchLedsGroup}>
        {trenchLeds.map((led, idx) => (
          <mesh key={idx} position={[led.x, 1.33, led.z]}>
            <sphereGeometry args={[0.035, 12, 12]} />
            <meshStandardMaterial
              color="#ffffff"
              emissive="#f97316"
              emissiveIntensity={0.8}
              toneMapped={false}
            />
          </mesh>
        ))}
      </group>

      {/* ================= GROUND SURFACE / BLAST APRON ================= */}
      {/* Massive circular apron surface below the platform */}
      <mesh position={[0, -0.01, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[22, 64]} />
        <meshStandardMaterial
          color="#0b0e14"
          roughness={0.85}
          metalness={0.25}
        />
      </mesh>

      {/* Concentric Guide Ring 1 (Inner apron perimeter) */}
      <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[5.2, 5.35, 64]} />
        <meshStandardMaterial
          color="#1e293b"
          roughness={0.5}
          metalness={0.6}
        />
      </mesh>

      {/* Concentric Guide Ring 2 (Middle perimeter) */}
      <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[9.5, 9.68, 64]} />
        <meshStandardMaterial
          color="#0ea5e9"
          emissive="#0284c7"
          emissiveIntensity={0.25}
          roughness={0.3}
          metalness={0.8}
        />
      </mesh>

      {/* Concentric Guide Ring 3 (Outer safety perimeter) */}
      <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[16.0, 16.25, 64]} />
        <meshStandardMaterial
          color="#334155"
          roughness={0.7}
          metalness={0.4}
        />
      </mesh>

      {/* Radial Zone Line Markings on the Ground */}
      {[0, Math.PI / 4, Math.PI / 2, (Math.PI * 3) / 4, Math.PI, (Math.PI * 5) / 4, (Math.PI * 3) / 2, (Math.PI * 7) / 4].map(
        (angle, idx) => (
          <mesh
            key={`radial-${idx}`}
            position={[Math.cos(angle) * 10.5, 0.006, Math.sin(angle) * 10.5]}
            rotation={[-Math.PI / 2, 0, angle]}
          >
            <planeGeometry args={[9.0, 0.12]} />
            <meshStandardMaterial
              color="#475569"
              roughness={0.6}
              metalness={0.3}
            />
          </mesh>
        )
      )}

      {/* Ground Recessed Blast Flare LEDs */}
      {[0, Math.PI / 3, (Math.PI * 2) / 3, Math.PI, (Math.PI * 4) / 3, (Math.PI * 5) / 3].map((angle, idx) => (
        <mesh
          key={`grnd-led-${idx}`}
          position={[Math.cos(angle) * 9.6, 0.02, Math.sin(angle) * 9.6]}
        >
          <cylinderGeometry args={[0.09, 0.09, 0.04, 16]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#00e5ff"
            emissiveIntensity={0.7}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}
