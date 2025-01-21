/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/naming-convention */
import React, { Suspense, useRef, useState, useEffect } from "react";
import emailjs from "@emailjs/browser";
import { useTranslation } from "react-i18next";
import { Canvas } from "@react-three/fiber";
import Sif from "../models/Sif";
import Bonfire from "../models/Bonfire";
import {
  ContactShadows,
  Environment,
  AccumulativeShadows,
  RandomizedLight,
  SpotLight,
} from "@react-three/drei";
import * as THREE from "three";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import useAlert from "../hooks/useAlert";
import Alert from "../components/Alert";

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

type SceneProps = {
  currentAnimation: "idle" | "walking" | "running" | "attack";
};

const Scene = ({ currentAnimation }: SceneProps) => {
  const themeMode = useSelector((state: RootState) => state.theme.mode);

  // Get window width for responsive scaling
  const [yPosition, setYPosition] = useState({ sif: -2.0, bonfire: -3.5 });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 545) { // iPhone SE and similar
        setYPosition({ sif: 0.0, bonfire: 0.0});
      } else {
        setYPosition({ sif: -2.0, bonfire: -3.5 });
      }
    };

    handleResize(); // Initial call
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const lightSettings = {
    light: {
      ambientLight: {
        intensity: 0.3,
        color: "#fff5e6",
      },
      directionalLight: {
        intensity: 0.8,
        color: "#ffe4b3",
        position: [5, 5, 5] as [number, number, number],
      },
      spotLight: {
        intensity: 1.0,
        color: "#ffa726",
        position: [3.0, 2.0, -10.0] as [number, number, number],
      },
      shadows: {
        contactOpacity: 0.25,
        accumulativeOpacity: 0.35,
        color: "#3a3a3a",
      },
      environment: "dawn",
    },
    dark: {
      ambientLight: {
        intensity: 0.25,
        color: "#f4efde",
      },
      directionalLight: {
        intensity: 1.5,
        color: "#e2c96e",
        position: [5, 5, 5] as [number, number, number],
      },
      spotLight: {
        intensity: 2.2,
        color: "#ffa041",
        position: [3.0, 2.0, -10.0] as [number, number, number],
      },
      shadows: {
        contactOpacity: 0.4,
        accumulativeOpacity: 0.7,
        color: "#000000",
      },
      environment: "night",
    },
  };

  const currentLightConfig =
    themeMode === "light" ? lightSettings.light : lightSettings.dark;

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
        position={[2.5, yPosition.bonfire, -10.0]}
        rotation={[0, -0.5, 0]}
        scale={[1.88 * 0.64, 1.88 * 0.64, 1.88 * 0.64]}
        castShadow
        receiveShadow
      />
      <Sif
        position={[-0.8, yPosition.sif, 0]}
        rotation={[0, -0.4, 0]}
        scale={[1.88, 1.88, 1.88]}
        currentAnimation={currentAnimation}
        castShadow
        receiveShadow
      />
    </React.Fragment>
  );
};

const Contact = () => {
  const { t } = useTranslation();
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [currentAnimation, setCurrentAnimation] = useState<
    "idle" | "walking" | "running" | "attack"
  >("idle");

  const { alert, showAlert, hideAlert } = useAlert();

  const formRef = useRef<HTMLFormElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFocus = () => {
    setCurrentAnimation("walking");
  };

  const handleBlur = () => {
    setCurrentAnimation("idle");
  };

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

      setForm({ name: "", email: "", message: "" });
    } catch (error) {
      setCurrentAnimation("idle");
      showAlert({ text: error instanceof Error ? error.message : "An error occurred", type: "danger" });

      setTimeout(() => {
        hideAlert();
      }, 2500);
    } finally {
      showAlert({ text: "Message sent successfully!", type: "success" });
      setCurrentAnimation("attack");
      setIsLoading(false);

      setTimeout(() => {
        hideAlert();
        setCurrentAnimation("idle");
        setForm({ name: "", email: "", message: "" });
      }, 2500);
    }
  };

  useEffect(() => {
    const updateCanvasHeight = () => {
      const width = window.innerWidth;
      if (width >= 1024 && formRef.current && canvasContainerRef.current) { // Desktop
        const h1 = formRef.current.previousElementSibling as HTMLElement;
        const form = formRef.current;
        const button = formRef.current.querySelector("button") as HTMLElement;

        if (h1 && form && button) {
          const totalHeight =
            h1.offsetHeight + form.offsetHeight + button.offsetHeight;
          canvasContainerRef.current.style.height = `${totalHeight + 30}px`;
        }
      } else if (canvasContainerRef.current && formRef.current) { // Mobile
        const formContainer = formRef.current.parentElement as HTMLElement;
        if (formContainer) {
          const formHeight = formContainer.offsetHeight;
          const viewportHeight = window.innerHeight;
          const canvasHeight = viewportHeight - formHeight;
          canvasContainerRef.current.style.height = `${canvasHeight}px`;
        }
      }
    };

    // Call on mount and add listeners for changes
    updateCanvasHeight();
    window.addEventListener("resize", updateCanvasHeight);
    // Also update on content changes that might affect height
    const resizeObserver = new ResizeObserver(updateCanvasHeight);
    if (formRef.current) {
      resizeObserver.observe(formRef.current);
    }

    return () => {
      window.removeEventListener("resize", updateCanvasHeight);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <section className="relative flex lg:flex-row flex-col max-container h-[100svh] overflow-hidden">
      {alert.show && <Alert {...alert} />}

      <div className="flex-1 min-w-[50%] flex flex-col px-3 lg:px-4 py-1 lg:py-4 lg:h-auto">
        <h1 className="text-2xl font-semibold dark:text-white mb-1 lg:mb-0">
          {t("Want To Work With Me")}?
        </h1>
        <form
          ref={formRef}
          className="w-full flex flex-col gap-1.5 lg:gap-7 mt-1 lg:mt-14"
          onSubmit={handleSubmit}
        >
          <label className="text-black-500 font-semibold dark:text-white">
            {t("Name")}:
            <input
              type="text"
              name="name"
              className="input h-8 lg:h-auto dark:bg-gray-800 dark:text-white py-0.5 lg:py-2 mt-1"
              placeholder={t("Sir Astorias, The Abysswalker")}
              required
              value={form.name}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </label>
          <label className="text-black-500 font-semibold dark:text-white">
            {t("Email")}:
            <input
              type="email"
              name="email"
              className="input h-8 lg:h-auto dark:bg-gray-800 dark:text-white py-0.5 lg:py-2 mt-1"
              placeholder={t("sif@gmail.com")}
              required
              value={form.email}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </label>
          <label className="text-black-500 font-semibold dark:text-white">
            {t("Message")}:
            <textarea
              name="message"
              rows={2}
              className="textarea h-12 lg:h-auto dark:bg-gray-800 dark:text-white py-0.5 lg:py-2 mt-1"
              placeholder={t("Let me know how I can be of service!")}
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
            className={`btn text-xs lg:text-md h-8 lg:h-10 flex items-center justify-center mt-1 lg:mt-0 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? t("Sending...") : t("Send Message")}
          </button>
        </form>
      </div>
      <div
        ref={canvasContainerRef}
        className="lg:w-1/2 w-full lg:h-auto lg:border-l border-t lg:border-t-0 border-white"
      >
        <Canvas
          shadows
          dpr={[1, 2]}
          camera={{
            position: [0, 0, 5],
            fov: 75,
            near: 0.1,
            far: 1000,
          }}
          gl={{
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            outputColorSpace: THREE.SRGBColorSpace,
          }}
          className="h-full"
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
