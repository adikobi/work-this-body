import {
  bookends as baseBookends,
  categories as baseCategories,
  exercises as baseExercises,
  levels as baseLevels,
  type Category,
  type Exercise,
} from "../exercises";
import type { Locale } from "./config";
import { he } from "./he";
import type { ContentPack } from "./types";

/** English is the source of truth in lib/exercises.ts, so it needs no pack. Add a language by adding a pack here. */
const packs: Record<Locale, ContentPack | null> = { en: null, he };

export interface Content {
  exercises: Exercise[];
  categories: Category[];
  levels: typeof baseLevels;
  byId: (id: string) => Exercise;
  bookends: (cat: string, limit?: number) => { warmup: Exercise[]; cooldown: Exercise[] };
}

function build(pack: ContentPack): Content {
  const warn = process.env.NODE_ENV !== "production";

  const translate = (name: string) => {
    const hit = pack.muscles[name];
    if (!hit && warn) console.warn(`[i18n] no translation for muscle "${name}"`);
    return hit ?? name;
  };

  const exercises = baseExercises.map((e): Exercise => {
    const t = pack.exercises[e.id];
    if (!t) {
      if (warn) console.warn(`[i18n] no translation for exercise "${e.id}"`);
      return e;
    }
    return {
      ...e,
      name: t.name,
      tagline: t.tagline,
      steps: t.steps,
      cues: t.cues,
      muscles: { primary: e.muscles.primary.map(translate), secondary: e.muscles.secondary.map(translate) },
    };
  });

  const categories = baseCategories.map((c): Category => ({ ...c, ...pack.categories[c.id] }));
  const levels = Object.fromEntries(
    Object.entries(baseLevels).map(([k, v]) => [k, { ...v, label: pack.levels[k as keyof typeof baseLevels] ?? v.label }]),
  ) as typeof baseLevels;

  const index = new Map(exercises.map((e) => [e.id, e]));
  const byId = (id: string) => index.get(id) ?? exercises[0];
  const bookends = (cat: string, limit?: number) => {
    const b = baseBookends(cat, limit);
    return { warmup: b.warmup.map((e) => byId(e.id)), cooldown: b.cooldown.map((e) => byId(e.id)) };
  };

  return { exercises, categories, levels, byId, bookends };
}

const cache = new Map<Locale, Content>();

/** The catalog in one language. Same ids, order, timings and motion in every language; only the words change. */
export function getContent(locale: Locale): Content {
  const hit = cache.get(locale);
  if (hit) return hit;
  const pack = packs[locale];
  const base = new Map(baseExercises.map((e) => [e.id, e]));
  const content: Content = pack
    ? build(pack)
    : {
        exercises: baseExercises,
        categories: baseCategories,
        levels: baseLevels,
        byId: (id) => base.get(id) ?? baseExercises[0],
        bookends: baseBookends,
      };
  cache.set(locale, content);
  return content;
}
