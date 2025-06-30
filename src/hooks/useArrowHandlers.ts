/* eslint-disable @typescript-eslint/naming-convention */
import { useMemo } from 'react';

// Possible keyboard directions that we support. Extend freely if needed.
export type Direction = 'ArrowLeft' | 'ArrowRight' | 'ArrowUp' | 'ArrowDown';

export interface ArrowHandlers {
  onTouchStart: () => void;
  onTouchEnd: () => void;
  onMouseDown: () => void;
  onMouseUp: () => void;
  onMouseLeave: () => void;
}

/**
 * Returns a stable set of event handlers for the given direction.
 * They are memoised with `useMemo`, so they will only change when
 * `handleStart` or `handleEnd` references change – significantly
 * reducing the number of new function instances created on every render.
 */
export default function useArrowHandlers(
  direction: Direction,
  handleStart: (key: Direction) => void,
  handleEnd: (key: Direction) => void
): ArrowHandlers {
  return useMemo(
    () => ({
      onTouchStart: () => handleStart(direction),
      onTouchEnd: () => handleEnd(direction),
      onMouseDown: () => handleStart(direction),
      onMouseUp: () => handleEnd(direction),
      onMouseLeave: () => handleEnd(direction),
    }),
    [direction, handleStart, handleEnd]
  );
} 