import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        'big-shoulders': ["var(--font-big-shoulders)", "sans-serif"],
        'general-sans': ["var(--font-general-sans)", "sans-serif"],
        'dancing-script': ["var(--font-dancing-script)", "cursive"],
        'poppins': ["var(--font-poppins)", "sans-serif"],
      },
      colors: {
        // Brand Colors
        'coral-red': {
          DEFAULT: 'var(--coral-red)',
          50: '#fef2f2',
          100: '#fee2e2',
          500: 'var(--coral-red)',
          600: '#dc2626',
          700: '#b91c1c',
        },
        'cool-gray': {
          DEFAULT: 'var(--cool-gray)',
          50: '#f9fafb',
          100: '#f3f4f6',
          500: 'var(--cool-gray)',
          600: '#4b5563',
          700: '#374151',
        },
        'warm-cream': {
          DEFAULT: 'var(--warm-cream)',
          50: '#fefdf8',
          100: '#fefbf0',
          500: 'var(--warm-cream)',
        },
        'deep-black': {
          DEFAULT: 'var(--deep-black)',
          500: 'var(--deep-black)',
        },
        // Shadcn/ui Colors (keeping for compatibility)
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "var(--coral-red)",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
}

export default config