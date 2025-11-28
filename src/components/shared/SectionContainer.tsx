import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface SectionContainerProps {
  id?: string;
  className?: string;
  children: ReactNode;
}

export function SectionContainer({
  id,
  className,
  children,
}: SectionContainerProps) {
  return (
    <section id={id} className={cn('py-16 md:py-24', className)}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}
