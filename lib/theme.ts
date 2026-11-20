// Theme ids match [data-theme] in app/globals.css. `page` is also the browser's theme-color.
export const THEMES = [
  { id: "volt", ground: "#0c0f0d", page: "#070908", accent: "#c9f25c" },
  { id: "ember", ground: "#120d0a", page: "#0b0807", accent: "#ff8a3d" },
  { id: "glacier", ground: "#0a111a", page: "#060a10", accent: "#7cc4ff" },
  { id: "rose", ground: "#121011", page: "#0a0809", accent: "#ff7f9e" },
  { id: "gold", ground: "#100f0c", page: "#090907", accent: "#f5b73d" },
  { id: "mono", ground: "#0a0a0a", page: "#000000", accent: "#f4f4f5" },
  { id: "plum", ground: "#150c15", page: "#0d070d", accent: "#f08ad0" },
  { id: "forest", ground: "#0a110c", page: "#060a07", accent: "#3ddc97" },
  { id: "light", ground: "#ffffff", page: "#f6f5f1", accent: "#2f7a1f" },
  { id: "sand", ground: "#fbf7ef", page: "#f3ede2", accent: "#b4491f" },
] as const;

export type ThemeId = (typeof THEMES)[number]["id"];
export const THEME_KEY = "wtb:theme";
export const defaultTheme: ThemeId = "volt";

export const isTheme = (v: unknown): v is ThemeId => THEMES.some((t) => t.id === v);

export function applyTheme(id: ThemeId) {
  const t = THEMES.find((x) => x.id === id) ?? THEMES[0];
  document.documentElement.setAttribute("data-theme", t.id);
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", t.page);
}
