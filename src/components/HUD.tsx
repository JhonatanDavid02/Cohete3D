import type { CameraPreset, SceneConfig, ThrustMode } from '../types';

interface HUDProps {
  config: SceneConfig;
  onChangeConfig: (newConfig: Partial<SceneConfig>) => void;
  onStartLaunch: () => void;
  onResetLaunch: () => void;
}

export function HUD({ config, onChangeConfig, onStartLaunch, onResetLaunch }: HUDProps) {
  const { launchState } = config;
  const isLaunching = launchState.phase !== 'standby';

  const getStatusInfo = () => {
    switch (launchState.phase) {
      case 'countdown':
        return {
          label: `CUENTA REGRESIVA // T-${launchState.countdown}s`,
          color: '#f59e0b',
          glow: 'rgba(245, 158, 11, 0.5)',
        };
      case 'ignition':
        return {
          label: 'IGNICIÓN // EMPUJE MÁXIMO',
          color: '#f97316',
          glow: 'rgba(249, 115, 22, 0.6)',
        };
      case 'liftoff':
        return {
          label: 'DESPEGUE // LIBERACIÓN DE BRAZOS',
          color: '#ef4444',
          glow: 'rgba(239, 68, 68, 0.6)',
        };
      case 'ascent':
        return {
          label: 'ASCENSO // TRAYECTORIA NOMINAL',
          color: '#10b981',
          glow: 'rgba(16, 185, 129, 0.5)',
        };
      case 'cruising':
        return {
          label: 'ÓRBITA ALCANZADA // VUELO NOMINAL',
          color: '#00e5ff',
          glow: 'rgba(0, 229, 255, 0.5)',
        };
      case 'standby':
      default:
        return config.thrustMode === 'test'
          ? {
              label: 'PRUEBA ESTÁTICA // FUEGO ACTIVO',
              color: '#f97316',
              glow: 'rgba(249, 115, 22, 0.4)',
            }
          : {
              label: 'READY // ESPERA DE IGNICIÓN',
              color: '#38bdf8',
              glow: 'rgba(56, 189, 248, 0.3)',
            };
    }
  };

  const status = getStatusInfo();

  return (
    <div className="hud-container">
      {/* ================= TOP HEADER BADGE & TELEMETRY ================= */}
      <header className="hud-header">
        <div className="hud-badge">
          <div
            className="hud-indicator-dot"
            style={{ backgroundColor: status.color, boxShadow: `0 0 14px ${status.glow}` }}
          />
          <div className="hud-title-group">
            <div className="hud-tag">LAUNCH PLATFORM • PAD-07A</div>
            <div className="hud-status" style={{ color: status.color }}>
              {status.label}
            </div>
          </div>
        </div>

        {/* Real-time Telemetry Pill */}
        <div className="hud-telemetry-pill">
          <span className="telemetry-item">
            <span className="telemetry-label">ALTITUD:</span>
            <span className="telemetry-value">
              {(launchState.rocketY * 4.2).toFixed(1)} m
            </span>
          </span>
          <span className="telemetry-divider">|</span>
          <span className="telemetry-item">
            <span className="telemetry-label">VELOCIDAD:</span>
            <span className="telemetry-value">
              {(launchState.velocity * 18.0).toFixed(0)} km/h
            </span>
          </span>
          <span className="telemetry-divider">|</span>
          <span className="telemetry-item">
            <span className="telemetry-label">EMPUJE:</span>
            <span className="telemetry-value">
              {isLaunching
                ? launchState.phase === 'countdown'
                  ? 'STANDBY'
                  : '100% MAX'
                : config.thrustMode === 'test'
                  ? '100% TEST'
                  : config.thrustMode === 'standby'
                    ? '35% IDLE'
                    : 'OFFLINE'}
            </span>
          </span>
        </div>
      </header>

      {/* ================= COUNTDOWN OVERLAY ================= */}
      {launchState.phase === 'countdown' && (
        <div className="hud-countdown-banner">
          <div className="countdown-number">T - 0{launchState.countdown}</div>
          <div className="countdown-sub">SECUENCIA AUTOMÁTICA EN PROCESO</div>
        </div>
      )}

      {/* ================= BOTTOM FLOATING CONTROLS DOCK ================= */}
      <footer className="hud-footer">
        {/* LAUNCH / RESET PRIMARY BUTTON */}
        <div className="hud-panel hud-panel-primary">
          {!isLaunching ? (
            <button
              type="button"
              className="hud-btn hud-btn-launch"
              onClick={onStartLaunch}
            >
              <span className="btn-icon">▲</span>
              <span className="btn-text">INICIAR DESPEGUE</span>
            </button>
          ) : (
            <button
              type="button"
              className="hud-btn hud-btn-reset"
              onClick={onResetLaunch}
            >
              <span className="btn-icon">↺</span>
              <span className="btn-text">REINICIAR LANZAMIENTO</span>
            </button>
          )}
        </div>

        {/* Propulsion Mode Selector (Active when on ground) */}
        {!isLaunching && (
          <div className="hud-panel">
            <div className="panel-label">POTENCIA MOTOR</div>
            <div className="hud-btn-group">
              {(['idle', 'standby', 'test'] as ThrustMode[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  className={`hud-btn ${config.thrustMode === mode ? 'active' : ''}`}
                  onClick={() => onChangeConfig({ thrustMode: mode })}
                >
                  {mode === 'idle' && 'APAGADO'}
                  {mode === 'standby' && 'STANDBY'}
                  {mode === 'test' && 'IGNICIÓN'}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Camera Views Selector */}
        <div className="hud-panel">
          <div className="panel-label">CÁMARA</div>
          <div className="hud-btn-group">
            {(
              [
                { id: 'default', label: 'PAD' },
                { id: 'rocket', label: 'COHETE' },
                { id: 'engine', label: 'MOTOR' },
                { id: 'tower', label: 'TORRE' },
              ] as { id: CameraPreset; label: string }[]
            ).map((item) => (
              <button
                key={item.id}
                type="button"
                className={`hud-btn ${config.cameraPreset === item.id ? 'active' : ''}`}
                onClick={() => onChangeConfig({ cameraPreset: item.id })}
              >
                {item.label}
              </button>
            ))}
            <button
              type="button"
              className={`hud-btn hud-btn-icon ${config.autoRotate ? 'active' : ''}`}
              title="Giro automático"
              onClick={() => onChangeConfig({ autoRotate: !config.autoRotate })}
            >
              GIRO
            </button>
          </div>
        </div>
      </footer>

      {/* ================= INTERACTION HINT ================= */}
      <div className="hud-interaction-hint">
        <span>Arrastra para rotar</span>
        <span className="dot">•</span>
        <span>Rueda para zoom</span>
        <span className="dot">•</span>
        <span>Clic derecho para desplazar</span>
      </div>
    </div>
  );
}
