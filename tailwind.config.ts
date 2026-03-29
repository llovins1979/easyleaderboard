import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f3f8f5',
          100: '#dceee4',
          500: '#2f7f5f',
          700: '#1d5f45',
          900: '#0f3323'
        },
        sand: '#efe5d6'
      }
    }
  },
  plugins: []
};

export default config;
