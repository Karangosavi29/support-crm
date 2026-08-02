/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      colors: {
        ink: "#161A21",
        paper: "#EEF0EE",
        slate: {
          850: "#1D222C",
        },
        signal: {
          open: "#B5541E",
          progress: "#2454B8",
          closed: "#25794F",
        },
      },
    },
  },
  plugins: [],
};
