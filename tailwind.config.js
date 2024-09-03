/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {},
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      'ipadMini': {'max': '768px'},
      'iPhone' : {'max': '376px'},

      
      
    },
  },
  plugins: [],
}

