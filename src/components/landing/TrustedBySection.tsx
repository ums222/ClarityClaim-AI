import { memo } from "react";
import SectionContainer from "../shared/SectionContainer";

const placeholders = [0, 1, 2, 3, 4, 5] as const;

const TrustedBySection = memo(() => {
  return (
    <SectionContainer>
      <div className="flex flex-col items-center gap-6">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
          Trusted by leading healthcare organizations
        </p>
        <div className="grid w-full max-w-4xl grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
          {placeholders.map((idx) => (
            <div
              key={idx}
              className="flex h-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/40 text-[10px] uppercase tracking-wide text-slate-600"
            >
              Logo
            </div>
          ))}
        </div>
      </div>
    </SectionContainer>
  );
});

TrustedBySection.displayName = "TrustedBySection";

export default TrustedBySection;
