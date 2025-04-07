/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: {
          light: '#f5f5f0',
          dark: '#202C33'
        },
        text: {
          light: '#1f2937',
          dark: '#e5e7eb'
        },
        primary: '#146EBE',
        secondary: '#4c9ed9',
        accent: '#e5e7eb',
        'kian-dark': '#131921',
        'kian-light': '#f8fafc',
        'kian-blue': {
          100: '#e6f2ff',
          200: '#c8e4ff',
          300: '#99ccff',
          400: '#66b3ff',
          500: '#3399ff',
          600: '#146EBE',
          700: '#0056b3',
          800: '#004080',
          900: '#002952',
        },
      },
    },
  },
  plugins: [],
} 