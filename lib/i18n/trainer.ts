import type { Locale } from "./config";

export interface TrainerText {
  open: string; title: string; callPlaceholder: string; call: string; noMatch: string;
  presets: string; saved: string; build: string; pickHint: string; search: string; selected: (n: number) => string;
  minutes: (n: number) => string; withBookends: string; start: string; save: string; saveName: string;
  clear: string; surprise: string; up: string; down: string; remove: string; close: string; end: string;
  session: (i: number, n: number) => string; delete: string; empty: string; presetNames: Record<string, string>;
}

export const trainerText: Record<Locale, TrainerText> = {
  en: {
    open: "Personal trainer", title: "Personal trainer", callPlaceholder: "Call a set or exercise by name…", call: "Call",
    noMatch: "Nothing by that name. Try “chest” or “quick”.", presets: "Ready-made sets", saved: "Your sets", build: "Build today's set",
    pickHint: "Tap exercises to add them, in the order you want.", search: "Search exercises", selected: (n) => `${n} selected`,
    minutes: (n) => `≈ ${n} min`, withBookends: "Add warm-up and cool-down", start: "Start session", save: "Save set", saveName: "Name this set",
    clear: "Clear", surprise: "Surprise me", up: "Move up", down: "Move down", remove: "Remove", close: "Close", end: "End session",
    session: (i, n) => `Exercise ${i} of ${n}`, delete: "Delete set", empty: "No exercises yet.",
    presetNames: { quick: "Quick 10", chest: "Chest day", legs: "Legs & hips", core: "Core & posture", knee: "Gentle knee day" },
  },
  he: {
    open: "מאמן אישי", title: "מאמן אישי", callPlaceholder: "קראו לסט או לתרגיל בשמו…", call: "קריאה",
    noMatch: "לא נמצא שם כזה. נסו \u201Cחזה\u201D או \u201Cמהיר\u201D.", presets: "סטים מוכנים", saved: "הסטים שלכם", build: "בנו את הסט להיום",
    pickHint: "הקישו על תרגילים כדי להוסיף אותם, לפי הסדר שבו תרצו לבצע.", search: "חיפוש תרגילים", selected: (n) => `${n} נבחרו`,
    minutes: (n) => `כ-${n} דק׳`, withBookends: "הוסיפו חימום ומתיחות", start: "התחילו אימון", save: "שמרו סט", saveName: "שם לסט",
    clear: "נקו", surprise: "הפתיעו אותי", up: "הזיזו למעלה", down: "הזיזו למטה", remove: "הסירו", close: "סגירה", end: "סיום אימון",
    session: (i, n) => `תרגיל ${i} מתוך ${n}`, delete: "מחקו סט", empty: "עדיין אין תרגילים.",
    presetNames: { quick: "מהיר 10", chest: "יום חזה", legs: "רגליים ואגן", core: "ליבה ויציבה", knee: "יום עדין לברכיים" },
  },
};
