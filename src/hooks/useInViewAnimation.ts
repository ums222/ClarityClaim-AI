import { useRef } from "react";
import { useInView } from "framer-motion";

export const useInViewAnimation = (margin: string = "-100px") => {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, {
    margin,
    once: true,
  });

  return { ref, isInView };
};
