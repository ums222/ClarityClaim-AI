import { ReactNode, memo } from "react";
import { cn } from "../../lib/utils";

interface SectionContainerProps {
  id?: string;
  className?: string;
  children: ReactNode;
}

const SectionContainer = memo(({ id, className, children }: SectionContainerProps) => {
  return (
    <section id={id} className={cn("py-12 md:py-16 lg:py-20", className)}>
      <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
        {children}
      </div>
    </section>
  );
});

SectionContainer.displayName = "SectionContainer";

export default SectionContainer;
