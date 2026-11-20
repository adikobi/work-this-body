/** @type {import('tailwindcss').Config} */
// Colours come from CSS variables (app/globals.css) so themes can swap them; <alpha-value> keeps bg-work/20 working.
const v = (name) => `rgb(var(--${name}) / <alpha-value>)`;

const config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.ts"],
  future: { hoverOnlyWhenSupported: true }, // hover styles never fire on touch
  theme: {
    extend: {
      colors: {
        ink: { 950: v("ink-950"), 900: v("ink-900"), 800: v("ink-800"), 700: v("ink-700") },
        work: v("work"), // effort
        rest: v("rest"), // recovery
        warn: v("warn"), // final 3 seconds
        "on-accent": v("on-accent"), // text on an accent-filled button
        white: v("white"), // overlay base: white on dark themes, black on light ones
        zinc: { 50: v("z50"), 100: v("z100"), 200: v("z200"), 300: v("z300"), 400: v("z400"), 500: v("z500") },
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glass: "inset 0 1px 0 rgba(255,255,255,0.07), 0 24px 60px -24px rgba(0,0,0,0.8)",
        glow: "0 0 40px -6px rgb(var(--work) / 0.55)",
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
