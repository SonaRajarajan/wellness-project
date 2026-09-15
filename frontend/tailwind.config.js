/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: "#0b071e",
        cosmicDark: "#0b071e",
        cosmicSpace: "#120a2e",
        cosmicCard: "#180e3d",
        pixelDark: "#12161b",
        pixelCard: "#181e26",
        pixelBorder: "#2b1b54",
        neonGreen: "#00ff66",
        neonCyan: "#00f0ff",
        neonPink: "#ff007f",
        neonYellow: "#ffe600",
        pixelPink: "#ff007f",
        pixelCyan: "#00f0ff",
        pixelYellow: "#ffe600",
        pixelGreen: "#00ff66",
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'cursive', 'monospace'],
        silkscreen: ['"Silkscreen"', 'cursive', 'monospace'],
        vt323: ['"VT323"', 'monospace'],
        pixelify: ['"Pixelify Sans"', 'sans-serif'],
        mono: ['"VT323"', '"Press Start 2P"', '"Courier New"', 'monospace'],
      }
    },
  },
  plugins: [],
}
