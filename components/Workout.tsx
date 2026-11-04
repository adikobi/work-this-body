"use client";
import { useEffect, useRef, useState } from "react";
import Visualizer from "@/components/Visualizer";
import Guide from "@/components/Guide";
import { PauseIcon, PlayIcon, ResetIcon, SoundOffIcon, SoundOnIcon } from "@/components/Icons";
import type { Category, Exercise } from "@/lib/exercises";
import { read, write } from "@/lib/storage";
import { useIntervalTimer } from "@/lib/useIntervalTimer";

const R = 52;
const C = 2 * Math.PI * R;
const PREP = 5; // get-ready seconds

const iconBtn =
  "flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-zinc-200 transition-transform duration-150 ease-snap active:scale-95 hover:bg-white/10 disabled:opacity-30 disabled:active:scale-100";

interface Props {
  exercise: Exercise;
  category: Category;
  next?: Exercise;
  onNext: () => void;
  onComplete: (id: string) => void;
}

export default function Workout({ exercise, category, next, onNext, onComplete }: Props) {
  const [sound, setSound] = useState(true);
  useEffect(() => { if (read("wtb:sound") === "0") setSound(false); }, []);
  const toggleSound = () => setSound((s) => { write("wtb:sound", s ? "0" : "1"); return !s; });

  const t = useIntervalTimer({ work: exercise.work, rest: exercise.rest, sets: exercise.sets, prep: PREP, sound });

  const secs = Math.ceil(t.remainingMs / 1000);
  const total = (t.phase === "work" ? exercise.work : t.phase === "rest" ? exercise.rest : PREP) * 1000;
  const frac = t.status === "done" ? 0 : Math.min(1, t.remainingMs / total);
  const running = t.status === "running";
  const prepping = t.phase === "prep" && t.status !== "idle" && t.status !== "done";
  const resting = t.phase === "rest" && t.status !== "done";
  const urgent = running && secs >= 1 && secs <= 3;
  const playing = t.status === "idle" || (running && t.phase === "work");
  const hold = t.status === "done" || prepping || resting;

  const tone = urgent
    ? { text: "text-warn", stroke: "stroke-warn", border: "border-warn/40" }
    : resting
      ? { text: "text-rest", stroke: "stroke-rest", border: "border-rest/25" }
      : prepping
        ? { text: "text-zinc-200", stroke: "stroke-zinc-200", border: "border-white/20" }
        : { text: "text-work", stroke: "stroke-work", border: "border-white/10" };

  const label =
    t.status === "done" ? "Done" : t.status === "idle" ? "Ready" : t.status === "paused" ? "Paused" : prepping ? "Get ready" : resting ? "Rest" : "Work";

  // Which side is up (alternating exercises): during rest, show the side that's coming.
  const upcoming = resting ? t.set + 1 : t.set;
  const side = exercise.alternate ? (upcoming % 2 === 1 ? "Left" : "Right") : null;

  const toggle = () => (running ? t.pause() : t.start());
  const toggleRef = useRef(toggle);
  useEffect(() => { toggleRef.current = toggle; });

  // Space starts / pauses (ignored while a button or field has focus).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (e.code !== "Space" || e.repeat || el?.closest("button, a, input, select, textarea")) return;
      e.preventDefault();
      toggleRef.current();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Live countdown in the tab title.
  useEffect(() => {
    if (!running) return;
    const prev = document.title;
    document.title = `${secs}s · ${label} — ${exercise.name}`;
    return () => { document.title = prev; };
  }, [running, secs, label, exercise.name]);

  useEffect(() => { if (t.status === "done") onComplete(exercise.id); }, [t.status, exercise.id, onComplete]);

  return (
    <div className="animate-rise">
      {/* The stage: visual + timer share one sticky card, so both stay on screen while the guide scrolls. */}
      <section
        className={`glass sticky top-2 z-20 rounded-3xl border bg-ink-900/70 p-3 shadow-glass backdrop-blur-xl transition-colors duration-200 ease-snap sm:p-4 lg:top-4 lg:p-6 ${tone.border}`}
        aria-label="Exercise stage"
      >
        <header className="mb-2 flex items-start justify-between gap-3 lg:mb-4">
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest text-zinc-300">
              <span className={`h-1.5 w-1.5 rounded-full ${category.dot}`} />
              {category.short}
            </p>
            <h2 className="truncate font-display text-xl font-bold tracking-tight text-zinc-50 sm:text-2xl lg:text-3xl">{exercise.name}</h2>
          </div>
          <p className="shrink-0 rounded-full bg-white/5 px-2.5 py-1 text-xs tabular-nums text-zinc-200">
            {exercise.sets} × {exercise.work}s · {exercise.rest}s rest
          </p>
        </header>

        <div className="grid grid-cols-5 items-center gap-2 lg:grid-cols-2 lg:gap-8">
          <div className="relative col-span-3 overflow-hidden rounded-2xl bg-ink-950/60 lg:col-span-1">
            <Visualizer motion={exercise.motion} cycle={exercise.cycle} playing={playing} hold={hold} resting={resting} urgent={urgent} />
            {exercise.hold && !resting && (
              <span className="absolute left-2 top-2 rounded-full bg-white/10 px-2 py-0.5 text-xs font-medium uppercase tracking-widest text-zinc-200">Hold</span>
            )}
            {resting && (
              <span className="absolute right-2 top-2 rounded-full bg-rest/15 px-2 py-0.5 text-xs font-medium uppercase tracking-widest text-rest">
                {side ? `Next: ${side}` : "Next set"}
              </span>
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
                  className={`font-display text-5xl font-extrabold leading-none tabular-nums tracking-tight sm:text-6xl lg:text-7xl ${urgent ? "animate-pop text-warn" : "text-zinc-50"}`}
                >
                  {t.status === "done" ? "✓" : secs}
                </span>
                <span className="mt-1 text-xs tabular-nums text-zinc-300">
                  Set {t.set} / {exercise.sets}{side ? ` · ${side}` : ""}
                </span>
              </div>
            </div>

            <ol className="mt-2 flex gap-1.5" aria-label="Set progress">
              {Array.from({ length: exercise.sets }, (_, i) => {
                const n = i + 1;
                const done = n < t.set || t.status === "done";
                const current = n === t.set && t.status !== "done";
                return (
                  <li key={n} className={`h-1.5 w-6 rounded-full transition-colors duration-200 ease-snap ${done ? "bg-work" : current ? "bg-white/60" : "bg-white/15"}`} />
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
          <button type="button" className={iconBtn} onClick={toggleSound} aria-label={sound ? "Mute cues" : "Unmute cues"} aria-pressed={!sound}>
            {sound ? <SoundOnIcon /> : <SoundOffIcon />}
          </button>
        </div>

        {t.status === "done" && next && (
          <button
            type="button"
            onClick={onNext}
            className="animate-rise mt-3 flex min-h-11 w-full items-center justify-center rounded-2xl bg-white/10 px-4 text-sm font-semibold text-zinc-50 transition-transform duration-150 ease-snap active:scale-95 hover:bg-white/15"
          >
            Next: {next.name} →
          </button>
        )}
        <p className="sr-only" aria-live="polite">{label}, set {t.set} of {exercise.sets}{side ? `, ${side} side` : ""}</p>
        <p className="mt-2 hidden text-center text-xs text-zinc-400 lg:block">Press Space to start or pause</p>
      </section>

      <Guide exercise={exercise} />
    </div>
  );
}
