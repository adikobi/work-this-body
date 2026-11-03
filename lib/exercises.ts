import type { Motion } from "@/lib/rig";

export interface Category { id: string; name: string; short: string; dot: string }
export interface Exercise {
  id: string;
  cat: string;
  name: string;
  tagline: string;
  sets: number;
  work: number; // seconds
  rest: number; // seconds
  cycle: number; // seconds per motion loop
  hold?: boolean;
  alternate?: boolean;
  muscles: { primary: string[]; secondary: string[] };
  steps: string[];
  cues: string[];
  motion: Motion;
}

export const categories: Category[] = [
  { id: "knee", name: "Knee & Leg Stability", short: "Knee & Leg", dot: "bg-lime-300" },
  { id: "core", name: "Core & Pelvic Strength", short: "Core", dot: "bg-amber-300" },
  { id: "upper", name: "Upper Body & Chest Toning", short: "Upper Body", dot: "bg-sky-300" },
  { id: "posture", name: "Posture & Back Alignment", short: "Posture", dot: "bg-rose-300" },
];

export const exercises: Exercise[] = [
  // ───────── Knee & Leg Stability ─────────
  {
    id: "step-downs", cat: "knee", name: "Controlled Step-Downs",
    tagline: "Eccentric control for the knee and hip.",
    sets: 3, work: 40, rest: 20, cycle: 4, alternate: true,
    muscles: { primary: ["Quadriceps", "Glute medius"], secondary: ["Glute max", "Calves", "Core"] },
    steps: [
      "Stand on a low step with one foot near the edge, arms forward for balance.",
      "Shift your weight onto the step leg and soften that knee.",
      "Lower the other heel toward the floor over three slow seconds, hips back.",
      "Tap lightly, then press through the step heel to stand tall. Switch legs each set.",
    ],
    cues: ["Knee over second toe", "Pelvis stays level", "Three seconds down"],
    motion: {
      pin: { joint: "ankleF", x: 60, y: 114 },
      props: [{ t: "rect", x: 30, y: 114, w: 40, h: 14 }],
      keys: [[180, 0, 0, 20, 10, 80, 90, 80, 90], [166, 60, -40, 35, 20, 85, 92, 85, 92]],
    },
  },
  {
    id: "wall-sit", cat: "knee", name: "Single-Leg Wall Sit",
    tagline: "Isometric quad endurance, one side at a time.",
    sets: 3, work: 30, rest: 30, cycle: 5, hold: true, alternate: true,
    muscles: { primary: ["Quadriceps", "Glutes"], secondary: ["Hamstrings", "Calves", "Core"] },
    steps: [
      "Lean your back flat against a wall and walk the feet out until knees reach about 90°.",
      "Shift weight to one leg and extend the other straight out in front.",
      "Hold with ribs down and breathe slowly. Press the heel into the floor.",
      "Lower the lifted foot, rest, then repeat on the other side.",
    ],
    cues: ["Back flat on wall", "Knee tracks over toes", "Breathe out, don't brace"],
    motion: {
      pin: { joint: "ankleF", x: 90, y: 128 },
      props: [{ t: "line", x1: 63, y1: 14, x2: 63, y2: 128 }],
      keys: [[180, 74, 0, 80, 84, 55, 90, 55, 90], [180, 90, 0, 90, 90, 60, 90, 60, 90]],
    },
  },
  {
    id: "bulgarian", cat: "knee", name: "Bulgarian Split Squat",
    tagline: "Single-leg strength with a rear-foot rest.",
    sets: 3, work: 40, rest: 20, cycle: 4, alternate: true,
    muscles: { primary: ["Quadriceps", "Glute max"], secondary: ["Adductors", "Hamstrings", "Hip flexors"] },
    steps: [
      "Rest the top of one foot on a bench behind you; step the other foot well forward.",
      "Keep your torso tall and lower straight down until the front thigh is near parallel.",
      "Keep the front heel planted and the knee tracking over the toes.",
      "Drive up through the front foot. Complete the set, then switch sides.",
    ],
    cues: ["Straight down, not forward", "Front heel heavy", "Chest proud"],
    motion: {
      pin: { joint: "ankleF", x: 100, y: 128 },
      props: [{ t: "rect", x: 36, y: 106, w: 26, h: 22 }],
      keys: [[180, 20, -10, -62, -62, 70, 90, 70, 90], [172, 70, -25, -35, -125, 70, 90, 70, 90]],
    },
  },
  {
    id: "trail-balance", cat: "knee", name: "Trail Balance",
    tagline: "Single-leg hinge with a long trailing leg.",
    sets: 3, work: 30, rest: 15, cycle: 5, hold: true, alternate: true,
    muscles: { primary: ["Glute medius", "Hamstrings"], secondary: ["Calves", "Foot stabilisers", "Spinal erectors"] },
    steps: [
      "Stand on one leg with a soft knee and arms by your sides.",
      "Hinge at the hips, reaching your arms forward as the other leg trails straight behind you.",
      "Form one long line from fingertips to heel. Keep hips square to the floor.",
      "Hold, then return slowly to standing. Switch legs each set.",
    ],
    cues: ["One long line", "Hips square", "Eyes on a fixed point"],
    motion: {
      pin: { joint: "ankleF", x: 100, y: 128 },
      keys: [[180, 0, 0, -10, -45, 70, 80, 70, 80], [105, 0, 0, -100, -100, 95, 100, 95, 100]],
    },
  },
  // ───────── Core & Pelvic Strength ─────────
  {
    id: "deadbug", cat: "core", name: "Deadbugs",
    tagline: "Anti-extension core control.",
    sets: 3, work: 40, rest: 20, cycle: 6,
    muscles: { primary: ["Transverse abdominis", "Rectus abdominis"], secondary: ["Obliques", "Hip flexors", "Pelvic floor"] },
    steps: [
      "Lie on your back, arms straight up, hips and knees bent to 90°.",
      "Press your lower back gently into the floor and keep it there.",
      "Slowly extend the opposite arm and leg toward the floor, exhaling.",
      "Return and alternate sides. Stop short if your back arches.",
    ],
    cues: ["Back stays glued down", "Exhale on the reach", "Slow beats big"],
    motion: {
      pin: { joint: "hip", x: 112, y: 124 },
      keys: [
        [-90, 180, 90, 180, 90, 180, 180, 180, 180],
        [-90, 180, 90, 100, 98, -100, -95, 180, 180],
        [-90, 180, 90, 180, 90, 180, 180, 180, 180],
        [-90, 100, 98, 180, 90, 180, 180, -100, -95],
      ],
    },
  },
  {
    id: "hollow", cat: "core", name: "Hollow Body Hold",
    tagline: "Full-length tension from ribs to toes.",
    sets: 3, work: 20, rest: 20, cycle: 4, hold: true,
    muscles: { primary: ["Rectus abdominis", "Transverse abdominis"], secondary: ["Hip flexors", "Quads", "Serratus"] },
    steps: [
      "Lie on your back, arms overhead and legs straight together.",
      "Flatten your lower back into the floor, then lift shoulders and legs a few inches.",
      "Reach long through fingertips and toes, forming a shallow banana shape.",
      "If your back peels off, bend the knees or raise the legs higher.",
    ],
    cues: ["Ribs pulled to hips", "Lower back stays down", "Biceps by the ears"],
    motion: {
      pin: { joint: "hip", x: 100, y: 122 },
      keys: [[-100, 125, 105, 125, 105, -100, -100, -100, -100], [-108, 122, 122, 122, 122, -108, -108, -108, -108]],
    },
  },
  {
    id: "bird-dog", cat: "core", name: "Bird-Dogs",
    tagline: "Spine-safe stability under asymmetric load.",
    sets: 3, work: 40, rest: 20, cycle: 6,
    muscles: { primary: ["Multifidus", "Glute max"], secondary: ["Deltoids", "Transverse abdominis", "Hamstrings"] },
    steps: [
      "Start on hands and knees, wrists under shoulders, knees under hips.",
      "Brace lightly, then slide one arm forward and the opposite leg back.",
      "Reach until both are level with your torso. Do not twist or sag.",
      "Return with control and alternate sides.",
    ],
    cues: ["Flat, level back", "Reach, don't lift", "Pause one beat"],
    motion: {
      pin: { joint: "hip", x: 82, y: 98 },
      keys: [
        [90, 0, -80, 0, -80, 0, 0, 0, 0],
        [90, 0, -80, -90, -90, 90, 90, 0, 0],
        [90, 0, -80, 0, -80, 0, 0, 0, 0],
        [90, -90, -90, 0, -80, 0, 0, 90, 90],
      ],
    },
  },
  // ───────── Upper Body & Chest Toning ─────────
  {
    id: "incline-pushup", cat: "upper", name: "Incline Push-Ups",
    tagline: "Press strength with a joint-friendly angle.",
    sets: 3, work: 40, rest: 25, cycle: 3,
    muscles: { primary: ["Pectoralis major", "Triceps"], secondary: ["Front deltoids", "Serratus", "Core"] },
    steps: [
      "Place hands on a bench or sturdy counter, slightly wider than shoulders.",
      "Step back into a straight line from head to heels.",
      "Lower your chest to the edge, elbows at roughly 45° from your ribs.",
      "Press away until your arms are straight. Lower the incline to make it harder.",
    ],
    cues: ["Plank from head to heel", "Elbows tucked 45°", "Chest to the bench"],
    motion: {
      pin: { joint: "wristF", x: 126, y: 92 },
      props: [{ t: "rect", x: 118, y: 92, w: 44, h: 36 }],
      keys: [[146, -34, -34, -34, -34, 0, 0, 0, 0], [139, -41, -41, -41, -41, -35, 40, -35, 40]],
    },
  },
  {
    id: "chest-squeeze", cat: "upper", name: "Chest Squeeze",
    tagline: "Isometric palm press for the inner chest.",
    sets: 4, work: 20, rest: 15, cycle: 4, hold: true,
    muscles: { primary: ["Pectoralis major", "Pectoralis minor"], secondary: ["Front deltoids", "Serratus", "Triceps"] },
    steps: [
      "Stand tall, palms together at chest height, elbows out to the sides.",
      "Press your palms into each other as hard as you can without shrugging.",
      "Hold the squeeze steadily, breathing out through pursed lips.",
      "Ease off slowly for the last second, then repeat.",
    ],
    cues: ["Shoulders down and back", "Squeeze from the chest", "Keep breathing"],
    motion: {
      pin: { joint: "ankleF", x: 100, y: 128 },
      keys: [[180, 0, 0, 0, 0, 40, 100, 40, 100], [178, 0, 0, 0, 0, 70, 100, 70, 100]],
    },
  },
  {
    id: "scap-retraction", cat: "upper", name: "Scapular Retractions",
    tagline: "Wake up the mid-back to open the chest.",
    sets: 3, work: 40, rest: 15, cycle: 4,
    muscles: { primary: ["Rhomboids", "Middle trapezius"], secondary: ["Rear deltoids", "Lower traps"] },
    steps: [
      "Stand tall, arms forward at shoulder height, shoulder blades spread.",
      "Draw your shoulder blades together and down, as if tucking them into back pockets.",
      "Bend your elbows back and squeeze for one second.",
      "Release forward with control. Do not arch your lower back.",
    ],
    cues: ["Blades to back pockets", "Neck long", "Ribs stay down"],
    motion: {
      pin: { joint: "ankleF", x: 100, y: 128 },
      keys: [[178, 0, 0, 0, 0, 85, 90, 85, 90], [180, 0, 0, 0, 0, -65, 70, -65, 70]],
    },
  },
  // ───────── Posture & Back Alignment ─────────
  {
    id: "prone-ytw", cat: "posture", name: "Prone Y-T-W",
    tagline: "Lower-trap and rear-delt endurance.",
    sets: 3, work: 45, rest: 20, cycle: 9,
    muscles: { primary: ["Lower trapezius", "Rhomboids"], secondary: ["Rear deltoids", "Spinal erectors", "Rotator cuff"] },
    steps: [
      "Lie face down, forehead hovering, thumbs pointing to the ceiling.",
      "Y: lift both arms overhead in a Y shape, then lower.",
      "T: sweep arms out to the sides and lift, then lower.",
      "W: bend elbows to form a W, pull blades together, then lower. Cycle smoothly.",
    ],
    cues: ["Thumbs up", "Lift from the back, not the neck", "Light, tiny range"],
    motion: {
      pin: { joint: "hip", x: 118, y: 124 },
      keys: [
        [-100, 90, 90, 90, 90, -118, -118, -118, -118],
        [-100, 90, 90, 90, 90, -165, -165, -165, -165],
        [-100, 90, 90, 90, 90, 150, -100, 150, -100],
      ],
    },
  },
  {
    id: "cobra", cat: "posture", name: "Cobra Holds",
    tagline: "Extend the spine and open the front body.",
    sets: 4, work: 20, rest: 15, cycle: 5, hold: true,
    muscles: { primary: ["Spinal erectors", "Glute max"], secondary: ["Lower traps", "Rear deltoids", "Abdominals (stretch)"] },
    steps: [
      "Lie face down, hands under shoulders, legs long and together.",
      "Squeeze your glutes and lift your chest using your back, not your hands.",
      "Draw the shoulders away from your ears and keep the gaze down.",
      "Hold, then lower with control.",
    ],
    cues: ["Hands barely pressing", "Long neck", "Glutes on"],
    motion: {
      pin: { joint: "hip", x: 120, y: 124 },
      keys: [[-98, 90, 90, 90, 90, 70, -80, 70, -80], [-135, 90, 90, 90, 90, 10, -15, 10, -15]],
    },
  },
  {
    id: "towel-pulls", cat: "posture", name: "Towel Pulls",
    tagline: "Band-free lat and mid-back activation.",
    sets: 3, work: 40, rest: 15, cycle: 4,
    muscles: { primary: ["Latissimus dorsi", "Middle trapezius"], secondary: ["Rear deltoids", "Biceps", "Rhomboids"] },
    steps: [
      "Hold a towel taut overhead with hands wider than shoulders.",
      "Pull the towel apart as if trying to rip it, and keep that tension throughout.",
      "Draw it down behind your head, elbows driving toward your ribs.",
      "Press back overhead slowly without letting the ribs flare.",
    ],
    cues: ["Rip the towel apart", "Elbows to ribs", "Ribs down"],
    motion: {
      pin: { joint: "ankleF", x: 100, y: 128 },
      keys: [[180, 0, 0, 0, 0, 172, 176, 172, 176], [180, 0, 0, 0, 0, -20, 165, -20, 165]],
    },
  },
];

export const byId = (id: string) => exercises.find((e) => e.id === id) ?? exercises[0];
