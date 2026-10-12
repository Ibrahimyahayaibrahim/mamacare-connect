/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        clay: {
          50: "#fdf5f1",
          100: "#fbe8de",
          200: "#f5cdb8",
          300: "#eba883",
          400: "#df7f52",
          500: "#cf5f30",
          600: "#b04824",
          700: "#8c3820",
          800: "#712f1f",
          900: "#5e291d",
        },
        sage: {
          50: "#f2f7f4",
          100: "#e1ede4",
          200: "#c3dbca",
          300: "#98c1a5",
          400: "#699f7c",
          500: "#48815e",
          600: "#37674a",
          700: "#2d523c",
          800: "#264232",
          900: "#20372b",
        },
      },
      fontFamily: {
        display: ["Poppins", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
