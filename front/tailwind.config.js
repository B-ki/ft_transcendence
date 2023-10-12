/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    colors: {
      primary: '#023A15',
      accent: '#F09C96',
      'dark-1': '#1C1C1C',
      'dark-2': '#343434',
      'dark-3': '#7E868C',
      'darkBlue-1': '#335C67',
      'darkBlue-2': '#37626D',
      'darkBlue-3': '#142429',
      'white-1': '#FFFFFF',
      'white-2': '#F8F9FA',
      'white-3': '#DFE3E6',
      red: '#E84057',
      'red-bg': '#FDE8E8',
      blue: '#5383E8',
      'blue-bg': '#ECF2FF',
      grey: '#758492',
      'grey-bg': '#F7F7F9',
    },
    fontFamily: {
      sans: ['Roboto', 'sans-serif'],
    },
    extend: {},
  },
  plugins: [],
};
