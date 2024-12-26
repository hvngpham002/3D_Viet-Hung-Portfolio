import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import Loader from '../components/Loader';
import Island from '../models/Island';

const Home = () => {
  const adjustIslandForScreenSize = (): [number[], number[], number[]] => {
    let screenScale: number[] = [1, 1, 1];
    let screenPosition: number[] = [0, -5, -18];
    let rotation = [0, 0, 0];

    if (window.innerWidth < 768) {
      screenScale = [0.9, 0.9, 0.9];
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
        <Canvas className="w-full h-screen bg-transparent" camera={{ near: 0.1, far: 1000 }}>
          <Suspense fallback={<Loader />}>
            <directionalLight position={[5, 10, 5]} intensity={1.5} castShadow />
            <ambientLight intensity={0.4} />
            <pointLight position={[2, 5, 5]} intensity={1} />
            <spotLight position={[-5, 10, 5]} angle={0.3} penumbra={1} intensity={1} castShadow />
            <hemisphereLight color="#b1e1ff" groundColor="#000000" intensity={0.6} />
            <Island position={islandPosition} scale={islandScale} rotation={islandRotation} />
          </Suspense>
        </Canvas>
      </section>
    </div>
  );
};

export default Home;
