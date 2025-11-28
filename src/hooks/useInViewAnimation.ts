import { useRef, useState, useEffect } from "react";

/**
 * Lightweight intersection observer hook for triggering animations
 * More performant than framer-motion's useInView for simple cases
 */
export const useInViewAnimation = (margin: string = "-100px") => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Use native IntersectionObserver for better performance
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          // Once triggered, stop observing to save resources
          observer.disconnect();
        }
      },
      {
        rootMargin: margin,
        threshold: 0,
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [margin]);

  return { ref, isInView };
};
