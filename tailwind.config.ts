import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#AFDDE5",
        paper: "#002528",
        "paper-dim": "#001b1e",
        "paper-dark": "#001c1f",
        "ink-dark": "#AFDDE5",
        surface: {
          light: "#02393e",
          dark: "#024950"
        },
        clay: {
          DEFAULT: "#964734",
          light: "#C25D44",
          dark: "#763526"
        },
        moss: {
          DEFAULT: "#0FA4AF",
          light: "#2EC6D1",
          dark: "#076F77"
        },
        stone: {
          DEFAULT: "#024950",
          light: "#AFDDE5",
          dark: "#00191c"
        },
        refire: {
          dark: "#002225",
          slate: "#024950",
          copper: "#964734",
          cyan: "#0FA4AF",
          ice: "#AFDDE5"
        }
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "ui-serif", "Georgia", "serif"],
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      fontSize: {
        "display-xl": ["clamp(3rem, 7vw, 6.5rem)", { lineHeight: "0.98", letterSpacing: "-0.02em" }],
        "display-lg": ["clamp(2.25rem, 5vw, 4.25rem)", { lineHeight: "1.02", letterSpacing: "-0.02em" }],
        "display-md": ["clamp(1.75rem, 3.4vw, 2.75rem)", { lineHeight: "1.08", letterSpacing: "-0.01em" }]
      },
      maxWidth: {
        prose: "68ch"
      },
      boxShadow: {
        soft: "0 1px 2px rgba(23, 21, 18, 0.06), 0 8px 24px -12px rgba(23, 21, 18, 0.18)",
        lift: "0 24px 48px -16px rgba(23, 21, 18, 0.28)"
      },
      backgroundImage: {
        grain: "url('/images/grain.svg')"
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" }
        },
        "border-color-cycle": {
          "0%, 100%": { borderColor: "rgba(0, 240, 255, 0.6)" },
          "33%": { borderColor: "rgba(236, 72, 153, 0.6)" },
          "66%": { borderColor: "rgba(167, 139, 250, 0.6)" }
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 30px rgba(0, 240, 255, 0.3), inset 0 0 10px rgba(0, 240, 255, 0.1)" },
          "33%": { boxShadow: "0 0 40px rgba(236, 72, 153, 0.5), inset 0 0 20px rgba(236, 72, 153, 0.2)" },
          "66%": { boxShadow: "0 0 40px rgba(167, 139, 250, 0.5), inset 0 0 20px rgba(167, 139, 250, 0.2)" }
        }
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.22,1,0.36,1) forwards",
        marquee: "marquee 28s linear infinite",
        "border-color-cycle": "border-color-cycle 4s ease-in-out infinite",
        "glow-pulse": "glow-pulse 4s ease-in-out infinite"
      },
      transitionTimingFunction: {
        signature: "cubic-bezier(0.22, 1, 0.36, 1)"
      }
    }
  },
  plugins: []
};

export default config;
