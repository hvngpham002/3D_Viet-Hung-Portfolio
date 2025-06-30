/* eslint-disable @typescript-eslint/naming-convention */
import {
  Suspense,
  useState,
  useRef,
  useEffect,
  useCallback,
  lazy,
  memo,
  useMemo,
} from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Canvas, useFrame, useThree, ThreeEvent } from "@react-three/fiber";
import Loader from "../components/Loader";
import HomeInfo from "../components/HomeInfo";
import * as THREE from "three";
import useArrowHandlers from "../hooks/useArrowHandlers";
import ErrorBoundary from "../components/ErrorBoundary";

const Sky = lazy(() =>
  import("../models/Sky").then((module) => ({ default: module.default }))
);
const Book = lazy(() =>
  import("../models/Book").then((module) => ({ default: module.default }))
);
const Dragon = lazy(() =>
  import("../models/Dragon").then((module) => ({ default: module.default }))
);
const Ciri = lazy(() =>
  import("../models/Ciri").then((module) => ({ default: module.default }))
);
const Flag = lazy(() =>
  import("../models/Flag").then((module) => ({ default: module.default }))
);

type SceneContentProps = {
  isRotating: boolean;
  setIsRotating: (isRotating: boolean) => void;
  currentStage: number | null;
  setCurrentStage: (stage: number | null) => void;
  themeMode: string;
  isSceneRotating: boolean;
  setIsSceneRotating: (isRotating: boolean) => void;
};

type ScreenAdjustment = [[number, number, number], THREE.Vector3, THREE.Euler];

