import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

type OrbitControlsType = React.ComponentRef<typeof OrbitControls>;
import { Rocket } from './Rocket';
import { EnginePlume } from './EnginePlume';
import { LaunchPlatform } from './LaunchPlatform';
import { GantryTower } from './GantryTower';
import { EnvironmentEffects } from './EnvironmentEffects';
import { Lighting } from './Lighting';
import type { CameraPreset, SceneConfig } from '../types';

interface SceneProps {
  config: SceneConfig;
}

// Smooth animated camera tracking manager for presets and flight ascent
function CameraController({
  preset,
  controlsRef,
  config,
}: {
  preset: CameraPreset;
  controlsRef: React.RefObject<OrbitControlsType | null>;
  config: SceneConfig;
}) {
  const { camera } = useThree();
  const targetPos = useRef<THREE.Vector3>(new THREE.Vector3(9.5, 6.2, 11.5));
  const targetLook = useRef<THREE.Vector3>(new THREE.Vector3(0, 4.2, 0));
  const isTransitioning = useRef<boolean>(false);

  // Update target when preset changes (only when on ground or manually commanded)
  useEffect(() => {
    isTransitioning.current = true;
    switch (preset) {
      case 'rocket':
        targetPos.current.set(3.5, 6.0, 4.5);
        targetLook.current.set(0, 5.5, 0);
        break;
      case 'engine':
        targetPos.current.set(2.8, 1.8, 3.2);
        targetLook.current.set(0, 1.4, 0);
        break;
      case 'tower':
        targetPos.current.set(-4.8, 7.0, 3.5);
        targetLook.current.set(-1.0, 5.5, 0);
        break;
      case 'top':
        targetPos.current.set(0.1, 15.0, 3.0);
        targetLook.current.set(0, 4.0, 0);
        break;
      case 'default':
      default:
        targetPos.current.set(9.5, 6.2, 11.5);
        targetLook.current.set(0, 4.2, 0);
        break;
    }
  }, [preset]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const { phase, rocketY } = config.launchState;
    const isFlightActive = phase === 'liftoff' || phase === 'ascent' || phase === 'cruising';

    if (isFlightActive) {
      // Smooth tracking during ascent: keep rocket framed in the upper portion
      // while preserving view of exhaust plume and the platform below
      const desiredLookY = 4.2 + rocketY * 0.75;
      const desiredPosY = 6.2 + rocketY * 0.78;
      const desiredDist = 1.0 + Math.min(rocketY * 0.015, 0.4);

      targetLook.current.set(0, desiredLookY, 0);
      targetPos.current.set(
        9.5 * desiredDist,
        desiredPosY,
        11.5 * desiredDist
      );

      camera.position.lerp(targetPos.current, dt * 3.8);

      if (controlsRef.current) {
        controlsRef.current.target.lerp(targetLook.current, dt * 3.8);
        controlsRef.current.update();
      }
    } else if (isTransitioning.current) {
      camera.position.lerp(targetPos.current, dt * 3.5);

      if (controlsRef.current) {
        controlsRef.current.target.lerp(targetLook.current, dt * 3.5);
        controlsRef.current.update();
      }

      if (camera.position.distanceTo(targetPos.current) < 0.08) {
        isTransitioning.current = false;
      }
    }
  });

  return null;
}

export function Scene({ config }: SceneProps) {
  const controlsRef = useRef<OrbitControlsType | null>(null);

  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
      <Canvas
        shadows
        camera={{ position: [9.5, 6.2, 11.5], fov: 42, near: 0.1, far: 300 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
      >
        <color attach="background" args={['#040711']} />

        {/* Camera Preset and Flight Ascent Manager */}
        <CameraController
          preset={config.cameraPreset}
          controlsRef={controlsRef}
          config={config}
        />

        {/* Orbit Controls */}
        <OrbitControls
          ref={controlsRef}
          enableDamping
          dampingFactor={0.06}
          minDistance={3.2}
          maxDistance={45}
          maxPolarAngle={Math.PI / 2 - 0.04}
          target={[0, 4.2, 0]}
          autoRotate={config.autoRotate && config.launchState.phase === 'standby'}
          autoRotateSpeed={0.8}
        />

        {/* Atmosphere & Space Environment */}
        <EnvironmentEffects />

        {/* Cinematic Scene Lights */}
        <Lighting floodlights={config.floodlights} />

        {/* Launch Complex Objects */}
        <group>
          {/* Base Platform with Animated Clamps */}
          <LaunchPlatform clampOpen={config.launchState.clampOpen} />

          {/* Gantry & Umbilical Support Towers with Retracting Arms */}
          <GantryTower
            floodlights={config.floodlights}
            armRetract={config.launchState.armRetract}
          />

          {/* Stylized Spacecraft with Launch Vibration and Altitude */}
          <Rocket
            thrustMode={config.thrustMode}
            rocketY={config.launchState.rocketY}
            launchPhase={config.launchState.phase}
          />

          {/* Engine Plume with Dynamic Smoke Trail and Heat Glow */}
          <EnginePlume
            thrustMode={config.thrustMode}
            rocketY={config.launchState.rocketY}
            launchPhase={config.launchState.phase}
          />
        </group>
      </Canvas>
    </div>
  );
}
