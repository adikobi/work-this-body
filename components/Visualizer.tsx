"use client";
import { useEffect, useId, useRef, useState } from "react";
import { VIEW, angDiff, poseAt, solve, type Motion, type Pose, type Pt } from "@/lib/rig";

const pts = (...p: Pt[]) => p.map((q) => `${q[0].toFixed(1)},${q[1].toFixed(1)}`).join(" ");

function Figure({ pose, motion, tone, ghost = false }: { pose: Pose; motion: Motion; tone: string; ghost?: boolean }) {
  const s = solve(pose, motion.pin);
  const back = ghost ? "stroke-white/15" : "stroke-zinc-500";
  const torso = ghost ? "stroke-white/15" : "stroke-zinc-100";
  const front = ghost ? "stroke-white/15" : tone;
  const common = { fill: "none", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: ghost ? 5 : 6 } as const;
  return (
    <g>
      <polyline {...common} className={back} points={pts(s.hip, s.kneeB, s.ankleB)} />
      <polyline {...common} className={back} points={pts(s.neck, s.elbowB, s.wristB)} />
      <line {...common} className={torso} x1={s.hip[0]} y1={s.hip[1]} x2={s.neck[0]} y2={s.neck[1]} />
      <polyline {...common} className={front} points={pts(s.hip, s.kneeF, s.ankleF)} />
      <polyline {...common} className={front} points={pts(s.neck, s.elbowF, s.wristF)} />
      <circle cx={s.head[0]} cy={s.head[1]} r={7} className={ghost ? "fill-white/10" : "fill-zinc-100"} />
    </g>
  );
}

interface Props {
  motion: Motion;
  cycle: number;
  playing: boolean; // advance the loop
  hold: boolean; // glide back to the start pose and wait there
  resting: boolean;
  urgent: boolean;
}

export default function Visualizer({ motion, cycle, playing, hold, resting, urgent }: Props) {
  const uid = useId().replace(/:/g, "");
  const [pose, setPose] = useState<Pose>(motion.keys[0]);
  const live = useRef({ playing, hold });
  useEffect(() => { live.current = { playing, hold }; });

  // One loop owns time. The drawn pose chases the target pose with a critically
  // damped glide, so pause / rest / resume never snap — they redirect from where
  // the figure currently is.
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    let t = 0;
    let shown: Pose = motion.keys[0];
    const loop = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const { playing: p, hold: h } = live.current;
      if (h) t = 0;
      else if (p) t = (t + dt / cycle) % 1;
      const target = poseAt(motion.keys, t);
      const k = 1 - Math.exp(-dt * 18);
      let max = 0;
      const next = shown.map((v, i) => {
        const d = angDiff(target[i], v);
        max = Math.max(max, Math.abs(d));
        return v + d * k;
      }) as unknown as Pose;
      if (max > 0.02) { shown = next; setPose(next); }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [motion, cycle]);

  const tone = urgent ? "stroke-warn" : resting ? "stroke-rest" : "stroke-work";
  const floor = VIEW.floor;

  return (
    <svg
      viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
      width={VIEW.w}
      height={VIEW.h}
      className="block h-auto w-full"
      role="img"
      aria-label="Animated stick-figure demonstration of the exercise"
    >
      <defs>
        <linearGradient id={`${uid}-floor`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.28" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <filter id={`${uid}-glow`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>

      <line x1="6" y1={floor + 3} x2="194" y2={floor + 3} stroke={`url(#${uid}-floor)`} strokeWidth="2" />

      {motion.props?.map((p, i) =>
        p.t === "rect" ? (
          <rect key={i} x={p.x} y={p.y} width={p.w} height={p.h} rx="3" className="fill-white/10 stroke-white/20" strokeWidth="1" />
        ) : (
          <line key={i} x1={p.x1} y1={p.y1} x2={p.x2} y2={p.y2} className="stroke-white/25" strokeWidth="3" strokeLinecap="round" />
        ),
      )}

      {/* Target-position ghost for simple two-pose movements */}
      {motion.keys.length === 2 && !hold && <Figure pose={motion.keys[1]} motion={motion} tone={tone} ghost />}

      <g className={resting ? "opacity-60" : "opacity-100"} style={{ transition: "opacity 200ms cubic-bezier(0.23, 1, 0.32, 1)" }}>
        <g filter={`url(#${uid}-glow)`} opacity="0.4"><Figure pose={pose} motion={motion} tone={tone} /></g>
        <Figure pose={pose} motion={motion} tone={tone} />
      </g>
    </svg>
  );
}
