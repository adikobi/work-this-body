"use client";
import { useI18n } from "@/components/LocaleProvider";
import type { Exercise } from "@/lib/exercises";

// Surfaces separate by a step in tone, not by borders or shadows; glass is reserved for the floating stage.
const card = "rounded-3xl bg-ink-800/70 p-4 animate-rise";

export default function Guide({ exercise }: { exercise: Exercise }) {
  const { t, content } = useI18n();
  const { levels, bookends } = content;
  const { muscles, steps, cues } = exercise;
  const { warmup, cooldown } = exercise.phase ? { warmup: [] as Exercise[], cooldown: [] as Exercise[] } : bookends(exercise.cat);
  const link = "rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-zinc-100 transition-colors duration-150 ease-snap hover:bg-white/15";
  return (
    <div className="mt-4 grid gap-3 pb-10 md:mt-0">
      <section className={card} style={{ animationDelay: "40ms" }}>
        <p className="text-sm text-zinc-50">{exercise.tagline}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${levels[exercise.level].chip}`}>{levels[exercise.level].label}</span>
          {exercise.phase && (
            <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-semibold text-zinc-100">
              {exercise.phase === "warmup" ? t.guide.warmup : t.guide.cooldown}
            </span>
          )}
          {muscles.primary.map((m) => (
            <span key={m} className="rounded-full bg-work/15 px-2.5 py-1 text-xs font-semibold text-work">{m}</span>
          ))}
          {muscles.secondary.map((m) => (
            <span key={m} className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-zinc-200">{m}</span>
          ))}
        </div>
        {exercise.alternate && <p className="mt-3 text-xs text-zinc-300">{t.guide.alternate}</p>}
      </section>

      <section className={card} style={{ animationDelay: "90ms" }}>
        <h3 className="font-display text-base font-bold tracking-tight text-zinc-50">{t.guide.howTo}</h3>
        <ol className="mt-3 space-y-2.5">
          {steps.map((s, i) => (
            <li key={s} className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-semibold tabular-nums text-zinc-200">{i + 1}</span>
              <span className="text-sm leading-relaxed text-zinc-100">{s}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className={card} style={{ animationDelay: "140ms" }}>
        <h3 className="font-display text-base font-bold tracking-tight text-zinc-50">{t.guide.keyCues}</h3>
        <ul className="mt-3 space-y-1.5">
          {cues.map((c) => (
            <li key={c} className="flex items-center gap-3 rounded-2xl bg-ink-900 px-3 py-2.5 text-sm font-medium text-zinc-100">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-work" />
              {c}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs leading-relaxed text-zinc-300">
          {t.guide.safety}
        </p>
      </section>

      {(warmup.length > 0 || cooldown.length > 0) && (
        <section className={card} style={{ animationDelay: "190ms" }}>
          <h3 className="font-display text-base font-bold tracking-tight text-zinc-50">{t.guide.bookendsTitle}</h3>
          <p className="mt-1 text-xs text-zinc-300">{t.guide.bookendsHint}</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 md:grid-cols-1">
            {([[t.guide.before, warmup], [t.guide.after, cooldown]] as const).map(([title, list]) =>
              list.length ? (
                <div key={title}>
                  <p className="text-xs font-semibold uppercase tracking-widest text-zinc-300">{title}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {list.map((e) => (
                      <a key={e.id} href={`#${e.id}`} className={link}>{e.name}</a>
                    ))}
                  </div>
                </div>
              ) : null,
            )}
          </div>
        </section>
      )}
    </div>
  );
}
