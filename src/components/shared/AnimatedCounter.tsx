import { useMemo } from "react";
import { useCountUp } from "../../hooks/useCountUp";

type AnimatedCounterProps = {
  decimals?: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  to: number;
};

const AnimatedCounter = ({
  decimals = 0,
  duration = 1500,
  prefix = "",
  suffix = "",
  to,
}: AnimatedCounterProps) => {
  const value = useCountUp(to, duration, decimals);

  const formatted = useMemo(
    () =>
      value.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }),
    [decimals, value]
  );

  return (
    <span>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
};

export default AnimatedCounter;
