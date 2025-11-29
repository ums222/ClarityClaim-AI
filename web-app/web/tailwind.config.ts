import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        clarity: {
          primary: "#1E3A5F",
          secondary: "#0D9488",
          accent: "#F59E0B",
          success: "#10B981",
          warning: "#F59E0B",
          error: "#F43F5E",
        },
      },
      backgroundImage: {
        "hero-gradient":
          "radial-gradient(circle at top, rgba(13,148,136,0.25), transparent 60%), radial-gradient(circle at bottom, rgba(30,58,95,0.8), #020617)",
        "problem-gradient":
          "linear-gradient(135deg, rgba(15,23,42,0.95), rgba(30,64,175,0.96))",
        "solution-gradient":
          "linear-gradient(135deg, rgba(15,23,42,1), rgba(13,148,136,0.9))",
        "cta-gradient":
          "linear-gradient(135deg, #1E3A5F, #0D9488)",
      },
      boxShadow: {
        "glow-primary": "0 0 30px rgba(30,58,95,0.6)",
        "glow-accent": "0 0 30px rgba(245,158,11,0.5)",
      },
      borderRadius: {
        "2xl": "1rem",
      },
    },
  },
  plugins: [],
};

export default config;
