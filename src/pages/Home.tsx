/* eslint-disable @typescript-eslint/naming-convention */
import React, { Suspense } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { Canvas } from '@react-three/fiber';
import Loader from '../components/Loader';
import Sky from '../models/Sky';
import Book from '../models/Book';

const Home = () => {

  const themeMode = useSelector((state: RootState) => state.theme.mode);

  const lightingConfig = themeMode === 'light'
  ? {
    directionalLight: {
      position: [0, 10, 0] as [number, number, number],
       intensity: 2.0,
       color: "#ffffff",
    },
    ambientLight: {
      intensity: 2.0,
      color: "#c6fff5",
    },
    hemisphereLight: {
      color: "#fafbd5", 
      groundColor: "#696152",
      intensity: 1.0,
    }
  } : {
    directionalLight: {
      position: [0, 10, 0] as [number, number, number],
      intensity: 1.5,  // Brighter light to simulate full moon
      color: "#e0eaff",  // Soft, cool light (moonlight with a hint of blue)
    },
    ambientLight: {
      intensity: 0.8,  // Higher ambient light to keep the scene visible
      color: "#c8f2ff",  // A brighter, cool-toned light with a slight hint of magical blue
    },
    hemisphereLight: {
      color: "#b8c6f3",  // Soft, pale blue for the sky, creating an ethereal look
      groundColor: "#a1b3d8",  // Soft, light gray for the ground to complement the sky
      intensity: 0.8,  // Bright intensity for a full moon feel
    }
  }


  const adjustIslandForScreenSize = (): [number[], number[], number[]] => {
    let screenScale: number[] = [0.1, 0.1, 0.1];
    const screenPosition: number[] = [0.5, -0.65, -2.5];
    const rotation = [0.25, 0, 0];

    if (window.innerWidth < 768) {
      screenScale = [0.09, 0.09, 0.09];
    }

    return [screenScale, screenPosition, rotation];
  };

  const [islandScale, islandPosition, islandRotation] = adjustIslandForScreenSize();

  return (
    <div>
      <section className="w-full h-screen relative">
        <div className="absolute top-28 left-0 right-0 z-10 flex items-center justify-center">
          POPUP
        </div>
        
        <Canvas shadows className="w-full h-screen bg-transparent" camera={{ near: 0.1, far: 1000 }}>
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
            castShadow />
            <ambientLight color={lightingConfig.ambientLight.color} intensity={lightingConfig.ambientLight.intensity} />
            <hemisphereLight color={lightingConfig.hemisphereLight.color} groundColor={lightingConfig.hemisphereLight.groundColor} intensity={lightingConfig.hemisphereLight.intensity} />

            <Sky isDay={themeMode === 'light'} />
            <Book position={islandPosition} scale={islandScale} rotation={islandRotation} />

          </Suspense>
        </Canvas>
      </section>
    </div>
  );
};

export default Home;
