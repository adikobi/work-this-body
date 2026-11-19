"use client";
import { useCallback, useEffect, useState } from "react";
import Brand from "@/components/Brand";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import { useI18n } from "@/components/LocaleProvider";
import Workout from "@/components/Workout";
// Ids, order and categories never change with language, so logic uses the base data and display uses `content`.
import { byId as baseById, levelOrder, type Level } from "@/lib/exercises";
import { read, today, write } from "@/lib/storage";

const pill =
  "flex min-h-11 shrink-0 items-center gap-1.5 rounded-full px-4 text-sm font-medium transition-[background-color,color,transform] duration-150 ease-snap active:scale-95";
const on = "bg-work/20 text-work";
const off = "bg-white/10 text-zinc-100 hover:bg-white/15";

type LevelFilter = Level | "all";

function LevelChips({ value, onChange }: { value: LevelFilter; onChange: (l: LevelFilter) => void }) {
  const { t, content } = useI18n();
  return (
    <div className="flex gap-2" role="group" aria-label={t.filterByDifficulty}>
      {(["all", ...levelOrder] as const).map((l) => (
        <button key={l} type="button" aria-pressed={value === l} onClick={() => onChange(l)} className={`${pill} min-h-9 px-3 text-xs ${value === l ? on : off}`}>
          {l === "all" ? t.allLevels : content.levels[l].label}
        </button>
      ))}
    </div>
  );
}

