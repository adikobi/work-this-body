"use client";
import { useState } from "react";
import Visualizer from "@/components/Visualizer";
import Guide from "@/components/Guide";
import { PauseIcon, PlayIcon, ResetIcon, SoundOffIcon, SoundOnIcon } from "@/components/Icons";
import type { Category, Exercise } from "@/lib/exercises";
import { useIntervalTimer } from "@/lib/useIntervalTimer";

const R = 52;
const C = 2 * Math.PI * R;

const iconBtn =
  "flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-300 transition-transform duration-150 ease-snap active:scale-95 hover:bg-white/10 disabled:opacity-30 disabled:active:scale-100";

export default function Workout({ exercise, category }: { exercise: Exercise; category: Category }) {
  const [sound, setSound] = useState(true);
  const t = useIntervalTimer({ work: exercise.work, rest: exercise.rest, sets: exercise.sets, sound });

  const secs = Math.ceil(t.remainingMs / 1000);
  const total = (t.phase === "work" ? exercise.work : exercise.rest) * 1000;
  const frac = t.status === "done" ? 0 : Math.min(1, t.remainingMs / total);
  const running = t.status === "running";
  const resting = t.phase === "rest" && t.status !== "done";
  const urgent = running && secs >= 1 && secs <= 3;
  const playing = t.status === "idle" || (running && !resting);

  const tone = urgent
    ? { text: "text-warn", stroke: "stroke-warn", border: "border-warn/40" }
    : resting
      ? { text: "text-rest", stroke: "stroke-rest", border: "border-rest/25" }
      : { text: "text-work", stroke: "stroke-work", border: "border-white/10" };

  const label =
    t.status === "done" ? "Done" : t.status === "idle" ? "Ready" : t.status === "paused" ? "Paused" : resting ? "Rest" : "Work";

  const toggle = () => (running ? t.pause() : t.start());

  return (
    <div className="animate-rise">
      {/* The stage: visual + timer share one sticky card, so both stay on screen while the guide scrolls. */}
      <section
        className={`sticky top-2 z-20 rounded-3xl border bg-ink-900/70 p-3 shadow-glass backdrop-blur-xl transition-colors duration-200 ease-snap sm:p-4 lg:top-4 lg:p-6 ${tone.border}`}
        aria-label="Exercise stage"
      >
        <header className="mb-2 flex items-start justify-between gap-3 lg:mb-4">
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest text-zinc-400">
              <span className={`h-1.5 w-1.5 rounded-full ${category.dot}`} />
              {category.short}
            </p>
            <h2 className="truncate font-display text-xl font-bold tracking-tight text-zinc-50 sm:text-2xl lg:text-3xl">{exercise.name}</h2>
          </div>
          <p className="shrink-0 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs tabular-nums text-zinc-300">
            {exercise.sets} × {exercise.work}s · {exercise.rest}s rest
          </p>
        </header>

        <div className="grid grid-cols-5 items-center gap-2 lg:grid-cols-2 lg:gap-8">
          <div className="relative col-span-3 overflow-hidden rounded-2xl bg-ink-950/60 lg:col-span-1">
            <Visualizer motion={exercise.motion} cycle={exercise.cycle} playing={playing} resting={resting} urgent={urgent} />
            {exercise.hold && (
              <span className="absolute left-2 top-2 rounded-full bg-white/10 px-2 py-0.5 text-xs font-medium uppercase tracking-widest text-zinc-300">Hold</span>
            )}
            {resting && (
              <span className="absolute right-2 top-2 rounded-full bg-rest/15 px-2 py-0.5 text-xs font-medium uppercase tracking-widest text-rest">Next set</span>
            )}
          </div>

          <div className="col-span-2 flex flex-col items-center lg:col-span-1">
            <div className="relative w-full max-w-xs">
              <svg viewBox="0 0 120 120" width="120" height="120" className="block h-auto w-full" aria-hidden="true">
                <circle cx="60" cy="60" r={R} className="fill-none stroke-white/10" strokeWidth="7" />
                <circle
                  cx="60" cy="60" r={R}
                  transform="rotate(-90 60 60)"
                  className={`fill-none ${tone.stroke}`}
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeDasharray={C}
                  strokeDashoffset={C * (1 - frac)}
                  style={{ transition: "stroke-dashoffset 120ms linear, stroke 200ms" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-xs font-semibold uppercase tracking-widest transition-colors duration-200 ${tone.text}`}>{label}</span>
                <span
                  key={urgent ? secs : "steady"}
                  className={`font-display text-5xl font-extrabold leading-none tabular-nums sm:text-6xl lg:text-7xl ${urgent ? "animate-pop text-warn" : "text-zinc-50"}`}
                >
                  {t.status === "done" ? "✓" : secs}
                </span>
                <span className="mt-1 text-xs tabular-nums text-zinc-400">Set {t.set} / {exercise.sets}</span>
              </div>
            </div>

            <ol className="mt-2 flex gap-1.5" aria-label="Set progress">
              {Array.from({ length: exercise.sets }, (_, i) => {
                const n = i + 1;
                const done = n < t.set || t.status === "done";
                const current = n === t.set && t.status !== "done";
                return (
                  <li
                    key={n}
                    className={`h-1.5 w-6 rounded-full transition-colors duration-200 ease-snap ${done ? "bg-work" : current ? "bg-white/60" : "bg-white/15"}`}
                  />
                );
              })}
            </ol>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-center gap-4 lg:mt-5">
          <button type="button" className={iconBtn} onClick={t.reset} aria-label="Reset timer" disabled={t.status === "idle"}>
            <ResetIcon />
          </button>
          <button
            type="button"
            onClick={toggle}
            aria-label={running ? "Pause" : t.status === "done" ? "Restart" : "Start"}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-work text-ink-950 shadow-glow transition-transform duration-150 ease-snap active:scale-95"
          >
            {running ? <PauseIcon /> : <PlayIcon />}
          </button>
          <button type="button" className={iconBtn} onClick={() => setSound((s) => !s)} aria-label={sound ? "Mute cues" : "Unmute cues"} aria-pressed={!sound}>
            {sound ? <SoundOnIcon /> : <SoundOffIcon />}
          </button>
        </div>
        <p className="sr-only" aria-live="polite">{label}, set {t.set} of {exercise.sets}</p>
      </section>

      <Guide exercise={exercise} />
    </div>
  );
}
