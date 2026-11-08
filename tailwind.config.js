/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        emerald: { DEFAULT: '#0F5C4D', dark: '#0A3F35', light: '#1B7F6B', soft: '#E3F1EC' },
        gold: { DEFAULT: '#C9A227', light: '#E6CB6E', soft: '#F7EFD2' },
        cream: { DEFAULT: '#FAF6EC', dark: '#F0E9D6' },
        night: { DEFAULT: '#0B1815', card: '#12241F' },
      },
      fontFamily: {
        sans: ['Inter', 'Noto Nastaliq Urdu', 'system-ui', 'sans-serif'],
        arabic: ['Amiri', 'serif'],
        urdu: ['Noto Nastaliq Urdu', 'serif'],
      },
    },
  },
  plugins: [],
};
