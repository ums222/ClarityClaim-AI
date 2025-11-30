import { Link } from "react-router-dom";
import { Linkedin, Twitter } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";

const productLinks = [
  { label: "Features", href: "/#solution" },
  { label: "Integrations", href: "/integrations" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Security", href: "/security" },
  { label: "API Documentation", href: "/api-docs" },
];

const companyLinks = [
  { label: "About Us", href: "/about" },
  { label: "Careers", href: "/careers" },
  { label: "Press", href: "/press" },
  { label: "Contact", href: "/#contact" },
  { label: "Partners", href: "/partners" },
];

const resourceLinks = [
  { label: "Blog", href: "/blog" },
  { label: "Case Studies", href: "/case-studies" },
  { label: "Webinars", href: "/webinars" },
  { label: "Help Center", href: "/help" },
  { label: "Status Page", href: "/status" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "HIPAA Notice", href: "/hipaa" },
  { label: "Cookie Policy", href: "/cookies" },
];

const Footer = () => {
  const { theme } = useTheme();
  
  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 pt-10 pb-6">
      <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-3">
            <Link to="/" className="flex items-center gap-2">
              {/* Theme-aware logo */}
              <img 
                src={theme === "dark" ? "/orbitlogo-dark.svg" : "/orbitlogo.svg"} 
                alt="ClarityClaim AI Logo" 
                className="h-6 w-auto" 
              />
            </Link>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">
              AI-powered healthcare claims management
            </p>
            <div className="flex items-center gap-3">
              <a href="#" aria-label="LinkedIn" className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors">
                <Linkedin className="h-4 w-4" />
              </a>
              <a href="#" aria-label="Twitter/X" className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
              Product
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              {productLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.href}
                    className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:underline underline-offset-4 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
              Company
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              {companyLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.href}
                    className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:underline underline-offset-4 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
              Resources
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              {resourceLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.href}
                    className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:underline underline-offset-4 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col gap-2 border-t border-neutral-200 dark:border-neutral-800 pt-4 text-[11px] text-neutral-500 md:flex-row md:items-center md:justify-between">
          <p>© 2025 ClarityClaim AI. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-3">
            {legalLinks.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="hover:text-neutral-700 dark:hover:text-neutral-300 hover:underline underline-offset-4 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <p>
            Made with <span className="text-teal-500">♥</span> for healthcare
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
