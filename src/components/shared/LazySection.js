import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
/**
 * Defers rendering of heavy sections until they approach the viewport.
 * This keeps the initial bundle smaller and improves first paint times.
 */
const LazySection = ({ children, minHeight = 400, rootMargin = "15% 0px", }) => {
    const containerRef = useRef(null);
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
        const observer = new IntersectionObserver((entries) => {
            if (entries[0]?.isIntersecting) {
                setShouldRender(true);
                observer.disconnect();
            }
        }, { rootMargin });
        observer.observe(node);
        return () => observer.disconnect();
    }, [rootMargin, shouldRender]);
    return (_jsx("div", { ref: containerRef, "aria-busy": !shouldRender, children: shouldRender ? (children) : (_jsx("div", { className: "px-4 py-16 md:py-24", style: { minHeight }, children: _jsx("div", { className: "mx-auto w-full max-w-6xl rounded-3xl bg-slate-900/30", style: { minHeight } }) })) }));
};
export default LazySection;
