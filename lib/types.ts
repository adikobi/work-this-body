import type { Level } from "../exercises";

/** The translatable text of one exercise. Everything else (timings, motion, ids) stays in lib/exercises.ts. */
export interface ExerciseText {
  name: string;
  tagline: string;
  steps: string[]; // same length as the English steps
  cues: string[]; // same length as the English cues
}

export interface CategoryText { name: string; short: string }

/** Everything needed to show the exercise catalog in one more language. */
export interface ContentPack {
  categories: Record<string, CategoryText>;
  levels: Record<Level, string>;
  /** English muscle name -> translated name. Shared by every exercise. */
  muscles: Record<string, string>;
  exercises: Record<string, ExerciseText>;
}
