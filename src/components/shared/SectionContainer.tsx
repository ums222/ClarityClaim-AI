import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

type SectionContainerProps = {
  children: ReactNode;
  className?: string;
  id?: string;
};

const SectionContainer = ({ children, className, id }: SectionContainerProps) => {
  return (
    <section id={id} className={cn("px-4 py-16 md:py-24", className)}>
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </section>
  );
};

export default SectionContainer;
