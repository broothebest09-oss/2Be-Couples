/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#E8A5B9', // soft rose
        secondary: '#FFF4E6', // warm cream
        accent: '#9B4D6F', // deep berry
        bgLight: '#FFF9F5',
        bgDark: '#1A1416',
        textPrimaryLight: '#2D1F24',
        textPrimaryDark: '#F5E6EA',
        textSecondaryLight: '#8B7578',
        textSecondaryDark: '#A89598',
        success: '#7FB77E',
        error: '#D64545',
        softrose: '#E8A5B9',
        warmcream: '#FFF4E6',
        deepberry: '#9B4D6F',
      },
      borderRadius: {
        'card': '16px',
        'button': '24px',
        'avatar': '999px',
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      spacing: {
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
        '16': '64px',
      },
      boxShadow: {
        'soft': '0 8px 24px -4px rgba(155, 77, 111, 0.08)',
        'rose-glow': '0 8px 25px -4px rgba(232, 165, 185, 0.35)',
      },
      animation: {
        'spring-press': 'springPress 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'pulse-subtle': 'pulseSubtle 2s ease-in-out infinite',
      },
      keyframes: {
        springPress: {
          '0%': { transform: 'scale(1)' },
          '40%': { transform: 'scale(0.94)' },
          '100%': { transform: 'scale(1)' },
        },
        pulseSubtle: {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.05)', opacity: '0.9' },
        }
      }
    },
  },
  plugins: [],
}
