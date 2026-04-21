/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#080515',
          900: '#0f0a1e',
          800: '#160f2e',
          700: '#1e1540',
          600: '#2a1f5c',
        },
        brand: {
          400: '#a855f7',
          500: '#7c3aed',
          600: '#6d28d9',
          700: '#5b21b6',
        },
        neon: {
          green: '#22c55e',
          teal: '#06b6d4',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px #7c3aed, 0 0 10px #7c3aed' },
          '100%': { boxShadow: '0 0 20px #7c3aed, 0 0 40px #7c3aed' },
        },
      },
    },
  },
  plugins: [],
};
