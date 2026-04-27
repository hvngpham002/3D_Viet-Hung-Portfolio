/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          0: "var(--paper-0)",
          1: "var(--paper-1)",
          2: "var(--paper-2)",
          edge: "var(--paper-edge)",
        },
        ink: {
          100: "var(--ink-100)",
          300: "var(--ink-300)",
          500: "var(--ink-500)",
          700: "var(--ink-700)",
          900: "var(--ink-900)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          soft: "var(--accent-soft)",
          wash: "var(--accent-wash)",
        },
        rule: "var(--rule)",
        "rule-strong": "var(--rule-strong)",
      },
      fontFamily: {
        display: ["Cormorant Garamond", "Iowan Old Style", "Palatino", "serif"],
        ui: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SF Mono", "monospace"],
      },
      boxShadow: {
        card: "var(--shadow-card)",
        press: "var(--shadow-press)",
      },
    },
  },
  plugins: [],
};
