import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

type SectionHeaderProps = {
  align?: "left" | "center" | "right";
  className?: string;
  eyebrow?: string;
  subtitle?: ReactNode;
  title: ReactNode;
};

const alignmentMap: Record<NonNullable<SectionHeaderProps["align"]>, string> = {
  left: "items-start text-left",
  center: "items-center text-center",
  right: "items-end text-right",
};

const SectionHeader = ({
  align = "left",
  className,
  eyebrow,
  subtitle,
  title,
}: SectionHeaderProps) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        alignmentMap[align ?? "left"],
        className
      )}
    >
      {eyebrow ? (
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-clarity-secondary">
          {eyebrow}
        </p>
      ) : null}
      <div className="text-2xl font-semibold text-slate-50 md:text-3xl">
        {title}
      </div>
      {subtitle ? (
        <p className="max-w-3xl text-sm text-slate-300 md:text-base">{subtitle}</p>
      ) : null}
    </div>
  );
};

export default SectionHeader;
