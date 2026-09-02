/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        slate: {
          950: '#0f172a',
        },
        primary: {
          DEFAULT: '#0f172a',
          soft: '#e2e8f0',
        },
        accent: '#2563eb',
        success: '#16a34a',
        warning: '#d97706',
        danger: '#dc2626',
      },
      boxShadow: {
        soft: '0 10px 30px rgba(15, 23, 42, 0.08)',
      },
    },
  },
  plugins: [],
}
