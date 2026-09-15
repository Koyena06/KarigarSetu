/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.tsx', './src/**/*.{js,ts,jsx,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      // Keep in sync with src/theme/colors.ts (used where RN needs raw values).
      colors: {
        leaf: {
          50: '#EDF4EF',
          100: '#D5E6DA',
          200: '#AFCDB8',
          300: '#7FAE8D',
          400: '#4E8A62',
          500: '#1F6B47',
          600: '#195A3C',
          700: '#144A31',
          800: '#0F3A27',
          900: '#0A2A1C',
        },
        paper: {
          50: '#FBFAF6',
          100: '#F4F1E9',
          200: '#E8E3D7',
          300: '#D6CFBF',
        },
        ink: {
          300: '#BEC4BF',
          400: '#98A09A',
          500: '#737D76',
          600: '#56615A',
          700: '#3B463F',
          800: '#26302A',
          900: '#161D19',
        },
        clay: {
          50: '#FAEEE6',
          100: '#F3D9C8',
          500: '#B4572B',
          600: '#96451F',
        },
        gold: {
          50: '#FFF8E6',
          100: '#FCEBBE',
          200: '#F6D98A',
          300: '#EEC55A',
          400: '#E2AE2E',
          500: '#C99419',
          600: '#A37612',
          700: '#7A580E',
        },
        saffron: {
          50: '#FAF2DE',
          100: '#F2E2B8',
          500: '#B5832A',
        },
      },
      fontFamily: {
        display: ['Fraunces_600SemiBold'],
        body: ['NotoSans_400Regular'],
        'body-medium': ['NotoSans_500Medium'],
        'body-semibold': ['NotoSans_600SemiBold'],
        'body-bold': ['NotoSans_700Bold'],
      },
    },
  },
  plugins: [],
};
