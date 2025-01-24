import { Variants } from 'framer-motion';

// Memoized spring configuration for reuse
const springConfig = { type: 'spring' as const, duration: 1.25 };

export const textVariant = (delay = 0): Variants => ({
  hidden: { y: 50, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      ...springConfig,
      delay,
    },
  },
});

export const fadeIn = (
  direction: string,
  type: string,
  delay: number,
  duration: number
): Variants => ({
  hidden: {
    x: direction === 'left' ? 100 : direction === 'right' ? -100 : 0,
    y: direction === 'up' ? 100 : direction === 'down' ? -100 : 0,
    opacity: 0,
  },
  show: {
    x: 0,
    y: 0,
    opacity: 1,
    transition: {
      type: type as "spring" | "tween" | "inertia" | "keyframes",
      delay,
      duration,
      ease: 'easeOut',
    },
  },
});
