import { useRef } from "react";
import { useInView } from "framer-motion";

export const useInViewAnimation = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, {
    once: true,
  });

  return { ref, isInView };
};
