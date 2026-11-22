import type { Exercise } from "./exercises";
import { read, write } from "./storage";

export interface Plan { name: string; ids: string[]; preset?: string }
const KEY = "wtb:plans";

export const loadPlans = (): Plan[] => {
  try { return JSON.parse(read(KEY) ?? "[]"); } catch { return []; }
};
export const savePlans = (p: Plan[]) => write(KEY, JSON.stringify(p));

/** Seconds for one exercise, including the get-ready lead-in. */
export const seconds = (e: Exercise) => 5 + e.sets * e.work + Math.max(0, e.sets - 1) * e.rest;
export const minutesOf = (list: Exercise[]) => Math.max(1, Math.round(list.reduce((a, e) => a + seconds(e), 0) / 60));

const main = (all: Exercise[]) => all.filter((e) => !e.phase);
const take = (all: Exercise[], cats: string[], n: number, levels?: string[]) =>
  main(all).filter((e) => cats.includes(e.cat) && (!levels || levels.includes(e.level))).slice(0, n).map((e) => e.id);

/** Preset sets, built from categories so they stay valid when exercises change. Ids only. */
export function presetIds(all: Exercise[]): Record<string, string[]> {
  const one = (c: string) => take(all, [c], 1, ["easy"]);
  return {
    quick: ["core", "upper", "hips", "knee", "posture"].flatMap(one),
    chest: take(all, ["upper"], 7),
    legs: take(all, ["knee", "hips"], 7),
    core: take(all, ["core", "posture"], 7),
    knee: take(all, ["knee", "hike"], 7, ["easy"]),
  };
}

export function surprise(all: Exercise[], n = 6): string[] {
  const pool = [...main(all)].sort(() => Math.random() - 0.5);
  const seen = new Map<string, number>();
  const out: Exercise[] = [];
  for (const e of pool) {
    if ((seen.get(e.cat) ?? 0) >= 2) continue;
    seen.set(e.cat, (seen.get(e.cat) ?? 0) + 1);
    out.push(e);
    if (out.length === n) break;
  }
  return out.map((e) => e.id);
}
