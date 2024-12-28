/* eslint-disable @typescript-eslint/naming-convention */
import React, { Suspense, useState} from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { Canvas } from '@react-three/fiber';
import Loader from '../components/Loader';
import Sky from '../models/Sky';
import Book from '../models/Book';
import Dragon from '../models/Dragon';
import Ciri from '../models/Ciri';

const Home = () => {
  const [isRotating, setIsRotating] = useState(false);
  const [currentStage, setCurrentStage] = useState(1);
  const [bookRotation, setBookRotation] = useState(0);
  
  const themeMode = useSelector((state: RootState) => state.theme.mode);

  const lightingConfig = themeMode === 'light'
    ? {
        directionalLight: {
          position: [0, 10, 0] as [number, number, number],
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
      } : {
        directionalLight: {
          position: [0, 10, 0] as [number, number, number],
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

  const adjustIslandForScreenSize = (): [number[], number[], number[]] => {
    let screenScale: number[] = [0.1, 0.1, 0.1];
    const screenPosition: number[] = [0.5, -0.65, -2.5];
    const rotation = [0.25, 0, 0];

    if (window.innerWidth < 768) {
      screenScale = [0.09, 0.09, 0.09];
    }

    return [screenScale, screenPosition, rotation];
  };

  const adjustDragonForScreenSize = (): [number[], number[], number[]] => {
    let screenScale: number[] = [0.8, 0.8, 0.8];
    const screenPosition: number[] = [0, 0.4, -1];
    const rotation = [0, 1.25, 0];

    if (window.innerWidth < 768) {
      screenScale = [0.6, 0.6, 0.6];
    }

    return [screenScale, screenPosition, rotation];
  };

  const adjustCiriForScreenSize = (): [number[], number[], number[]] => {
    let screenScale: number[] = [0.5, 0.5, 0.5];
    const screenPosition: number[] = [-2.0, -1.6, 0.49];
    const rotation = [0, 1.25, 0];

    if (window.innerWidth < 768) {
      screenScale = [0.6, 0.6, 0.6];
    }

    return [screenScale, screenPosition, rotation];
  };

  const [islandScale, islandPosition, islandRotation] = adjustIslandForScreenSize();
  const [dragonScale, dragonPosition, dragonRotation] = adjustDragonForScreenSize();
  const [ciriScale, ciriPosition, ciriRotation] = adjustCiriForScreenSize();

  return (
    <div>
      <section className="w-full h-screen relative">
        <div className="absolute top-28 left-0 right-0 z-10 flex items-center justify-center">
          POPUP
        </div>
        <Canvas 
          shadows 
          className={`w-full h-screen ${themeMode === 'light' ? 'bg-gray-100' : 'bg-gray-800'} ${isRotating ? 'cursor-grabbing' : 'cursor-grab'}`} 
          camera={{ near: 0.1, far: 1000 }}
          gl={{
            antialias: window.innerHeight <= 1080,
            powerPreference: "high-performance",
            stencil: false,
            depth: true
          }}
          // Add performance attributes
          dpr={[1, window.innerHeight > 1080 ? 1.5 : 2]} 
          performance={{ min: 0.5 }} 
          >
          <Suspense fallback={<Loader />}>
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
            <ambientLight color={lightingConfig.ambientLight.color} intensity={lightingConfig.ambientLight.intensity} />
            <hemisphereLight color={lightingConfig.hemisphereLight.color} groundColor={lightingConfig.hemisphereLight.groundColor} intensity={lightingConfig.hemisphereLight.intensity} />
            
            <Sky isRotating={isRotating} isDay={themeMode === 'light'} />
            <Dragon 
              position={dragonPosition} 
              scale={dragonScale} 
              rotation={dragonRotation} 
              isRotating={isRotating} 
              setIsRotating={setIsRotating}
              bookRotation={bookRotation} 
            />
            <Ciri 
              position={ciriPosition} 
              scale={ciriScale} 
              rotation={ciriRotation} 
              isRotating={isRotating} 
              setIsRotating={setIsRotating}
              bookRotation={bookRotation}
            />
            <Book 
              position={islandPosition} 
              scale={islandScale} 
              rotation={islandRotation} 
              isRotating={isRotating} 
              setIsRotating={setIsRotating} 
              setCurrentStage={setCurrentStage}
              setBookRotation={setBookRotation} 
            />
          </Suspense>
        </Canvas>
      </section>
    </div>
  );
};

export default Home;
