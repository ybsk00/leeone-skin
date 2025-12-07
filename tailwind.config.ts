import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Healthcare Theme (Traditional/Hanji + AI)
        traditional: {
          bg: "#F9F7F2", // Warmer, deeper Hanji tone
          text: "#1A1A1A", // Softer Black
          subtext: "#4A4A4A", // Dark Gray
          primary: "#2C3E2C", // Deep Forest Green (Traditional)
          secondary: "#8C6A4A", // Deep Earthy Brown
          accent: "#D4AF37", // Muted Gold (Sophistication)
          muted: "#E5E0D5", // Warm Gray
          ai: "#3B82F6", // AI Blue (Subtle accent)
        },
        // Medical Theme (Modern/Clinic - Integrated with Traditional)
        medical: {
          bg: "#FFFFFF",
          text: "#111827",
          subtext: "#4B5563",
          primary: "#2C3E2C", // Unified with Traditional Primary
          secondary: "#10B981", // Emerald Green (kept for medical cues)
          accent: "#3B82F6", // Blue
          muted: "#F3F4F6",
        },
      },

      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.4))',
        'glass-dark': 'linear-gradient(135deg, rgba(20, 20, 20, 0.8), rgba(20, 20, 20, 0.4))',
      },
      fontFamily: {
        sans: ["var(--font-sans)", "sans-serif"],
        serif: ["var(--font-serif)", "serif"], // Keeping serif just in case for specific headers
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.5s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
