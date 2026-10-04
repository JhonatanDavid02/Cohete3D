# Cohete3D — Space Launch Simulator (Pad-07A)

Simulador interactivo 3D en tiempo real de una plataforma de lanzamiento espacial y secuencia de despegue orbital, desarrollado con React 19, Three.js, React Three Fiber y TypeScript.

---

## 🇪🇸 Español

### Descripción

**Cohete3D** es una aplicación interactiva que simula un complejo de lanzamiento espacial orbital (denominado *Pad-07A*). Permite al usuario explorar la infraestructura de despegue en tres dimensiones, inspeccionar subsistemas mecánicos (torre de servicio, brazos umbilicales, abrazaderas de retención, trinchera de deflexión de llamas) y ejecutar una secuencia automatizada de lanzamiento por etapas con telemetría en tiempo real.

### Valor técnico

Este proyecto demuestra competencias clave en desarrollo frontend y gráficos por computadora modernos:
- **Renderizado 3D declarativo**: Integración de Three.js dentro del ciclo de vida de React mediante `@react-three/fiber` y `@react-three/drei`.
- **Modelado procedimental sin assets externos**: Toda la nave, la torre de lanzamiento y la plataforma están construidas mediante geometrías primitivas y mallas procedurales nativas de Three.js, minimizando dependencias de archivos 3D pesados (.gltf/.obj).
- **Sistemas de partículas optimizados**: Generación y simulación física de humo y chispas de ignición empleando buffers de memoria directa (`Float32Array`) y `THREE.Points`.
- **Máquina de estados de vuelo desacoplada**: Manejo de cinemática de vuelo, aceleración progresiva y secuencias temporizadas a través de un custom hook (`useLaunchSequence`) con bucle `requestAnimationFrame` desacoplado del ciclo de re-renderizado reactivo innecesario.
- **Cinemática de cámara**: Controlador de cámara que combina soporte para presets orbitales y seguimiento suave por interpolación (*lerp*) durante la trayectoria de ascenso.
- **Arquitectura de UI desacoplada**: Interfaz HUD de grado aeroespacial superpuesta con HTML5/CSS, manteniendo el renderizado WebGL aislado y fluido a 60 FPS.

### Características

- **Secuencia de Despegue Automatizada**:
  - Cuenta regresiva visual (`T-3`, `T-2`, `T-1`).
  - Fase de ignición con microvibraciones físicas en el fuselaje antes del despegue.
  - Liberación mecánica coordinada de abrazaderas y retracción de brazos umbilicales.
  - Ascenso vertical con aceleración progresiva por quema de propelente.
  - Fase de crucero a altitud nominal.
- **Modos de Prueba Estática en Plataforma**:
  - Selector manual de empuje: `APAGADO` (idle), `STANDBY` (mínimo técnico), `IGNICIÓN` (prueba estática a potencia máxima).
- **Control de Cámaras**:
  - Presets preconfigurados: General (`PAD`), Detalle de Fuselaje (`COHETE`), Tobera de Escape (`MOTOR`), Torre de Servicio (`TORRE`).
  - Modo de rotación orbital automática (`GIRO`).
  - Navegación libre mediante controles orbitales (rotación 360°, paneo, zoom).
  - Seguimiento dinámico de cámara durante el ascenso del vehículo.
- **Telemetría en Vivo (HUD)**:
  - Altitud calculada en metros.
  - Velocidad estimada en km/h.
  - Nivel de empuje porcentual del motor.
  - Indicador de estado de misión con iluminación cromática contextual.

### Arquitectura

