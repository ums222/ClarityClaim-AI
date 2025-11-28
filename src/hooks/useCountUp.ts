import { useEffect, useState, useRef, useCallback } from "react";

/**
 * Optimized counter hook with RAF-based animation
 * Uses easeOutQuart for smooth deceleration
 */
export const useCountUp = (
  target: number,
  duration = 1500,
  decimals = 0
): number => {
  const [value, setValue] = useState(0);
  const frameRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  // Easing function for smoother animation
  const easeOutQuart = useCallback((t: number): number => {
    return 1 - Math.pow(1 - t, 4);
  }, []);

  useEffect(() => {
    // Reset on target change
    setValue(0);
    startTimeRef.current = 0;

    const tick = (now: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = now;
      }

      const elapsed = now - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuart(progress);
      const next = target * easedProgress;

      setValue(Number(next.toFixed(decimals)));

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      }
    };

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [target, duration, decimals, easeOutQuart]);

  return value;
};
