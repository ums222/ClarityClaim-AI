import { memo } from "react";
import { cn } from "../../lib/utils";

interface SectionContainerProps {
  id?: string;
  className?: string;
  children: React.ReactNode;
}

const SectionContainer = memo<SectionContainerProps>(
  ({ id, className, children }) => (
    <section
      id={id}
      className={cn(
        "px-4 py-16 md:px-6 lg:px-8 md:py-20 lg:py-24",
        className
      )}
    >
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  )
);

SectionContainer.displayName = "SectionContainer";

export default SectionContainer;
