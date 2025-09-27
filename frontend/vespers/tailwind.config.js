/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // dark UI base
        dark: {
          900: "#0b0f0e",
          800: "#111817",
          700: "#1a2423",
        },
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        "glow-emerald": "0 0 25px rgba(16, 185, 129, 0.35)",
        "glow-cyan": "0 0 25px rgba(34, 211, 238, 0.35)",
      },
      fontFamily: {
        display: ["Playfair Display", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-10px) rotate(1deg)" },
        },
        glow: {
          "0%, 100%": { opacity: 0.8, filter: "drop-shadow(0 0 15px rgba(16,185,129,0.4))" },
          "50%": { opacity: 1, filter: "drop-shadow(0 0 30px rgba(34,211,238,0.5))" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        glow: "glow 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
