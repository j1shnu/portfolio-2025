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
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
