/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Include toate fișierele JS/JSX/TS/TSX din folderul src
    "./public/index.html"        // Include și index.html dacă vei folosi clase acolo
  ],
  theme: {
    extend: {}, // Aici poți extinde tema default Tailwind (culori, fonturi, etc.)
  },
  plugins: [], // Aici poți adăuga plugin-uri Tailwind
}