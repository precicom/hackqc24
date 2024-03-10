/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,ts}"],
  daisyui: {
    themes: ["lemonade", "dracula"],
  },
  plugins: [require("daisyui")],
};
