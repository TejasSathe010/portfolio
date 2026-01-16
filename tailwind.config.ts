import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        /* Surface model (4-layer) */
        bg: "rgb(var(--bg) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        "surface-2": "rgb(var(--surface2) / <alpha-value>)",
        "surface-3": "rgb(var(--surface3) / <alpha-value>)",

        /* Ink hierarchy */
        fg: "rgb(var(--fg) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        "muted-2": "rgb(var(--muted2) / <alpha-value>)",

        /* Borders (micro-contrast) */
        border: "rgb(var(--border) / <alpha-value>)",
        "border-2": "rgb(var(--border2) / <alpha-value>)",

        /* Accent palette (Sapphire/Teal/Copper) */
        primary: "rgb(var(--p) / <alpha-value>)",
        "primary-hover": "rgb(var(--p-hover) / <alpha-value>)",
        secondary: "rgb(var(--s) / <alpha-value>)",
        "secondary-hover": "rgb(var(--s-hover) / <alpha-value>)",
        warm: "rgb(var(--w) / <alpha-value>)",
        "warm-hover": "rgb(var(--w-hover) / <alpha-value>)",

        /* Tints (use with /5, /6, /8, /10, /12 opacity) */
        "primary-tint": "rgb(var(--pTint) / <alpha-value>)",
        "primary-tint-2": "rgb(var(--pTint2) / <alpha-value>)",
        "secondary-tint": "rgb(var(--sTint) / <alpha-value>)",
        "secondary-tint-2": "rgb(var(--sTint2) / <alpha-value>)",
        "warm-tint": "rgb(var(--wTint) / <alpha-value>)",
        "warm-tint-2": "rgb(var(--wTint2) / <alpha-value>)",

        /* Ring */
        ring: "rgb(var(--ring) / <alpha-value>)",

        /* Legacy aliases */
        accent: "rgb(var(--p) / <alpha-value>)",
        "accent-hover": "rgb(var(--p-hover) / <alpha-value>)",
        accent2: "rgb(var(--s) / <alpha-value>)",
        "accent2-hover": "rgb(var(--s-hover) / <alpha-value>)",
        accent3: "rgb(var(--w) / <alpha-value>)",
        brand: "rgb(var(--p) / <alpha-value>)",
        brand2: "rgb(var(--s) / <alpha-value>)",
        brand3: "rgb(var(--w) / <alpha-value>)"
      },

      spacing: {
        "18": "4.5rem",
        "88": "22rem",
        "128": "32rem",
        "gutter-sm": "var(--gutterSm)",
        "gutter-md": "var(--gutterMd)",
        "gutter-lg": "var(--gutterLg)",
        "section-py-sm": "var(--sectionPySm)",
        "section-py-md": "var(--sectionPyMd)",
        "stack-sm": "var(--stackSm)",
        "stack-md": "var(--stackMd)",
        "stack-lg": "var(--stackLg)"
      },

      maxWidth: {
        prose: "65ch",
        "prose-wide": "75ch",
        container: "1120px"
      },

      borderRadius: {
        "r-card": "var(--rCard)",
        "r-btn": "var(--rBtn)",
        "r-button": "var(--rBtn)",  /* Legacy alias */
        "r-chip": "var(--rChip)",
        DEFAULT: "6px",
        sm: "4px",
        md: "8px",
        lg: "12px",
        xl: "16px"
      },

      boxShadow: {
        sm: "var(--shadow1)",
        DEFAULT: "var(--shadow2)",
        md: "var(--shadow2)",
        lg: "var(--shadow3)",
        glow: "var(--shadowGlow)"
      },

      transitionDuration: {
        "150": "150ms",
        "180": "180ms",
        "200": "200ms",
        "250": "250ms",
        "280": "280ms",
        "300": "300ms",
        fast: "var(--durFast)",
        DEFAULT: "var(--durMed)",
        med: "var(--durMed)",
        slow: "var(--durSlow)"
      },

      transitionTimingFunction: {
        DEFAULT: "var(--easeOut)",
        out: "var(--easeOut)",
        "out-premium": "var(--easeOut)",     /* Legacy alias */
        "ease-out-premium": "var(--easeOut)" /* Legacy alias */
      },

      keyframes: {
        reveal: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        sheen: {
          "0%": { transform: "translateX(-100%) skewX(-15deg)", opacity: "0" },
          "50%": { opacity: "1" },
          "100%": { transform: "translateX(100%) skewX(-15deg)", opacity: "0" }
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" }
        },
        skeleton: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" }
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        }
      },

      animation: {
        reveal: "reveal 420ms var(--easeOut) both",
        sheen: "sheen 700ms var(--easeOut)",
        float: "float 3s ease-in-out infinite",
        skeleton: "skeleton 1.5s ease-in-out infinite",
        "fade-in-up": "fade-in-up 400ms var(--easeOut) both"
      }
    }
  },
  plugins: []
} satisfies Config;
