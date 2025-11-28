import { useRef } from "react";
import { useInView } from "framer-motion";

export const useInViewAnimation = (margin: string = "-100px") => {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, {
    margin,
    once: true,
    // Reduce animation overhead by using a less aggressive threshold
    amount: 0.2,
  });

  return { ref, isInView };
};
