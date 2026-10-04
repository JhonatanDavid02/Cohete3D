import { useState } from 'react';
import { Scene } from './components/Scene';
import { HUD } from './components/HUD';
import { useLaunchSequence } from './hooks/useLaunchSequence';
import type { CameraPreset, SceneConfig, ThrustMode } from './types';

export function App() {
  const { launchState, startLaunch, resetLaunch } = useLaunchSequence();

  const [manualConfig, setManualConfig] = useState<{
    thrustMode: ThrustMode;
    floodlights: boolean;
    autoRotate: boolean;
    cameraPreset: CameraPreset;
  }>({
    thrustMode: 'standby',
    floodlights: true,
    autoRotate: false,
    cameraPreset: 'default',
  });

  const handleUpdateConfig = (newConfig: Partial<SceneConfig>) => {
    setManualConfig((prev) => ({ ...prev, ...newConfig }));
  };

  const handleStartLaunch = () => {
    setManualConfig((prev) => ({ ...prev, cameraPreset: 'default', autoRotate: false }));
    startLaunch();
  };

  const handleResetLaunch = () => {
    setManualConfig((prev) => ({ ...prev, cameraPreset: 'default' }));
    resetLaunch();
  };

  const config: SceneConfig = {
    ...manualConfig,
    launchState,
  };

  return (
    <main className="app-viewport">
      <Scene config={config} />
      <HUD
        config={config}
        onChangeConfig={handleUpdateConfig}
        onStartLaunch={handleStartLaunch}
        onResetLaunch={handleResetLaunch}
      />
    </main>
  );
}

export default App;
