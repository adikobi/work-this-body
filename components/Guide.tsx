"use client";
import { useI18n } from "@/components/LocaleProvider";
import type { Exercise } from "@/lib/exercises";

const label = "text-xs font-semibold uppercase tracking-widest text-zinc-400";

export default function Guide({ exercise }: { exercise: Exercise }) {
  const { t, content } = useI18n();
  const { levels, bookends } = content;
  const { muscles, steps, cues } = exercise;
  // Optional: add `benefits?: string[]` to Exercise in lib/exercises.ts (and the translated packs) to fill the list.
  const benefits = (exercise as unknown as { benefits?: string[] }).benefits ?? [];
  const { warmup, cooldown } = exercise.phase ? { warmup: [] as Exercise[], cooldown: [] as Exercise[] } : bookends(exercise.cat);
  return (
    <div dir="auto" className="mt-4 pb-10 md:mt-0 md:min-h-0 md:overflow-y-auto md:overscroll-contain md:pb-2 md:pe-1">
      {/* One panel, hairline-divided sections: no cards inside cards, nothing animates in. */}
      <article className="divide-y divide-white/10 rounded-3xl border border-white/10 bg-ink-900">
        <section className="p-5">
          <p className="text-sm text-zinc-50">{exercise.tagline}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${levels[exercise.level].chip}`}>{levels[exercise.level].label}</span>
            {exercise.phase && (
              <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-semibold text-zinc-100">
                {exercise.phase === "warmup" ? t.guide.warmup : t.guide.cooldown}
              </span>
            )}
          </div>
          {exercise.alternate && <p className="mt-3 text-xs text-zinc-300">{t.guide.alternate}</p>}
        </section>

        <section className="p-5">
          <h3 className={label}>{t.guide.howTo}</h3>
          <ol className="mt-4 space-y-3">
            {steps.map((s, i) => (
              <li key={s} className="flex gap-3">
                <span className="w-6 shrink-0 pt-0.5 font-display text-xs font-bold tabular-nums text-work">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-sm leading-relaxed text-zinc-100">{s}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="p-5">
          <h3 className={label}>{t.guide.keyCues}</h3>
          <ul className="mt-4">
            {cues.map((c) => (
              <li key={c} className="flex items-start gap-3 border-t border-white/10 py-2.5 text-sm font-medium text-zinc-100 first:border-t-0 first:pt-0">
                <span className="mt-2 h-0.5 w-3 shrink-0 bg-work" />
                {c}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs leading-relaxed text-zinc-300">{t.guide.safety}</p>
        </section>

        {(muscles.primary.length > 0 || muscles.secondary.length > 0 || benefits.length > 0) && (
          <section className="p-5">
            <h3 className={label}>{t.guide.targetsTitle}</h3>
            <div className="mt-4 space-y-4">
              {muscles.primary.length > 0 && (
                <div>
                  <p className="text-xs text-zinc-400">{t.guide.strengthens}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {muscles.primary.map((m) => (
                      <span key={m} className="rounded-full bg-work/15 px-2.5 py-1 text-xs font-semibold text-work">{m}</span>
                    ))}
                  </div>
                </div>
              )}
              {muscles.secondary.length > 0 && (
                <div>
                  <p className="text-xs text-zinc-400">{t.guide.alsoWorks}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {muscles.secondary.map((m) => (
                      <span key={m} className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-zinc-200">{m}</span>
                    ))}
                  </div>
                </div>
              )}
              {benefits.length > 0 && (
                <div>
                  <p className="text-xs text-zinc-400">{t.guide.benefits}</p>
                  <ul className="mt-2">
                    {benefits.map((b) => (
                      <li key={b} className="flex items-start gap-3 border-t border-white/10 py-2.5 text-sm font-medium text-zinc-100 first:border-t-0 first:pt-0">
                        <span className="mt-2 h-0.5 w-3 shrink-0 bg-work" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>
        )}

        {(warmup.length > 0 || cooldown.length > 0) && (
          <section className="p-5">
            <h3 className={label}>{t.guide.bookendsTitle}</h3>
            <p className="mt-1 text-xs text-zinc-300">{t.guide.bookendsHint}</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-1">
              {([[t.guide.before, warmup], [t.guide.after, cooldown]] as const).map(([title, list]) =>
                list.length ? (
                  <div key={title}>
                    <p className={label}>{title}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {list.map((e) => (
                        <a key={e.id} href={`#${e.id}`} className="btn btn-secondary btn-sm">{e.name}</a>
                      ))}
                    </div>
                  </div>
                ) : null,
              )}
            </div>
          </section>
        )}
      </article>
    </div>
  );
}
