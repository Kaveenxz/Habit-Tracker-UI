import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'ff-primary': '#FFA500',
        'ff-secondary': '#FF4500',
        'ff-dark': '#1A1A1A',
        'ff-light': '#F5F5F5',
        'ff-accent': '#00BFFF',
      },
      fontFamily: {
        'ff-main': ['"Rajdhani"', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
