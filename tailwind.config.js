/* eslint-disable global-require */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    fontFamily: {
      sans: ['"Lexend Deca"', 'Montserrat', 'arial', 'sans-serif'],
    },
    extend: {},
  },
  plugins: [require('@tailwindcss/forms')],
};

// Fonts
// https://fonts.google.com/specimen/Oxygen
// https://fonts.google.com/specimen/Lexend+Deca
// https://fonts.google.com/specimen/Montserrat
