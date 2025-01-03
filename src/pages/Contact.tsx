/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/naming-convention */
import React, { Suspense, useEffect, useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import { useTranslation } from 'react-i18next';
import { Canvas } from '@react-three/fiber';
import Sif from '../models/Sif';
import Bonfire from '../models/Bonfire';
import { ContactShadows, Environment, AccumulativeShadows, RandomizedLight, SpotLight } from '@react-three/drei';
import * as THREE from 'three';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import useAlert from '../hooks/useAlert';
import Alert from '../components/Alert';

// Initialize EmailJS with your public key
emailjs.init(import.meta.env.VITE_APP_EMAILJS_PUBLIC_KEY);

interface FormData {
  name: string;
  email: string;
  message: string;
}
declare global {
  interface ImportMetaEnv {
    readonly VITE_APP_EMAILJS_SERVICE_ID: string;
    readonly VITE_APP_EMAILJS_TEMPLATE_ID: string;
    readonly VITE_APP_EMAILJS_PUBLIC_KEY: string;
  }
}


const Scene = ({ currentAnimation }) => {

  const themeMode = useSelector((state: RootState) => state.theme.mode);
  
  const lightSettings = {
    light: {
      ambientLight: {
        intensity: 0.3,
        color: "#fff5e6"
      },
      directionalLight: {
        intensity: 0.8,
        color: "#ffe4b3",
        position: [5, 5, 5] as [number, number, number]
      },
      spotLight: {
        intensity: 1.0,
        color: "#ffa726",
        position: [3.0, 2.0, -10.0] as [number, number, number]
      },
      shadows: {
        contactOpacity: 0.25,
        accumulativeOpacity: 0.35,
        color: "#3a3a3a"
      },
      environment: "dawn"
    },
    dark: {
      ambientLight: {
        intensity: 0.25,
        color: "#f4efde"
      },
      directionalLight: {
        intensity: 1.5,
        color: "#e2c96e",
        position: [5, 5, 5] as [number, number, number]
      },
      spotLight: {
        intensity: 2.2,
        color: "#ffa041",
        position: [3.0, 2.0, -10.0] as [number, number, number]
      },
      shadows: {
        contactOpacity: 0.4,
        accumulativeOpacity: 0.7,
        color: "#000000"
      },
      environment: "night"
    }
  };

  const currentLightConfig = themeMode === 'light' ? lightSettings.light : lightSettings.dark;

  return (
    <React.Fragment>
      {/* Environment and ambient lighting */}
      <Environment preset={currentLightConfig.environment as any} />
      
      <ambientLight 
        intensity={currentLightConfig.ambientLight.intensity} 
        color={currentLightConfig.ambientLight.color}
      />

      {/* Main directional light */}
      <directionalLight 
        intensity={currentLightConfig.directionalLight.intensity}
        position={currentLightConfig.directionalLight.position} 
        color={currentLightConfig.directionalLight.color}
        castShadow 
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />

      {/* Bonfire spot light */}
      <SpotLight
        position={currentLightConfig.spotLight.position}
        intensity={currentLightConfig.spotLight.intensity}
        angle={0.6}
        penumbra={0.5}
        attenuation={5}
        color={currentLightConfig.spotLight.color}
        castShadow
      />

      {/* Contact shadows for better grounding */}
      <ContactShadows
        opacity={currentLightConfig.shadows.contactOpacity}
        scale={10}
        blur={1}
        far={10}
        resolution={256}
        color={currentLightConfig.shadows.color}
      />

      {/* Accumulative shadows for more realistic lighting */}
      <AccumulativeShadows
        temporal
        frames={100}
        color={currentLightConfig.shadows.color}
        colorBlend={0.5}
        toneMapped={true}
        alphaTest={0.8}
        opacity={currentLightConfig.shadows.accumulativeOpacity}
        scale={12}
      >
        <RandomizedLight
          amount={8}
          radius={4}
          ambient={0.5}
          intensity={1}
          position={[3.0, 2.0, -10.0]}
          bias={0.001}
        />
      </AccumulativeShadows>

      {/* Models */}
      <Bonfire 
        position={[3.0, -3.0, -10.0]} 
        rotation={[0, -0.5, 0]} 
        scale={[1, 1, 1]}
        castShadow
        receiveShadow
      />
      <Sif 
        position={[-0.6, -2.0, 0]} 
        rotation={[0, -0.4, 0]} 
        scale={[1.85, 1.85, 1.85]} 
        currentAnimation={currentAnimation}
        castShadow
        receiveShadow
      />
    </React.Fragment>
  );
};

const Contact = () => {
  const { t } = useTranslation();
  const [form, setForm] = useState<FormData>({ name: '', email: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [currentAnimation, setCurrentAnimation] = useState('idle');

  const { alert, showAlert, hideAlert } = useAlert();

  const formRef = useRef<HTMLFormElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFocus = () => {
    setCurrentAnimation('walking');
  }

  const handleBlur = () => {
    setCurrentAnimation('idle');
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setCurrentAnimation("running");

    try {
      await emailjs.send(
        import.meta.env.VITE_APP_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_APP_EMAILJS_TEMPLATE_ID,
        {
          from_name: form.name,
          to_name: "Viet Hung Pham",
          from_email: form.email,
          to_email: "hung.v.pham002@gmail.com",
          message: form.message,
        }
      );

      setForm({ name: '', email: '', message: '' });
    } catch (error) {
      setCurrentAnimation("idle");
      showAlert({ text: error, type: 'danger'})

      setTimeout(() => {
        hideAlert();
      }, 2500)

    } finally {
      showAlert({text: "Message sent successfully!", type: 'success'})
      setCurrentAnimation("attack");
      setIsLoading(false);

      setTimeout(() => {
        hideAlert();
        setCurrentAnimation('idle')
        setForm({ name: '', email: '', message: ''});
      }, 2500)
    }
  };

  const canvasContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const updateCanvasHeight = () => {
      if (formRef.current && canvasContainerRef.current) {
        const h1 = formRef.current.previousElementSibling as HTMLElement;
        const form = formRef.current;
        const button = formRef.current.querySelector('button') as HTMLElement;
        
        if (h1 && form && button) {
          const totalHeight = h1.offsetHeight + form.offsetHeight + button.offsetHeight;
          canvasContainerRef.current.style.height = `${totalHeight}px`;
        }
      }
    };
   
    updateCanvasHeight();
    window.addEventListener('resize', updateCanvasHeight);
    return () => window.removeEventListener('resize', updateCanvasHeight);
   }, []);

  return (
    <section className="relative flex lg:flex-row flex-col max-container h-screen">

      {alert.show && <Alert {...alert} />}

      <div className="flex-1 min-w-[50%] flex flex-col h-full overflow-y-auto">
        <h1 className="text-2xl font-semibold dark:text-white">
          {t('Want To Work With Me')}?
        </h1>
        <form 
          ref={formRef}
          className="w-full flex flex-col gap-7 mt-14" 
          onSubmit={handleSubmit}
        >
          <label className="text-black-500 font-semibold dark:text-white">
            {t('Name')}:
            <input 
              type="text" 
              name="name" 
              className="input dark:bg-gray-800 dark:text-white" 
              placeholder={t('Sir Astorias, The Abysswalker')}
              required 
              value={form.name}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </label>
          <label className="text-black-500 font-semibold dark:text-white">
            {t('Email')}:
            <input 
              type="email" 
              name="email" 
              className="input dark:bg-gray-800 dark:text-white" 
              placeholder={t('sif@gmail.com')}
              required 
              value={form.email}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </label>
          <label className="text-black-500 font-semibold dark:text-white">
            {t('Message')}:
            <textarea 
              name="message" 
              rows={4} 
              className="textarea dark:bg-gray-800 dark:text-white" 
              placeholder={t('Let me know how I can be of service!')}
              required
              value={form.message}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </label>

          <button
            type="submit"
            disabled={isLoading}
            className={`btn ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? t('Sending...') : t('Send Message')}
          </button>
        </form>
      </div>
      <div ref={canvasContainerRef} className="lg:w-1/2 w-full lg:h-full border border-white" >
      <Canvas 
          shadows
          dpr={[1, 2]}
          camera={{ 
            position: [0, 0, 5], 
            fov: 75, 
            near: 0.1, 
            far: 1000 
          }}
          gl={{
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            outputColorSpace: THREE.SRGBColorSpace
          }}
        >
            <Suspense fallback={null}>
              <Scene currentAnimation={currentAnimation} />
            </Suspense>
          </Canvas>
      </div>
    </section>
  );
};

export default Contact;