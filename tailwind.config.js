/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        outfit: ["Outfit", "system-ui", "sans-serif"],
      },
      colors: {
        primary: {
          DEFAULT: "#0066FF",
          dark: "#0052CC",
          light: "#3385FF",
        },
        success: "#10B981",
        warning: "#F59E0B",
        error: "#EF4444",
      },
    },
  },
  plugins: [],
};
