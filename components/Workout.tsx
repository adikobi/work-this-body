"use client";
import { useEffect, useRef, useState } from "react";
import Visualizer from "@/components/Visualizer";
import Guide from "@/components/Guide";
import { NextExerciseIcon, PauseIcon, PlayIcon, ResetIcon, SkipRestIcon, SoundOffIcon, SoundOnIcon } from "@/components/Icons";
import { useI18n } from "@/components/LocaleProvider";
import { setMuted, unlockAudio } from "@/lib/audio";
import type { Category, Exercise } from "@/lib/exercises";
import { read, write } from "@/lib/storage";
import { useIntervalTimer } from "@/lib/useIntervalTimer";

const R = 52;
const C = 2 * Math.PI * R;
const PREP = 5; // get-ready seconds

const iconBtn = "btn btn-secondary btn-icon";

interface Props {
  exercise: Exercise;
  category: Category;
  next?: Exercise;
  onNext: (auto?: boolean) => void;
  autoStart: boolean; // begin immediately (we arrived here from an auto-continue)
  auto: boolean; // auto-continue setting
  onAutoChange: (on: boolean) => void;
  onComplete: (id: string) => void;
  onTrainingChange: (training: boolean) => void;
}

export default function Workout({ exercise, category, next, onNext, onComplete, onTrainingChange, autoStart, auto, onAutoChange }: Props) {
  const { t: ui, content } = useI18n(); // `t` below is the interval timer, so the UI strings are `ui`
  const levels = content.levels;

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

  // People who ask for reduced motion get a still figure until the exercise actually starts.
  const [reduceMotion, setReduceMotion] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Arrived via auto-continue: start the get-ready countdown straight away.
  useEffect(() => {
    if (autoStart) t.start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Finished and auto-continue is on: count down, then move on and start the next exercise.
  const [cd, setCd] = useState<number | null>(null);
  useEffect(() => {
    if (!(t.status === "done" && auto && next)) { setCd(null); return; }
    let n = 3;
    setCd(n);
    const id = window.setInterval(() => {
      n -= 1;
      if (n <= 0) { window.clearInterval(id); setCd(null); onNext(true); } else setCd(n);
    }, 1000);
    return () => window.clearInterval(id);
  }, [t.status, auto, next, onNext]);

  // Lets the shell slide the catalog shut while an exercise is in progress.
  const active = t.status !== "idle";
  useEffect(() => {
    onTrainingChange(active);
    return () => onTrainingChange(false);
  }, [active, onTrainingChange]);

  const secs = Math.ceil(t.remainingMs / 1000);
  const total = (t.phase === "work" ? exercise.work : t.phase === "rest" ? exercise.rest : PREP) * 1000;
  const frac = t.status === "done" ? 0 : Math.min(1, t.remainingMs / total);
  const running = t.status === "running";
  const prepping = t.phase === "prep" && t.status !== "idle" && t.status !== "done";
  const resting = t.phase === "rest" && t.status !== "done";
  const urgent = running && secs >= 1 && secs <= 3;
  const playing = (t.status === "idle" && !reduceMotion) || (running && t.phase === "work");
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

  // Which side is up (alternating exercises): during rest, show the side that's coming.
  const upcoming = resting ? t.set + 1 : t.set;
  const side = exercise.alternate ? (upcoming % 2 === 1 ? ui.sideLeft : ui.sideRight) : null;

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

  // Live countdown in the tab title. Restores the title of the current language (not a captured one).
  useEffect(() => {
    if (!running) return;
    document.title = `${ui.secs(secs)} · ${label} — ${exercise.name}`;
    return () => { document.title = ui.meta.title; };
  }, [running, secs, label, exercise.name, ui]);

  useEffect(() => { if (t.status === "done") onComplete(exercise.id); }, [t.status, exercise.id, onComplete]);

  // md+: stage on the left (fills the viewport height, width follows the free space), guide in a fixed-width column on the right.
  return (
    <div className="animate-rise md:grid md:min-h-0 md:flex-1 md:grid-cols-[minmax(0,1fr)_min(21rem,31vw)] md:grid-rows-[minmax(0,1fr)] md:gap-6">
      <section
        className={`sticky top-2 z-20 flex flex-col rounded-3xl border bg-ink-900 p-3 transition-colors duration-200 ease-snap sm:p-4 md:static md:h-full md:min-h-0 ${tone.border}`}
        aria-label={ui.stage}
      >
        <header className="mb-2 flex items-start justify-between gap-3 md:mb-3">
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest text-zinc-300">
              <span className={`h-1.5 w-1.5 rounded-full ${category.dot}`} />
              {category.short}
              <span className={`rounded-full px-2 py-0.5 text-xs font-semibold normal-case tracking-normal ${levels[exercise.level].chip}`}>
                {levels[exercise.level].label}
              </span>
            </p>
            <h2 className="truncate font-display text-xl font-bold tracking-tight text-zinc-50 sm:text-2xl">{exercise.name}</h2>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1.5">
            <p className="rounded-full bg-white/5 px-2.5 py-1 text-xs tabular-nums text-zinc-200">
              {ui.summary(exercise.sets, exercise.work, exercise.rest)}
            </p>
            <button
              type="button"
              aria-pressed={auto}
              onClick={() => onAutoChange(!auto)}
              className={`btn btn-secondary btn-sm ${auto ? "btn-on" : ""}`}
            >
              {ui.autoNext}
            </button>
          </div>
        </header>

        <div className="grid grid-cols-5 items-center gap-2 md:min-h-0 md:flex-1 md:grid-cols-[minmax(0,1fr)_14rem] lg:grid-cols-[minmax(0,1fr)_16rem] md:grid-rows-[minmax(0,1fr)] md:gap-6">
          {/* Simulation: on md+ it fills all the height left in the stage and the figure scales to fit */}
          <div className="sheet relative col-span-3 overflow-hidden rounded-2xl md:col-span-1 md:h-full md:min-h-0">
            <div className="md:absolute md:inset-0 md:[&>svg]:h-full md:[&>svg]:w-full">
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

          <div className="col-span-2 flex flex-col items-center md:col-span-1 md:justify-center">
            <div className="relative w-full max-w-xs md:max-w-[14rem] lg:max-w-[16rem]">
              <svg viewBox="0 0 120 120" width="120" height="120" className="block h-auto w-full" aria-hidden="true">
                <circle cx="60" cy="60" r="58" transform="rotate(-90 60 60)" className="fill-none stroke-white/20" strokeWidth="3" strokeDasharray="1.2 4.874" />
                <circle cx="60" cy="60" r={R} className="fill-none stroke-white/10" strokeWidth="6" />
                <circle
                  cx="60" cy="60" r={R}
                  transform="rotate(-90 60 60)"
                  className={`fill-none ${tone.stroke}`}
                  strokeWidth="6"
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
                  className={`font-display text-5xl font-extrabold leading-none tabular-nums tracking-tight md:text-6xl lg:text-7xl ${urgent ? "animate-pop text-warn" : "text-zinc-50"}`}
                >
                  {t.status === "done" ? "✓" : secs}
                </span>
                <span className="mt-1 text-xs tabular-nums text-zinc-300">
                  {ui.setOf(t.set, exercise.sets)}{side ? ` · ${side}` : ""}
                </span>
              </div>
            </div>

            <ol className="mt-3 flex gap-1.5" aria-label={ui.setProgress}>
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

        {/* One media bar: utilities on one side of Play, forward actions on the other (mirrored in RTL). */}
        <div className="mt-3 flex shrink-0 flex-wrap items-center justify-center gap-2.5">
          <button type="button" className={iconBtn} onClick={t.reset} aria-label={ui.reset} title={ui.reset} disabled={t.status === "idle"}>
            <ResetIcon />
          </button>
          <button type="button" className={iconBtn} onClick={toggleSound} aria-label={sound ? ui.muteCues : ui.unmuteCues} title={sound ? ui.muteCues : ui.unmuteCues} aria-pressed={!sound}>
            {sound ? <SoundOnIcon /> : <SoundOffIcon />}
          </button>
          <button
            type="button"
            onClick={toggle}
            aria-label={running ? ui.pause : t.status === "done" ? ui.restart : ui.start}
            className={`btn btn-round ${t.status === "done" && next ? "btn-secondary" : "btn-primary"}`}
          >
            {running ? <PauseIcon /> : <PlayIcon />}
          </button>
          <button type="button" className={iconBtn} onClick={t.skipRest} aria-label={ui.skipRest} title={ui.skipRest} disabled={!resting || t.status === "idle"}>
            <span className="flex rtl:-scale-x-100"><SkipRestIcon /></span>
          </button>
          <button
            type="button"
            onClick={() => onNext(false)}
            disabled={!next}
            aria-label={t.status === "done" && next ? ui.nextExercise(next.name) : ui.skipToNext}
            title={t.status === "done" && next ? ui.nextExercise(next.name) : ui.skipToNext}
            className={`btn btn-icon ${t.status === "done" ? "btn-primary" : "btn-secondary"}`}
          >
            <span className="flex rtl:-scale-x-100"><NextExerciseIcon /></span>
          </button>
        </div>
        <p className="sr-only" aria-live="polite">{ui.live(label, t.set, exercise.sets, side)}</p>
        <p className="mt-2 min-h-4 shrink-0 text-center text-xs text-zinc-400" aria-live="polite">
          {cd !== null && next ? <span className="text-work">{ui.autoNextIn(next.name, cd)}</span> : <span className="hidden lg:inline">{ui.spaceHint}</span>}
        </p>
      </section>

      <Guide exercise={exercise} />
    </div>
  );
}
