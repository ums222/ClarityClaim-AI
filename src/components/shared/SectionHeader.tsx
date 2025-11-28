import { memo, ReactNode } from "react";
import { cn } from "../../lib/utils";

interface SectionHeaderProps {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: string;
  align?: "left" | "center";
}

const SectionHeader = memo<SectionHeaderProps>(
  ({ eyebrow, title, subtitle, align = "left" }) => (
    <div
      className={cn(
        "mb-8",
        align === "center" && "text-center"
      )}
    >
      {eyebrow && (
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-clarity-secondary">
          {eyebrow}
        </p>
      )}
      <h2 className="text-2xl font-bold tracking-tight text-slate-50 md:text-3xl lg:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 max-w-2xl text-sm text-slate-300 md:text-base mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  )
);

SectionHeader.displayName = "SectionHeader";

export default SectionHeader;
