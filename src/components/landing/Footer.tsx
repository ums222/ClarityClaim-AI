import { Link, useLocation, useNavigate } from "react-router-dom";
import { Linkedin, Twitter } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";

const productLinks = [
  { label: "Features", href: "/#solution", isHash: true },
  { label: "Integrations", href: "/integrations", isHash: false },
  { label: "Pricing", href: "/#pricing", isHash: true },
  { label: "Security", href: "/security", isHash: false },
  { label: "API Documentation", href: "/api-docs", isHash: false },
];

const companyLinks = [
  { label: "About Us", href: "/about", isHash: false },
  { label: "Careers", href: "/careers", isHash: false },
  { label: "Press", href: "/press", isHash: false },
  { label: "Contact", href: "/#contact", isHash: true },
  { label: "Partners", href: "/partners", isHash: false },
];

const resourceLinks = [
  { label: "Blog", href: "/blog", isHash: false },
  { label: "Case Studies", href: "/case-studies", isHash: false },
  { label: "Webinars", href: "/webinars", isHash: false },
  { label: "Help Center", href: "/help", isHash: false },
  { label: "Status Page", href: "/status", isHash: false },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy", isHash: false },
  { label: "Terms of Service", href: "/terms", isHash: false },
  { label: "HIPAA Notice", href: "/hipaa", isHash: false },
  { label: "Cookie Policy", href: "/cookies", isHash: false },
];

// Helper component for smart navigation (handles hash links properly)
const SmartLink = ({ 
  item, 
  className 
}: { 
  item: { label: string; href: string; isHash: boolean }; 
  className: string;
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    if (item.isHash) {
      e.preventDefault();
      const hashPart = item.href.split('#')[1];
      
      // If we're on the home page, just scroll to the section
      if (location.pathname === '/') {
        const element = document.getElementById(hashPart);
        element?.scrollIntoView({ behavior: 'smooth' });
      } else {
        // Navigate to home page first, then scroll
        navigate('/');
        setTimeout(() => {
          const element = document.getElementById(hashPart);
          element?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  };

  if (item.isHash) {
    return (
      <a href={item.href} onClick={handleClick} className={className}>
        {item.label}
      </a>
    );
  }

  return (
    <Link to={item.href} className={className}>
      {item.label}
    </Link>
  );
};

const Footer = () => {
  const { theme } = useTheme();
  
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 pt-10 pb-6">
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
            <p className="text-xs text-slate-600 dark:text-slate-400">
              AI-powered healthcare claims management
            </p>
            <div className="flex items-center gap-3">
              <a href="#" aria-label="LinkedIn" className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
                <Linkedin className="h-4 w-4" />
              </a>
              <a href="#" aria-label="Twitter/X" className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Product
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              {productLinks.map((item) => (
                <li key={item.label}>
                  <SmartLink
                    item={item}
                    className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:underline underline-offset-4 transition-colors"
                  />
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Company
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              {companyLinks.map((item) => (
                <li key={item.label}>
                  <SmartLink
                    item={item}
                    className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:underline underline-offset-4 transition-colors"
                  />
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Resources
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              {resourceLinks.map((item) => (
                <li key={item.label}>
                  <SmartLink
                    item={item}
                    className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:underline underline-offset-4 transition-colors"
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col gap-2 border-t border-slate-200 dark:border-slate-800 pt-4 text-[11px] text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>© 2025 ClarityClaim AI. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-3">
            {legalLinks.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="hover:text-slate-700 dark:hover:text-slate-300 hover:underline underline-offset-4 transition-colors"
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
