import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        serif: ["var(--font-serif)", "serif"],
        "big-shoulders": ["var(--font-big-shoulders)", "sans-serif"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "warm-beige": "#E8DFD0",
        "warm-cream": "#D4C8B8",
        "warm-gold": "#C9B99A",
        "portal-bg": "#050505",
        "portal-panel": "#121212",
      },
    },
  },
  plugins: [],
}
export default config
