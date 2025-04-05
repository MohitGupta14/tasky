/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',  // For the new App Directory
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
        fontFamily: {

          lato: ['Funnel Display', 'Lato', 'sans-serif'], // 'sans-serif' as fallback
        },

    },
  },
  plugins: [],
}