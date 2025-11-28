import { useEffect, useRef, useState, type ReactNode } from "react";

type LazySectionProps = {
  children: ReactNode;
  minHeight?: number;
  rootMargin?: string;
};

/**
 * Defers rendering of heavy sections until they approach the viewport.
 * This keeps the initial bundle smaller and improves first paint times.
 */
const LazySection = ({
  children,
  minHeight = 400,
  rootMargin = "15% 0px",
}: LazySectionProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (shouldRender) {
      return;
    }

    const node = containerRef.current;
    if (!node) {
      return;
    }

    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setShouldRender(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShouldRender(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [rootMargin, shouldRender]);

  return (
    <div ref={containerRef} aria-busy={!shouldRender}>
      {shouldRender ? (
        children
      ) : (
        <div
          className="px-4 py-16 md:py-24"
          style={{ minHeight }}
        >
          <div className="mx-auto w-full max-w-6xl rounded-3xl bg-slate-900/30" style={{ minHeight }} />
        </div>
      )}
    </div>
  );
};

export default LazySection;
