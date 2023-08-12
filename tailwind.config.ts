import type {Config} from 'tailwindcss';

export default {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  plugins: [require('daisyui')],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: ['light'],
  },
} satisfies Config;
