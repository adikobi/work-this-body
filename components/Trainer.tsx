"use client";
import { useEffect, useMemo, useState } from "react";
import { useI18n } from "@/components/LocaleProvider";
import { trainerText } from "@/lib/i18n/trainer";
import { loadPlans, minutesOf, presetIds, savePlans, surprise, type Plan } from "@/lib/plans";

const label = "text-xs font-semibold uppercase tracking-widest text-zinc-400";

export default function Trainer({ onStart, onClose }: { onStart: (ids: string[]) => void; onClose: () => void }) {
  const { locale, content } = useI18n();
  const tr = trainerText[locale];
  const { exercises, categories } = content;
  const main = useMemo(() => exercises.filter((e) => !e.phase), [exercises]);

  const [picked, setPicked] = useState<string[]>([]);
  const [saved, setSaved] = useState<Plan[]>([]);
  const [q, setQ] = useState("");
  const [call, setCall] = useState("");
  const [miss, setMiss] = useState(false);
  const [bookends, setBookends] = useState(true);
  const [name, setName] = useState("");
  useEffect(() => { setSaved(loadPlans()); }, []);
  useEffect(() => {
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, [onClose]);

  const presets: Plan[] = useMemo(
    () => Object.entries(presetIds(exercises)).map(([k, ids]) => ({ name: tr.presetNames[k], ids, preset: k })),
    [exercises, tr],
  );
  const pool = useMemo(() => [...saved, ...presets], [saved, presets]);

  const toggle = (id: string) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  const move = (i: number, d: number) => setPicked((p) => {
    const n = [...p]; const j = i + d;
    if (j < 0 || j >= n.length) return p;
    [n[i], n[j]] = [n[j], n[i]];
    return n;
  });

  const norm = (s: string) => s.trim().toLowerCase();
  const matches = useMemo(() => {
    const n = norm(call);
    if (!n) return { plans: [] as Plan[], ex: [] as typeof main };
    return { plans: pool.filter((p) => norm(p.name).includes(n)).slice(0, 4), ex: main.filter((e) => norm(e.name).includes(n)).slice(0, 4) };
  }, [call, pool, main]);

  const withBookends = (ids: string[]) => {
    if (!bookends || ids.length === 0) return ids;
    const cat = content.byId(ids[0]).cat;
    const b = content.bookends(cat, 1);
    const w = b.warmup[0]?.id; const c = b.cooldown[0]?.id;
    return [...(w && !ids.includes(w) ? [w] : []), ...ids, ...(c && !ids.includes(c) ? [c] : [])];
  };
  const run = (ids: string[]) => ids.length && onStart(withBookends(ids));

  const submitCall = () => {
    const first = matches.plans[0] ?? null;
    if (first) return run(first.ids);
    if (matches.ex[0]) return onStart([matches.ex[0].id]);
    setMiss(true);
  };

  const save = () => {
    const n = name.trim();
    if (!n || picked.length === 0) return;
    const next = [...saved.filter((p) => norm(p.name) !== norm(n)), { name: n, ids: picked }];
    setSaved(next); savePlans(next); setName("");
  };
  const del = (n: string) => { const next = saved.filter((p) => p.name !== n); setSaved(next); savePlans(next); };

  const list = main.filter((e) => !q.trim() || norm(e.name).includes(norm(q)));
  const total = minutesOf(withBookends(picked).map((id) => content.byId(id)));

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 sm:items-center sm:p-6" onPointerDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div role="dialog" aria-modal="true" aria-label={tr.title} dir="auto" className="animate-rise flex max-h-[92dvh] w-full max-w-3xl flex-col rounded-t-3xl border border-white/10 bg-ink-900 sm:rounded-3xl">
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-white/10 p-4">
          <h2 className="font-display text-xl font-bold text-zinc-50">{tr.title}</h2>
          <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>{tr.close}</button>
        </div>

        <div className="space-y-6 overflow-y-auto overscroll-contain p-4">
          {/* Call by name */}
          <section>
            <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); submitCall(); }}>
              <input
                value={call}
                onChange={(e) => { setCall(e.target.value); setMiss(false); }}
                placeholder={tr.callPlaceholder}
                aria-label={tr.callPlaceholder}
                className="min-h-11 min-w-0 flex-1 rounded-full bg-white/10 px-4 text-sm text-zinc-50 placeholder:text-zinc-400"
              />
              <button type="submit" className="btn btn-primary">{tr.call}</button>
            </form>
            {miss && <p className="mt-2 text-xs text-warn">{tr.noMatch}</p>}
            {(matches.plans.length > 0 || matches.ex.length > 0) && (
              <div className="mt-3 flex flex-wrap gap-2">
                {matches.plans.map((p) => <button key={p.name} type="button" className="btn btn-secondary btn-sm" onClick={() => run(p.ids)}>{p.name}</button>)}
                {matches.ex.map((e) => <button key={e.id} type="button" className="btn btn-secondary btn-sm" onClick={() => onStart([e.id])}>{e.name}</button>)}
              </div>
            )}
          </section>

          <section>
            <h3 className={label}>{tr.presets}</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {presets.map((p) => (
                <button key={p.preset} type="button" className="btn btn-secondary btn-sm" onClick={() => setPicked(p.ids)}>{p.name}</button>
              ))}
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => setPicked(surprise(exercises))}>{tr.surprise}</button>
            </div>
          </section>

          {saved.length > 0 && (
            <section>
              <h3 className={label}>{tr.saved}</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {saved.map((p) => (
                  <span key={p.name} className="flex gap-1">
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => setPicked(p.ids)}>{p.name}</button>
                    <button type="button" className="btn btn-secondary btn-square" aria-label={`${tr.delete}: ${p.name}`} onClick={() => del(p.name)}>×</button>
                  </span>
                ))}
              </div>
            </section>
          )}

          <section>
            <h3 className={label}>{tr.build}</h3>
            <p className="mt-1 text-xs text-zinc-300">{tr.pickHint}</p>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={tr.search}
              aria-label={tr.search}
              className="mt-3 min-h-11 w-full rounded-full bg-white/10 px-4 text-sm text-zinc-50 placeholder:text-zinc-400"
            />
            <div className="mt-3 space-y-4">
              {categories.map((c) => {
                const items = list.filter((e) => e.cat === c.id);
                if (!items.length) return null;
                return (
                  <div key={c.id}>
                    <p className="mb-2 flex items-center gap-2 text-xs font-semibold text-zinc-300"><span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />{c.name}</p>
                    <div className="flex flex-wrap gap-2">
                      {items.map((e) => (
                        <button key={e.id} type="button" aria-pressed={picked.includes(e.id)} className={`btn btn-secondary btn-sm ${picked.includes(e.id) ? "btn-on" : ""}`} onClick={() => toggle(e.id)}>{e.name}</button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section>
            <h3 className={label}>{tr.selected(picked.length)} · {picked.length ? tr.minutes(total) : tr.empty}</h3>
            <ol className="mt-3 space-y-2">
              {picked.map((id, i) => (
                <li key={id} className="flex items-center gap-2 rounded-2xl bg-white/5 ps-4 pe-1">
                  <span className="w-6 text-xs tabular-nums text-zinc-400">{String(i + 1).padStart(2, "0")}</span>
                  <span className="min-w-0 flex-1 truncate text-sm text-zinc-100">{content.byId(id).name}</span>
                  <button type="button" className="btn btn-secondary btn-square" aria-label={tr.up} onClick={() => move(i, -1)} disabled={i === 0}>↑</button>
                  <button type="button" className="btn btn-secondary btn-square" aria-label={tr.down} onClick={() => move(i, 1)} disabled={i === picked.length - 1}>↓</button>
                  <button type="button" className="btn btn-secondary btn-square" aria-label={tr.remove} onClick={() => toggle(id)}>×</button>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <div className="shrink-0 space-y-3 border-t border-white/10 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" aria-pressed={bookends} className={`btn btn-secondary btn-sm ${bookends ? "btn-on" : ""}`} onClick={() => setBookends((b) => !b)}>{tr.withBookends}</button>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => setPicked([])} disabled={!picked.length}>{tr.clear}</button>
          </div>
          <div className="flex flex-wrap gap-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={tr.saveName}
              aria-label={tr.saveName}
              className="min-h-11 min-w-0 flex-1 rounded-full bg-white/10 px-4 text-sm text-zinc-50 placeholder:text-zinc-400"
            />
            <button type="button" className="btn btn-secondary" onClick={save} disabled={!name.trim() || !picked.length}>{tr.save}</button>
            <button type="button" className="btn btn-primary" onClick={() => run(picked)} disabled={!picked.length}>{tr.start}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
