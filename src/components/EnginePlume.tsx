import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import type { LaunchPhase, ThrustMode } from '../types';

interface EnginePlumeProps {
  thrustMode: ThrustMode;
  rocketY: number;
  launchPhase: LaunchPhase;
}

export function EnginePlume({ thrustMode, rocketY, launchPhase }: EnginePlumeProps) {
  const flameGroup = useRef<THREE.Group>(null);
  const coreFlameRef = useRef<THREE.Mesh>(null);
  const outerFlameRef = useRef<THREE.Mesh>(null);
  const pointLightRef = useRef<THREE.PointLight>(null);
  const smokePointsRef = useRef<THREE.Points>(null);
  const sparksPointsRef = useRef<THREE.Points>(null);

  // Smoke trail particle count & simulation buffers
  const smokeCount = 260;
  const { smokePositions, smokeVelocities, smokeAges, smokeMaxAges } = useMemo(() => {
    const pos = new Float32Array(smokeCount * 3);
    const vel = new Float32Array(smokeCount * 3);
    const ages = new Float32Array(smokeCount);
    const maxAges = new Float32Array(smokeCount);

    for (let i = 0; i < smokeCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * 0.4;
      pos[i * 3 + 0] = Math.cos(angle) * r;
      pos[i * 3 + 1] = -100; // start offscreen
      pos[i * 3 + 2] = Math.sin(angle) * r;

      vel[i * 3 + 0] = 0;
      vel[i * 3 + 1] = 0;
      vel[i * 3 + 2] = 0;

      maxAges[i] = 2.0 + Math.random() * 1.5;
      ages[i] = Math.random() * maxAges[i];
    }
    return {
      smokePositions: pos,
      smokeVelocities: vel,
      smokeAges: ages,
      smokeMaxAges: maxAges,
    };
  }, []);

  // Sparks particle count & simulation buffers
  const sparkCount = 90;
  const { sparkPositions, sparkVelocities, sparkAges, sparkMaxAges } = useMemo(() => {
    const pos = new Float32Array(sparkCount * 3);
    const vel = new Float32Array(sparkCount * 3);
    const ages = new Float32Array(sparkCount);
    const maxAges = new Float32Array(sparkCount);

    for (let i = 0; i < sparkCount; i++) {
      pos[i * 3 + 0] = 0;
      pos[i * 3 + 1] = -100;
      pos[i * 3 + 2] = 0;

      vel[i * 3 + 0] = 0;
      vel[i * 3 + 1] = 0;
      vel[i * 3 + 2] = 0;

      maxAges[i] = 0.5 + Math.random() * 0.5;
      ages[i] = Math.random() * maxAges[i];
    }
    return {
      sparkPositions: pos,
      sparkVelocities: vel,
      sparkAges: ages,
      sparkMaxAges: maxAges,
    };
  }, []);

  // Circular soft alpha texture for smoke
  const smokeTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, 'rgba(255,255,255,1)');
      grad.addColorStop(0.3, 'rgba(240,245,255,0.85)');
      grad.addColorStop(0.7, 'rgba(190,205,225,0.3)');
      grad.addColorStop(1, 'rgba(100,110,130,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 64, 64);
    }
    return new THREE.CanvasTexture(canvas);
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    const dt = Math.min(delta, 0.05);

    // Determine target flame scale based on launch phase or manual thrust mode
    let targetScaleY = 0;
    let targetScaleXZ = 0;
    let lightIntensity = 0;

    const isFullBurn =
      launchPhase === 'liftoff' ||
      launchPhase === 'ascent' ||
      thrustMode === 'test';

    const isIgnition = launchPhase === 'ignition';
    const isCruising = launchPhase === 'cruising';
    const isStandby =
      (launchPhase === 'standby' && thrustMode === 'standby') ||
      launchPhase === 'countdown';

    if (isFullBurn) {
      const flutter = 1 + Math.sin(t * 45) * 0.08 + Math.cos(t * 68) * 0.05;
      targetScaleY = (launchPhase === 'ascent' ? 2.6 : 2.0) * flutter;
      targetScaleXZ = 1.35 * flutter;
      lightIntensity = 24 + Math.sin(t * 35) * 6;
    } else if (isIgnition) {
      // Ignition surge
      const flutter = 1 + Math.sin(t * 50) * 0.1;
      targetScaleY = 1.6 * flutter;
      targetScaleXZ = 1.15 * flutter;
      lightIntensity = 18 + Math.sin(t * 40) * 4;
    } else if (isCruising) {
      const flutter = 1 + Math.sin(t * 30) * 0.04;
      targetScaleY = 1.3 * flutter;
      targetScaleXZ = 0.85 * flutter;
      lightIntensity = 10;
    } else if (isStandby) {
      const flutter = 1 + Math.sin(t * 24) * 0.05 + Math.cos(t * 37) * 0.04;
      targetScaleY = 0.85 * flutter;
      targetScaleXZ = 0.7 * flutter;
      lightIntensity = 6 + Math.sin(t * 20) * 1.5;
    } else {
      targetScaleY = 0.001;
      targetScaleXZ = 0.001;
      lightIntensity = 0.1;
    }

    // Update flame transform attached to ascending rocket
    if (flameGroup.current) {
      flameGroup.current.position.y = 1.25 + rocketY;
      flameGroup.current.scale.y = THREE.MathUtils.lerp(flameGroup.current.scale.y, targetScaleY, dt * 12);
      flameGroup.current.scale.x = THREE.MathUtils.lerp(flameGroup.current.scale.x, targetScaleXZ, dt * 12);
      flameGroup.current.scale.z = THREE.MathUtils.lerp(flameGroup.current.scale.z, targetScaleXZ, dt * 12);
    }

    if (pointLightRef.current) {
      pointLightRef.current.position.y = 0.7 + rocketY;
      pointLightRef.current.intensity = THREE.MathUtils.lerp(
        pointLightRef.current.intensity,
        lightIntensity,
        dt * 12
      );
    }

    // Animate Smoke & Vapor Trail
    if (smokePointsRef.current) {
      const positions = smokePointsRef.current.geometry.attributes.position.array as Float32Array;
      const isThrusting = isFullBurn || isIgnition || isCruising || isStandby;
      const isAscending = launchPhase === 'liftoff' || launchPhase === 'ascent' || launchPhase === 'cruising';

      for (let i = 0; i < smokeCount; i++) {
        smokeAges[i] += dt;

        if (smokeAges[i] >= smokeMaxAges[i]) {
          smokeAges[i] = 0;
          if (isThrusting) {
            const angle = Math.random() * Math.PI * 2;
            const r = Math.random() * (isAscending ? 0.35 : 0.45);
            // Spawn right below rocket engine nozzle
            positions[i * 3 + 0] = Math.cos(angle) * r;
            positions[i * 3 + 1] = 1.0 + rocketY;
            positions[i * 3 + 2] = Math.sin(angle) * r;

            if (isAscending) {
              // High downward ejection velocity for ascending smoke plume
              const radialVel = 0.4 + Math.random() * 0.8;
              smokeVelocities[i * 3 + 0] = Math.cos(angle) * radialVel;
              smokeVelocities[i * 3 + 1] = -3.5 - Math.random() * 3.0;
              smokeVelocities[i * 3 + 2] = Math.sin(angle) * radialVel;
            } else {
              // Horizontal deluge billowing across the platform trench
              const radialSpeed = (0.9 + Math.random() * 1.5) * (isIgnition ? 1.6 : 0.8);
              smokeVelocities[i * 3 + 0] = Math.cos(angle) * radialSpeed;
              smokeVelocities[i * 3 + 1] = -0.4 - Math.random() * 0.4;
              smokeVelocities[i * 3 + 2] = Math.sin(angle) * radialSpeed;
            }
          } else {
            positions[i * 3 + 1] = -100;
          }
        } else if (positions[i * 3 + 1] > -50) {
          // Progress existing smoke particle in 3D world space
          positions[i * 3 + 0] += smokeVelocities[i * 3 + 0] * dt;
          positions[i * 3 + 1] += smokeVelocities[i * 3 + 1] * dt;
          positions[i * 3 + 2] += smokeVelocities[i * 3 + 2] * dt;

          // Atmospheric drag and buoyancy
          smokeVelocities[i * 3 + 0] *= 0.97;
          smokeVelocities[i * 3 + 2] *= 0.97;
          smokeVelocities[i * 3 + 1] = THREE.MathUtils.lerp(smokeVelocities[i * 3 + 1], 0.2, dt * 2.0);
        }
      }
      smokePointsRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // Animate Sparks (active during static test or ignition & liftoff)
    if (sparksPointsRef.current) {
      const positions = sparksPointsRef.current.geometry.attributes.position.array as Float32Array;
      const sparksActive = isIgnition || launchPhase === 'liftoff' || thrustMode === 'test';

      if (sparksActive) {
        for (let i = 0; i < sparkCount; i++) {
          sparkAges[i] += dt;
          if (sparkAges[i] >= sparkMaxAges[i]) {
            sparkAges[i] = 0;
            const angle = Math.random() * Math.PI * 2;
            positions[i * 3 + 0] = Math.cos(angle) * 0.18;
            positions[i * 3 + 1] = 1.25 + rocketY;
            positions[i * 3 + 2] = Math.sin(angle) * 0.18;

            sparkVelocities[i * 3 + 0] = (Math.random() - 0.5) * 3.0;
            sparkVelocities[i * 3 + 1] = -5.0 - Math.random() * 4.0;
            sparkVelocities[i * 3 + 2] = (Math.random() - 0.5) * 3.0;
          } else {
            positions[i * 3 + 0] += sparkVelocities[i * 3 + 0] * dt;
            positions[i * 3 + 1] += sparkVelocities[i * 3 + 1] * dt;
            positions[i * 3 + 2] += sparkVelocities[i * 3 + 2] * dt;
          }
        }
        sparksPointsRef.current.geometry.attributes.position.needsUpdate = true;
      }
    }
  });

  return (
    <group>
      {/* ================= PROPULSION FLAME MESHES (Follows Rocket in Y) ================= */}
      <group ref={flameGroup} position={[0, 1.25, 0]}>
        {/* Core Supersonic Jet (Bright Blue/White Plasma) */}
        <mesh ref={coreFlameRef} position={[0, -0.65, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.26, 1.3, 24]} />
          <meshBasicMaterial
            color="#d6f4ff"
            transparent
            opacity={0.95}
          />
        </mesh>

        {/* Inner Shock Diamonds (Luminous flame nodes) */}
        <mesh position={[0, -0.4, 0]}>
          <cylinderGeometry args={[0.08, 0.18, 0.45, 16]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.9} />
        </mesh>
        <mesh position={[0, -0.85, 0]}>
          <cylinderGeometry args={[0.05, 0.14, 0.35, 16]} />
          <meshBasicMaterial color="#a5f3fc" transparent opacity={0.85} />
        </mesh>

        {/* Mid Plasma Envelope (Brilliant Orange/Gold) */}
        <mesh ref={outerFlameRef} position={[0, -0.95, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.48, 1.9, 24]} />
          <meshBasicMaterial
            color="#ff6600"
            transparent
            opacity={0.8}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* Outer Radiant Heat Aura (Crimson/Yellow Gradient) */}
        <mesh position={[0, -1.2, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.72, 2.4, 24]} />
          <meshBasicMaterial
            color="#ff2200"
            transparent
            opacity={0.45}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* ================= DYNAMIC FLAME LIGHT ================= */}
      <pointLight
        ref={pointLightRef}
        position={[0, 0.7, 0]}
        color="#ff5500"
        distance={18}
        decay={2}
        intensity={6}
      />

      {/* Secondary high-temperature core glow */}
      {(launchPhase === 'liftoff' || launchPhase === 'ascent' || thrustMode === 'test') && (
        <pointLight
          position={[0, 1.1 + rocketY, 0]}
          color="#38bdf8"
          distance={8}
          decay={2}
          intensity={12}
        />
      )}

      {/* ================= VOLUMETRIC EXHAUST SMOKE TRAIL ================= */}
      <points ref={smokePointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[smokePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={launchPhase === 'ascent' || launchPhase === 'liftoff' ? 2.2 : 1.4}
          map={smokeTexture}
          transparent
          opacity={
            launchPhase === 'ascent' || launchPhase === 'liftoff' || launchPhase === 'ignition'
              ? 0.42
              : thrustMode === 'test'
                ? 0.35
                : 0.22
          }
          depthWrite={false}
          blending={THREE.NormalBlending}
          color={launchPhase === 'ascent' ? '#f1f5f9' : '#fed7aa'}
        />
      </points>

      {/* ================= FIERY SPARK PARTICLES ================= */}
      <points ref={sparksPointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[sparkPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.14}
          color="#fde047"
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
