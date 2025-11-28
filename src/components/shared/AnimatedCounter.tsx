import { memo } from "react";
import { useCountUp } from "../../hooks/useCountUp";

interface AnimatedCounterProps {
  to: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

const AnimatedCounter = memo(({ to, prefix, suffix, decimals = 0 }: AnimatedCounterProps) => {
  const value = useCountUp(to, 1500, decimals);
  
  return (
    <>
      {prefix}
      {value}
      {suffix}
    </>
  );
});

AnimatedCounter.displayName = "AnimatedCounter";

export default AnimatedCounter;
