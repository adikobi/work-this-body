// A tiny forward-kinematics rig. Every pose is 9 absolute angles in degrees,
// so bone lengths never distort. Angle 0 = pointing down, 90 = right (the
// direction the figure faces), 180 = up, -90 = left. Vector = (sin a, cos a).
//
// Pose = [torso, thighF, shinF, thighB, shinB, upperArmF, forearmF, upperArmB, forearmB]
// "F" is the near (bright) limb pair, "B" the far (dim) pair.

export type Pose = readonly [number, number, number, number, number, number, number, number, number];
export type Pt = readonly [number, number];
export interface Pin { joint: "hip" | "ankleF" | "ankleB" | "wristF" | "wristB"; x: number; y: number }
export type Prop =
  | { t: "rect"; x: number; y: number; w: number; h: number }
  | { t: "line"; x1: number; y1: number; x2: number; y2: number };
export interface Motion { pin: Pin; keys: readonly Pose[]; props?: readonly Prop[] }

export const VIEW = { w: 200, h: 140, floor: 128 } as const;

const BONE = { torso: 36, thigh: 22, shin: 22, upper: 15, fore: 15, head: 10 };
const rad = (d: number) => (d * Math.PI) / 180;
const vec = (deg: number, len: number): Pt => [Math.sin(rad(deg)) * len, Math.cos(rad(deg)) * len];
const add = (a: Pt, b: Pt): Pt => [a[0] + b[0], a[1] + b[1]];

export interface Skeleton {
  head: Pt; neck: Pt; hip: Pt;
  kneeF: Pt; ankleF: Pt; kneeB: Pt; ankleB: Pt;
  elbowF: Pt; wristF: Pt; elbowB: Pt; wristB: Pt;
}

export function solve(p: Pose, pin: Pin): Skeleton {
  const [torso, thF, shF, thB, shB, uaF, faF, uaB, faB] = p;
  const hip: Pt = [0, 0];
  const neck = add(hip, vec(torso, BONE.torso));
  const head = add(neck, vec(torso, BONE.head));
  const kneeF = add(hip, vec(thF, BONE.thigh));
  const ankleF = add(kneeF, vec(shF, BONE.shin));
  const kneeB = add(hip, vec(thB, BONE.thigh));
  const ankleB = add(kneeB, vec(shB, BONE.shin));
  const elbowF = add(neck, vec(uaF, BONE.upper));
  const wristF = add(elbowF, vec(faF, BONE.fore));
  const elbowB = add(neck, vec(uaB, BONE.upper));
  const wristB = add(elbowB, vec(faB, BONE.fore));
  const anchors = { hip, ankleF, ankleB, wristF, wristB };
  const anchor = anchors[pin.joint];
  const dx = pin.x - anchor[0];
  const dy = pin.y - anchor[1];
  const m = (q: Pt): Pt => [q[0] + dx, q[1] + dy];
  return {
    head: m(head), neck: m(neck), hip: m(hip),
    kneeF: m(kneeF), ankleF: m(ankleF), kneeB: m(kneeB), ankleB: m(ankleB),
    elbowF: m(elbowF), wristF: m(wristF), elbowB: m(elbowB), wristB: m(wristB),
  };
}

/** Cyclic interpolation through keys (last key eases back to the first). */
export function poseAt(keys: readonly Pose[], t: number): Pose {
  const n = keys.length;
  const s = (((t % 1) + 1) % 1) * n;
  const i = Math.floor(s);
  const f = s - i;
  const e = 0.5 - 0.5 * Math.cos(Math.PI * f); // sine ease-in-out
  const a = keys[i % n];
  const b = keys[(i + 1) % n];
  return a.map((v, k) => v + (b[k] - v) * e) as unknown as Pose;
}