const Home = () => {
  const [isRotating, setIsRotating] = useState(false);
  const [currentStage, setCurrentStage] = useState<number | null>(1);
  const [isSceneRotating, setIsSceneRotating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const moveIntervalRef = useRef<number | null>(null);

  const themeMode = useSelector((state: RootState) => state.theme.mode);

  const lightingConfig = useMemo(
    () =>
      themeMode === "light"
        ? {
            directionalLight: {
              position: new THREE.Vector3(0, 10, 0),
              intensity: 2.5,
              color: "#ffffff",
            },
            ambientLight: {
              intensity: 2.5,
              color: "#c6fff5",
            },
            hemisphereLight: {
              color: "#fafbd5",
              groundColor: "#696152",
              intensity: 2.5,
            },
          }
        : {
            directionalLight: {
              position: new THREE.Vector3(0, 10, 0),
              intensity: 1.5,
              color: "#e0eaff",
            },
            ambientLight: {
              intensity: 0.6,
              color: "#c8f2ff",
            },
            hemisphereLight: {
              color: "#b8c6f3",
              groundColor: "#a1b3d8",
              intensity: 0.6,
            },
          },
    [themeMode]
  );

  const simulateKeyPress = useCallback((key: string) => {
    // Create and dispatch keydown event
    const keydownEvent = new KeyboardEvent("keydown", { key });
    document.dispatchEvent(keydownEvent);
  }, []);

  const simulateKeyRelease = useCallback((key: string) => {
    // Create and dispatch keyup event
    const keyupEvent = new KeyboardEvent("keyup", { key });
    document.dispatchEvent(keyupEvent);
  }, []);

  const handleMoveStart = useCallback(
    (key: string) => {
      // Initial press
      simulateKeyPress(key);

      // Clear any existing interval
      if (moveIntervalRef.current) {
        clearInterval(moveIntervalRef.current);
      }

      // Set up continuous movement
      moveIntervalRef.current = window.setInterval(() => {
        simulateKeyPress(key);
      }, 16); // ~60fps
    },
    [simulateKeyPress]
  );

  const handleMoveEnd = useCallback(
    (key: string) => {
      // Clear the interval
      if (moveIntervalRef.current) {
        clearInterval(moveIntervalRef.current);
        moveIntervalRef.current = null;
      }

      // Release the key
      simulateKeyRelease(key);
    },
    [simulateKeyRelease]
  );

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (moveIntervalRef.current) {
        clearInterval(moveIntervalRef.current);
      }
    };
  }, []);

  const leftHandlers = useArrowHandlers("ArrowLeft", handleMoveStart, handleMoveEnd);
  const rightHandlers = useArrowHandlers("ArrowRight", handleMoveStart, handleMoveEnd);

  return (
    <ErrorBoundary>
    <>
      {/* Loader at the top level with highest z-index */}
      {isLoading && (
        <div className="fixed top-0 left-0 right-0 bottom-0 z-[999] bg-gray-100 dark:bg-gray-800">
          <Loader onStarted={() => setIsLoading(false)} />
        </div>
      )}

      <div className="fixed top-0 left-0 right-0 bottom-0">
        <Canvas
          shadows
          className={`w-full h-screen bg-transparent ${
            isRotating ? "cursor-grabbing" : "cursor-grab"
          }`}
          camera={{ position: [0, 0, 5], near: 0.1, far: 1000 }}
          gl={{
            antialias: window.innerHeight <= 1080,
            powerPreference: "high-performance",
            stencil: false,
            depth: true,
            alpha: false,
            premultipliedAlpha: false,
          }}
          dpr={[1, window.innerHeight > 1080 ? 1.5 : 2]}
          performance={{ min: 0.5, max: 1 }}
          style={{ touchAction: "none" }}
          onTouchMove={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <Suspense fallback={null}>
            <directionalLight
              shadow-mapSize-width={1024}
              shadow-mapSize-height={1024}
              color={lightingConfig.directionalLight.color}
              position={lightingConfig.directionalLight.position}
              intensity={lightingConfig.directionalLight.intensity}
              shadow-camera-near={0.1}
              shadow-camera-far={50}
              shadow-camera-left={-10}
              shadow-camera-right={10}
              shadow-camera-top={10}
              shadow-camera-bottom={-10}
              castShadow
            />
            <ambientLight
              color={lightingConfig.ambientLight.color}
              intensity={lightingConfig.ambientLight.intensity}
            />
            <hemisphereLight
              color={lightingConfig.hemisphereLight.color}
              groundColor={lightingConfig.hemisphereLight.groundColor}
              intensity={lightingConfig.hemisphereLight.intensity}
            />
            <MemoizedSceneContent
              isRotating={isRotating}
              setIsRotating={setIsRotating}
              currentStage={currentStage}
              setCurrentStage={setCurrentStage}
              themeMode={themeMode}
              isSceneRotating={isSceneRotating}
              setIsSceneRotating={setIsSceneRotating}
            />
          </Suspense>
        </Canvas>
      </div>

      <div className="fixed top-0 left-0 right-0 bottom-0 pointer-events-none">
        <div className="absolute top-28 left-0 right-0 flex items-center justify-center">
          <div className="pointer-events-auto">
            {currentStage && <HomeInfo currentStage={currentStage} />}
          </div>
        </div>

        {/* Control Buttons */}
        {/* Desktop layout: visible on medium screens and up */}
        <div className="hidden md:flex absolute bottom-8 left-0 right-0 items-center justify-center gap-4 pointer-events-auto select-none">
          <button
            className="w-16 h-16 rounded-lg bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm border-2 dark:border-white/20 border-gray-700 flex flex-col items-center justify-center active:scale-95 transition-transform shadow-lg hover:bg-white/30 dark:hover:bg-gray-800/30 select-none touch-none"
            {...leftHandlers}
            aria-label="Move Left"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6 dark:text-white text-black select-none"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
            <span className="text-xs font-medium dark:text-white text-black mt-1 select-none">
              LEFT
            </span>
          </button>
          <button
            className="w-16 h-16 rounded-lg bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm border-2 dark:border-white/20 border-gray-700 flex flex-col items-center justify-center active:scale-95 transition-transform shadow-lg hover:bg-white/30 dark:hover:bg-gray-800/30 select-none touch-none"
            {...rightHandlers}
            aria-label="Move Right"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6 dark:text-white text-black select-none"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
            <span className="text-xs font-medium dark:text-white text-black mt-1 select-none">
              RIGHT
            </span>
          </button>
          <button
            className="w-16 h-16 rounded-lg bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm border-2 dark:border-white/20 border-gray-700 flex flex-col items-center justify-center active:scale-95 transition-transform shadow-lg hover:bg-white/30 dark:hover:bg-gray-800/30 select-none touch-none"
            onTouchStart={() => handleMoveStart("q")}
            onTouchEnd={() => handleMoveEnd("q")}
            onMouseDown={() => handleMoveStart("q")}
            onMouseUp={() => handleMoveEnd("q")}
            onMouseLeave={() => handleMoveEnd("q")}
            aria-label="Q key"
          >
            <span className="text-lg font-bold dark:text-white text-black select-none">
              Q
            </span>
          </button>
          <button
            className="w-16 h-16 rounded-lg bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm border-2 dark:border-white/20 border-gray-700 flex flex-col items-center justify-center active:scale-95 transition-transform shadow-lg hover:bg-white/30 dark:hover:bg-gray-800/30 select-none touch-none"
            onTouchStart={() => handleMoveStart("w")}
            onTouchEnd={() => handleMoveEnd("w")}
            onMouseDown={() => handleMoveStart("w")}
            onMouseUp={() => handleMoveEnd("w")}
            onMouseLeave={() => handleMoveEnd("w")}
            aria-label="W key"
          >
            <span className="text-lg font-bold dark:text-white text-black select-none">
              W
            </span>
          </button>
          <button
            className="w-16 h-16 rounded-lg bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm border-2 dark:border-white/20 border-gray-700 flex flex-col items-center justify-center active:scale-95 transition-transform shadow-lg hover:bg-white/30 dark:hover:bg-gray-800/30 select-none touch-none"
            onTouchStart={() => handleMoveStart("e")}
            onTouchEnd={() => handleMoveEnd("e")}
            onMouseDown={() => handleMoveStart("e")}
            onMouseUp={() => handleMoveEnd("e")}
            onMouseLeave={() => handleMoveEnd("e")}
            aria-label="E key"
          >
            <span className="text-lg font-bold dark:text-white text-black select-none">
              E
            </span>
          </button>
          <button
            className="w-16 h-16 rounded-lg bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm border-2 dark:border-white/20 border-gray-700 flex flex-col items-center justify-center active:scale-95 transition-transform shadow-lg hover:bg-white/30 dark:hover:bg-gray-800/30 select-none touch-none"
            onTouchStart={() => handleMoveStart("r")}
            onTouchEnd={() => handleMoveEnd("r")}
            onMouseDown={() => handleMoveStart("r")}
            onMouseUp={() => handleMoveEnd("r")}
            onMouseLeave={() => handleMoveEnd("r")}
            aria-label="R key"
          >
            <span className="text-lg font-bold dark:text-white text-black select-none">
              R
            </span>
          </button>
        </div>

        {/* Mobile layout: visible on small screens */}
        <div className="flex md:hidden flex-col absolute bottom-8 left-0 right-0 items-center justify-center gap-4 pointer-events-auto select-none">
          <div className="flex gap-4">
            <button
              className="w-12 h-12 rounded-lg bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm border-2 dark:border-white/20 border-gray-700 flex flex-col items-center justify-center active:scale-95 transition-transform shadow-lg hover:bg-white/30 dark:hover:bg-gray-800/30 select-none touch-none"
              onTouchStart={() => handleMoveStart("q")}
              onTouchEnd={() => handleMoveEnd("q")}
              onMouseDown={() => handleMoveStart("q")}
              onMouseUp={() => handleMoveEnd("q")}
              onMouseLeave={() => handleMoveEnd("q")}
              aria-label="Q key"
            >
              <span className="text-lg font-bold dark:text-white text-black select-none">
                Q
              </span>
            </button>
            <button
              className="w-12 h-12 rounded-lg bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm border-2 dark:border-white/20 border-gray-700 flex flex-col items-center justify-center active:scale-95 transition-transform shadow-lg hover:bg-white/30 dark:hover:bg-gray-800/30 select-none touch-none"
              onTouchStart={() => handleMoveStart("w")}
              onTouchEnd={() => handleMoveEnd("w")}
              onMouseDown={() => handleMoveStart("w")}
              onMouseUp={() => handleMoveEnd("w")}
              onMouseLeave={() => handleMoveEnd("w")}
              aria-label="W key"
            >
              <span className="text-lg font-bold dark:text-white text-black select-none">
                W
              </span>
            </button>
            <button
              className="w-12 h-12 rounded-lg bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm border-2 dark:border-white/20 border-gray-700 flex flex-col items-center justify-center active:scale-95 transition-transform shadow-lg hover:bg-white/30 dark:hover:bg-gray-800/30 select-none touch-none"
              onTouchStart={() => handleMoveStart("e")}
              onTouchEnd={() => handleMoveEnd("e")}
              onMouseDown={() => handleMoveStart("e")}
              onMouseUp={() => handleMoveEnd("e")}
              onMouseLeave={() => handleMoveEnd("e")}
              aria-label="E key"
            >
              <span className="text-lg font-bold dark:text-white text-black select-none">
                E
              </span>
            </button>
            <button
              className="w-12 h-12 rounded-lg bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm border-2 dark:border-white/20 border-gray-700 flex flex-col items-center justify-center active:scale-95 transition-transform shadow-lg hover:bg-white/30 dark:hover:bg-gray-800/30 select-none touch-none"
              onTouchStart={() => handleMoveStart("r")}
              onTouchEnd={() => handleMoveEnd("r")}
              onMouseDown={() => handleMoveStart("r")}
              onMouseUp={() => handleMoveEnd("r")}
              onMouseLeave={() => handleMoveEnd("r")}
              aria-label="R key"
            >
              <span className="text-lg font-bold dark:text-white text-black select-none">
                R
              </span>
            </button>
          </div>
          <div className="flex gap-4">
            <button
              className="w-12 h-12 rounded-lg bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm border-2 dark:border-white/20 border-gray-700 flex flex-col items-center justify-center active:scale-95 transition-transform shadow-lg hover:bg-white/30 dark:hover:bg-gray-800/30 select-none touch-none"
              {...leftHandlers}
              aria-label="Move Left"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4 dark:text-white text-black select-none"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
              <span className="text-[0.6rem] font-medium dark:text-white text-black mt-1 select-none">
                LEFT
              </span>
            </button>
            <button
              className="w-12 h-12 rounded-lg bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm border-2 dark:border-white/20 border-gray-700 flex flex-col items-center justify-center active:scale-95 transition-transform shadow-lg hover:bg-white/30 dark:hover:bg-gray-800/30 select-none touch-none"
              {...rightHandlers}
              aria-label="Move Right"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4 dark:text-white text-black select-none"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
              <span className="text-[0.6rem] font-medium dark:text-white text-black mt-1 select-none">
                RIGHT
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
    </ErrorBoundary>
  );
};

