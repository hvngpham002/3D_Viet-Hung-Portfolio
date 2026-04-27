/* eslint-disable @typescript-eslint/naming-convention */
import { useState, useEffect } from "react";
import { useProgress } from "@react-three/drei";
import LanguageToggle from "./LanguageToggle";
import { useTranslation } from "react-i18next";
import { reloadTranslations } from "../i18n";
import React from "react";
import VersionMark from "./VersionMark";
import { APP_VERSION } from "../constants/version";

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

  const displayPercent = Math.round(displayProgress);
  const progressCircumference = 2 * Math.PI * 52;
  const progressDash = (displayProgress / 100) * progressCircumference;

  return (
    <div className="paper grain vignette fixed inset-0 z-50 flex flex-col items-center justify-center px-4">
      <div className="absolute right-3 top-3">
        <LanguageToggle />
      </div>

      <div className="mb-8 max-w-2xl text-center">
        <div className="t-eyebrow mb-3">-- Prologue --</div>
        {isTranslationsLoading ? (
          <React.Fragment>
            <div className="loading-bar mb-3 h-12 w-full rounded-sm sm:h-16" />
            <div className="loading-bar h-8 w-full rounded-sm sm:h-10" />
          </React.Fragment>
        ) : (
          <React.Fragment>
            <h1 className="mb-3 font-display text-4xl leading-none text-ink-900 sm:text-5xl md:text-6xl">
              {t("Welcome to My Journey")}
            </h1>
            <p className="font-display text-base italic leading-relaxed text-ink-700 sm:text-lg">
              {t(
                "Explore an interactive timeline of my professional development through an immersive 3D experience."
              )}
            </p>
          </React.Fragment>
        )}
      </div>

      <div className="plate mb-8 w-full max-w-md text-left">
        <div className="t-eyebrow mb-3">
          {isTranslationsLoading ? (
            <div className="loading-bar h-4 w-24 rounded-sm" />
          ) : (
            t("Quick Guide")
          )}
        </div>
        <ul className="m-0 grid list-none gap-2.5 p-0">
          {(isTranslationsLoading
            ? [
                ["", ""],
                ["", ""],
                ["", ""],
                ["", ""],
              ]
            : [
                [t("Movement"), t("Left/Right Arrows or Left Mouse")],
                [t("Rotation"), t("Middle Mouse Button + Drag")],
                [t("Animations"), t("Press Q, W, E, or R")],
                [t("Zoom"), t("Mouse Wheel")],
              ]
          ).map(([label, value], index) => (
            <li
              key={`${label}-${index}`}
              className="flex items-baseline justify-between gap-4 pb-1.5"
              style={{ borderBottom: "1px dotted var(--rule)" }}
            >
              {isTranslationsLoading ? (
                <React.Fragment>
                  <div className="loading-bar h-5 w-24 rounded-sm" />
                  <div className="loading-bar h-5 w-40 rounded-sm" />
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <span className="font-display text-base italic text-ink-900">
                    {label}
                  </span>
                  <span className="text-right font-mono text-xs text-ink-700">
                    {value}
                  </span>
                </React.Fragment>
              )}
            </li>
          ))}
        </ul>
      </div>

      <button
        type="button"
        onClick={() => canStart && onStarted?.()}
        className={`relative ${
          canStart
            ? "cursor-pointer transition-transform hover:scale-105"
            : "cursor-default"
        }`}
        disabled={!canStart}
        aria-label={
          canStart ? t("Click to start experience") : t("Loading models")
        }
      >
        <div className="relative h-[120px] w-[120px]">
          <svg
            width="120"
            height="120"
            viewBox="0 0 120 120"
            className="absolute inset-0"
            aria-hidden="true"
          >
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke="var(--rule)"
              strokeWidth="2"
            />
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="3"
              strokeDasharray={`${progressDash} ${progressCircumference}`}
              strokeLinecap="round"
              transform="rotate(-90 60 60)"
            />
          </svg>
          <div
            className="absolute grid place-items-center rounded-full"
            style={{
              inset: 14,
              background:
                "radial-gradient(circle at 30% 30%, var(--accent-soft), var(--accent) 60%, #4a0e0a 100%)",
              boxShadow:
                "inset 0 -4px 8px rgba(0,0,0,0.4), inset 0 2px 4px rgba(255,255,255,0.15)",
              color: "#f6efe1",
              fontFamily: "var(--font-display)",
              fontSize: 22,
              fontStyle: "italic",
              fontWeight: 600,
            }}
          >
            {displayPercent}%
          </div>
        </div>
        <div className="absolute -bottom-8 left-1/2 w-48 -translate-x-1/2 text-center">
          {canStart ? (
            <span className="font-display text-base italic text-accent sm:text-lg">
              {t("Click to Start")}
            </span>
          ) : (
            isTranslationsLoading ? (
              <div className="loading-bar mx-auto h-4 w-32 rounded-sm" />
            ) : (
              <span className="t-eyebrow">{t("Loading assets...")}</span>
            )
          )}
        </div>
      </button>

      {active && (
        <div className="t-eyebrow absolute bottom-3 left-3">
          {isTranslationsLoading ? (
            <div className="loading-bar h-4 w-40 rounded-sm" />
          ) : (
            <React.Fragment>
              {t("Loaded")} {loaded} {t("of")} {total} {t("assets")}
            </React.Fragment>
          )}
        </div>
      )}

      <VersionMark version={APP_VERSION} />
    </div>
  );
};

export default Loader;
