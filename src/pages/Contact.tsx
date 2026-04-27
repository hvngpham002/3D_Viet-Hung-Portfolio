/* eslint-disable @typescript-eslint/naming-convention */
import React, { Suspense, useRef, useState, useEffect, lazy } from "react";
import emailjs, { EmailJSResponseStatus } from "@emailjs/browser";
import { useTranslation } from "react-i18next";
import { Canvas } from "@react-three/fiber";
import { reloadTranslations } from "../i18n";

const Sif = lazy(() =>
  import("../models/Sif").then((module) => ({ default: module.default }))
);
const Bonfire = lazy(() =>
  import("../models/Bonfire").then((module) => ({ default: module.default }))
);

import {
  ContactShadows,
  Environment,
  AccumulativeShadows,
  RandomizedLight,
  SpotLight,
  Html,
} from "@react-three/drei";
import * as THREE from "three";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import useAlert from "../hooks/useAlert";
import Alert from "../components/Alert";

const emailJsPublicKey = import.meta.env.VITE_APP_EMAILJS_PUBLIC_KEY;

// Initialize EmailJS with your public key
emailjs.init({
  publicKey: emailJsPublicKey,
});

const getEmailJsErrorMessage = (error: unknown) => {
  if (error instanceof EmailJSResponseStatus) {
    return error.text || `EmailJS request failed with status ${error.status}`;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "text" in error &&
    typeof error.text === "string"
  ) {
    return error.text;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An error occurred";
};

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

interface LightConfig {
  ambientLight: {
    intensity: number;
    color: string;
  };
  directionalLight: {
    intensity: number;
    color: string;
    position: [number, number, number];
  };
  spotLight: {
    intensity: number;
    color: string;
    position: [number, number, number];
  };
  shadows: {
    contactOpacity: number;
    accumulativeOpacity: number;
    color: string;
  };
  environment: "dawn" | "night" | "sunset" | "warehouse" | "city" | "apartment" | "studio" | "park" | "lobby" | "forest";
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
      if (width < 545) {
        // iPhone SE and similar
        setYPosition({ sif: 0.0, bonfire: 0.0 });
      } else {
        setYPosition({ sif: -2.0, bonfire: -3.5 });
      }
    };

    handleResize(); // Initial call
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const lightSettings: { light: LightConfig; dark: LightConfig } = {
    light: {
      ambientLight: {
        intensity: 0.3,
        color: "#fff5e6",
      },
      directionalLight: {
        intensity: 0.8,
        color: "#ffe4b3",
        position: [5, 5, 5],
      },
      spotLight: {
        intensity: 1.0,
        color: "#ffa726",
        position: [3.0, 2.0, -10.0],
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
        position: [5, 5, 5],
      },
      spotLight: {
        intensity: 2.2,
        color: "#ffa041",
        position: [3.0, 2.0, -10.0],
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
      <Environment preset={currentLightConfig.environment} />

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

  const [isTranslationsLoading, setIsTranslationsLoading] = useState(true);

  useEffect(() => {
    reloadTranslations().finally(() => setIsTranslationsLoading(false));
  }, []);

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
  const translatedSendingLabel = t("contact_sending");
  const sendingLabel =
    translatedSendingLabel === "contact_sending"
      ? `${t("contact_send_message")}...`
      : translatedSendingLabel;

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
        },
        {
          publicKey: emailJsPublicKey,
        }
      );

      setForm({ name: "", email: "", message: "" });
      showAlert({ text: "Message sent successfully!", type: "success" });
      setCurrentAnimation("attack");

      setTimeout(() => {
        hideAlert();
        setCurrentAnimation("idle");
      }, 2500);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("[Contact] EmailJS send failed:", error);
      setCurrentAnimation("idle");
      showAlert({
        text: getEmailJsErrorMessage(error),
        type: "danger",
      });

      setTimeout(() => {
        hideAlert();
      }, 2500);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const updateCanvasHeight = () => {
      const width = window.innerWidth;
      if (width >= 1024 && formRef.current && canvasContainerRef.current) {
        // Desktop
        if (isTranslationsLoading) {
          // When loading, calculate height based on loading bars
          const loadingBars = formRef.current.querySelectorAll(".loading-bar");
          let totalHeight = 0;
          loadingBars.forEach((bar) => {
            totalHeight += (bar as HTMLElement).offsetHeight;
          });
          canvasContainerRef.current.style.height = `${totalHeight + 200}px`;
        } else {
          // Existing logic for loaded state
          const h1 = formRef.current.previousElementSibling as HTMLElement;
          const form = formRef.current;
          const button = formRef.current.querySelector("button") as HTMLElement;

          if (h1 && form && button) {
            const totalHeight =
              h1.offsetHeight + form.offsetHeight + button.offsetHeight;
            canvasContainerRef.current.style.height = `${totalHeight + 30}px`;
          }
        }
      } else if (canvasContainerRef.current && formRef.current) {
        // Mobile
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
  }, [isTranslationsLoading]);

  return (
    <>
      <section className="relative mx-auto flex min-h-[calc(100svh-64px)] w-full max-w-6xl flex-col px-6 pb-10 pt-28 sm:px-8 lg:px-10">
        {alert.show && <Alert {...alert} />}

        <div className="card-paper grid min-h-[680px] grid-cols-1 overflow-hidden lg:grid-cols-2">
          <div className="flex flex-col p-6 sm:p-8 lg:border-r lg:border-rule-strong lg:p-12">
            {isTranslationsLoading ? (
              <div className="space-y-4">
                <div className="loading-bar h-4 w-32" />
                <div className="loading-bar h-14 w-full max-w-md" />
                <div className="loading-bar h-8 w-full max-w-sm" />
              </div>
            ) : (
              <div>
                <p className="t-eyebrow">Chapter IV</p>
                <h1 className="t-display mt-3 text-[clamp(2.75rem,7vw,4.5rem)] text-ink-900">
                  {t("contact_title")}
                </h1>
                <p className="t-display-italic mt-4 max-w-md text-lg leading-relaxed text-ink-700">
                  Sif is on watch. The bonfire is lit. I read everything.
                </p>
              </div>
            )}

            <form
              ref={formRef}
              className="mt-10 grid w-full gap-7"
              onSubmit={handleSubmit}
            >
              {isTranslationsLoading ? (
                <React.Fragment>
                  <div className="loading-bar h-16 w-full" />
                  <div className="loading-bar h-16 w-full" />
                  <div className="loading-bar h-40 w-full" />
                  <div className="loading-bar h-11 w-full max-w-52" />
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <label className="block">
                    <span className="t-eyebrow block">
                      {t("contact_name")}
                    </span>
                    <input
                      type="text"
                      name="name"
                      className="input-ms mt-2"
                      placeholder="Sir Astorias, The Abysswalker"
                      required
                      value={form.name}
                      onChange={handleChange}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    />
                  </label>

                  <label className="block">
                    <span className="t-eyebrow block">
                      {t("contact_email")}
                    </span>
                    <input
                      type="email"
                      name="email"
                      className="input-ms mt-2"
                      placeholder="sif@gmail.com"
                      required
                      value={form.email}
                      onChange={handleChange}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    />
                  </label>

                  <label className="block">
                    <span className="t-eyebrow block">
                      {t("contact_message")}
                    </span>
                    <textarea
                      name="message"
                      rows={5}
                      className="input-ms mt-2 min-h-[160px] resize-y"
                      placeholder={t("contact_message_placeholder")}
                      required
                      value={form.message}
                      onChange={handleChange}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                    />
                  </label>

                  <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
                    <span className="t-mono text-[11px] uppercase text-ink-500">
                      ENC. EMAILJS - OWL POST
                    </span>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`btn-ink w-full sm:w-auto ${
                        isLoading ? "pointer-events-none opacity-60" : ""
                      }`}
                    >
                      {isLoading ? sendingLabel : t("contact_send_message")}
                    </button>
                  </div>
                </React.Fragment>
              )}
            </form>
          </div>

          <div
            ref={canvasContainerRef}
            className="relative min-h-[380px] w-full overflow-hidden bg-paper-2 lg:min-h-[540px]"
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
                premultipliedAlpha: false,
                powerPreference: "high-performance",
                stencil: false,
                depth: true,
              }}
              className="h-full w-full"
            >
              <Suspense
                fallback={
                  <Html center>
                    <div className="custom-spinner mt-20" />
                  </Html>
                }
              >
                <Scene currentAnimation={currentAnimation} />
              </Suspense>
            </Canvas>

            <div
              className="pointer-events-none absolute bottom-5 left-5 max-w-[calc(100%-2.5rem)] border border-rule-strong px-4 py-3 shadow-card backdrop-blur-sm"
              style={{
                background:
                  "color-mix(in srgb, var(--paper-0) 80%, transparent)",
              }}
            >
              <p className="t-eyebrow mb-1">Now playing</p>
              <p className="t-display-italic text-base text-ink-900">
                Sif waits by the bonfire...
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="t-eyebrow pb-6 text-center text-ink-300">
        © 2025 Viet Hung Pham. All rights reserved.
      </footer>
    </>
  );
};

export default Contact;
