/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        maincolor: "#55FF06", // Replace with your desired hex color code
      },
    },
  },
  plugins: [],
};
