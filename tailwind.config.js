/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {},
    screens: {
      // screen sizes provided by tailwindcss
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      'ipadMini': {'max': '768px'}, //customized max-width screen sizes for media query
      'iPhone' : {'max': '376px'},

      
      
    },
  },
  plugins: [],
}

