/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        naano: {
          blue: "#2F5AF7",
          dark: "#0F1222",
        },
      },
      borderRadius: {
        card: "1.75rem",
      },
    },
  },
  plugins: [],
}
