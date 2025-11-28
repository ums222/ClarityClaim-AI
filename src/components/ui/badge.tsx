import * as React from "react";
import { cn } from "../../lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline";
}

// Modern minimalist badge
export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variantClasses = {
    default: "bg-teal-500/10 text-teal-600 dark:text-teal-400 ring-1 ring-teal-500/20",
    secondary: "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 ring-1 ring-neutral-200 dark:ring-neutral-700",
    outline: "bg-transparent text-neutral-600 dark:text-neutral-400 ring-1 ring-neutral-200 dark:ring-neutral-700",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}
