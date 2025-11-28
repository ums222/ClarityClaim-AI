import { jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from "react";
import { useCountUp } from "../../hooks/useCountUp";
const AnimatedCounter = ({ decimals = 0, duration = 1500, prefix = "", suffix = "", to, }) => {
    const value = useCountUp(to, duration, decimals);
    const formatted = useMemo(() => value.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }), [decimals, value]);
    return (_jsxs("span", { children: [prefix, formatted, suffix] }));
};
export default AnimatedCounter;