export default function AppShell() {
  const { t, content } = useI18n();
  const { exercises, categories } = content;
  const [exId, setExId] = useState(exercises[0].id);
  const [open, setOpen] = useState<string[]>([exercises[0].cat]);
  const [done, setDone] = useState<string[]>([]);
  const [level, setLevel] = useState<LevelFilter>("all");
  // While an exercise is running, the desktop catalog collapses to a slim bar so the stage gets the room.
  const [training, setTraining] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const collapsed = training && !menuOpen;
  useEffect(() => { if (!training) setMenuOpen(false); }, [training]);

  const exercise = content.byId(exId);
  const category = categories.find((c) => c.id === exercise.cat) ?? categories[0];
  const key = `wtb:done:${today()}`;

  const select = useCallback((id: string, updateHash = true) => {
    const ex = baseById(id);
    setExId(ex.id);
    setOpen((o) => (o.includes(ex.cat) ? o : [...o, ex.cat]));
    if (updateHash) window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}#${ex.id}`);
    window.scrollTo({ top: 0 });
  }, []);

  // Deep links (#exercise-id) and today's completed list.
  useEffect(() => {
    const fromHash = () => {
      const h = window.location.hash.slice(1);
      if (baseById(h).id === h) select(h, false); // byId falls back to the first exercise for unknown ids
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    try { setDone(JSON.parse(read(key) ?? "[]")); } catch { /* ignore */ }
    return () => window.removeEventListener("hashchange", fromHash);
  }, [select, key]);

  const complete = useCallback((id: string) => {
    setDone((d) => {
      if (d.includes(id)) return d;
      const n = [...d, id];
      write(key, JSON.stringify(n));
      return n;
    });
  }, [key]);

  const visible = exercises.filter((e) => level === "all" || e.level === level);
  const vi = visible.findIndex((e) => e.id === exercise.id);
  const next = vi >= 0 ? visible[vi + 1] : undefined;
  const cats = categories.filter((c) => visible.some((e) => e.cat === c.id));
  const toggleCat = (id: string) => setOpen((o) => (o.includes(id) ? o.filter((x) => x !== id) : [...o, id]));
  const tick = (id: string) => (done.includes(id) ? <span className="text-work" aria-label={t.completedToday}>✓</span> : null);

  return (
    <div
      className={`mx-auto min-h-dvh px-3 pb-6 pt-4 sm:px-6 lg:pt-8 ${
        collapsed ? "max-w-[1800px]" : "max-w-6xl lg:grid lg:grid-cols-12 lg:gap-8"
      }`}
    >
      {/* Desktop catalog */}
      <aside className={collapsed ? "hidden" : "hidden lg:col-span-3 lg:block"}>
        <div className="no-scrollbar sticky top-8 max-h-screen overflow-y-auto pb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl"><Brand /></h1>
            {training && (
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label={t.exercisesNav}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-zinc-100 hover:bg-white/15"
              >
                ✕
              </button>
            )}
          </div>
          <p className="mt-1 text-xs tabular-nums text-zinc-300">{t.todayLong(done.length, exercises.length)}</p>
          <div className="mt-3"><LocaleSwitcher /></div>
          <div className="mt-4"><LevelChips value={level} onChange={setLevel} /></div>
          <nav className="mt-5 space-y-1" aria-label={t.exercisesNav}>
            {cats.map((c) => {
              const list = visible.filter((e) => e.cat === c.id);
              const isOpen = open.includes(c.id);
              return (
                <div key={c.id}>
                  <button
                    type="button"
                    onClick={() => toggleCat(c.id)}
                    aria-expanded={isOpen}
                    className="flex min-h-11 w-full items-center gap-2 rounded-xl px-3 text-start text-xs font-semibold uppercase tracking-widest text-zinc-300 transition-colors duration-150 ease-snap hover:bg-white/5"
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
                    <span className="flex-1">{c.name}</span>
                    <span className="tabular-nums text-zinc-400">{list.filter((e) => done.includes(e.id)).length}/{list.length}</span>
                  </button>
                  {isOpen && (
                    <ul className="mb-2 space-y-0.5">
                      {list.map((e) => (
                        <li key={e.id}>
                          <button
                            type="button"
                            onClick={() => select(e.id)}
                            aria-current={e.id === exId}
                            className={`flex min-h-11 w-full items-center justify-between gap-2 rounded-xl px-3 text-start text-sm transition-[background-color,color] duration-150 ease-snap ${e.id === exId ? "bg-white/10 font-semibold text-zinc-50" : "text-zinc-200 hover:bg-white/5"}`}
                          >
                            {e.name}
                            {tick(e.id)}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Desktop slim bar while training */}
      {collapsed && (
        <div className="mb-4 hidden items-center justify-between lg:flex">
          <h1 className="text-xl"><Brand /></h1>
          <div className="flex items-center gap-3">
            <p className="text-xs tabular-nums text-zinc-300">{t.todayShort(done.length, exercises.length)}</p>
            <LocaleSwitcher />
            <button type="button" onClick={() => setMenuOpen(true)} className={`${pill} min-h-9 px-4 text-xs ${off}`}>
              {t.exercisesNav}
            </button>
          </div>
        </div>
      )}

      <main className={collapsed ? "" : "lg:col-span-9"}>
        {/* Mobile catalog */}
        <div className="lg:hidden">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
            <h1 className="text-xl"><Brand /></h1>
            <div className="flex items-center gap-3">
              <p className="text-xs tabular-nums text-zinc-300">{t.todayShort(done.length, exercises.length)}</p>
              <LocaleSwitcher />
            </div>
          </div>
          <div className="no-scrollbar -mx-3 mb-2 overflow-x-auto px-3 pb-1"><LevelChips value={level} onChange={setLevel} /></div>
          <div className="no-scrollbar -mx-3 flex gap-2 overflow-x-auto px-3 pb-2">
            {cats.map((c) => (
              <button
                key={c.id}
                type="button"
                className={`${pill} ${c.id === exercise.cat ? on : off}`}
                onClick={() => select(visible.find((e) => e.cat === c.id)?.id ?? exId)}
              >
                {c.short}
              </button>
            ))}
          </div>
          <div className="no-scrollbar -mx-3 mb-3 flex gap-2 overflow-x-auto px-3 pb-2">
            {visible.filter((e) => e.cat === exercise.cat).map((e) => (
              <button key={e.id} type="button" className={`${pill} text-xs ${e.id === exId ? "bg-white/20 text-zinc-50" : off}`} onClick={() => select(e.id)}>
                {tick(e.id)}
                {e.name}
              </button>
            ))}
          </div>
        </div>

        <Workout
          key={exercise.id}
          exercise={exercise}
          category={category}
          next={next}
          onNext={() => next && select(next.id)}
          onComplete={complete}
          onTrainingChange={setTraining}
        />
      </main>
    </div>
  );
}
