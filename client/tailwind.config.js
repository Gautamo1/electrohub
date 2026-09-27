/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef4ff',
          100: '#dbe6fe',
          200: '#bfd3fe',
          300: '#93b4fd',
          400: '#6090fa',
          500: '#3b6df6',
          600: '#2554eb',
          700: '#1d43d8',
          800: '#1e39af',
          900: '#1e348a',
          950: '#172154',
        },
        neon: {
          400: '#22d3ee',
          500: '#06b6d4',
        },
      },
      fontFamily: {
        sans: [
          'Inter var', 'Inter', 'ui-sans-serif', 'system-ui', '-apple-system',
          'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif',
        ],
      },
      boxShadow: {
        glow: '0 0 24px rgba(59, 109, 246, 0.35)',
        'glow-cyan': '0 0 24px rgba(34, 211, 238, 0.28)',
        card: '0 8px 30px rgba(15, 23, 42, 0.08)',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.5s ease-out both',
        'pulse-soft': 'pulse 2.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        float: 'float 7s ease-in-out infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
      },
    },
  },
  plugins: [],
};
