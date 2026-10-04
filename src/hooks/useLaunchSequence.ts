import { useState, useRef, useEffect, useCallback } from 'react';
import type { LaunchState } from '../types';

export function useLaunchSequence() {
  const [launchState, setLaunchState] = useState<LaunchState>({
    phase: 'standby',
    countdown: 3,
    rocketY: 0,
    velocity: 0,
    armRetract: 0,
    clampOpen: 0,
  });

  // Mutable refs for continuous smooth animation loop without re-triggering timers
  const stateRef = useRef<LaunchState>(launchState);
  stateRef.current = launchState;

  const timerRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  const startLaunch = useCallback(() => {
    timerRef.current = 0;
    lastTimeRef.current = performance.now();
    setLaunchState({
      phase: 'countdown',
      countdown: 3,
      rocketY: 0,
      velocity: 0,
      armRetract: 0,
      clampOpen: 0,
    });
  }, []);

  const resetLaunch = useCallback(() => {
    timerRef.current = 0;
    if (animFrameRef.current !== null) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    lastTimeRef.current = null;
    setLaunchState({
      phase: 'standby',
      countdown: 3,
      rocketY: 0,
      velocity: 0,
      armRetract: 0,
      clampOpen: 0,
    });
  }, []);

  useEffect(() => {
    if (launchState.phase === 'standby') {
      return;
    }

    let isRunning = true;

    const tick = (now: number) => {
      if (!isRunning) return;

      if (lastTimeRef.current === null) {
        lastTimeRef.current = now;
      }
      const rawDt = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;
      const dt = Math.min(Math.max(rawDt, 0.001), 0.05);

      const current = { ...stateRef.current };

      if (current.phase === 'countdown') {
        timerRef.current += dt;
        if (timerRef.current < 1.0) {
          current.countdown = 3;
        } else if (timerRef.current < 2.0) {
          current.countdown = 2;
        } else if (timerRef.current < 3.0) {
          current.countdown = 1;
        } else {
          // Transition to Ignition (T-0)
          current.phase = 'ignition';
          current.countdown = 0;
          timerRef.current = 0;
        }
      } else if (current.phase === 'ignition') {
        // Engines ignited on pad, flame ramping up, subtle vibration
        timerRef.current += dt;
        if (timerRef.current >= 1.8) {
          // Release hold-down clamps and begin vertical ascent
          current.phase = 'liftoff';
          timerRef.current = 0;
        }
      } else if (current.phase === 'liftoff') {
        // Clamps release and umbilical arms swing away
        current.armRetract = Math.min(current.armRetract + dt * 1.6, 1.0);
        current.clampOpen = Math.min(current.clampOpen + dt * 2.5, 1.0);

        // Smooth initial vertical acceleration (2.2 m/s²)
        current.velocity += 2.2 * dt;
        current.rocketY += current.velocity * dt;

        if (current.rocketY > 4.5) {
          current.phase = 'ascent';
        }
      } else if (current.phase === 'ascent') {
        current.armRetract = 1.0;
        current.clampOpen = 1.0;

        // Progressive acceleration as vehicle burns propellant and gains altitude
        const accel = 3.2 + Math.min(current.rocketY * 0.06, 3.8);
        current.velocity = Math.min(current.velocity + accel * dt, 17.5);
        current.rocketY += current.velocity * dt;

        if (current.rocketY >= 52.0) {
          current.phase = 'cruising';
        }
      } else if (current.phase === 'cruising') {
        // Smoothly taper off to steady cruise speed
        current.velocity = Math.max(current.velocity - dt * 6.0, 1.4);
        current.rocketY += current.velocity * dt;
      }

      setLaunchState(current);
      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);

    return () => {
      isRunning = false;
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [launchState.phase]);

  return {
    launchState,
    startLaunch,
    resetLaunch,
  };
}
