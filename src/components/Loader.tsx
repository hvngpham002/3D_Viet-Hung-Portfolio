/* eslint-disable @typescript-eslint/naming-convention */
import { useState, useEffect } from "react";
import { useProgress } from "@react-three/drei";
import LanguageToggle from "./LanguageToggle";
import { useTranslation } from "react-i18next";
import { reloadTranslations } from "../i18n";
import React from "react";

interface LoaderProps {
  onStarted?: () => void;
}

const Loader = ({ onStarted }: LoaderProps) => {
  const { progress, total, loaded, active } = useProgress();
  const [canStart, setCanStart] = useState(false);
  const [displayProgress, setDisplayProgress] = useState(0);
  const [isTranslationsLoading, setIsTranslationsLoading] = useState(true);
  const { t } = useTranslation();

  // Update displayProgress, but never let it go backwards
  useEffect(() => {
    if (progress > displayProgress) {
      setDisplayProgress(progress);
    }
  }, [progress, displayProgress]);

  useEffect(() => {
    reloadTranslations().finally(() => setIsTranslationsLoading(false));
  }, []);

  // Only allow starting when everything is loaded
  const isComplete = !active && loaded === total && displayProgress === 100;

  // Once we reach 100%, allow the start button to be shown
  useEffect(() => {
    if (isComplete && !canStart) {
      setCanStart(true);
    }
  }, [isComplete, canStart]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-800">
      {/* Language Toggle - Positioned in top-right corner */}
      <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
        <LanguageToggle />
      </div>

      {/* Introductory Text */}
      <div className="min-w-[300px] md:min-w-[48rem] max-w-3xl text-center mb-5 sm:mb-6 px-3">
        {isTranslationsLoading ? (
          <React.Fragment>
            <div className="loading-bar sm:h-16 h-12 w-full min-w-[300px] rounded-md bg-gray-500 dark:bg-gray-700 mb-3 sm:mb-4" />
            <div className="loading-bar sm:h-10 h-8 w-full min-w-[300px] rounded-md bg-gray-500 dark:bg-gray-700" />
          </React.Fragment>
        ) : (
          <React.Fragment>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 text-blue-400">
              {t("Welcome to My Journey")}
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 leading-relaxed">
              {t(
                "Explore an interactive timeline of my professional development through an immersive 3D experience."
              )}
            </p>
          </React.Fragment>
        )}
      </div>

      {/* Controls Guide */}
      <div className="max-w-md text-sm sm:text-base md:text-lg bg-gray-900 p-4 sm:p-5 rounded-lg mb-6 sm:mb-8">
        {isTranslationsLoading ? (
          <div className="loading-bar sm:h-10 h-8 w-auto rounded-md mb-3 bg-gray-500 dark:bg-gray-700" />
        ) : (
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-3 text-blue-400">
            {t("Quick Guide")}
          </h2>
        )}
        <ul className="space-y-2 text-gray-300">
          {isTranslationsLoading ? (
            <>
              <li className="flex items-center gap-2">
                <span className="inline-block min-w-[5rem] sm:min-w-[7rem]">
                  <div className="loading-bar sm:h-8 h-6 w-full rounded-md bg-gray-500 dark:bg-gray-700" />
                </span>
                <span className="sm:min-w-[275px] min-w-[225px] flex-1">
                  <div className="loading-bar sm:h-8 h-6 w-full rounded-md bg-gray-500 dark:bg-gray-700" />
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="inline-block min-w-[5rem] sm:min-w-[7rem]">
                  <div className="loading-bar sm:h-8 h-6 w-full rounded-md bg-gray-500 dark:bg-gray-700" />
                </span>
                <span className="sm:min-w-[275px] min-w-[225px] flex-1">
                  <div className="loading-bar sm:h-8 h-6 w-full rounded-md bg-gray-500 dark:bg-gray-700" />
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="inline-block min-w-[5rem] sm:min-w-[7rem]">
                  <div className="loading-bar sm:h-8 h-6 w-full rounded-md bg-gray-500 dark:bg-gray-700" />
                </span>
                <span className="sm:min-w-[275px] min-w-[225px] flex-1">
                  <div className="loading-bar sm:h-8 h-6 w-full rounded-md bg-gray-500 dark:bg-gray-700" />
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="inline-block min-w-[5rem] sm:min-w-[7rem]">
                  <div className="loading-bar sm:h-8 h-6 w-full rounded-md bg-gray-500 dark:bg-gray-700" />
                </span>
                <span className="sm:min-w-[275px] min-w-[225px] flex-1">
                  <div className="loading-bar sm:h-8 h-6 w-full rounded-md bg-gray-500 dark:bg-gray-700" />
                </span>
              </li>
            </>
          ) : (
            <>
              <li className="flex items-center">
                <span className="inline-block w-24 sm:w-28 font-medium">
                  {t("Movement")}:
                </span>
                <span>{t("Left/Right Arrows or Left Mouse")}</span>
              </li>
              <li className="flex items-center">
                <span className="inline-block w-24 sm:w-28 font-medium">
                  {t("Rotation")}:
                </span>
                <span>{t("Middle Mouse Button + Drag")}</span>
              </li>
              <li className="flex items-center">
                <span className="inline-block w-24 sm:w-28 font-medium">
                  {t("Animations")}:
                </span>
                <span>{t("Press Q, W, E, or R")}</span>
              </li>
              <li className="flex items-center">
                <span className="inline-block w-24 sm:w-28 font-medium">
                  {t("Zoom")}:
                </span>
                <span>{t("Mouse Wheel")}</span>
              </li>
            </>
          )}
        </ul>
      </div>

      {/* Interactive Loader/Button */}
      <button
        onClick={() => canStart && onStarted?.()}
        className={`relative group ${
          canStart
            ? "cursor-pointer hover:scale-105 transition-transform"
            : "cursor-default"
        }`}
        disabled={!canStart}
        aria-label={
          canStart ? t("Click to start experience") : t("Loading models")
        }
      >
        <div className={`custom-spinner ${canStart ? "completed" : ""}`} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <span className="text-base sm:text-lg md:text-xl font-bold text-white">
            {Math.round(displayProgress)}%
          </span>
        </div>
        {canStart ? (
          <div className="absolute -bottom-7 sm:-bottom-8 left-1/2 transform -translate-x-1/2 text-center w-40">
            <span className="text-sm sm:text-base md:text-lg text-blue-400 animate-bounce">
              {t("Click to Start")}
            </span>
          </div>
        ) : (
          <div className="absolute -bottom-7 sm:-bottom-8 left-1/2 transform -translate-x-1/2 text-center w-40">
            {isTranslationsLoading ? (
              <div className="loading-bar h-4 sm:h-6 w-auto rounded-md bg-gray-500 dark:bg-gray-700" />
            ) : (
              <span className="text-sm sm:text-base md:text-lg text-gray-400">
                {t("Loading assets...")}
              </span>
            )}
          </div>
        )}
      </button>

      {/* Loading Details (only shown during active loading) */}
      {active && (
        <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 text-sm sm:text-base text-gray-400">
          {isTranslationsLoading ? (
            <div className="loading-bar h-4 sm:h-6 min-w-[180px] rounded-md  bg-gray-500 dark:bg-gray-700" />
          ) : (
            <React.Fragment>
              {t("Loaded")} {loaded} {t("of")} {total} {t("assets")}
            </React.Fragment>
          )}
        </div>
      )}

      {/* Version Mark */}
      <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 text-xs sm:text-sm text-gray-500">
        v1.0.1
      </div>
    </div>
  );
};

export default Loader;
