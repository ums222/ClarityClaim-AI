import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        // Minimalist palette - single accent (teal)
        clarity: {
          primary: "#0F172A",
          secondary: "#0D9488",  // Teal - THE accent
          accent: "#0D9488",     // Same teal
        },
        // Modern neutral grays
        neutral: {
          50: "#FAFAFA",
          100: "#F4F4F5",
          200: "#E4E4E7",
          300: "#D4D4D8",
          400: "#A1A1AA",
          500: "#71717A",
          600: "#52525B",
          700: "#3F3F46",
          800: "#27272A",
          900: "#18181B",
          950: "#09090B",
        }
      },
      backgroundImage: {
        // Simple, monochromatic gradients only
        "hero-gradient": "linear-gradient(to bottom, #09090B, #18181B)",
      },
      boxShadow: {
        "card": "0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.1)",
        "card-hover": "0 4px 12px rgba(0,0,0,0.1)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      }
    }
  },
  plugins: []
};

export default config;
