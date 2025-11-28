import { useTheme } from "../../hooks/useTheme";
import SectionContainer from "../shared/SectionContainer";

const healthcareOrganizations = [
  { name: "Mayo Clinic", logo: "/logos/mayo-clinic.png" },
  { name: "Cleveland Clinic", logo: "/logos/cleveland-clinic.png" },
  { name: "Johns Hopkins Medicine", logo: "/logos/johns-hopkins.png" },
  { name: "Kaiser Permanente", logo: "/logos/kaiser.png" },
  { name: "Mass General Brigham", logo: "/logos/mass-general.png" },
  { name: "UPMC", logo: "/logos/upmc.png" },
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
              className="flex h-16 items-center justify-center rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 px-4 transition-all hover:border-neutral-300 dark:hover:border-neutral-700 hover:shadow-sm"
              title={org.name}
            >
              <img
                src={org.logo}
                alt={org.name}
                className="max-h-10 w-auto max-w-full object-contain dark:brightness-0 dark:invert dark:opacity-80"
              />
            </div>
          ))}
        </div>
      </div>
    </SectionContainer>
  );
};

export default TrustedBySection;
