import type { Locale } from "./config";
import type { ThemeId } from "../theme";

/** Every UI string that isn't exercise content. Functions take the dynamic parts so word order can differ per language. */
export interface Messages {
  meta: { title: string; description: string };
  language: string;
  theme: string;
  themes: Record<ThemeId, string>;
  filterByDifficulty: string;
  allLevels: string;
  exercisesNav: string;
  completedToday: string;
  todayLong: (done: number, total: number) => string;
  todayShort: (done: number, total: number) => string;

  stage: string;
  status: { done: string; ready: string; paused: string; getReady: string; rest: string; work: string };
  hold: string;
  nextSide: (side: string) => string;
  nextSet: string;
  sideLeft: string;
  sideRight: string;
  setOf: (n: number, total: number) => string;
  setProgress: string;
  reset: string;
  pause: string;
  restart: string;
  start: string;
  muteCues: string;
  unmuteCues: string;
  nextExercise: (name: string) => string;
  skipRest: string;
  skipToNext: string;
  live: (label: string, set: number, total: number, side: string | null) => string;
  spaceHint: string;
  secs: (n: number) => string;
  summary: (sets: number, work: number, rest: number) => string;

  guide: {
    alternate: string;
    warmup: string;
    cooldown: string;
    howTo: string;
    keyCues: string;
    safety: string;
    bookendsTitle: string;
    bookendsHint: string;
    before: string;
    after: string;
  };
  visualizerAlt: string;
}

const en: Messages = {
  meta: {
    title: "work-this-body — guided mobility & strength",
    description: "Interval timer with a live motion guide for knee, core, upper-body and posture exercises.",
  },
  language: "Language",
  theme: "Theme",
  themes: { volt: "Volt", ember: "Ember", glacier: "Glacier", rose: "Rose", gold: "Gold", mono: "Mono", plum: "Plum", forest: "Forest", light: "Light", sand: "Sand" },
  filterByDifficulty: "Filter by difficulty",
  allLevels: "All levels",
  exercisesNav: "Exercises",
  completedToday: "completed today",
  todayLong: (d, n) => `Today: ${d} / ${n} done`,
  todayShort: (d, n) => `Today ${d}/${n}`,

  stage: "Exercise stage",
  status: { done: "Done", ready: "Ready", paused: "Paused", getReady: "Get ready", rest: "Rest", work: "Work" },
  hold: "Hold",
  nextSide: (s) => `Next: ${s}`,
  nextSet: "Next set",
  sideLeft: "Left",
  sideRight: "Right",
  setOf: (n, total) => `Set ${n} / ${total}`,
  setProgress: "Set progress",
  reset: "Reset timer",
  pause: "Pause",
  restart: "Restart",
  start: "Start",
  muteCues: "Mute cues",
  unmuteCues: "Unmute cues",
  nextExercise: (name) => `Next: ${name} →`,
  skipRest: "Skip rest",
  skipToNext: "Next exercise →",
  live: (label, set, total, side) => `${label}, set ${set} of ${total}${side ? `, ${side} side` : ""}`,
  spaceHint: "Press Space to start or pause",
  secs: (n) => `${n}s`,
  summary: (sets, work, rest) => `${sets} × ${work}s · ${rest}s rest`,

  guide: {
    alternate: "Alternate sides each set.",
    warmup: "Warm-up",
    cooldown: "Cool-down",
    howTo: "How to do it",
    keyCues: "Key cues",
    safety: "Stop if you feel sharp or joint pain. If you have a current knee, back or pelvic condition, check with a clinician first.",
    bookendsTitle: "Warm up and cool down",
    bookendsHint: "Suggested bookends for this kind of workout.",
    before: "Before",
    after: "After",
  },
  visualizerAlt: "Animated stick-figure demonstration of the exercise",
};

// Hebrew uses plural imperatives ("התחילו", "שכבו"), the usual gender-neutral register for instructions.
const he: Messages = {
  meta: {
    title: "work-this-body — ניידות וכוח מודרכים",
    description: "טיימר אינטרוולים עם מדריך תנועה חי לתרגילי ברך, ליבה, גוף עליון ויציבה.",
  },
  language: "שפה",
  theme: "ערכת נושא",
  themes: { volt: "וולט", ember: "גחלת", glacier: "קרחון", rose: "ורד", gold: "זהב", mono: "מונו", plum: "שזיף", forest: "יער", light: "בהיר", sand: "חול" },
  filterByDifficulty: "סינון לפי רמת קושי",
  allLevels: "כל הרמות",
  exercisesNav: "תרגילים",
  completedToday: "הושלם היום",
  todayLong: (d, n) => `היום: ${d} מתוך ${n} הושלמו`,
  todayShort: (d, n) => `היום ${d}/${n}`,

  stage: "אזור התרגיל",
  status: { done: "הושלם", ready: "מוכנים", paused: "מושהה", getReady: "התכוננו", rest: "מנוחה", work: "מאמץ" },
  hold: "החזקה",
  nextSide: (s) => `הבא: ${s}`,
  nextSet: "הסט הבא",
  sideLeft: "שמאל",
  sideRight: "ימין",
  setOf: (n, total) => `סט ${n} / ${total}`,
  setProgress: "התקדמות הסטים",
  reset: "איפוס הטיימר",
  pause: "השהיה",
  restart: "התחלה מחדש",
  start: "התחלה",
  muteCues: "השתקת צלילי הטיימר",
  unmuteCues: "הפעלת צלילי הטיימר",
  nextExercise: (name) => `הבא: ${name} ←`, // the arrow points the way the text reads
  skipRest: "דלגו על המנוחה",
  skipToNext: "לתרגיל הבא ←",
  live: (label, set, total, side) => `${label}, סט ${set} מתוך ${total}${side ? `, צד ${side}` : ""}`,
  spaceHint: "לחצו על מקש הרווח (Space) כדי להתחיל או להשהות",
  secs: (n) => `${n} שנ׳`,
  summary: (sets, work, rest) => `${sets} × ${work} שנ׳ · ${rest} שנ׳ מנוחה`,

  guide: {
    alternate: "החליפו צד בכל סט.",
    warmup: "חימום",
    cooldown: "קירור",
    howTo: "איך מבצעים",
    keyCues: "דגשים עיקריים",
    safety: "הפסיקו אם אתם מרגישים כאב חד או כאב במפרק. אם יש לכם כרגע בעיה בברך, בגב או באגן, היוועצו קודם באיש מקצוע רפואי.",
    bookendsTitle: "חימום וקירור",
    bookendsHint: "הצעות לפני ואחרי סוג אימון כזה.",
    before: "לפני",
    after: "אחרי",
  },
  visualizerAlt: "הדגמה מונפשת של התרגיל בדמות מקלות",
};

export const messages: Record<Locale, Messages> = { en, he };
