// localStorage can throw (private mode, blocked cookies) — never let it break the app.
export const read = (k: string): string | null => {
  try { return window.localStorage.getItem(k); } catch { return null; }
};
export const write = (k: string, v: string) => {
  try { window.localStorage.setItem(k, v); } catch { /* ignore */ }
};
export const today = () => new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD, local time
