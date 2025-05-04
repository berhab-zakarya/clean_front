import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        regular: ["var(--font-regular)"],
        bold: ["var(--font-bold)"],
        black: ["var(--font-black)"],
        extrabold: ["var(--font-extrabold)"],
        extralight: ["var(--font-extralight)"],
        light: ["var(--font-light)"],
        medium: ["var(--font-medium)"],
        semibold: ["var(--font-semibold)"],
        thin: ["var(--font-thin)"],
        variable: ["var(--font-variable)"],
        revolution: ["var(--font-revolution)"],
      },
      keyframes: {
        "marquee-x": {
         from: { transform: "translateX(0)" },
         to: { transform: "translateX(calc(-100% - var(--gap)))" },
       },
       "marquee-y": {
         from: { transform: "translateY(0)" },
         to: { transform: "translateY(calc(-100% - var(--gap)))" },
       },
     },
     animation: {
       "marquee-horizontal": "marquee-x var(--duration) infinite linear",
       "marquee-vertical": "marquee-y var(--duration) linear infinite",
       },
    },
  },
  plugins: [],
};

export default config;
