interface SectionHeaderProps {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: string;
  align?: "left" | "center";
}

const SectionHeader = ({
  eyebrow,
  title,
  subtitle,
  align = "left",
}: SectionHeaderProps) => {
  const baseClass = "mb-8";
  const alignClass =
    align === "center" ? "text-center mx-auto max-w-2xl" : "";

  return (
    <div className={`${baseClass} ${alignClass}`}>
      {eyebrow && (
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-clarity-secondary">
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-sm md:text-base text-neutral-600 dark:text-neutral-400">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;
