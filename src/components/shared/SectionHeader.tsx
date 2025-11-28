import { ReactNode, memo } from "react";
import { cn } from "../../lib/utils";

interface SectionHeaderProps {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: string;
  align?: "left" | "center" | "right";
  className?: string;
}

const SectionHeader = memo(({
  eyebrow,
  title,
  subtitle,
  align = "left",
  className,
}: SectionHeaderProps) => {
  return (
    <div
      className={cn(
        "mb-8",
        align === "center" && "text-center",
        align === "right" && "text-right",
        className
      )}
    >
      {eyebrow && (
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-clarity-secondary">
          {eyebrow}
        </p>
      )}
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-slate-50">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-sm md:text-base text-slate-300 max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
});

SectionHeader.displayName = "SectionHeader";

export default SectionHeader;
