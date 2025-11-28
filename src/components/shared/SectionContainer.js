import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from "../../lib/utils";
const SectionContainer = ({ children, className, id }) => {
    return (_jsx("section", { id: id, className: cn("px-4 py-16 md:py-24", className), children: _jsx("div", { className: "mx-auto w-full max-w-6xl", children: children }) }));
};
export default SectionContainer;
