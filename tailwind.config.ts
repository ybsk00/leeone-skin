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
          bg: "#E6E2D3", // Darker warm Hanji tone
          text: "#1A1A1A", // Reverted to dark text
          subtext: "#4A4A4A", // Reverted to dark gray
          primary: "#2C3E2C", // Deep Forest Green (Traditional)
          secondary: "#8C6A4A", // Deep Earthy Brown
          accent: "#D4AF37", // Muted Gold (Sophistication)
          muted: "#E5E0D5", // Reverted to warm gray
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
        // Dental Theme (Deep Navy Dark Mode)
        dental: {
          bg: "#0A1628",           // 딥네이비 배경
          bgSecondary: "#0F2040",  // 보조 배경
          surface: "#142640",      // 표면 색상
          text: "#F1F5F9",         // 기본 텍스트
          subtext: "#94A3B8",      // 보조 텍스트
          primary: "#3B82F6",      // 프라이머리 블루
          secondary: "#06B6D4",    // 시안 악센트
          accent: "#60A5FA",       // 밝은 블루
          glow: "#3B82F6",         // 글로우 효과
          muted: "#1E3A5F",        // 뮤트 컬러
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
