import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from "../../lib/utils";
const alignmentMap = {
    left: "items-start text-left",
    center: "items-center text-center",
    right: "items-end text-right",
};
const SectionHeader = ({ align = "left", className, eyebrow, subtitle, title, }) => {
    return (_jsxs("div", { className: cn("flex flex-col gap-3", alignmentMap[align ?? "left"], className), children: [eyebrow ? (_jsx("p", { className: "text-[11px] font-semibold uppercase tracking-[0.3em] text-clarity-secondary", children: eyebrow })) : null, _jsx("div", { className: "text-2xl font-semibold text-slate-50 md:text-3xl", children: title }), subtitle ? (_jsx("p", { className: "max-w-3xl text-sm text-slate-300 md:text-base", children: subtitle })) : null] }));
};
export default SectionHeader;
