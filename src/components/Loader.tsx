/* eslint-disable @typescript-eslint/naming-convention */
import { useState, useEffect } from 'react';
import { useProgress } from '@react-three/drei';
import LanguageToggle from './LanguageToggle';
import { useTranslation } from 'react-i18next';

interface LoaderProps {
  onStarted?: () => void;
}

const Loader = ({ onStarted }: LoaderProps) => {
  const { progress, total, loaded, active } = useProgress();
  const [canStart, setCanStart] = useState(false);
  const [displayProgress, setDisplayProgress] = useState(0);
  const { t } = useTranslation();

  // Update displayProgress, but never let it go backwards
  useEffect(() => {
    if (progress > displayProgress) {
      setDisplayProgress(progress);
    }
  }, [progress, displayProgress]);

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
      <div className="absolute top-4 right-4">
        <LanguageToggle />
      </div>

      {/* Introductory Text */}
      <div className="max-w-3xl text-center mb-16 px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-8 text-blue-400">
          {t('Welcome to My Journey')}
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
          {t('Explore an interactive timeline of my professional development through an immersive 3D experience.')}
        </p>
      </div>

      {/* Controls Guide */}
      <div className="max-w-md text-sm md:text-base bg-gray-900 p-6 rounded-lg mb-12">
        <h2 className="text-lg md:text-xl font-semibold mb-4 text-blue-400">
          {t('Quick Guide')}
        </h2>
        <ul className="space-y-3 text-gray-300">
          <li className="flex items-center">
            <span className="inline-block w-32 font-medium">{t('Character Movement')}:</span>
            <span>{t('Left/Right Arrows or Left Mouse Drag')}</span>
          </li>
          <li className="flex items-center">
            <span className="inline-block w-32 font-medium">{t('Scene Rotation')}:</span>
            <span>{t('Middle Mouse Button + Drag')}</span>
          </li>
          <li className="flex items-center">
            <span className="inline-block w-32 font-medium">{t('Animations')}:</span>
            <span>{t('Press Q, W, E, or R')}</span>
          </li>
          <li className="flex items-center">
            <span className="inline-block w-32 font-medium">{t('Zoom')}:</span>
            <span>{t('Mouse Wheel')}</span>
          </li>
        </ul>
      </div>

      {/* Interactive Loader/Button */}
      <button 
        onClick={() => canStart && onStarted?.()}
        className={`relative group ${canStart ? 'cursor-pointer hover:scale-105 transition-transform' : 'cursor-default'}`}
        disabled={!canStart}
        aria-label={canStart ? t('Click to start experience') : t('Loading models')}
      >
        <div className={`custom-spinner ${canStart ? 'border-blue-500' : 'border-gray-500'}`} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <span className="text-xl font-bold text-white">
            {Math.round(displayProgress)}%
          </span>
        </div>
        {canStart ? (
          <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-center w-32">
            <span className="text-blue-400 animate-bounce">{t('Click to Start')}</span>
          </div>
        ) : (
          <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-center w-32">
            <span className="text-gray-400">{t('Loading assets...')}</span>
          </div>
        )}
      </button>

      {/* Loading Details (only shown during active loading) */}
      {active && (
        <div className="absolute bottom-4 left-4 text-sm text-gray-400">
          {t('Loaded')} {loaded} {t('of')} {total} {t('assets')}
        </div>
      )}
    </div>
  );
};

export default Loader;