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
      },
      animation: {
        spin360: 'spin360 1s linear infinite',
      },
    },
  },
  plugins: [],
}