import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "rgb(var(--bg) / <alpha-value>)",
        fg: "rgb(var(--fg) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        card: "rgb(var(--card) / <alpha-value>)",
        border: "rgb(var(--border) / <alpha-value>)",
        brand: "rgb(var(--brand) / <alpha-value>)",
        brand2: "rgb(var(--brand2) / <alpha-value>)",
        brand3: "rgb(var(--brand3) / <alpha-value>)"
      },
      boxShadow: {
        soft: "0 10px 30px rgba(2,6,23,0.10)",
        lift: "0 22px 70px rgba(2,6,23,0.16)",
        insetStroke: "inset 0 0 0 1px rgba(148,163,184,0.25)"
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        }
      },
      animation: { "fade-up": "fadeUp 600ms ease-out both" }
    }
  },
  plugins: []
} satisfies Config;
