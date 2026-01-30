
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#FF6B35",
        "primary-dark": "#E55A2B",
        secondary: "#1F2937",
        "background-light": "#FFFFFF",
        "background-dark": "#111827",
        "surface-light": "#F9FAFB",
        "surface-dark": "#1F2937",
        "neutral-100": "#F3F4F6",
        "neutral-200": "#E5E7EB",
        "neutral-300": "#D1D5DB",
        "neutral-400": "#9CA3AF",
        "neutral-500": "#6B7280",
        "neutral-600": "#4B5563",
        "neutral-800": "#1F2937",
        "neutral-900": "#111827",
      },
      fontFamily: {
        heading: ["Roobert", "sans-serif"],
        body: ["Interdisplay", "Arial", "sans-serif"],
        sans: ["Interdisplay", "Arial", "sans-serif"],
        manrope: ["Manrope", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        soft: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
        glow: "0 0 15px rgba(255, 107, 53, 0.3)",
      },
    },
  },
  plugins: [],
}