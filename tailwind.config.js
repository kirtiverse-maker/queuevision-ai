/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Manrope', 'system-ui', 'sans-serif'] },
      colors: {
        navy: { 950: '#070E24', 900: '#0B1533', 800: '#132049', 700: '#1E2F63' },
        brand: { DEFAULT: '#4C8DFF', soft: '#DCE8FF' },
      },
    },
  },
  plugins: [],
}
