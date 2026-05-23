/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        plum: {
          50: "#f8f5ff",
          100: "#f1ebff",
          200: "#e4d8ff",
          300: "#cfb5ff",
          400: "#b48cff",
          500: "#9864ff",
          600: "#7f44f6",
          700: "#6b33d2",
          800: "#572aae",
          900: "#311553",
        },
        midnight: "#120a24",
        ink: "#231536",
      },
      boxShadow: {
        glow: "0 30px 80px rgba(95, 52, 191, 0.24)",
        card: "0 18px 45px rgba(18, 10, 36, 0.12)",
      },
      backgroundImage: {
        hero:
          "radial-gradient(circle at top left, rgba(196, 172, 255, 0.36), transparent 32%), radial-gradient(circle at top right, rgba(143, 100, 255, 0.18), transparent 28%), linear-gradient(135deg, #120a24 0%, #231536 48%, #3b1b68 100%)",
        cta: "linear-gradient(135deg, #6b33d2 0%, #9864ff 45%, #c3a4ff 100%)",
        surface:
          "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(245,240,255,0.92) 100%)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};
