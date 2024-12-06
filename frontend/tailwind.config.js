/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        maincolor: '#55FF06', // Thêm màu chính vào theme (có thể thay đổi mã màu theo ý muốn)
      },
    },
  },
  plugins: [],
};
