/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        alibaba: ['Alibaba Sans', 'sans-serif'],
      },
      colors: {
        primary: '#0099CC',
        secondary: '#FF6B6B',
        lightGray: '#F5F7FA',
        textPrimary: '#333333',
      },
    },
  },
  plugins: [
    require('daisyui'),
  ],
}

