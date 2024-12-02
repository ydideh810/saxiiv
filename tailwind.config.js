/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'press-start': ['"Press Start 2P"', 'cursive'],
      },
      colors: {
        theme: 'var(--theme-color)',
      },
      backgroundColor: {
        'theme-10': 'rgb(var(--theme-color-rgb) / 0.1)',
        'theme-20': 'rgb(var(--theme-color-rgb) / 0.2)',
      },
    },
  },
  plugins: [],
};