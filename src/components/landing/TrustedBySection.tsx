import { useTheme } from "../../hooks/useTheme";
import SectionContainer from "../shared/SectionContainer";

const healthcareOrganizations = [
  { name: "Mayo Clinic", logo: "/logos/mayo-clinic.svg" },
  { name: "Cleveland Clinic", logo: "/logos/cleveland-clinic.svg" },
  { name: "Johns Hopkins", logo: "/logos/johns-hopkins.svg" },
  { name: "Kaiser Permanente", logo: "/logos/kaiser.svg" },
  { name: "Mass General Brigham", logo: "/logos/mass-general.svg" },
  { name: "UPMC", logo: "/logos/upmc.svg" },
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
          {healthcareOrganizations.map((org, idx) => (
            <div
              key={idx}
              className="flex h-12 items-center justify-center rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 px-3 transition-all hover:border-neutral-300 dark:hover:border-neutral-700"
            >
              <img
                src={org.logo}
                alt={org.name}
                className="h-8 w-auto object-contain dark:brightness-0 dark:invert dark:opacity-70"
              />
            </div>
          ))}
        </div>
      </div>
    </SectionContainer>
  );
};

export default TrustedBySection;
