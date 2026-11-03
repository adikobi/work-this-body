"use client";
import { useEffect, useId, useRef, useState } from "react";
import { VIEW, poseAt, solve, type Motion, type Pose, type Pt } from "@/lib/rig";

const pts = (...p: Pt[]) => p.map((q) => `${q[0].toFixed(1)},${q[1].toFixed(1)}`).join(" ");

function Figure({ pose, motion, tone, ghost = false }: { pose: Pose; motion: Motion; tone: string; ghost?: boolean }) {
  const s = solve(pose, motion.pin);
  const back = ghost ? "stroke-white/15" : "stroke-zinc-500";
  const torso = ghost ? "stroke-white/15" : "stroke-zinc-100";
  const front = ghost ? "stroke-white/15" : tone;
  const w = ghost ? 5 : 6;
  const common = { fill: "none", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: w } as const;
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

interface Props { motion: Motion; cycle: number; playing: boolean; resting: boolean; urgent: boolean }

export default function Visualizer({ motion, cycle, playing, resting, urgent }: Props) {
  const uid = useId().replace(/:/g, "");
  const [t, setT] = useState(0);

  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      setT((p) => (p + dt / cycle) % 1);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [playing, cycle]);

  const shown = resting ? 0 : t;
  const pose = poseAt(motion.keys, shown);
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
      {motion.keys.length === 2 && !resting && <Figure pose={motion.keys[1]} motion={motion} tone={tone} ghost />}

      <g
        className={resting ? "opacity-60" : "opacity-100"}
        style={{ transition: "opacity 200ms cubic-bezier(0.23, 1, 0.32, 1)" }}
      >
        <g filter={`url(#${uid}-glow)`} opacity="0.4"><Figure pose={pose} motion={motion} tone={tone} /></g>
        <Figure pose={pose} motion={motion} tone={tone} />
      </g>
    </svg>
  );
}
