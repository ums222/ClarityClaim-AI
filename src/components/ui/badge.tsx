import { cn } from "../../lib/utils";

export const Badge = ({
  className,
  children,
}: React.HTMLAttributes<HTMLSpanElement>) => (
  <span
    className={cn(
      "inline-flex items-center rounded-full border border-clarity-accent/30 bg-clarity-accent/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-clarity-accent",
      className
    )}
  >
    {children}
  </span>
);
