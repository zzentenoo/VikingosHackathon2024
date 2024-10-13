/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {fontFamily: {
        rubik: ['"Rubik One"', 'sans-serif'],
      }},
  },
  plugins: [],
}

