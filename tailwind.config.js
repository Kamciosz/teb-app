/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        teb: {
          primary: '#0052cc', // Example TEB blue, adjust as needed
          secondary: '#ffcc00', // Example TEB yellow
        }
      }
    },
  },
  plugins: [],
}
