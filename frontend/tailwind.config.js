/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: "#0d0f12",
        pixelDark: "#12161b",
        pixelCard: "#181e26",
        pixelBorder: "#2a3442",
        neonGreen: "#00ff66",
        neonCyan: "#00f0ff",
        neonPink: "#ff0055",
        neonYellow: "#ffee00",
      },
      fontFamily: {
        mono: ['"Courier New"', "Courier", "monospace"]
      }
    },
  },
  plugins: [],
}
