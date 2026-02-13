/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg': '#0A0A0B',
        'bg-secondary': '#141416',
        'bg-tertiary': '#1C1C1F',
        'border': '#27272A',
        'accent': '#6366F1',
        'accent-hover': '#818CF8',
        'text': '#FAFAFA',
        'text-secondary': '#A1A1AA',
        'text-tertiary': '#71717A',
      }
    },
  },
  plugins: [],
}
