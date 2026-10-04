import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface GantryTowerProps {
  floodlights: boolean;
  armRetract?: number;
}

export function GantryTower({ floodlights, armRetract = 0 }: GantryTowerProps) {
  const beaconRef = useRef<THREE.PointLight>(null);
  const beaconMeshRef = useRef<THREE.Mesh>(null);
  const towerLedsGroup = useRef<THREE.Group>(null);

  // Strobe beacon animation (aviation warning light on tower tops)
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    // Sharp aviation strobe flash
    const strobe = (Math.sin(t * 5.0) > 0.6 ? 1 : 0.15) * (Math.sin(t * 10) > 0 ? 1 : 0.5);

    if (beaconRef.current) {
      beaconRef.current.intensity = strobe * 4.0;
    }
    if (beaconMeshRef.current && 'emissiveIntensity' in beaconMeshRef.current.material) {
      (beaconMeshRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = strobe * 3.0;
    }

    if (towerLedsGroup.current) {
      const pulse = 0.5 + Math.sin(t * 3.2) * 0.45;
      towerLedsGroup.current.children.forEach((child) => {
        const mesh = child as THREE.Mesh;
        if (mesh.material && 'emissiveIntensity' in mesh.material) {
          (mesh.material as THREE.MeshStandardMaterial).emissiveIntensity = pulse;
        }
      });
    }
  });

  return (
    <group>
      {/* ================= TOWER 1: MAIN UMBILICAL SERVICE GANTRY ================= */}
      <group position={[-2.95, 1.15, -0.6]}>
        {/* Tower Concrete / Heavy Steel Base Pad */}
        <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.5, 0.3, 1.5]} />
          <meshStandardMaterial color="#1a202c" roughness={0.6} metalness={0.7} />
        </mesh>

        {/* 4 Main Vertical Steel Chords (Corner Posts) */}
        {[-0.55, 0.55].map((x) =>
          [-0.55, 0.55].map((z) => (
            <mesh key={`post-${x}-${z}`} position={[x, 4.6, z]} castShadow>
              <boxGeometry args={[0.1, 8.8, 0.1]} />
              <meshStandardMaterial color="#2d3748" metalness={0.8} roughness={0.35} />
            </mesh>
          ))
        )}

        {/* Horizontal Girders at Multiple Tiers */}
        {[1.8, 3.4, 5.0, 6.6, 8.2].map((y) => (
          <group key={`tier-${y}`} position={[0, y, 0]}>
            {/* Perimeter Girders */}
            <mesh castShadow>
              <boxGeometry args={[1.2, 0.08, 0.08]} />
              <meshStandardMaterial color="#334155" metalness={0.8} />
            </mesh>
            <mesh position={[0, 0, -0.55]} castShadow>
              <boxGeometry args={[1.2, 0.08, 0.08]} />
              <meshStandardMaterial color="#334155" metalness={0.8} />
            </mesh>
            <mesh position={[0, 0, 0.55]} castShadow>
              <boxGeometry args={[1.2, 0.08, 0.08]} />
              <meshStandardMaterial color="#334155" metalness={0.8} />
            </mesh>
            <mesh position={[-0.55, 0, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
              <boxGeometry args={[1.2, 0.08, 0.08]} />
              <meshStandardMaterial color="#334155" metalness={0.8} />
            </mesh>
            <mesh position={[0.55, 0, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
              <boxGeometry args={[1.2, 0.08, 0.08]} />
              <meshStandardMaterial color="#334155" metalness={0.8} />
            </mesh>
          </group>
        ))}

        {/* Diagonal Cross-Bracing Struts (Lattice Truss Aesthetic) */}
        {[0.9, 2.6, 4.2, 5.8, 7.4].map((y, idx) => (
          <group key={`brace-${idx}`} position={[0, y + 0.8, 0]}>
            <mesh position={[0, 0, 0.55]} rotation={[0, 0, idx % 2 === 0 ? 0.75 : -0.75]} castShadow>
              <cylinderGeometry args={[0.025, 0.025, 1.8, 8]} />
              <meshStandardMaterial color="#475569" metalness={0.75} />
            </mesh>
            <mesh position={[0, 0, -0.55]} rotation={[0, 0, idx % 2 === 0 ? -0.75 : 0.75]} castShadow>
              <cylinderGeometry args={[0.025, 0.025, 1.8, 8]} />
              <meshStandardMaterial color="#475569" metalness={0.75} />
            </mesh>
            <mesh position={[-0.55, 0, 0]} rotation={[idx % 2 === 0 ? 0.75 : -0.75, 0, 0]} castShadow>
              <cylinderGeometry args={[0.025, 0.025, 1.8, 8]} />
              <meshStandardMaterial color="#475569" metalness={0.75} />
            </mesh>
          </group>
        ))}

        {/* Mid Catwalk / Work Platform (Level 2) */}
        <group position={[0, 5.0, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.4, 0.06, 1.4]} />
            <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.4} />
          </mesh>
          {/* Safety Handrail */}
          <mesh position={[0, 0.25, 0.68]}>
            <boxGeometry args={[1.4, 0.03, 0.03]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.6} />
          </mesh>
        </group>

        {/* Upper Catwalk / Crew Access Platform (Level 3) */}
        <group position={[0.2, 6.6, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.8, 0.06, 1.4]} />
            <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.25, 0.68]}>
            <boxGeometry args={[1.8, 0.03, 0.03]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.6} />
          </mesh>
        </group>

        {/* Tower Top Platform & Antenna Mast */}
        <group position={[0, 9.05, 0]}>
          <mesh castShadow>
            <boxGeometry args={[1.3, 0.1, 1.3]} />
            <meshStandardMaterial color="#0f172a" metalness={0.9} />
          </mesh>
          {/* Lightning Arrestor / Communication Mast */}
          <mesh position={[0, 0.9, 0]} castShadow>
            <cylinderGeometry args={[0.03, 0.06, 1.8, 12]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.9} />
          </mesh>
          {/* Aviation Warning Beacon Light */}
          <mesh ref={beaconMeshRef} position={[0, 1.85, 0]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial
              color="#ef4444"
              emissive="#ef4444"
              emissiveIntensity={2.5}
              toneMapped={false}
            />
          </mesh>
          <pointLight
            ref={beaconRef}
            position={[0, 1.9, 0]}
            color="#ef4444"
            distance={10}
            decay={2}
            intensity={3.5}
          />
        </group>

        {/* ================= SUPPORT / UMBILICAL ARMS (CONNECTED TO ROCKET) ================= */}
        {/* UPPER UMBILICAL ARM: Extends to the upper stage of the rocket */}
        {/* From Tower at [-2.95, 6.6, -0.6] reaching to Rocket at [0, 6.6, 0] */}
        <group position={[0.55, 5.8, 0.45]} rotation={[0, -armRetract * 0.45, 0]}>
          {/* Swivel Pivot Hinge on the Tower */}
          <mesh position={[0, 0, 0]} castShadow>
            <cylinderGeometry args={[0.16, 0.16, 0.4, 16]} />
            <meshStandardMaterial color="#334155" metalness={0.85} roughness={0.3} />
          </mesh>

          {/* Main Structural Truss Beam spanning towards the rocket */}
          <mesh position={[1.05, 0, 0.08]} rotation={[0, -0.15, 0]} castShadow>
            <boxGeometry args={[2.1, 0.14, 0.18]} />
            <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.35} />
          </mesh>

          {/* Diagonal Hydraulic Cylinder Actuator */}
          <mesh position={[0.8, -0.22, 0.08]} rotation={[0, -0.15, 0.35]} castShadow>
            <cylinderGeometry args={[0.04, 0.045, 1.4, 12]} />
            <meshStandardMaterial color="#0284c7" metalness={0.9} roughness={0.2} />
          </mesh>

          {/* Umbilical Interface Collar / Service Clamp (Touch point on rocket fuselage) */}
          <group position={[2.15, 0, 0.15]}>
            {/* Interface Coupling Hood */}
            <mesh castShadow>
              <boxGeometry args={[0.25, 0.28, 0.32]} />
              <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.25} />
            </mesh>
            {/* Flexible Cryogenic Umbilical Hoses connecting to Rocket Body */}
            {[-0.08, 0.08].map((zOffset, i) => (
              <mesh key={i} position={[0.15, -0.06, zOffset]} rotation={[0, 0, Math.PI / 2]}>
                <torusGeometry args={[0.12, 0.025, 8, 16, Math.PI * 0.7]} />
                <meshStandardMaterial color="#f59e0b" metalness={0.3} roughness={0.6} />
              </mesh>
            ))}
            {/* Visual Indicator LED on the clamp */}
            <mesh position={[0, 0.16, 0]}>
              <sphereGeometry args={[0.03, 12, 12]} />
              <meshStandardMaterial
                color="#00e5ff"
                emissive="#00e5ff"
                emissiveIntensity={1.2}
                toneMapped={false}
              />
            </mesh>
          </group>
        </group>

        {/* MID-LEVEL VEHICLE STABILIZER CLAMP ARM */}
        {/* Extends to the lower stage / interstage at y = 4.6 */}
        <group position={[0.55, 3.5, 0.45]} rotation={[0, -armRetract * 0.45, 0]}>
          {/* Pivot Hinge */}
          <mesh position={[0, 0, 0]} castShadow>
            <cylinderGeometry args={[0.14, 0.14, 0.35, 16]} />
            <meshStandardMaterial color="#334155" metalness={0.85} />
          </mesh>
          {/* Clamp Arm Beam */}
          <mesh position={[1.05, 0, 0.08]} rotation={[0, -0.15, 0]} castShadow>
            <boxGeometry args={[2.0, 0.12, 0.15]} />
            <meshStandardMaterial color="#334155" metalness={0.8} />
          </mesh>
          {/* Hydraulic Cylinder */}
          <mesh position={[0.7, 0.18, 0.08]} rotation={[0, -0.15, -0.3]} castShadow>
            <cylinderGeometry args={[0.035, 0.04, 1.2, 12]} />
            <meshStandardMaterial color="#0284c7" metalness={0.9} />
          </mesh>
          {/* Stabilizing Claw gripping the rocket */}
          <group position={[2.1, 0, 0.15]}>
            <mesh castShadow>
              <boxGeometry args={[0.22, 0.22, 0.38]} />
              <meshStandardMaterial color="#0f172a" metalness={0.9} />
            </mesh>
            <mesh position={[0.08, 0, 0.16]} rotation={[0, 0.5, 0]} castShadow>
              <boxGeometry args={[0.15, 0.18, 0.08]} />
              <meshStandardMaterial color="#e2e8f0" metalness={0.85} />
            </mesh>
            <mesh position={[0.08, 0, -0.16]} rotation={[0, -0.5, 0]} castShadow>
              <boxGeometry args={[0.15, 0.18, 0.08]} />
              <meshStandardMaterial color="#e2e8f0" metalness={0.85} />
            </mesh>
          </group>
        </group>
      </group>

      {/* ================= TOWER 2: LIGHTNING & SENSOR MAST ================= */}
      <group position={[2.8, 1.15, -2.5]}>
        <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.5, 0.6, 0.2, 16]} />
          <meshStandardMaterial color="#1e293b" roughness={0.6} metalness={0.7} />
        </mesh>
        {/* Slender Tapered Lattice Mast */}
        <mesh position={[0, 3.4, 0]} castShadow>
          <cylinderGeometry args={[0.12, 0.28, 6.8, 12]} />
          <meshStandardMaterial color="#334155" metalness={0.85} roughness={0.35} />
        </mesh>
        {/* Sensor Crossarms */}
        <mesh position={[0, 6.2, 0]} castShadow>
          <boxGeometry args={[0.8, 0.06, 0.06]} />
          <meshStandardMaterial color="#64748b" metalness={0.8} />
        </mesh>
        {/* Top Antenna Needle & Warning Beacon */}
        <mesh position={[0, 7.1, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.6, 8]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} />
        </mesh>
        <mesh position={[0, 7.45, 0]}>
          <sphereGeometry args={[0.06, 12, 12]} />
          <meshStandardMaterial
            color="#00e5ff"
            emissive="#00e5ff"
            emissiveIntensity={2.0}
            toneMapped={false}
          />
        </mesh>

        {/* Floodlight Rig pointed directly at the Rocket */}
        {floodlights && (
          <group position={[-0.1, 5.5, 0.1]} rotation={[-0.45, -0.65, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.3, 0.22, 0.2]} />
              <meshStandardMaterial color="#0f172a" metalness={0.9} />
            </mesh>
            <mesh position={[0, 0, 0.11]}>
              <planeGeometry args={[0.26, 0.18]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
            <spotLight
              position={[0, 0, 0.2]}
              target-position={[-2.8, -1.0, 2.5]}
              color="#e0f2fe"
              intensity={12}
              distance={18}
              angle={0.6}
              penumbra={0.7}
              castShadow
            />
          </group>
        )}
      </group>

      {/* ================= TOWER 3: TELEMETRY & TRACKING MAST ================= */}
      <group position={[2.5, 1.15, 2.6]}>
        <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.45, 0.55, 0.2, 16]} />
          <meshStandardMaterial color="#1e293b" roughness={0.6} metalness={0.7} />
        </mesh>
        {/* Vertical Column */}
        <mesh position={[0, 2.8, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.24, 5.6, 12]} />
          <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.4} />
        </mesh>
        {/* Telemetry Tracking Dish */}
        <group position={[-0.2, 5.2, -0.2]} rotation={[0.4, 0.8, -0.3]}>
          {/* Parabolic Dish */}
          <mesh castShadow>
            <sphereGeometry args={[0.4, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.45]} />
            <meshStandardMaterial color="#f1f5f9" metalness={0.8} roughness={0.25} side={THREE.DoubleSide} />
          </mesh>
          {/* Feed Horn */}
          <mesh position={[0, 0.28, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.28, 8]} />
            <meshStandardMaterial color="#38bdf8" metalness={0.9} />
          </mesh>
        </group>
        {/* Top Warning Light */}
        <mesh position={[0, 5.8, 0]}>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshStandardMaterial
            color="#f59e0b"
            emissive="#f59e0b"
            emissiveIntensity={2.0}
            toneMapped={false}
          />
        </mesh>

        {/* Secondary Gantry Floodlight aimed at rocket */}
        {floodlights && (
          <group position={[-0.1, 4.2, -0.1]} rotation={[0.4, 0.7, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.26, 0.18, 0.16]} />
              <meshStandardMaterial color="#0f172a" metalness={0.9} />
            </mesh>
            <mesh position={[0, 0, 0.09]}>
              <planeGeometry args={[0.22, 0.14]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
            <spotLight
              position={[0, 0, 0.15]}
              target-position={[-2.5, 0.5, -2.6]}
              color="#e0f2fe"
              intensity={10}
              distance={16}
              angle={0.65}
              penumbra={0.7}
              castShadow
            />
          </group>
        )}
      </group>

      {/* Small tech accent LEDs distributed on tower structures */}
      <group ref={towerLedsGroup}>
        {/* Tower 1 vertical LEDs */}
        {[3.4, 5.0, 6.6, 8.2].map((y, idx) => (
          <mesh key={`t1-led-${idx}`} position={[-2.4, y + 1.15, -0.6]}>
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshStandardMaterial
              color="#00e5ff"
              emissive="#00e5ff"
              emissiveIntensity={0.8}
              toneMapped={false}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}
