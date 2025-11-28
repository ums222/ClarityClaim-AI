import { useCountUp } from "../../hooks/useCountUp";

interface AnimatedCounterProps {
  to: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
}

const AnimatedCounter = ({
  to,
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = 1500,
}: AnimatedCounterProps) => {
  const value = useCountUp(to, duration, decimals);

  return (
    <span>
      {prefix}
      {value.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
};

export default AnimatedCounter;
