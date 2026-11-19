"use client";
import { useEffect, useRef, useState } from "react";
import Visualizer from "@/components/Visualizer";
import Guide from "@/components/Guide";
import { PauseIcon, PlayIcon, ResetIcon, SoundOffIcon, SoundOnIcon } from "@/components/Icons";
import { useI18n } from "@/components/LocaleProvider";
import { setMuted, unlockAudio } from "@/lib/audio";
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
  onTrainingChange: (training: boolean) => void;
}

export default function Workout({ exercise, category, next, onNext, onComplete, onTrainingChange }: Props) {
  const { t: ui, content } = useI18n(); // `t` below is the interval timer, so the UI strings are `ui`
  const levels = content.levels;
  // "learn": read the instructions first. "train": timer + simulation. Resets per exercise (AppShell keys on exercise.id).
  const [mode, setMode] = useState<"learn" | "train">("learn");
  const modeRef = useRef(mode);
  useEffect(() => { modeRef.current = mode; });

  // Tell the shell when training is active so it can collapse the catalog.
  useEffect(() => {
    onTrainingChange(mode === "train");
    return () => onTrainingChange(false);
  }, [mode, onTrainingChange]);

  const [sound, setSound] = useState(true);
  useEffect(() => {
    const muted = read("wtb:sound") === "0";
    setMuted(muted);
    if (muted) setSound(false);
  }, []);
  const toggleSound = () => {
    const next = !sound;
    setSound(next);
    setMuted(!next);
    write("wtb:sound", next ? "1" : "0");
    if (next) unlockAudio();
  };

  const t = useIntervalTimer({ work: exercise.work, rest: exercise.rest, sets: exercise.sets, prep: PREP, sound: true });

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
    t.status === "done"
      ? ui.status.done
      : t.status === "idle"
        ? ui.status.ready
        : t.status === "paused"
          ? ui.status.paused
          : prepping
            ? ui.status.getReady
            : resting
              ? ui.status.rest
              : ui.status.work;

  const upcoming = resting ? t.set + 1 : t.set;
  const side = exercise.alternate ? (upcoming % 2 === 1 ? ui.sideLeft : ui.sideRight) : null;

  const toggle = () => (running ? t.pause() : t.start());
  const toggleRef = useRef(toggle);
  useEffect(() => { toggleRef.current = toggle; });

  // Space starts / pauses (only in train mode; ignored while a button or field has focus).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (modeRef.current !== "train") return;
      if (e.code !== "Space" || e.repeat || el?.closest("button, a, input, select, textarea")) return;
      e.preventDefault();
      toggleRef.current();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!running) return;
    document.title = `${ui.secs(secs)} · ${label} — ${exercise.name}`;
    return () => { document.title = ui.meta.title; };
  }, [running, secs, label, exercise.name, ui]);

  useEffect(() => { if (t.status === "done") onComplete(exercise.id); }, [t.status, exercise.id, onComplete]);

  const header = (
    <header className="mb-2 flex items-start justify-between gap-3 md:mb-4">
      <div className="min-w-0">
        <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest text-zinc-300">
          <span className={`h-1.5 w-1.5 rounded-full ${category.dot}`} />
          {category.short}
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold normal-case tracking-normal ${levels[exercise.level].chip}`}>
            {levels[exercise.level].label}
          </span>
        </p>
        <h2 className="truncate font-display text-xl font-bold tracking-tight text-zinc-50 sm:text-2xl">{exercise.name}</h2>
      </div>
      <p className="shrink-0 rounded-full bg-white/5 px-2.5 py-1 text-xs tabular-nums text-zinc-200">
        {ui.summary(exercise.sets, exercise.work, exercise.rest)}
      </p>
    </header>
  );

  // ---- Step 1: read the instructions before anything starts ----
  if (mode === "learn") {
    return (
      <div className="animate-rise">
        <div className="mt-1 md:mt-0">{header}</div>
        <div className="md:grid md:grid-cols-2 md:items-start md:gap-6">
          <div className="overflow-hidden rounded-3xl bg-ink-950/60 md:sticky md:top-4">
            <Visualizer motion={exercise.motion} cycle={exercise.cycle} playing hold={false} resting={false} urgent={false} />
          </div>
          <Guide exercise={exercise} />
        </div>
        <div className="sticky bottom-3 z-20 flex justify-center pb-2">
          <button
            type="button"
            onClick={() => setMode("train")}
            className="flex h-14 w-full max-w-sm items-center justify-center rounded-full bg-work px-6 text-base font-bold text-ink-950 shadow-glow transition-transform duration-150 ease-snap active:scale-95"
          >
            {ui.guide.startExercise}
          </button>
        </div>
      </div>
    );
  }

  // ---- Step 2: workout. md+: large stage left (sticky), guide in a narrower column right, so they never overlap ----
  return (
    <div className="animate-rise md:grid md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] md:items-start md:gap-6">
      <section
        className={`glass sticky top-2 z-20 rounded-3xl border bg-ink-900/70 p-3 shadow-glass backdrop-blur-xl transition-colors duration-200 ease-snap sm:p-4 md:top-4 ${tone.border}`}
        aria-label={ui.stage}
      >
        {header}

        <div className="grid grid-cols-5 items-center gap-2 md:grid-cols-1 md:gap-4">
          <div className="relative col-span-3 overflow-hidden rounded-2xl bg-ink-950/60 md:col-span-1">
            <div className="md:mx-auto md:max-w-[min(100%,62vh)]">
              <Visualizer motion={exercise.motion} cycle={exercise.cycle} playing={playing} hold={hold} resting={resting} urgent={urgent} />
            </div>
            {exercise.hold && !resting && (
              <span className="absolute start-2 top-2 rounded-full bg-white/10 px-2 py-0.5 text-xs font-medium uppercase tracking-widest text-zinc-200">{ui.hold}</span>
            )}
            {resting && (
              <span className="absolute end-2 top-2 rounded-full bg-rest/15 px-2 py-0.5 text-xs font-medium uppercase tracking-widest text-rest">
                {side ? ui.nextSide(side) : ui.nextSet}
              </span>
            )}
          </div>

          <div className="col-span-2 flex flex-col items-center md:col-span-1 md:flex-row md:justify-center md:gap-6">
            <div className="relative w-full max-w-xs md:max-w-[10rem]">
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
                  className={`font-display text-5xl font-extrabold leading-none tabular-nums tracking-tight md:text-4xl ${urgent ? "animate-pop text-warn" : "text-zinc-50"}`}
                >
                  {t.status === "done" ? "✓" : secs}
                </span>
                <span className="mt-1 text-xs tabular-nums text-zinc-300">
                  {ui.setOf(t.set, exercise.sets)}{side ? ` · ${side}` : ""}
                </span>
              </div>
            </div>

            <ol className="mt-2 flex gap-1.5 md:mt-0" aria-label={ui.setProgress}>
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

        <div className="mt-3 flex items-center justify-center gap-4">
          <button type="button" className={iconBtn} onClick={t.reset} aria-label={ui.reset} disabled={t.status === "idle"}>
            <ResetIcon />
          </button>
          <button
            type="button"
            onClick={toggle}
            aria-label={running ? ui.pause : t.status === "done" ? ui.restart : ui.start}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-work text-ink-950 shadow-glow transition-transform duration-150 ease-snap active:scale-95"
          >
            {running ? <PauseIcon /> : <PlayIcon />}
          </button>
          <button type="button" className={iconBtn} onClick={toggleSound} aria-label={sound ? ui.muteCues : ui.unmuteCues} aria-pressed={!sound}>
            {sound ? <SoundOnIcon /> : <SoundOffIcon />}
          </button>
        </div>

        {t.status === "done" && next && (
          <button
            type="button"
            onClick={onNext}
            className="animate-rise mt-3 flex min-h-11 w-full items-center justify-center rounded-2xl bg-white/10 px-4 text-sm font-semibold text-zinc-50 transition-transform duration-150 ease-snap active:scale-95 hover:bg-white/15"
          >
            {ui.nextExercise(next.name)}
          </button>
        )}
        <p className="sr-only" aria-live="polite">{ui.live(label, t.set, exercise.sets, side)}</p>
        <p className="mt-2 hidden text-center text-xs text-zinc-400 md:block">{ui.spaceHint}</p>
      </section>

      <Guide exercise={exercise} />
    </div>
  );
}
