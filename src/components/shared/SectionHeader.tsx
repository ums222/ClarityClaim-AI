import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface SectionHeaderProps {
  badge?: string;
  title: string;
  description?: string;
  className?: string;
  align?: 'left' | 'center';
}

export function SectionHeader({
  badge,
  title,
  description,
  className,
  align = 'center',
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'mb-12 md:mb-16',
        align === 'center' && 'text-center',
        className
      )}
    >
      {badge && (
        <Badge variant="outline" className="mb-4">
          {badge}
        </Badge>
      )}
      <h2 className="text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl md:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-lg text-slate-400 max-w-3xl mx-auto">
          {description}
        </p>
      )}
    </div>
  );
}
