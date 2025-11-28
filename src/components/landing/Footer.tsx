import { Shield } from "lucide-react";
import SectionContainer from "../shared/SectionContainer";

const footerColumns = [
  {
    title: "Product",
    links: ["Platform", "Pricing", "Security", "Integrations"],
  },
  {
    title: "Company",
    links: ["About", "Careers", "Press", "Contact"],
  },
  {
    title: "Resources",
    links: ["Blog", "Case Studies", "Support", "Status"],
  },
];

const Footer = () => {
  return (
    <footer className="border-t border-slate-900 bg-slate-950">
      <SectionContainer className="py-12">
        <div className="grid gap-8 md:grid-cols-[2fr_3fr]">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-clarity-primary/30 text-clarity-accent">
                <Shield className="h-5 w-5" />
              </span>
              <div>
                <p className="text-base font-semibold">ClarityClaim AI</p>
                <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">
                  Revenue Integrity
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm text-slate-400">
              AI-powered claims, appeals, and equity analytics built for healthcare
              leaders.
            </p>
            <p className="mt-4 text-xs text-slate-500">
              © {new Date().getFullYear()} ClarityClaim AI. All rights reserved.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {footerColumns.map((column) => (
              <div key={column.title}>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                  {column.title}
                </p>
                <ul className="mt-4 space-y-2 text-sm text-slate-300">
                  {column.links.map((link) => (
                    <li key={link}>
                      <a
                        className="text-slate-300 transition-colors hover:text-clarity-accent"
                        href="#"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </SectionContainer>
    </footer>
  );
};

export default Footer;
