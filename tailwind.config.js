/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'quicksand': ['Quicksand', 'sans-serif'],
        'baloo': ['Baloo 2', 'cursive'],
        'poppins': ['Poppins', 'sans-serif'],
      },
      colors: {
        cute: {
          'baby-pink': '#FBCFE8',
          'mint-green': '#A7F3D0',
          'pastel-yellow': '#FEF9C3',
          'charcoal': '#374151',
          'cloud-pink': '#FCE7F3',
          'cloud-purple': '#E9D5FF',
          'cloud-blue': '#DBEAFE',
        },
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'float-reverse': 'float-reverse 7s ease-in-out infinite',
        'bounce-slow': 'bounce 3s infinite',
        'wiggle': 'wiggle 0.5s ease-in-out',
        'shimmer': 'shimmer 2s linear infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bubble-bounce': 'bubble-bounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'float-reverse': {
          '0%, 100%': { transform: 'translateY(-10px)' },
          '50%': { transform: 'translateY(10px)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'bubble-bounce': {
          '0%': { transform: 'scale(0.8) translateY(10px)', opacity: '0' },
          '50%': { transform: 'scale(1.05) translateY(-5px)', opacity: '1' },
          '100%': { transform: 'scale(1) translateY(0px)', opacity: '1' },
        },
      }
    },
  },
  plugins: [],
};