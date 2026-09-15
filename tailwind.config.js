/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.tsx', './src/**/*.{js,ts,jsx,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        heading: ['CormorantGaramond_700Bold'],
        section: ['PlayfairDisplay_700Bold'],
        body: ['Poppins_400Regular'],
        medium: ['Poppins_500Medium'],
        semibold: ['Poppins_600SemiBold'],
        bold: ['Poppins_700Bold'],
      },

      colors: {
        cream: {
          50: '#FFFDF8',
          100: '#FAF4E8',
          200: '#F0E4D0',
          300: '#E4D2B8',
        },
        forest: {
          50: '#EEF7F0',
          100: '#D9EDDE',
          200: '#B9DCBE',
          300: '#88C394',
          400: '#4C9A61',
          500: '#236B45',
          600: '#1B5938',
          700: '#16482F',
          800: '#103923',
          900: '#0B2818',
        },
        terracotta: {
          100: '#FFF0DF',
          200: '#F8D6AF',
          400: '#F0A353',
          500: '#DB7B2E',
          600: '#B95F1E',
        },
        lavender: {
          50: '#F5F0FF',
          100: '#E9DEFF',
          200: '#D6C2FA',
          500: '#7653B8',
          600: '#60419B',
        },
        mist: {
          50: '#F0FAF9',
          100: '#D9F1EE',
          200: '#B8E2DD',
          500: '#287B76',
        },
        sand: {
          200: '#E8DCC8',
          300: '#D9C9AC',
          400: '#C4B094',
        },
      },
    },
  },
  plugins: [],
};