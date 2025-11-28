import { useCountUp } from '@/hooks/useCountUp';
import { cn } from '@/lib/utils';

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function AnimatedCounter({
  end,
  duration = 2000,
  prefix = '',
  suffix = '',
  className,
}: AnimatedCounterProps) {
  const count = useCountUp(end, duration);

  return (
    <span className={cn('tabular-nums', className)}>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}
