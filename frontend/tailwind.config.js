/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts}"],
  daisyui: {
    themes: ["cupcake"],
  },
  plugins: [require("daisyui")],
};
