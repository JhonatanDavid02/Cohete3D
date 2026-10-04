interface LightingProps {
  floodlights: boolean;
}

export function Lighting({ floodlights }: LightingProps) {
  return (
    <group>
      {/* Deep Space Ambient Light */}
      <ambientLight color="#0c162c" intensity={0.8} />

      {/* Atmospheric Hemisphere Fill Light */}
      <hemisphereLight
        args={['#1e293b', '#040711', 0.6]}
      />

      {/* Main Celestial Directional Key Light (Casting Soft Shadows) */}
      <directionalLight
        position={[14, 20, 12]}
        color="#f1f5f9"
        intensity={2.4}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
        shadow-camera-near={0.5}
        shadow-camera-far={50}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={16}
        shadow-camera-bottom={-4}
      />

      {/* High-Contrast Sci-Fi Rim Light (Cyan/Electric Blue) */}
      <directionalLight
        position={[-12, 10, -10]}
        color="#0284c7"
        intensity={1.6}
      />

      {/* Subtle Warm Fill Light to soften dark side of the vehicle */}
      <directionalLight
        position={[-6, 4, 12]}
        color="#f97316"
        intensity={0.4}
      />

      {/* High-Angle Platform Overhead Spot */}
      {floodlights && (
        <spotLight
          position={[0, 15, 0]}
          target-position={[0, 4, 0]}
          color="#f8fafc"
          intensity={5.0}
          distance={24}
          angle={0.55}
          penumbra={0.8}
        />
      )}
    </group>
  );
}
