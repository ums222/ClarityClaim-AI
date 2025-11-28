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
        // Modern minimalist palette - single accent color
        clarity: {
          primary: "#0F172A",    // Deep slate (for dark elements in light mode)
          secondary: "#0D9488",  // Teal - THE accent color
          accent: "#0D9488",     // Same teal for consistency
          success: "#10B981",    // Keep for status indicators only
          warning: "#F59E0B",    // Keep for warnings only
          error: "#EF4444",      // Keep for errors only
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
        // Simplified, monochromatic gradients
        "hero-gradient":
          "radial-gradient(ellipse at top, rgba(13,148,136,0.15), transparent 50%), linear-gradient(to bottom, #09090B, #18181B)",
        "hero-gradient-light":
          "linear-gradient(to bottom, #FFFFFF, #F4F4F5)",
        "subtle-gradient":
          "linear-gradient(to bottom right, rgba(13,148,136,0.05), transparent)",
        "cta-gradient":
          "linear-gradient(135deg, #0D9488, #0F766E)",
      },
      boxShadow: {
        "glow-sm": "0 0 20px rgba(13,148,136,0.15)",
        "glow-md": "0 0 40px rgba(13,148,136,0.2)",
        "subtle": "0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.1)",
        "card": "0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)",
        "card-hover": "0 10px 25px -5px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)",
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
