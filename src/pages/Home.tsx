/* eslint-disable @typescript-eslint/naming-convention */
import React, { Suspense, useState, useRef, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import Loader from '../components/Loader';
import Sky from '../models/Sky';
import Book from '../models/Book';
import Dragon from '../models/Dragon';
import Ciri from '../models/Ciri';
import Flag from '../models/Flag';
import HomeInfo from '../components/HomeInfo';
import * as THREE from 'three';

const Home = () => {
  const [isRotating, setIsRotating] = useState(false);
  const [currentStage, setCurrentStage] = useState(1);
  const [isSceneRotating, setIsSceneRotating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const themeMode = useSelector((state: RootState) => state.theme.mode);

  const lightingConfig = themeMode === 'light'
    ? {
        directionalLight: {
          position: [0, 10, 0],
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
        }
      }
    : {
        directionalLight: {
          position: [0, 10, 0],
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
        }
      };

  return (
    <div>
      <section className="w-full h-screen relative">
        <div className="absolute top-28 left-0 right-0 z-10 flex items-center justify-center">
          {currentStage && <HomeInfo currentStage={currentStage} />}
        </div>

        {isLoading && (
          <Loader onStarted={() => setIsLoading(false)} />
        )}

        <Canvas 
          shadows 
          className={`w-full h-screen cursor-grab ${themeMode === 'light' ? 'bg-gray-100' : 'bg-gray-800'}`} 
          camera={{ position: [0, 0, 5], near: 0.1, far: 1000 }}
          gl={{
            antialias: window.innerHeight <= 1080,
            powerPreference: "high-performance",
            stencil: false,
            depth: true
          }}
          dpr={[1, window.innerHeight > 1080 ? 1.5 : 2]} 
          performance={{ min: 0.5 }}
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
            
            <SceneContent
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
      </section>
    </div>
  );
};

const SceneContent = ({ isRotating, setIsRotating, currentStage, setCurrentStage, themeMode, isSceneRotating, setIsSceneRotating}) => {
  const groupRef = useRef();
  const { gl, camera } = useThree();
  const lastX = useRef(0);
  const lastY = useRef(0);
  const rotationSpeed = useRef({ x: 0, y: 0 });
  const dampingFactor = 0.95;
  const zoomSpeed = 0.001;
  const minZoom = 1;
  const maxZoom = 10;

  const adjustIslandForScreenSize = () => {
    let screenScale = [0.1, 0.1, 0.1];
    const screenPosition = [0.5, -0.65, -2.5];
    const rotation = [0.25, 0, 0];

    if (window.innerWidth < 768) {
      screenScale = [0.09, 0.09, 0.09];
    }

    return [screenScale, screenPosition, rotation];
  };

  const adjustDragonForScreenSize = () => {
    let screenScale = [0.8, 0.8, 0.8];
    const screenPosition = [0, 0.4, -1];
    const rotation = [0, 1.25, 0];

    if (window.innerWidth < 768) {
      screenScale = [0.6, 0.6, 0.6];
    }

    return [screenScale, screenPosition, rotation];
  };

  const adjustCiriForScreenSize = () => {
    let screenScale = [0.5, 0.5, 0.5];
    const screenPosition = [-2.0, -1.6, 0.49];
    const rotation = [0, 1.25, 0];

    if (window.innerWidth < 768) {
      screenScale = [0.6, 0.6, 0.6];
    }

    return [screenScale, screenPosition, rotation];
  };

  const adjustFlagForScreenSize = () => {
    let screenScale = [0.15, 0.15, 0.15];
    const screenPosition = [[-3.0, -1.65, 0], [-1.75, -1.39, 0], [1.5, -1.30, 0], [3.0, -1.55, 0]];
    const rotation = [0.25, 0, 0];

    if (window.innerWidth < 768) {
      screenScale = [0.6, 0.6, 0.6];
    }

    return [screenScale, screenPosition, rotation];
  };

  const [islandScale, islandPosition, islandRotation] = adjustIslandForScreenSize();
  const [dragonScale, dragonPosition, dragonRotation] = adjustDragonForScreenSize();
  const [ciriScale, ciriPosition, ciriRotation] = adjustCiriForScreenSize();
  const [flagScale, flagPosition, flagRotation] = adjustFlagForScreenSize();

  useFrame(() => {
    if (!isSceneRotating) {
      rotationSpeed.current.x *= dampingFactor;
      rotationSpeed.current.y *= dampingFactor;

      if (Math.abs(rotationSpeed.current.x) < 0.001) rotationSpeed.current.x = 0;
      if (Math.abs(rotationSpeed.current.y) < 0.001) rotationSpeed.current.y = 0;

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

  const handleMouseDown = useCallback((event) => {
    if (event.button === 1) {
      setIsSceneRotating(true); 
      gl.domElement.style.cursor = 'move';
      lastX.current = event.clientX;
      lastY.current = event.clientY;
    }
  }, [gl, setIsSceneRotating]);
  
  const handleMouseUp = useCallback(() => {
    if (isSceneRotating) {
      setIsSceneRotating(false);
      gl.domElement.style.cursor = 'grab';
    }
  }, [isSceneRotating, setIsSceneRotating, gl.domElement.style]);
  
  const handleMouseMove = useCallback((event) => {
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
  }, [isSceneRotating]);
  
  useEffect(() => {
    const canvas = gl.domElement;
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseUp);
  
    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseUp);
    };
  }, [gl, handleMouseDown, handleMouseUp, handleMouseMove]);

  const handleWheel = (event) => {
    event.stopPropagation();
    const newZoom = camera.position.z + event.deltaY * zoomSpeed;
    camera.position.z = THREE.MathUtils.clamp(newZoom, minZoom, maxZoom);
  };

  return (
    <group
      ref={groupRef}
      onWheel={handleWheel}
    >
      <Sky isDay={themeMode === 'light'} />
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
        currentStage={currentStage}
        isSceneRotating={isSceneRotating}
      />
    </group>
  );
};

export default Home;