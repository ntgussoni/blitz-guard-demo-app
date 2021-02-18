// tailwind.config.js
module.exports = {
  purge: ["{app,pages}/**/*.{js,jsx,ts,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: "#0DA7EB",
        "primary-transparent": "rgba(7,91,125,0.8)",
        text: "#0DA7EB",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