El proyecto sigue una arquitectura modular guiada por componentes:
```
src/
├── components/           # Componentes visuales y de escena
│   ├── Scene.tsx         # Canvas WebGL principal, luces y controlador de cámara
│   ├── Rocket.tsx        # Malla 3D del cohete, etapas, toberas y microvibración
│   ├── LaunchPlatform.tsx# Base de lanzamiento, zanja de llamas y abrazaderas móviles
│   ├── GantryTower.tsx   # Torre de servicio y brazos umbilicales retráctiles
│   ├── EnginePlume.tsx   # Cono de fuego y simulación de partículas (humo/chispas)
│   ├── Lighting.tsx      # Configuración de reflectores y luces ambientales/sombras
│   ├── EnvironmentEffects.tsx # Campo estelar y niebla atmosférica
│   └── HUD.tsx           # Interfaz de telemetría y controles superpuestos
├── hooks/
│   └── useLaunchSequence.ts # Máquina de estados de vuelo y cálculo cinemático
├── types.ts              # Definiciones de tipos TypeScript compartidas
├── App.tsx               # Orquestación de estado y enlace HUD-Escena
├── main.tsx              # Punto de entrada de la aplicación
└── index.css             # Sistema de diseño futurista con tipografías monoespaciadas
```

### Tecnologías

- **Lenguaje**: TypeScript (versión de compilador `tsc` v6.0.3)
- **Framework UI**: React 19.3.0
- **Gráficos 3D**: Three.js 0.186.1, React Three Fiber 9.8.1, React Three Drei 10.7.9
- **Bundler y Servidor Dev**: Vite 6.4.3 (`@vitejs/plugin-react` 4.7.0)
- **Gestor de Paquetes**: `pnpm` (gestor primario con `pnpm-lock.yaml` v9 determinista)
- **Linter / Tipado**: Oxlint (`.oxlintrc.json`) y TypeScript Compiler (`tsc -b`)

### Estructura del proyecto

| Archivo / Carpeta | Descripción |
| ----------------- | ----------- |
| `src/components/Scene.tsx` | Contenedor principal de Three.js con Canvas y cámara cinemática. |
| `src/components/Rocket.tsx` | Modelado procedural de la nave de dos etapas e interetapa. |
| `src/components/EnginePlume.tsx` | Simulación física de partículas para humo, tobera y chispas. |
| `src/components/LaunchPlatform.tsx` | Estructura de soporte con clamps animados y deflectores. |
| `src/components/GantryTower.tsx` | Torre metálica con elevador y brazos de combustible móviles. |
| `src/components/HUD.tsx` | Telemetría en tiempo real y panel de control táctico. |
| `src/hooks/useLaunchSequence.ts` | Motor cinemático con requestAnimationFrame y fases de misión. |
| `src/types.ts` | Modelos de datos para telemetría, fases y configuración de escena. |

### Requisitos

- **Node.js**: v18.0.0 o superior (recomendado v20.x).
- **Gestor de paquetes recomendado**: `pnpm` (v9+ o v12+). El repositorio incluye `pnpm-lock.yaml` para garantizar instalaciones deterministas.
- **Navegador**: Cualquier navegador moderno con soporte para WebGL 2.0 (Chrome, Firefox, Edge, Safari).

### Instalación

1. Clonar el repositorio o ingresar al directorio del proyecto:
   ```bash
   cd Cohete3D
   ```

2. Instalar las dependencias del proyecto:
   ```bash
   # Método principal y recomendado (garantiza versiones exactas vía pnpm-lock.yaml)
   pnpm install
   ```

   *(Alternativa comprobada: también es posible utilizar `npm install` si no se dispone de pnpm, aunque se recomienda pnpm para consistencia con el lockfile original).*

### Ejecución

- **Modo Desarrollo**:
  ```bash
  pnpm dev
  ```
  *(O con npm: `npm run dev`)*
  Abre la URL indicada en la terminal (usualmente `http://localhost:5173/`).

- **Compilación para Producción**:
  ```bash
  pnpm build
  ```
  *(O con npm: `npm run build`)*
  Ejecuta la validación de tipos estricta (`tsc -b`) y empaqueta el bundle optimizado en `dist/`.

- **Vista Previa de Producción**:
  ```bash
  pnpm preview
  ```
  *(O con npm: `npm run preview`)*

### Pruebas

- **Estado actual**: Este proyecto no cuenta actualmente con una suite de pruebas automatizadas configurada.
- **Estrategia sugerida**:
  - Configurar **Vitest** con `@testing-library/react` para validar transiciones de estado en `useLaunchSequence` y renderizado de componentes HUD.
  - Implementar pruebas de regresión visual o snapshots de Canvas para validar que el grafo de Three.js se inicialice sin errores de shader/contexto.

