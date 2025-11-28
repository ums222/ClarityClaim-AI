import { cn } from "../../lib/utils";

interface SectionContainerProps {
  id?: string;
  className?: string;
  children: React.ReactNode;
}

const SectionContainer = ({ id, className, children }: SectionContainerProps) => {
  return (
    <section id={id} className={cn("w-full py-16 md:py-24", className)}>
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6 lg:px-8">
        {children}
      </div>
    </section>
  );
};

export default SectionContainer;
