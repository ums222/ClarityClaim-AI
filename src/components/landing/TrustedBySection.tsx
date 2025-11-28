import SectionContainer from "../shared/SectionContainer";

const placeholders = Array.from({ length: 6 });

const TrustedBySection = () => {
  return (
    <SectionContainer>
      <div className="flex flex-col items-center gap-6">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-600 dark:text-slate-500">
          Trusted by leading healthcare organizations
        </p>
        <div className="grid w-full max-w-4xl grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
          {placeholders.map((_, idx) => (
            <div
              key={idx}
              className="flex h-10 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/40 dark:bg-slate-900/40 text-[10px] uppercase tracking-wide text-slate-500 dark:text-slate-600"
            >
              Logo
            </div>
          ))}
        </div>
      </div>
    </SectionContainer>
  );
};

export default TrustedBySection;