### Ejemplo de uso

1. Al abrir la aplicación, el cohete se encuentra en el pad de lanzamiento en estado de espera (`STANDBY`).
2. Usa el ratón para rotar la cámara 360°, hacer zoom sobre la tobera de escape o la torre de servicio.
3. Puedes cambiar la perspectiva rápidamente utilizando los botones de cámara: **PAD**, **COHETE**, **MOTOR**, **TORRE**.
4. Haz clic en **INICIAR DESPEGUE**:
   - Comenzará la cuenta regresiva `T-3s`.
   - En `T-0`, el motor entrará en ignición y el fuselaje vibrará de forma realista.
   - Las abrazaderas y brazos umbilicales se abrirán coordinadamente.
   - El cohete ascenderá verticalmente dejando una estela densa de humo y chispas, mientras la cámara lo sigue en su trayectoria.
5. Haz clic en **REINICIAR LANZAMIENTO** en cualquier momento para volver a colocar el cohete en la plataforma.

### Estado del proyecto

- **Estado**: Funcional y estable.
- **Rendimiento**: 60 FPS estables en GPUs estándar gracias al uso de primitivas nativas y buffers de partículas eficientes.

### Limitaciones y deuda técnica

- **Tamaño del bundle en producción**: El bundle compilado genera un chunk JavaScript que supera los 500 kB (aproximadamente 1.2 MB sin comprimir / 332 kB gzipped) debido a que Three.js y React Three Fiber se empaquetan en un único bloque sin configuración de `manualChunks` en Vite.
- **Declaración de dependencias de tipos**: `@types/three` se encuentra actualmente en la sección `dependencies` en lugar de `devDependencies` en `package.json`.
- **Ausencia de tests**: No dispone de pruebas automatizadas unitarias ni de integración.

### Próximas mejoras (Mejoras opcionales)

- [ ] **Efectos sonoros espaciales**: Integración de audio mediante Web Audio API / Howler.js (cuenta atrás de control de misión por voz, sonido ambiental del pad y estruendo de propulsión).
- [ ] **Optimización de chunks (Code Splitting)**: Configurar `build.rollupOptions.output.manualChunks` en `vite.config.ts` para segregar el vendor de Three.js y Drei.
- [ ] **Ajuste de dependencias**: Mover `@types/three` a `devDependencies`.
- [ ] **Suite de pruebas**: Añadir Vitest para verificar el ciclo de vida cinemático de `useLaunchSequence`.
- [ ] **Presets ambientales**: Selector de condiciones horarias (día, puesta de sol, noche profunda con iluminación artificial de torre).

### Autor

Desarrollado por **Jhonatan David** como parte de su portafolio de proyectos, demostrando capacidades técnicas en gráficos 3D interactivos e ingeniería de software frontend.

---

## 🇬🇧 English

### Description

**Cohete3D** is a real-time interactive 3D simulation of an orbital space launch complex (*Pad-07A*). It allows users to explore launch infrastructure in three dimensions, inspect mechanical subsystems (gantry service tower, umbilical arms, hold-down clamps, flame deflection trench), and execute an automated multistage liftoff sequence with live telemetry.

### Technical Value

This project highlights key skills in modern frontend engineering and WebGL computer graphics:
- **Declarative 3D Rendering**: Seamless Three.js integration within the React lifecycle using `@react-three/fiber` and `@react-three/drei`.
- **Zero External 3D Asset Dependencies**: Spacecraft, service tower, and launch platform are procedurally generated using native Three.js primitive geometries, eliminating heavyweight `.gltf` or `.obj` network downloads.
- **High-Performance Particle Simulations**: Dynamic plume exhaust smoke and ignition sparks simulated using direct memory buffers (`Float32Array`) paired with `THREE.Points`.
- **Decoupled Flight State Machine**: Vehicle kinetics, progressive mass-depletion acceleration, and timed release phases managed by a custom hook (`useLaunchSequence`) using `requestAnimationFrame`, avoiding unnecessary React component re-renders.
- **Cinematic Camera Management**: Dual-mode camera controller supporting orbital presets and smooth linear interpolation (*lerp*) tracking during atmospheric ascent.
- **Decoupled UI Layer**: Futuristic aerospace-inspired HUD built with clean HTML5/CSS, layered on top of the WebGL canvas maintaining a fluid 60 FPS.

