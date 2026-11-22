"use client";
import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import Brand from "@/components/Brand";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { useI18n } from "@/components/LocaleProvider";
import Trainer from "@/components/Trainer";
import Workout from "@/components/Workout";
import { trainerText } from "@/lib/i18n/trainer";
// Ids, order and categories never change with language, so logic uses the base data and display uses `content`.
import { byId as baseById, levelOrder, type Level } from "@/lib/exercises";
import { read, today, write } from "@/lib/storage";


type LevelFilter = Level | "all";

function LevelChips({ value, onChange }: { value: LevelFilter; onChange: (l: LevelFilter) => void }) {
  const { t, content } = useI18n();
  return (
    <div className="flex gap-2 lg:flex-wrap" role="group" aria-label={t.filterByDifficulty}>
      {(["all", ...levelOrder] as const).map((l) => (
        <button key={l} type="button" aria-pressed={value === l} onClick={() => onChange(l)} className={`btn btn-secondary btn-sm ${value === l ? "btn-on" : ""}`}>
          {l === "all" ? t.allLevels : content.levels[l].label}
        </button>
      ))}
    </div>
  );
}

export default function AppShell() {
  const { t, content, locale } = useI18n();
  const tr = trainerText[locale];
  const { exercises, categories } = content;
  // Personal trainer: an ordered list of exercise ids for today. While set, it replaces the catalog and drives "next".
  const [plan, setPlan] = useState<string[] | null>(null);
  const [trainerOpen, setTrainerOpen] = useState(false);
  const [runKey, setRunKey] = useState(0);
  const [exId, setExId] = useState(exercises[0].id);
  const [open, setOpen] = useState<string[]>([exercises[0].cat]);
  const [done, setDone] = useState<string[]>([]);
  const [level, setLevel] = useState<LevelFilter>("all");
  // Desktop catalog column: open while idle, slides shut once an exercise is running (the user can reopen it).
  const [training, setTraining] = useState(false);
  const [menuOpen, setMenuOpen] = useState(true);
  // Auto-continue: when an exercise finishes, move to the next one and start it. Remembered between visits.
  const [auto, setAuto] = useState(false);
  const [autoStart, setAutoStart] = useState(false);
  useEffect(() => { setAuto(read("wtb:auto") === "1"); }, []);
  const changeAuto = useCallback((on: boolean) => { setAuto(on); write("wtb:auto", on ? "1" : "0"); }, []);
  useEffect(() => { setMenuOpen(!training); }, [training]);

  // Swipe anywhere on the screen: toward the catalog's edge (left in LTR, right in RTL) closes it, the other way opens it.
  // Touch/pen only, desktop/landscape only, and only for clearly horizontal swipes so scrolling is untouched.
  const swipe = useRef<{ x: number; y: number } | null>(null);
  const swipeStart = (e: PointerEvent) => {
    const skip = e.pointerType === "mouse" || !window.matchMedia("(min-width: 1024px)").matches || (e.target as HTMLElement).closest("input, textarea, select, [data-no-swipe]");
    swipe.current = skip ? null : { x: e.clientX, y: e.clientY };
  };
  const swipeEnd = (e: PointerEvent) => {
    const s = swipe.current;
    swipe.current = null;
    if (!s) return;
    const dx = e.clientX - s.x;
    const dy = e.clientY - s.y;
    if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    const inward = getComputedStyle(e.currentTarget).direction === "rtl" ? -dx : dx;
    setMenuOpen(inward > 0);
  };

  const exercise = content.byId(exId);
  const category = categories.find((c) => c.id === exercise.cat) ?? categories[0];
  const key = `wtb:done:${today()}`;

  const select = useCallback((id: string, updateHash = true) => {
    const ex = baseById(id);
    setAutoStart(false); // picking an exercise by hand never auto-starts it
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

  const visible = plan ? plan.map((id) => content.byId(id)) : exercises.filter((e) => level === "all" || e.level === level);
  const vi = visible.findIndex((e) => e.id === exercise.id);
  const next = vi >= 0 ? visible[vi + 1] : undefined;
  const cats = categories.filter((c) => visible.some((e) => e.cat === c.id));
  const goNext = useCallback((viaAuto?: boolean) => {
    if (!next) return;
    select(next.id);
    setAutoStart(!!viaAuto);
  }, [next, select]);
  const tick = (id: string) => (done.includes(id) ? <span className="text-work" aria-label={t.completedToday}>✓</span> : null);
  const startPlan = useCallback((ids: string[]) => {
    setPlan(ids);
    setTrainerOpen(false);
    setRunKey((k) => k + 1);
    changeAuto(true); // a session flows from one exercise to the next
    select(ids[0]);
    setAutoStart(true);
  }, [changeAuto, select]);
  const endPlan = () => { setPlan(null); setAutoStart(false); setRunKey((k) => k + 1); };
  const trainerBtn = (cls: string) => (
    <button type="button" className={`btn btn-secondary ${cls} ${plan ? "btn-on" : ""}`} onClick={() => setTrainerOpen(true)}>{tr.open}</button>
  );
  const sessionList = plan && (
    <div>
      <p className="px-3 text-xs font-semibold uppercase tracking-widest text-zinc-300">{tr.session(Math.max(1, vi + 1), plan.length)}</p>
      <ol className="mt-3 space-y-2">
        {plan.map((id, i) => (
          <li key={`${id}-${i}`}>
            <button type="button" onClick={() => select(id)} aria-current={id === exId} className={`flex min-h-11 w-full items-center justify-between gap-2 rounded-xl px-3 text-start text-sm transition-[background-color,color] duration-150 ease-snap ${id === exId ? "bg-white/10 font-semibold text-zinc-50" : "text-zinc-200 hover:bg-white/5"}`}>
              <span className="flex min-w-0 items-baseline gap-3"><span className="w-5 shrink-0 text-xs tabular-nums text-zinc-500">{String(i + 1).padStart(2, "0")}</span>{content.byId(id).name}</span>
              {tick(id)}
            </button>
          </li>
        ))}
      </ol>
      <button type="button" className="btn btn-secondary mt-4 w-full" onClick={endPlan}>{tr.end}</button>
    </div>
  );
  const toggleCat = (id: string) => setOpen((o) => (o.includes(id) ? o.filter((x) => x !== id) : [...o, id]));

  return (
    <div
      className="mx-auto flex min-h-dvh max-w-[1800px] flex-col px-3 pb-6 pt-4 sm:px-6 md:h-dvh md:overflow-hidden md:pb-4 lg:touch-pan-y lg:pt-6"
      onPointerDown={swipeStart}
      onPointerUp={swipeEnd}
      onPointerCancel={() => { swipe.current = null; }}
    >
      {/* Desktop header: always visible, so the logo never moves */}
      <div className="mb-4 hidden shrink-0 items-center justify-between gap-4 border-b border-white/10 pb-4 lg:flex">
        <div className="flex items-baseline gap-4">
          <h1 className="text-2xl"><Brand /></h1>
          <p className="text-xs tabular-nums text-zinc-300">{t.todayLong(done.length, exercises.length)}</p>
        </div>
        <div className="flex items-center gap-3">
          <ThemeSwitcher />
          <LocaleSwitcher />
          {trainerBtn("")}
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-controls="exercise-catalog"
            className={`btn btn-secondary ${menuOpen ? "btn-on" : ""}`}
          >
            {t.exercisesNav}
          </button>
        </div>
      </div>

      <div className="md:flex md:min-h-0 md:flex-1">
        {/* Desktop catalog: width animates, inner content keeps its size so nothing reflows */}
        <aside
          id="exercise-catalog"
          className={`no-scrollbar hidden shrink-0 overflow-y-auto overflow-x-hidden transition-[width,opacity,margin,visibility] duration-300 ease-snap lg:block ${
            menuOpen ? "w-72 opacity-100 lg:me-8" : "invisible w-0 opacity-0 lg:me-0"
          }`}
        >
          <div className="w-72 pb-8">
            {sessionList}
            {!plan && <LevelChips value={level} onChange={setLevel} />}
            {!plan && <nav className="mt-5 space-y-2" aria-label={t.exercisesNav}>
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
                      <ul className="mb-2 space-y-2">
                        {list.map((e, i) => (
                          <li key={e.id}>
                            <button
                              type="button"
                              onClick={() => select(e.id)}
                              aria-current={e.id === exId}
                              className={`flex min-h-11 w-full items-center justify-between gap-2 rounded-xl px-3 text-start text-sm transition-[background-color,color] duration-150 ease-snap ${e.id === exId ? "bg-white/10 font-semibold text-zinc-50" : "text-zinc-200 hover:bg-white/5"}`}
                            >
                              <span className="flex min-w-0 items-baseline gap-3"><span className="w-5 shrink-0 text-xs tabular-nums text-zinc-500">{String(i + 1).padStart(2, "0")}</span>{e.name}</span>
                            {tick(e.id)}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </nav>}
          </div>
        </aside>

        <main className="min-w-0 flex-1 md:flex md:min-h-0 md:flex-col">
          {/* Mobile catalog */}
          <div className="md:shrink-0 lg:hidden">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
              <h1 className="text-xl"><Brand /></h1>
              <div className="flex items-center gap-3">
                <p className="text-xs tabular-nums text-zinc-300">{t.todayShort(done.length, exercises.length)}</p>
                <ThemeSwitcher />
                <LocaleSwitcher />
              </div>
            </div>
            <div className="mb-3 flex gap-2">
              {trainerBtn("btn-sm")}
              {plan && <button type="button" className="btn btn-secondary btn-sm" onClick={endPlan}>{tr.end}</button>}
            </div>
            {!plan && <>
            <div className="no-scrollbar -mx-3 mb-2 overflow-x-auto px-3 pb-1"><LevelChips value={level} onChange={setLevel} /></div>
            <div className="no-scrollbar -mx-3 flex gap-2 overflow-x-auto px-3 pb-2">
              {cats.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className={`btn btn-secondary ${c.id === exercise.cat ? "btn-on" : ""}`}
                  onClick={() => select(visible.find((e) => e.cat === c.id)?.id ?? exId)}
                >
                  {c.short}
                </button>
              ))}
            </div>
            <div className="no-scrollbar -mx-3 mb-3 flex gap-2 overflow-x-auto px-3 pb-2">
              {visible.filter((e) => e.cat === exercise.cat).map((e) => (
                <button key={e.id} type="button" className={`btn btn-secondary btn-sm ${e.id === exId ? "btn-on" : ""}`} onClick={() => select(e.id)}>
                  {tick(e.id)}
                  {e.name}
                </button>
              ))}
            </div>
            </>}
            {plan && (
              <div className="no-scrollbar -mx-3 mb-3 flex gap-2 overflow-x-auto px-3 pb-2">
                {visible.map((e) => (
                  <button key={e.id} type="button" className={`btn btn-secondary btn-sm ${e.id === exId ? "btn-on" : ""}`} onClick={() => select(e.id)}>{tick(e.id)}{e.name}</button>
                ))}
              </div>
            )}
          </div>

          <Workout
            key={`${exercise.id}-${runKey}`}
            exercise={exercise}
            category={category}
            next={next}
            onNext={goNext}
            autoStart={autoStart}
            auto={auto}
            onAutoChange={changeAuto}
            onComplete={complete}
            onTrainingChange={setTraining}
          />
        </main>
      </div>
      {trainerOpen && <Trainer onStart={startPlan} onClose={() => setTrainerOpen(false)} />}
    </div>
  );
}
