/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.ts"],
  future: { hoverOnlyWhenSupported: true }, // hover styles never fire on touch
  theme: {
    extend: {
      colors: {
        ink: { 950: "#070908", 900: "#0c0f0d", 800: "#141916", 700: "#1d241f" },
        work: "#c9f25c", // effort
        rest: "#5cc8f2", // recovery
        warn: "#ff7a59", // final 3 seconds
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glass: "inset 0 1px 0 rgba(255,255,255,0.07), 0 24px 60px -24px rgba(0,0,0,0.8)",
        glow: "0 0 40px -6px rgba(201,242,92,0.55)",
      },
      transitionTimingFunction: {
        snap: "cubic-bezier(0.23, 1, 0.32, 1)", // strong ease-out
        move: "cubic-bezier(0.77, 0, 0.175, 1)", // on-screen movement
      },
      keyframes: {
        rise: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pop: {
          "0%": { opacity: "0.55", transform: "scale(1.16)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        rise: "rise 300ms cubic-bezier(0.23, 1, 0.32, 1) both",
        pop: "pop 220ms cubic-bezier(0.23, 1, 0.32, 1) both",
      },
    },
  },
  plugins: [],
};

export default config;
