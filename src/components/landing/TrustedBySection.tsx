import { useTheme } from "../../hooks/useTheme";
import SectionContainer from "../shared/SectionContainer";

// Logo components rendered inline for reliability
const MayoClinicLogo = ({ className }: { className?: string }) => (
  <div className={className}>
    <span className="font-serif text-sm font-normal tracking-tight text-[#00457C] dark:text-neutral-200">
      Mayo Clinic
    </span>
  </div>
);

const ClevelandClinicLogo = ({ className }: { className?: string }) => (
  <div className={className}>
    <span className="font-sans text-[11px] font-bold tracking-tight text-[#006747] dark:text-neutral-200">
      Cleveland Clinic
    </span>
  </div>
);

const JohnsHopkinsLogo = ({ className }: { className?: string }) => (
  <div className={className}>
    <span className="font-serif text-xs font-normal tracking-tight text-[#002D72] dark:text-neutral-200">
      Johns Hopkins
    </span>
  </div>
);

const KaiserLogo = ({ className }: { className?: string }) => (
  <div className={`flex flex-col items-center leading-none ${className}`}>
    <span className="font-sans text-[10px] font-bold tracking-wide text-[#004B87] dark:text-neutral-200">
      KAISER
    </span>
    <span className="font-sans text-[8px] font-normal tracking-wider text-[#004B87] dark:text-neutral-300">
      PERMANENTE
    </span>
  </div>
);

const MassGeneralLogo = ({ className }: { className?: string }) => (
  <div className={`flex flex-col items-center leading-none ${className}`}>
    <span className="font-sans text-[10px] font-bold tracking-tight text-[#003A70] dark:text-neutral-200">
      Mass General
    </span>
    <span className="font-sans text-[9px] font-normal text-[#003A70] dark:text-neutral-300">
      Brigham
    </span>
  </div>
);

const UPMCLogo = ({ className }: { className?: string }) => (
  <div className={className}>
    <span className="font-sans text-base font-black tracking-tight text-[#1E3A8A] dark:text-neutral-200">
      UPMC
    </span>
  </div>
);

const healthcareLogos = [
  { name: "Mayo Clinic", Logo: MayoClinicLogo },
  { name: "Cleveland Clinic", Logo: ClevelandClinicLogo },
  { name: "Johns Hopkins", Logo: JohnsHopkinsLogo },
  { name: "Kaiser Permanente", Logo: KaiserLogo },
  { name: "Mass General Brigham", Logo: MassGeneralLogo },
  { name: "UPMC", Logo: UPMCLogo },
];

const TrustedBySection = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <SectionContainer className={isDark ? "bg-neutral-950" : "bg-white"}>
      <div className="flex flex-col items-center gap-6">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
          Trusted by leading healthcare organizations
        </p>
        <div className="grid w-full max-w-4xl grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
          {healthcareLogos.map((item, idx) => (
            <div
              key={idx}
              className="flex h-14 items-center justify-center rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 px-3 transition-all hover:border-neutral-300 dark:hover:border-neutral-700 hover:shadow-sm"
              title={item.name}
            >
              <item.Logo />
            </div>
          ))}
        </div>
      </div>
    </SectionContainer>
  );
};

export default TrustedBySection;
