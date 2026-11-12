// Web Audio cues. The context is created/resumed from a user gesture (Play, or un-muting).
let ctx: AudioContext | null = null;
let muted = false;

/** Mute lives here (not in the timer) so toggling it can never leave the timer with a stale value. */
export function setMuted(m: boolean) {
  muted = m;
}

export function unlockAudio() {
  if (typeof window === "undefined") return;
  const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return;
  if (!ctx || ctx.state === "closed") ctx = new AC();
  if (ctx.state !== "running") void ctx.resume(); // "suspended", or iOS "interrupted"
}

function beep(freq: number, dur: number, vol: number, delay = 0) {
  if (muted || !ctx) return;
  if (ctx.state !== "running") void ctx.resume(); // the browser may suspend an idle context
  const t0 = ctx.currentTime + delay;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(gain).connect(ctx.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

const buzz = (ms: number | number[]) => {
  if (muted) return;
  if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate(ms);
};

export const cues = {
  tick: () => { beep(660, 0.1, 0.16); buzz(20); },
  phase: () => { beep(988, 0.38, 0.22); buzz(120); },
  done: () => { [784, 988, 1319].forEach((f, i) => beep(f, 0.3, 0.2, i * 0.18)); buzz([120, 60, 120, 60, 240]); },
};