const SceneContent = ({
  isRotating,
  setIsRotating,
  setCurrentStage,
  themeMode,
  isSceneRotating,
  setIsSceneRotating,
}: SceneContentProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const { gl, camera } = useThree();
  const lastX = useRef(0);
  const lastY = useRef(0);
  const rotationSpeed = useRef({ x: 0, y: 0 });
  const dampingFactor = 0.95;
  const zoomSpeed = 0.001;
  const minZoom = 2;
  const maxZoom = 10;
  const touchStartDistance = useRef(0);
  const initialZoom = useRef(0);

  const adjustIslandForScreenSize = (): ScreenAdjustment => {
    let screenScale: [number, number, number] = [0.1, 0.1, 0.1];
    const screenPosition = new THREE.Vector3(0.5, -0.65, -2.5);
    const rotation = new THREE.Euler(0.25, 0, 0);

    if (window.innerWidth < 768) {
      screenScale = [0.055, 0.055, 0.055];
    }

    return [screenScale, screenPosition, rotation];
  };

  const adjustDragonForScreenSize = (): ScreenAdjustment => {
    let screenScale: [number, number, number] = [30.0, 30.0, 30.0];
    const screenPosition = new THREE.Vector3(0, 0.4, -1);
    const rotation = new THREE.Euler(0, 1.25, 0);

    if (window.innerWidth < 768) {
      screenScale = [20.0, 20.0, 20.0];
    }

    return [screenScale, screenPosition, rotation];
  };

  const adjustCiriForScreenSize = (): ScreenAdjustment => {
    let screenScale: [number, number, number] = [0.5, 0.5, 0.5];
    let screenPosition = new THREE.Vector3(-2.0, -1.6, 0.49);
    const rotation = new THREE.Euler(0, 1.25, 0);

    if (window.innerWidth < 768) {
      screenScale = [0.4, 0.4, 0.4];
      screenPosition = new THREE.Vector3(0, 0, 0);
    }

    return [screenScale, screenPosition, rotation];
  };

  type FlagScreenAdjustment = [
    [number, number, number],
    THREE.Vector3[],
    THREE.Euler
  ];

  const adjustFlagForScreenSize = (): FlagScreenAdjustment => {
    let screenScale: [number, number, number] = [0.15, 0.15, 0.15];
    let screenPosition = [
      new THREE.Vector3(-3.0, -1.65, 0),
      new THREE.Vector3(-1.75, -1.39, 0),
      new THREE.Vector3(1.5, -1.3, 0),
      new THREE.Vector3(3.0, -1.55, 0),
    ];
    const rotation = new THREE.Euler(0.25, 0, 0);

    if (window.innerWidth < 768) {
      screenScale = [0.15, 0.15, 0.15];
      screenPosition = [
        new THREE.Vector3(-1.5, -1.3, -1.3),
        new THREE.Vector3(-0.5, -1.12, -1.3),
        new THREE.Vector3(1.0, -1.12, -1.3),
        new THREE.Vector3(2.0, -1.25, -1.3),
      ];
    }

    return [screenScale, screenPosition, rotation];
  };

  const [islandScale, islandPosition, islandRotation] =
    adjustIslandForScreenSize();
  const [dragonScale, dragonPosition, dragonRotation] =
    adjustDragonForScreenSize();
  const [ciriScale, ciriPosition, ciriRotation] = adjustCiriForScreenSize();
  const [flagScale, flagPosition, flagRotation] = adjustFlagForScreenSize();

  useFrame(() => {
    if (!isSceneRotating) {
      rotationSpeed.current.x *= dampingFactor;
      rotationSpeed.current.y *= dampingFactor;

      if (Math.abs(rotationSpeed.current.x) < 0.001)
        rotationSpeed.current.x = 0;
      if (Math.abs(rotationSpeed.current.y) < 0.001)
        rotationSpeed.current.y = 0;

      if (groupRef.current) {
        groupRef.current.rotation.y += rotationSpeed.current.x;
        groupRef.current.rotation.x += rotationSpeed.current.y;
      }
    }

    if (groupRef.current) {
      groupRef.current.rotation.x = THREE.MathUtils.clamp(
        groupRef.current.rotation.x,
        -Math.PI / 3,
        Math.PI / 3
      );
    }
  });

  const handleMouseDown = useCallback(
    (event: THREE.Event) => {
      if ((event as MouseEvent).button === 1) {
        setIsSceneRotating(true);
        gl.domElement.style.cursor = "move";
        lastX.current = (event as MouseEvent).clientX;
        lastY.current = (event as MouseEvent).clientY;
      }
    },
    [gl, setIsSceneRotating]
  );

  const handleMouseUp = useCallback(() => {
    if (isSceneRotating) {
      setIsSceneRotating(false);
      gl.domElement.style.cursor = "grab";
    }
  }, [isSceneRotating, setIsSceneRotating, gl.domElement.style]);

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (isSceneRotating && groupRef.current) {
        const deltaX = (event.clientX - lastX.current) / 100;
        const deltaY = (event.clientY - lastY.current) / 100;

        groupRef.current.rotation.y += deltaX;
        groupRef.current.rotation.x = THREE.MathUtils.clamp(
          groupRef.current.rotation.x + deltaY,
          -Math.PI / 3,
          Math.PI / 3
        );

        lastX.current = event.clientX;
        lastY.current = event.clientY;
      }
    },
    [isSceneRotating]
  );

  useEffect(() => {
    const canvas = gl.domElement;
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseUp);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseUp);
    };
  }, [gl, handleMouseDown, handleMouseUp, handleMouseMove]);

  // Add touch zoom handlers
  const handleTouchStart = useCallback(
    (event: TouchEvent) => {
      if (event.touches.length === 2) {
        const dx = event.touches[0].clientX - event.touches[1].clientX;
        const dy = event.touches[0].clientY - event.touches[1].clientY;
        touchStartDistance.current = Math.sqrt(dx * dx + dy * dy);
        initialZoom.current = camera.position.z;
        event.preventDefault();
      }
    },
    [camera]
  );

  const handleTouchMove = useCallback(
    (event: TouchEvent) => {
      if (event.touches.length === 2) {
        const dx = event.touches[0].clientX - event.touches[1].clientX;
        const dy = event.touches[0].clientY - event.touches[1].clientY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const scale = touchStartDistance.current / distance;
        const newZoom = initialZoom.current * scale;
        camera.position.z = THREE.MathUtils.clamp(newZoom, minZoom, maxZoom);
        event.preventDefault();
      }
    },
    [camera, maxZoom, minZoom]
  );

  // Add wheel zoom handler
  const handleWheel = useCallback(
    (event: ThreeEvent<WheelEvent>) => {
      const newZoom = camera.position.z + event.deltaY * zoomSpeed;
      camera.position.z = THREE.MathUtils.clamp(newZoom, minZoom, maxZoom);
    },
    [camera, maxZoom, minZoom, zoomSpeed]
  );

  useEffect(() => {
    const canvas = gl.domElement;
    canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
    canvas.addEventListener("wheel", handleWheel as unknown as EventListener);

    return () => {
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener(
        "wheel",
        handleWheel as unknown as EventListener
      );
    };
  }, [gl, handleTouchStart, handleTouchMove, handleWheel]);

  return (
    <group ref={groupRef} onWheel={handleWheel}>
      <Sky isDay={themeMode === "light"} />
      <Book
        position={islandPosition}
        scale={islandScale}
        rotation={islandRotation}
      />
      <Flag
        position={flagPosition[0]}
        scale={flagScale}
        rotation={flagRotation}
      />
      <Flag
        position={flagPosition[1]}
        scale={flagScale}
        rotation={flagRotation}
      />
      <Flag
        position={flagPosition[2]}
        scale={flagScale}
        rotation={flagRotation}
      />
      <Flag
        position={flagPosition[3]}
        scale={flagScale}
        rotation={flagRotation}
      />
      <Dragon
        position={dragonPosition}
        scale={dragonScale}
        rotation={dragonRotation}
      />
      <Ciri
        position={ciriPosition}
        scale={ciriScale}
        rotation={ciriRotation}
        isRotating={isRotating}
        setIsRotating={setIsRotating}
        setCurrentStage={setCurrentStage}
        isSceneRotating={isSceneRotating}
      />
    </group>
  );
};

const MemoizedSceneContent = memo(SceneContent);

export default Home;