### Features

- **Automated Launch Sequence**:
  - Visual countdown sequence (`T-3`, `T-2`, `T-1`).
  - Ignition phase featuring authentic pre-liftoff airframe micro-vibrations while clamped.
  - Coordinated hold-down clamp release and umbilical arm retraction.
  - Progressive vertical acceleration and atmospheric ascent.
  - High-altitude steady cruise state.
- **Static Fire & Test Modes on Pad**:
  - Manual thrust selector: `OFFLINE` (idle), `STANDBY` (low-level flame), `TEST FIRE` (full-thrust ground run).
- **Camera Presets & Controls**:
  - Perspective presets: Overall (`PAD`), Airframe (`ROCKET`), Engine Nozzle (`ENGINE`), Gantry Tower (`TOWER`).
  - Auto-rotation showcase mode (`ROTATE`).
  - Full orbital controls (360° rotate, pan, zoom).
  - Dynamic ascent camera tracking following the vehicle as it climbs.
- **Live HUD Telemetry**:
  - Real-time altitude calculation (meters).
  - Velocity indicator (km/h).
  - Engine thrust percentage.
  - Mission status badge with contextual glowing indicators.

### Architecture

The application adopts a component-driven architecture:
```
src/
├── components/           # 3D scene elements & UI components
│   ├── Scene.tsx         # Main Canvas container, lights, and camera controller
│   ├── Rocket.tsx        # 3D rocket assembly, stages, nozzles, and vibration kinetics
│   ├── LaunchPlatform.tsx# Base launch deck, flame trench, and animated clamps
│   ├── GantryTower.tsx   # Structural service tower with movable umbilical arms
│   ├── EnginePlume.tsx   # Flame cone & procedural particle buffers (smoke/sparks)
│   ├── Lighting.tsx      # Spotlights, fill lights, and shadow casting setup
│   ├── EnvironmentEffects.tsx # Starfield particles and atmospheric fog
│   └── HUD.tsx           # Overlay HUD telemetry and tactical control dock
├── hooks/
│   └── useLaunchSequence.ts # Kinematics engine and flight phase state machine
├── types.ts              # Shared TypeScript definitions
├── App.tsx               # State coordinator connecting HUD with 3D Scene
├── main.tsx              # Application entry point
└── index.css             # Aerospace styling, glowing accents, and typography
```

### Technologies

- **Language**: TypeScript (compiler `tsc` version 6.0.3)
- **UI Framework**: React 19.3.0
- **3D Graphics Engine**: Three.js 0.186.1, React Three Fiber 9.8.1, React Three Drei 10.7.9
- **Bundler & Tooling**: Vite 6.4.3 (`@vitejs/plugin-react` 4.7.0)
- **Package Manager**: `pnpm` (primary manager with deterministic `pnpm-lock.yaml` v9)
- **Code Quality**: Oxlint (`.oxlintrc.json`) and TypeScript Compiler (`tsc -b`)

### Project Structure

| File / Folder | Purpose |
| ------------- | ------- |
| `src/components/Scene.tsx` | Main Three.js Canvas setup, tone mapping, and camera tracking controller. |
| `src/components/Rocket.tsx` | Procedural multi-stage rocket fuselage, fins, nozzles, and thrusters. |
| `src/components/EnginePlume.tsx` | Dynamic flame geometry and GPU particle buffers for smoke and sparks. |
| `src/components/LaunchPlatform.tsx` | Pad base, flame trench warning strobes, and motorized hold-down clamps. |
| `src/components/GantryTower.tsx` | Structural truss tower with elevator cabin and swing-away umbilical arms. |
| `src/components/HUD.tsx` | Heads-up display with flight metrics and control dock. |
| `src/hooks/useLaunchSequence.ts` | Physics ticker and launch sequence state coordinator. |
| `src/types.ts` | Strict data interfaces for camera presets, flight states, and configurations. |

