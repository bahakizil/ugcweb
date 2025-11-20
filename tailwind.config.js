import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Space Grotesk"', '"Inter"', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        'brand-canvas': 'var(--color-canvas)',
        'brand-surface': 'var(--color-surface)',
        'brand-border': 'var(--color-border)',
        'brand-muted': 'var(--color-muted)',
        'brand-ink': 'var(--color-ink)',
        'brand-primary': '#4F46E5',
        'brand-secondary': '#0EA5E9',
        'brand-accent': '#8B5CF6',
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
        '4xl': '2.25rem',
      },
      boxShadow: {
        brand: '0 24px 80px -40px rgba(15,23,42,0.65)',
      },
    },
  },
  plugins: [],
};
