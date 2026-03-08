/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  safelist: [
    'text-blue-400',
    'text-green-400',
    'text-purple-400',
    'text-orange-400',
    'text-yellow-400',
    'text-red-400',
    'from-red-600',
    'to-red-700',
    'from-blue-600',
    'to-blue-700',
    'from-gray-600',
    'to-gray-700',
    'text-emerald-400',
    'text-amber-400',
    'text-cyan-400',
  ],
  theme: {
    extend: {
      keyframes: {
        'ripple-ring': {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(1.8)', opacity: '0' },
        },
      },
      animation: {
        'ripple-ring': 'ripple-ring 1.2s ease-out infinite',
      },
    },
  },
  plugins: [],
};
