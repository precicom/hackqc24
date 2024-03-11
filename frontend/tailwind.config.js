/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts}"],
  daisyui: {
    themes: [
      {
        cupcake: {
          ...require("daisyui/src/theming/themes")["cupcake"]     
          // customize the cupcake theme here   
        }
      }         
    ],
  },
  plugins: [require("daisyui")],
};
