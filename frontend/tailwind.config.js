/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#E1F5EE",
          100: "#9FE1CB",
          200: "#5DCAA5",
          300: "#1D9E75",
          400: "#0F6E56",
          500: "#085041",
          600: "#04342C",
        },
        amber: {
          50:  "#FAEEDA",
          100: "#FAC775",
          200: "#EF9F27",
          300: "#854F0B",
          400: "#633806",
        },
      },
      fontFamily: {
        sans:    ["Outfit", "sans-serif"],
        display: ["Playfair Display", "serif"],
      },
      animation: {
        "fade-up":   "fadeUp 0.35s ease both",
        "fade-in":   "fadeIn 0.25s ease both",
        "spin-slow": "spin 1s linear infinite",
        "scan":      "scan 2s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: 0, transform: "translateY(12px)" },
          to:   { opacity: 1, transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: 0 },
          to:   { opacity: 1 },
        },
        scan: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%":      { transform: "translateY(224px)" }, // 56rem max-h-56
        }
      },
    },
  },
  plugins: [],
};