### Prerequisites

- **Node.js**: v18.0.0 or higher (v20.x recommended).
- **Recommended Package Manager**: `pnpm` (v9+ or v12+). The repository includes `pnpm-lock.yaml` for deterministic installations.
- **Browser**: Modern web browser with WebGL 2.0 support (Chrome, Firefox, Safari, Edge).

### Installation

1. Clone or navigate to the project directory:
   ```bash
   cd Cohete3D
   ```

2. Install dependencies:
   ```bash
   # Primary and recommended method (guarantees exact dependency tree via pnpm-lock.yaml)
   pnpm install
   ```

   *(Verified alternative: `npm install` can also be used if pnpm is not installed, though pnpm is recommended for lockfile reproducibility).*

### Running Locally

- **Development Server**:
  ```bash
  pnpm dev
  ```
  *(Or with npm: `npm run dev`)*
  Open the local URL displayed in the terminal (typically `http://localhost:5173/`).

- **Production Build**:
  ```bash
  pnpm build
  ```
  *(Or with npm: `npm run build`)*
  Runs strict type checking (`tsc -b`) and outputs the production bundle to `dist/`.

- **Preview Build**:
  ```bash
  pnpm preview
  ```
  *(Or with npm: `npm run preview`)*

### Testing

- **Current Status**: No automated test suite is currently configured.
- **Recommended Implementation**:
  - Integrate **Vitest** and `@testing-library/react` to test countdown and velocity calculations in `useLaunchSequence`.
  - Add visual regression snapshots to guarantee the WebGL canvas initializes and mounts properly without context loss.

### Usage Example

1. Upon loading, the vehicle stands on the pad in `STANDBY` state.
2. Use mouse controls to rotate 360°, inspect the gantry tower, or zoom in on the engine bell.
3. Switch camera perspectives with the HUD dock buttons: **PAD**, **COHETE**, **MOTOR**, **TORRE**.
4. Click **INICIAR DESPEGUE**:
   - The countdown sequence initiates at `T-3s`.
   - At `T-0`, engine ignition begins with realistic pre-launch fuselage vibration.
   - The hold-down clamps release and umbilical support arms swing open.
   - The rocket accelerates vertically through the atmosphere while the camera tracks its climb.
5. Click **REINICIAR LANZAMIENTO** at any time to return the vehicle to the launch mount.

### Project Status

- **Status**: Stable & functional.
- **Performance**: Consistent 60 FPS on standard modern GPUs using instanced/buffer particle rendering.

### Limitations & Technical Debt

- **Production Bundle Size**: The compiled bundle produces a JavaScript chunk exceeding 500 kB (approx. 1.2 MB uncompressed / 332 kB gzipped) because Three.js and React Three Fiber are bundled without custom `manualChunks` in Vite.
- **Type Declaration Categorization**: `@types/three` is currently listed in `dependencies` rather than `devDependencies` in `package.json`.
- **Test Coverage**: No unit or integration test suite is currently implemented.

### Future Enhancements (Optional)

- [ ] **Spatial Audio Effects**: Implement audio via Web Audio API or Howler.js (countdown voice audio, ambient pad sounds, engine roar).
- [ ] **Vendor Code Splitting**: Configure `build.rollupOptions.output.manualChunks` in `vite.config.ts` to isolate Three.js and Drei.
- [ ] **Dependency Reclassification**: Move `@types/three` to `devDependencies`.
- [ ] **Automated Tests**: Implement Vitest tests for the `useLaunchSequence` hook.
- [ ] **Environmental Presets**: Add dynamic day/night cycles with tower illumination.

### Author

Developed by **Jhonatan David** as part of his personal software portfolio, showcasing technical capabilities in interactive 3D graphics and modern frontend engineering.
