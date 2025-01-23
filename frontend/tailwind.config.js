/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/components/*.jsx",
    "./src/views/*.jsx",
    "./src/pages/*.jsx",
    "./src/App.jsx",
    "./src/Layout.jsx"
  ],
  theme: {
    extend: {
      keyframes: {
        spin360: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
      animation: {
        spin360: 'spin360 1s linear infinite',
        slideLeft: 'slideLeft 10s linear infinite',
      },
    },
  },
  plugins: [],
}
