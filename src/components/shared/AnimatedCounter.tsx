import { memo } from "react";
import { useCountUp } from "../../hooks/useCountUp";

interface AnimatedCounterProps {
  to: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
}

const AnimatedCounter = memo<AnimatedCounterProps>(
  ({ to, prefix = "", suffix = "", decimals = 0, duration = 1500 }) => {
    const value = useCountUp(to, duration, decimals);
    return (
      <span>
        {prefix}
        {value}
        {suffix}
      </span>
    );
  }
);

AnimatedCounter.displayName = "AnimatedCounter";

export default AnimatedCounter;
