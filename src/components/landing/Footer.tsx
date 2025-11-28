import { Link } from "react-router-dom";
import { Linkedin, Twitter } from "lucide-react";
const Footer = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 section-bg-dark pt-10 pb-6">
      <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
            <img src="/logo.png" alt="ClarityClaim AI Logo" className="h-6 w-auto" />
                        </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              AI-powered healthcare claims management
            </p>
            <div className="flex items-center gap-3">
              <a href="#" aria-label="LinkedIn" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100">
                <Linkedin className="h-4 w-4" />
              </a>
              <a href="#" aria-label="Twitter/X" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100">
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Product
            </p>
            <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-400">
              {["Features", "Integrations", "Pricing", "Security", "API Documentation"].map(
                (item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="hover:text-slate-900 dark:hover:text-slate-100 hover:underline underline-offset-4"
                    >
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Company
            </p>
            <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-400">
              {["About Us", "Careers", "Press", "Contact", "Partners"].map(
                (item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="hover:text-slate-900 dark:hover:text-slate-100 hover:underline underline-offset-4"
                    >
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Resources
            </p>
            <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-400">
              {["Blog", "Case Studies", "Webinars", "Help Center", "Status Page"].map(
                (item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="hover:text-slate-900 dark:hover:text-slate-100 hover:underline underline-offset-4"
                    >
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col gap-2 border-t border-slate-800 pt-4 text-[11px] text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>© 2025 ClarityClaim AI. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-3">
            {["Privacy Policy", "Terms of Service", "HIPAA Notice", "Cookie Policy"].map(
              (item) => (
                <Link
                  key={item}
                  to="#"
                  className="hover:text-slate-700 dark:hover:text-slate-300 hover:underline underline-offset-4"
                >
                  {item}
                </Link>
              )
            )}
          </div>
          <p>
            Made with <span className="text-rose-400">heart</span> for healthcare
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
