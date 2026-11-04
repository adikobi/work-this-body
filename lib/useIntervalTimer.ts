"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { cues, unlockAudio } from "@/lib/audio";

export type Status = "idle" | "running" | "paused" | "done";
export type Phase = "prep" | "work" | "rest";
export interface Snap { status: Status; phase: Phase; set: number; remainingMs: number }
interface Cfg { work: number; rest: number; sets: number; prep: number; sound: boolean }

export function useIntervalTimer(cfg: Cfg) {
  const initial: Snap = { status: "idle", phase: "work", set: 1, remainingMs: cfg.work * 1000 };
  const [snap, setSnap] = useState<Snap>(initial);
  const snapRef = useRef(snap);
  const cfgRef = useRef(cfg);
  const endRef = useRef(0);
  const lastSecRef = useRef(-1);

  useEffect(() => { cfgRef.current = cfg; });

  const commit = useCallback((s: Snap) => { snapRef.current = s; setSnap(s); }, []);

  const start = useCallback(() => {
    unlockAudio();
    let s = snapRef.current;
    if (s.status === "done") s = { status: "idle", phase: "work", set: 1, remainingMs: cfgRef.current.work * 1000 };
    // First press from idle: a short get-ready lead-in so you can get into position.
    if (s.status === "idle" && cfgRef.current.prep > 0) s = { ...s, phase: "prep", remainingMs: cfgRef.current.prep * 1000 };
    endRef.current = Date.now() + s.remainingMs;
    lastSecRef.current = Math.ceil(s.remainingMs / 1000);
    commit({ ...s, status: "running" });
  }, [commit]);

  const pause = useCallback(() => {
    const s = snapRef.current;
    if (s.status !== "running") return;
    commit({ ...s, status: "paused", remainingMs: Math.max(0, endRef.current - Date.now()) });
  }, [commit]);

  const reset = useCallback(() => {
    commit({ status: "idle", phase: "work", set: 1, remainingMs: cfgRef.current.work * 1000 });
  }, [commit]);

  useEffect(() => {
    if (snap.status !== "running") return;

    const tick = () => {
      const s = snapRef.current;
      const c = cfgRef.current;
      const rem = endRef.current - Date.now();

      if (rem > 0) {
        const sec = Math.ceil(rem / 1000);
        if (sec !== lastSecRef.current) {
          lastSecRef.current = sec;
          if (sec <= 3 && c.sound) cues.tick();
        }
        commit({ ...s, remainingMs: rem });
        return;
      }

      // Phase finished.
      const begin = (phase: Phase, set: number) => {
        const dur = (phase === "work" ? c.work : phase === "rest" ? c.rest : c.prep) * 1000;
        endRef.current = Date.now() + dur;
        lastSecRef.current = Math.ceil(dur / 1000);
        commit({ status: "running", phase, set, remainingMs: dur });
      };

      if (s.phase === "prep") {
        if (c.sound) cues.phase();
        begin("work", 1);
        return;
      }
      if (s.phase === "work" && s.set >= c.sets) {
        if (c.sound) cues.done();
        commit({ status: "done", phase: "work", set: c.sets, remainingMs: 0 });
        return;
      }
      if (c.sound) cues.phase();
      if (s.phase === "work") c.rest > 0 ? begin("rest", s.set) : begin("work", s.set + 1);
      else begin("work", s.set + 1);
    };

    const id = window.setInterval(tick, 100);

    // Keep the screen awake mid-set (best effort).
    let lock: { release: () => Promise<void> } | null = null;
    const wl = (navigator as unknown as { wakeLock?: { request: (t: "screen") => Promise<{ release: () => Promise<void> }> } }).wakeLock;
    wl?.request("screen").then((l) => { lock = l; }).catch(() => {});

    return () => { window.clearInterval(id); void lock?.release().catch(() => {}); };
  }, [snap.status, commit]);

  return { ...snap, start, pause, reset };
}
