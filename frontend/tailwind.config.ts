import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#17202a",
        panel: "#f8fafc",
        line: "#d9e2ec",
        brand: "#0f766e",
        accent: "#e11d48"
      },
      boxShadow: {
        soft: "0 18px 55px rgba(15, 23, 42, 0.10)"
      }
    }
  },
  plugins: []
} satisfies Config;
