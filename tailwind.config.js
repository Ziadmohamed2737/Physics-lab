/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#0056D2',
        'primary-2': '#0040A1',
        secondary: '#00E3FD',
        surface: '#F8FAFC',
        'on-surface': '#0F172A',
        outline: '#E2E8F0',
      },
      fontFamily: {
        headline: ['"Noto Sans Arabic"', '"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['"Noto Sans Arabic"', '"Manrope"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      keyframes: {
        'rotate-particle': {
          from: { transform: 'rotate(0deg) translateX(80px) rotate(0deg)' },
          to: { transform: 'rotate(360deg) translateX(80px) rotate(-360deg)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.3', transform: 'scale(1)' },
          '50%': { opacity: '0.6', transform: 'scale(1.1)' },
        },
        'spark-flash': {
          '0%, 100%': { opacity: '0', transform: 'scaleY(0.5)' },
          '50%': { opacity: '0.6', transform: 'scaleY(1.5)' },
        },
      },
      animation: {
        'rotate-particle': 'rotate-particle 4s linear infinite',
        'pulse-glow': 'pulse-glow 3s infinite',
        'spark-flash': 'spark-flash 2s infinite ease-in-out',
        'slow-spin': 'spin 8s linear infinite',
      },
      boxShadow: {
        glow: '0 0 30px rgba(0,227,253,0.25)',
      },
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#0056D2',
        'primary-2': '#0040A1',
        secondary: '#00E3FD',
        surface: '#F8FAFC',
        'on-surface': '#0F172A',
        outline: '#E2E8F0',
      },
      fontFamily: {
        headline: ['"Noto Sans Arabic"', '"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['"Noto Sans Arabic"', '"Manrope"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      keyframes: {
        'rotate-particle': {
          from: { transform: 'rotate(0deg) translateX(80px) rotate(0deg)' },
          to: { transform: 'rotate(360deg) translateX(80px) rotate(-360deg)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.3', transform: 'scale(1)' },
          '50%': { opacity: '0.6', transform: 'scale(1.1)' },
        },
        'spark-flash': {
          '0%, 100%': { opacity: '0', transform: 'scaleY(0.5)' },
          '50%': { opacity: '0.6', transform: 'scaleY(1.5)' },
        },
      },
      animation: {
        'rotate-particle': 'rotate-particle 4s linear infinite',
        'pulse-glow': 'pulse-glow 3s infinite',
        'spark-flash': 'spark-flash 2s infinite ease-in-out',
        'slow-spin': 'spin 8s linear infinite',
      },
      boxShadow: {
        glow: '0 0 30px rgba(0,227,253,0.25)',
      },
    },
  },
  plugins: [],
}

