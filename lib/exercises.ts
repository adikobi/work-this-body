import type { Motion } from "./rig";

export type Level = "easy" | "moderate" | "hard";
export type Phase = "warmup" | "cooldown";

export const levelOrder: Level[] = ["easy", "moderate", "hard"];
export const levels: Record<Level, { label: string; chip: string }> = {
  easy: { label: "Easy", chip: "bg-emerald-400/15 text-emerald-300" },
  moderate: { label: "Moderate", chip: "bg-amber-400/15 text-amber-300" },
  hard: { label: "Hard", chip: "bg-rose-400/15 text-rose-300" },
};

export interface Category { id: string; name: string; short: string; dot: string }
export interface Exercise {
  id: string;
  cat: string;
  level: Level;
  /** Marks an exercise as a warm-up or cool-down option. */
  phase?: Phase;
  /** Categories this warm-up / cool-down suits. Omit = suits everything. */
  suits?: string[];
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
  /** What the exercise is good for: short points shown under "Target muscles & benefits". */
  benefits?: string[];
  motion: Motion;
}

export const categories: Category[] = [
  { id: "warmup", name: "Warm-Up & Mobility", short: "Warm-Up", dot: "bg-yellow-300" },
  { id: "knee", name: "Knee & Leg Stability", short: "Knee & Leg", dot: "bg-lime-300" },
  { id: "hike", name: "Hike Prep: Knee-Friendly", short: "Hike Prep", dot: "bg-emerald-300" },
  { id: "core", name: "Core & Pelvic Strength", short: "Core", dot: "bg-amber-300" },
  { id: "upper", name: "Upper Body & Chest Toning", short: "Upper Body", dot: "bg-sky-300" },
  { id: "posture", name: "Posture & Back Alignment", short: "Posture", dot: "bg-rose-300" },
  { id: "hips", name: "Hips & Glutes", short: "Hips", dot: "bg-orange-300" },
  { id: "shoulder", name: "Shoulder Mobility", short: "Shoulders", dot: "bg-teal-300" },
  { id: "cardio", name: "Full-Body Conditioning", short: "Conditioning", dot: "bg-fuchsia-300" },
  { id: "stretch", name: "Stretch & Recovery", short: "Stretch", dot: "bg-violet-300" },
];

const raw: Exercise[] = [
  // ───────── Knee & Leg Stability ─────────
  {
    id: "step-downs", cat: "knee", level: "moderate", name: "Controlled Step-Downs",
    tagline: "Practise lowering yourself slowly: the skill you need on stairs and downhill.",
    sets: 4, work: 40, rest: 20, cycle: 4, alternate: true,
    muscles: { primary: ["Quadriceps", "Glute medius"], secondary: ["Glute max", "Calves", "Core"] },
    steps: [
      "Stand on a low step with one foot near the edge, arms forward for balance.",
      "Shift your weight onto the step leg and soften that knee.",
      "Lower the other heel toward the floor over three slow seconds, hips back.",
      "Tap lightly, then press through the step heel to stand tall. Switch legs each set.",
    ],
    cues: ["Knee over second toe", "Pelvis stays level", "Three seconds down"],
    benefits: ["Builds control for walking downhill and down stairs", "Strengthens the muscles that steady the knee", "Trains hip and knee to work together"],
    motion: {
      pin: { joint: "ankleF", x: 60, y: 114 },
      props: [{ t: "rect", x: 30, y: 114, w: 40, h: 14 }],
      keys: [[180, 0, 0, 20, 10, 80, 90, 80, 90], [166, 60, -40, 35, 20, 85, 92, 85, 92]],
    },
  },
  {
    id: "wall-sit", cat: "knee", level: "hard", name: "Single-Leg Wall Sit",
    tagline: "Hold a seated position against a wall to build thigh endurance, one leg at a time.",
    sets: 4, work: 30, rest: 30, cycle: 5, hold: true, alternate: true,
    muscles: { primary: ["Quadriceps", "Glutes"], secondary: ["Hamstrings", "Calves", "Core"] },
    steps: [
      "Lean your back flat against a wall and walk the feet out until knees reach about 90°.",
      "Shift weight to one leg and extend the other straight out in front.",
      "Hold with ribs down and breathe slowly. Press the heel into the floor.",
      "Lower the lifted foot, rest, then repeat on the other side.",
    ],
    cues: ["Back flat on wall", "Knee tracks over toes", "Breathe out, don't brace"],
    benefits: ["Builds quad endurance for long climbs", "Trains each leg on its own, evening out strength", "Teaches the knee to stay steady under load"],
    motion: {
      pin: { joint: "ankleF", x: 90, y: 128 },
      props: [{ t: "line", x1: 63, y1: 14, x2: 63, y2: 128 }],
      keys: [[180, 74, 0, 80, 84, 55, 90, 55, 90], [180, 90, 0, 90, 90, 60, 90, 60, 90]],
    },
  },
  {
    id: "bulgarian", cat: "knee", level: "hard", name: "Bulgarian Split Squat",
    tagline: "A one-legged squat with your back foot resting on a bench for balance.",
    sets: 4, work: 40, rest: 20, cycle: 4, alternate: true,
    muscles: { primary: ["Quadriceps", "Glute max"], secondary: ["Adductors", "Hamstrings", "Hip flexors"] },
    steps: [
      "Rest the top of one foot on a bench behind you; step the other foot well forward.",
      "Keep your torso tall and lower straight down until the front thigh is near parallel.",
      "Keep the front heel planted and the knee tracking over the toes.",
      "Drive up through the front foot. Complete the set, then switch sides.",
    ],
    cues: ["Straight down, not forward", "Front heel heavy", "Chest proud"],
    benefits: ["Builds strong, balanced legs one side at a time", "Improves hip stability and balance", "Strengthens thighs and glutes for climbing and stairs"],
    motion: {
      pin: { joint: "ankleF", x: 100, y: 128 },
      props: [{ t: "rect", x: 36, y: 106, w: 26, h: 22 }],
      keys: [[180, 20, -10, -62, -62, 70, 90, 70, 90], [172, 70, -25, -35, -125, 70, 90, 70, 90]],
    },
  },
  {
    id: "trail-balance", cat: "knee", level: "moderate", name: "Trail Balance",
    tagline: "Lean forward on one leg while the other leg stretches out behind you.",
    sets: 4, work: 30, rest: 15, cycle: 5, hold: true, alternate: true,
    muscles: { primary: ["Glute medius", "Hamstrings"], secondary: ["Calves", "Foot stabilisers", "Spinal erectors"] },
    steps: [
      "Stand on one leg next to a wall or chair for support, with a soft bend in the standing knee.",
      "Lean your upper body forward from the hips while the other leg lifts straight back behind you.",
      "Reach your arms forward until your body forms a long line from fingertips to heel, like a letter T lying on its side. Keep your hips pointing at the floor.",
      "Hold, breathing slowly, then return to standing. Switch legs each set.",
    ],
    cues: ["One long line", "Hips square", "Eyes on a fixed point"],
    benefits: ["Improves balance on uneven ground", "Strengthens the hips and the back of the leg", "Builds ankle and foot stability"],
    motion: {
      pin: { joint: "ankleF", x: 100, y: 128 },
      keys: [[180, 0, 0, -10, -45, 70, 80, 70, 80], [105, 0, 0, -100, -100, 95, 100, 95, 100]],
    },
  },
  // ───────── Core & Pelvic Strength ─────────
  {
    id: "deadbug", cat: "core", level: "moderate", name: "Deadbugs",
    tagline: "Keep your lower back flat while your arms and legs move: trains the deep abs.",
    sets: 3, work: 40, rest: 20, cycle: 6,
    muscles: { primary: ["Transverse abdominis", "Rectus abdominis"], secondary: ["Obliques", "Hip flexors", "Pelvic floor"] },
    steps: [
      "Lie on your back with your arms pointing straight up and your hips and knees bent to 90°, shins parallel to the floor, like a table.",
      "Press your lower back gently into the floor and keep it there for the whole exercise.",
      "Slowly lower one arm back overhead and the opposite leg out straight toward the floor, breathing out.",
      "Return to the start and switch sides. Move only as far as your lower back stays flat.",
    ],
    cues: ["Back stays glued down", "Exhale on the reach", "Slow beats big"],
    benefits: ["Teaches the core to stay steady while the limbs move", "Protects the lower back", "Builds deep core control without straining the neck"],
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
    id: "hollow", cat: "core", level: "hard", name: "Hollow Body Hold",
    tagline: "Lie on your back and lift shoulders and legs slightly, with your lower back pressed down.",
    sets: 3, work: 20, rest: 20, cycle: 4, hold: true,
    muscles: { primary: ["Rectus abdominis", "Transverse abdominis"], secondary: ["Hip flexors", "Quads", "Serratus"] },
    steps: [
      "Lie on your back with your legs straight and together and your arms stretched overhead.",
      "Press your lower back into the floor, as if flattening it against the ground. Keep it there for the whole hold.",
      "Lift your shoulders and your legs a few inches off the floor, arms by your ears. You should look like a shallow banana.",
      "Breathe steadily. If your lower back lifts off the floor, bend your knees or raise your legs higher to make it easier.",
    ],
    cues: ["Ribs pulled to hips", "Lower back stays down", "Biceps by the ears"],
    benefits: ["Builds strong abs and full-body tension", "Teaches a flat, braced lower back", "Improves trunk control for harder core moves"],
    motion: {
      pin: { joint: "hip", x: 100, y: 122 },
      keys: [[-100, 125, 105, 125, 105, -100, -100, -100, -100], [-108, 122, 122, 122, 122, -108, -108, -108, -108]],
    },
  },
  {
    id: "bird-dog", cat: "core", level: "easy", name: "Bird-Dogs",
    tagline: "Reach one arm and the opposite leg while your back stays perfectly still.",
    sets: 3, work: 40, rest: 20, cycle: 6,
    muscles: { primary: ["Multifidus", "Glute max"], secondary: ["Deltoids", "Transverse abdominis", "Hamstrings"] },
    steps: [
      "Start on hands and knees, wrists under shoulders, knees under hips.",
      "Brace lightly, then slide one arm forward and the opposite leg back.",
      "Reach until both are level with your torso. Do not twist or sag.",
      "Return with control and alternate sides.",
    ],
    cues: ["Flat, level back", "Reach, don't lift", "Pause one beat"],
    benefits: ["Strengthens the muscles that support the spine", "Improves balance and coordination", "Builds back and glute strength with low joint stress"],
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
    id: "incline-pushup", cat: "upper", level: "moderate", name: "Incline Push-Ups",
    tagline: "A push-up with your hands raised on a bench: easier on wrists and shoulders.",
    sets: 3, work: 40, rest: 25, cycle: 3,
    muscles: { primary: ["Pectoralis major", "Triceps"], secondary: ["Front deltoids", "Serratus", "Core"] },
    steps: [
      "Place hands on a bench or sturdy counter, slightly wider than shoulders.",
      "Step back into a straight line from head to heels.",
      "Lower your chest to the edge, elbows at roughly 45° from your ribs.",
      "Press away until your arms are straight. Lower the incline to make it harder.",
    ],
    cues: ["Plank from head to heel", "Elbows tucked 45°", "Chest to the bench"],
    benefits: ["Builds chest, shoulder and arm strength", "Easier on the wrists and shoulders than floor push-ups", "A stepping stone toward full push-ups"],
    motion: {
      pin: { joint: "wristF", x: 126, y: 92 },
      props: [{ t: "rect", x: 118, y: 92, w: 44, h: 36 }],
      keys: [[146, -34, -34, -34, -34, 0, 0, 0, 0], [139, -41, -41, -41, -41, -35, 40, -35, 40]],
    },
  },
  {
    id: "chest-squeeze", cat: "upper", level: "easy", name: "Chest Squeeze",
    tagline: "Press your palms together hard to wake up the chest muscles, no equipment needed.",
    sets: 4, work: 20, rest: 15, cycle: 4, hold: true,
    muscles: { primary: ["Pectoralis major", "Pectoralis minor"], secondary: ["Front deltoids", "Serratus", "Triceps"] },
    steps: [
      "Stand tall, palms together at chest height, elbows out to the sides.",
      "Press your palms into each other as hard as you can without shrugging.",
      "Hold the squeeze steadily, breathing out through pursed lips.",
      "Ease off slowly for the last second, then repeat.",
    ],
    cues: ["Shoulders down and back", "Squeeze from the chest", "Keep breathing"],
    benefits: ["Tones the chest without any equipment", "Teaches you to feel the chest muscles working", "Gentle on the shoulders"],
    motion: {
      pin: { joint: "ankleF", x: 100, y: 128 },
      keys: [[180, 0, 0, 0, 0, 40, 100, 40, 100], [178, 0, 0, 0, 0, 70, 100, 70, 100]],
    },
  },
  {
    id: "scap-retraction", cat: "upper", level: "easy", name: "Scapular Retractions",
    tagline: "Squeeze your shoulder blades together to counter rounded shoulders.",
    sets: 3, work: 40, rest: 15, cycle: 4,
    muscles: { primary: ["Rhomboids", "Middle trapezius"], secondary: ["Rear deltoids", "Lower traps"] },
    steps: [
      "Stand tall with your arms stretched forward at shoulder height, as if holding a big ball.",
      "Squeeze your shoulder blades together, as if pinching a pencil between them, and bend your elbows back.",
      "Hold the squeeze for one second without arching your lower back or shrugging your shoulders.",
      "Release your arms forward slowly and repeat.",
    ],
    cues: ["Blades to back pockets", "Neck long", "Ribs stay down"],
    benefits: ["Counters rounded shoulders", "Wakes up the muscles between the shoulder blades", "Supports upright sitting and standing posture"],
    motion: {
      pin: { joint: "ankleF", x: 100, y: 128 },
      keys: [[178, 0, 0, 0, 0, 85, 90, 85, 90], [180, 0, 0, 0, 0, -65, 70, -65, 70]],
    },
  },
  // ───────── Posture & Back Alignment ─────────
  {
    id: "prone-ytw", cat: "posture", level: "moderate", name: "Prone Y-T-W",
    tagline: "Lying on your belly, lift your arms into Y, T and W shapes to strengthen the upper back.",
    sets: 3, work: 45, rest: 20, cycle: 9,
    muscles: { primary: ["Lower trapezius", "Rhomboids"], secondary: ["Rear deltoids", "Spinal erectors", "Rotator cuff"] },
    steps: [
      "Lie face down with your forehead hovering just off the floor and your arms by your sides, thumbs pointing up.",
      "Y: reach both arms forward and slightly apart, forming a Y, and lift them a few inches. Lower slowly.",
      "T: sweep your arms out to the sides at shoulder height, forming a T, and lift. Lower slowly.",
      "W: bend your elbows and pull your shoulder blades together, forming a W, and lift. Lower, then repeat the Y-T-W sequence smoothly.",
    ],
    cues: ["Thumbs up", "Lift from the back, not the neck", "Light, tiny range"],
    benefits: ["Builds endurance in the upper-back muscles", "Improves shoulder posture and stability", "Balances all the pushing work for the chest"],
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
    id: "cobra", cat: "posture", level: "easy", name: "Cobra Holds",
    tagline: "Lie on your belly and lift your chest to strengthen your back and open your chest.",
    sets: 4, work: 20, rest: 15, cycle: 5, hold: true,
    muscles: { primary: ["Spinal erectors", "Glute max"], secondary: ["Lower traps", "Rear deltoids", "Abdominals (stretch)"] },
    steps: [
      "Lie face down, hands under shoulders, legs long and together.",
      "Squeeze your glutes and lift your chest using your back, not your hands.",
      "Draw the shoulders away from your ears and keep the gaze down.",
      "Hold, then lower with control.",
    ],
    cues: ["Hands barely pressing", "Long neck", "Glutes on"],
    benefits: ["Strengthens the muscles that straighten the back", "Opens the chest and front of the body", "Helps counter long hours of sitting"],
    motion: {
      pin: { joint: "hip", x: 120, y: 124 },
      keys: [[-98, 90, 90, 90, 90, 70, -80, 70, -80], [-135, 90, 90, 90, 90, 10, -15, 10, -15]],
    },
  },
  {
    id: "towel-pulls", cat: "posture", level: "easy", name: "Towel Pulls",
    tagline: "Pull a towel apart as hard as you can to work your back muscles without equipment.",
    sets: 3, work: 40, rest: 15, cycle: 4,
    muscles: { primary: ["Latissimus dorsi", "Middle trapezius"], secondary: ["Rear deltoids", "Biceps", "Rhomboids"] },
    steps: [
      "Stand tall and hold a towel stretched between your hands, a little wider than your shoulders, above your head.",
      "Pull your hands apart as if trying to rip the towel in half, and keep that tension for the whole set.",
      "Keeping the tension, slowly lower the towel behind your head toward your upper back, elbows pointing down.",
      "Raise it back overhead slowly without letting your ribs flare forward.",
    ],
    cues: ["Rip the towel apart", "Elbows to ribs", "Ribs down"],
    benefits: ["Activates the back muscles without bands or weights", "Improves pulling strength and posture", "Easy to do anywhere"],
    motion: {
      pin: { joint: "ankleF", x: 100, y: 128 },
      keys: [[180, 0, 0, 0, 0, 172, 176, 172, 176], [180, 0, 0, 0, 0, -20, 165, -20, 165]],
    },
  },
  {
    id: "reverse-lunge", cat: "knee", level: "moderate", name: "Reverse Lunges",
    tagline: "Step back into a lunge: easier on the knee because the front shin stays upright.",
    sets: 4, work: 40, rest: 20, cycle: 4, alternate: true,
    muscles: { primary: ["Quadriceps", "Glute max"], secondary: ["Hamstrings", "Calves", "Core"] },
    steps: ["Stand tall with arms forward for balance.", "Step one foot back and lower until the front thigh is near parallel.", "Keep the front shin vertical and your torso upright.", "Push through the front heel to return. Alternate legs each rep."],
    cues: ["Shin stays vertical", "Back knee hovers", "Push through the heel"],
    benefits: ["Builds single-leg strength with less strain on the knee", "Strengthens thighs and glutes", "Improves balance and control"],
    motion: {
      pin: { joint: "ankleF", x: 100, y: 128 },
      keys: [
        [180, 0, 0, 0, 0, 85, 90, 85, 90],
        [176, 75, -5, -25, -75, 85, 90, 85, 90],
      ],
    },
  },
  {
    id: "sit-to-stand", cat: "knee", level: "easy", name: "Chair Sit-to-Stands",
    tagline: "Stand up from a chair slowly and sit back down slowly: the squat you do every day.",
    sets: 3, work: 40, rest: 20, cycle: 5,
    muscles: { primary: ["Quadriceps", "Glute max"], secondary: ["Hamstrings", "Core", "Calves"] },
    steps: ["Sit near the front of a sturdy chair, feet hip-width apart.", "Lean forward slightly and stand up over three seconds, pressing through your heels.", "Pause tall, squeezing your glutes.", "Sit back slowly over three seconds. Lightly touch the seat, don't drop."],
    cues: ["Heels heavy", "Knees over toes", "Slow on the way down"],
    benefits: ["Strengthens the movement you use every day", "Builds thigh and glute strength", "Teaches slow, knee-friendly control"],
    motion: {
      pin: { joint: "ankleF", x: 90, y: 128 },
      props: [{ t: "rect", x: 44, y: 106, w: 32, h: 5 }, { t: "line", x1: 46, y1: 72, x2: 46, y2: 106 }, { t: "line", x1: 50, y1: 111, x2: 50, y2: 128 }, { t: "line", x1: 72, y1: 111, x2: 72, y2: 128 }],
      keys: [
        [180, 0, 0, 0, 0, 85, 90, 85, 90],
        [170, 85, 0, 85, 0, 85, 90, 85, 90],
      ],
    },
  },
  {
    id: "straight-leg-raise", cat: "knee", level: "easy", name: "Straight-Leg Raises",
    tagline: "Lift a straight leg with the thigh tight to strengthen it without bending the knee.",
    sets: 4, work: 40, rest: 20, cycle: 7, alternate: true,
    muscles: { primary: ["Quadriceps", "Hip flexors"], secondary: ["Core"] },
    steps: ["Lie on your back, one knee bent with the foot flat, the other leg straight.", "Tighten the thigh of the straight leg so the knee locks out.", "Lift the leg to the height of the bent knee, toes pointing up.", "Hold at the top for 2 seconds, keeping the thigh tight and the knee locked.", "Lower slowly over 3 seconds. Switch legs each set."],
    cues: ["Knee fully locked", "Pause 2s at the top", "Lower back flat"],
    benefits: ["Strengthens the thigh without bending the knee", "Useful when deeper knee bends feel uncomfortable", "Builds hip and thigh control"],
    motion: {
      pin: { joint: "hip", x: 110, y: 124 },
      // down → lift → hold (two segments at the top) → lower → short rest
      keys: [
        [-90, 90, 90, 150, 20, 90, 90, 90, 90],
        [-90, 135, 135, 150, 20, 90, 90, 90, 90],
        [-90, 135, 135, 150, 20, 90, 90, 90, 90],
        [-90, 135, 135, 150, 20, 90, 90, 90, 90],
        [-90, 90, 90, 150, 20, 90, 90, 90, 90],
      ],
    },
  },
  {
    id: "plank", cat: "core", level: "moderate", name: "Forearm Plank",
    tagline: "Hold your body in a straight line on your forearms to strengthen your whole core.",
    sets: 3, work: 30, rest: 20, cycle: 4, hold: true,
    muscles: { primary: ["Transverse abdominis", "Rectus abdominis"], secondary: ["Glutes", "Shoulders", "Quads"] },
    steps: ["Set your elbows under your shoulders, forearms flat on the floor.", "Tuck your pelvis slightly and squeeze your glutes.", "Form one line from head to heels. Do not let the hips sag or pike.", "Breathe steadily and hold."],
    cues: ["Ribs down", "Squeeze glutes", "Push the floor away"],
    benefits: ["Builds whole-trunk strength and endurance", "Supports a stable spine", "Strengthens shoulders and glutes too"],
    motion: {
      pin: { joint: "ankleF", x: 40, y: 127 },
      keys: [
        [101, -79, -79, -79, -79, 0, 90, 0, 90],
        [97, -83, -83, -83, -83, 0, 90, 0, 90],
      ],
    },
  },
  {
    id: "mountain-climbers", cat: "core", level: "hard", name: "Mountain Climbers",
    tagline: "From a plank, run your knees toward your chest: core work that raises your heart rate.",
    sets: 3, work: 30, rest: 20, cycle: 2.4,
    muscles: { primary: ["Rectus abdominis", "Hip flexors"], secondary: ["Shoulders", "Quads", "Obliques"] },
    steps: ["Start in a high plank, hands under shoulders.", "Drive one knee toward your chest without lifting the hips.", "Switch legs in a steady rhythm.", "Slow the pace if your hips start to bounce."],
    cues: ["Hips low and level", "Hands stay planted", "Quick, quiet feet"],
    benefits: ["Raises your heart rate while training the core", "Builds shoulder and hip endurance", "Improves coordination"],
    motion: {
      pin: { joint: "wristF", x: 120, y: 128 },
      keys: [
        [112, -68, -68, -68, -68, 0, 0, 0, 0],
        [112, 120, 20, -68, -68, 0, 0, 0, 0],
        [112, -68, -68, -68, -68, 0, 0, 0, 0],
        [112, -68, -68, 120, 20, 0, 0, 0, 0],
      ],
    },
  },
  {
    id: "bicycle-crunch", cat: "core", level: "moderate", name: "Bicycle Crunches",
    tagline: "Pedal your legs and bring opposite elbow to knee to work the abs and sides of the waist.",
    sets: 3, work: 40, rest: 20, cycle: 3,
    muscles: { primary: ["Rectus abdominis", "Obliques"], secondary: ["Hip flexors"] },
    steps: ["Lie on your back, hands lightly behind your head, shoulders lifted.", "Bring one knee in as the opposite elbow travels toward it.", "Extend the other leg long and low.", "Pedal slowly. Rotate your ribs, not just your elbows."],
    cues: ["Rotate from the ribs", "Low back stays down", "Slow pedal"],
    benefits: ["Strengthens the abs and the sides of the waist", "Trains the core to rotate with control", "Improves coordination between upper and lower body"],
    motion: {
      pin: { joint: "hip", x: 112, y: 124 },
      keys: [
        [-125, -170, 100, 110, 110, -150, 60, -150, 60],
        [-125, 110, 110, -170, 100, -150, 60, -150, 60],
      ],
    },
  },
  {
    id: "knee-pushup", cat: "upper", level: "easy", name: "Knee Push-Ups",
    tagline: "Build push-up strength with a shorter lever.",
    sets: 3, work: 40, rest: 25, cycle: 3,
    muscles: { primary: ["Pectoralis major", "Triceps"], secondary: ["Front deltoids", "Serratus", "Core"] },
    steps: ["Kneel with hands slightly wider than your shoulders.", "Walk your hands forward so your body is one line from head to knees.", "Lower your chest toward the floor with elbows at about 45°.", "Press back up without letting your hips sag."],
    cues: ["Line from head to knees", "Elbows 45°", "Chest to the floor"],
    benefits: ["Builds chest, shoulder and arm strength", "A shorter lever makes it easier to progress", "Teaches good push-up form"],
    motion: {
      pin: { joint: "wristF", x: 120, y: 128 },
      keys: [
        [121, -59, -120, -59, -120, 0, 0, 0, 0],
        [114, -66, -120, -66, -120, -35, 40, -35, 40],
      ],
    },
  },
  {
    id: "shoulder-taps", cat: "upper", level: "moderate", name: "Shoulder Taps",
    tagline: "In a plank, tap each shoulder in turn while your hips stay still.",
    sets: 3, work: 30, rest: 20, cycle: 4,
    muscles: { primary: ["Obliques", "Deltoids"], secondary: ["Pectorals", "Serratus", "Glutes"] },
    steps: ["Start in a high plank with feet slightly wider than hip-width.", "Lift one hand and tap the opposite shoulder.", "Keep your hips from rocking side to side.", "Alternate hands at a controlled pace."],
    cues: ["Hips stay square", "Wide feet", "Slow taps"],
    benefits: ["Trains the core to resist twisting", "Builds shoulder stability", "Improves balance in plank positions"],
    motion: {
      pin: { joint: "hip", x: 87, y: 112 },
      keys: [
        [112, -68, -68, -68, -68, 0, 0, 0, 0],
        [112, -68, -68, -68, -68, 100, 205, 0, 0],
        [112, -68, -68, -68, -68, 0, 0, 0, 0],
        [112, -68, -68, -68, -68, 0, 0, 100, 205],
      ],
    },
  },
  {
    id: "superman", cat: "posture", level: "easy", name: "Superman Lifts",
    tagline: "Lie on your belly and lift arms, chest and legs slightly to strengthen the back.",
    sets: 3, work: 30, rest: 20, cycle: 4,
    muscles: { primary: ["Spinal erectors", "Glute max"], secondary: ["Rear deltoids", "Hamstrings"] },
    steps: ["Lie face down, arms reaching overhead, legs long.", "Lift arms, chest and legs a few inches together.", "Keep your gaze down and the neck long.", "Lower slowly. Small range is enough."],
    cues: ["Long neck", "Reach, don't crank", "Squeeze glutes"],
    benefits: ["Builds endurance in the back muscles", "Strengthens the glutes and back of the shoulders", "Works the back without loading the spine"],
    motion: {
      pin: { joint: "hip", x: 118, y: 124 },
      keys: [
        [-95, 90, 90, 90, 90, -95, -95, -95, -95],
        [-110, 100, 100, 100, 100, -112, -112, -112, -112],
      ],
    },
  },
  {
    id: "reverse-plank", cat: "posture", level: "moderate", name: "Reverse Plank",
    tagline: "Hold your body in a straight line facing the ceiling, supported by your hands and heels.",
    sets: 3, work: 25, rest: 20, cycle: 4, hold: true,
    muscles: { primary: ["Glute max", "Hamstrings"], secondary: ["Rear deltoids", "Triceps", "Spinal erectors"] },
    steps: [
      "Sit on the floor with your legs straight in front of you and your hands behind your hips, fingers pointing toward your feet.",
      "Press through your hands and heels and lift your hips until your body forms a straight line from shoulders to heels.",
      "Open your chest and keep your shoulders away from your ears. Look forward or slightly up, with a long neck.",
      "Hold and breathe, then lower your hips slowly. Bend your knees (tabletop) to make it easier.",
    ],
    cues: ["Hips high", "Chest open", "Shoulders away from ears"],
    benefits: ["Strengthens the whole back of the body", "Opens the chest and front of the shoulders", "Improves posture"],
    motion: {
      pin: { joint: "wristF", x: 60, y: 128 },
      keys: [
        [-118, 62, 62, 62, 62, 0, 0, 0, 0],
        [-112, 68, 68, 68, 68, 0, 0, 0, 0],
      ],
    },
  },
  {
    id: "good-morning", cat: "posture", level: "easy", name: "Hip Hinge Good Mornings",
    tagline: "Learn to bend from the hips, not the spine.",
    sets: 3, work: 40, rest: 20, cycle: 4,
    muscles: { primary: ["Hamstrings", "Spinal erectors"], secondary: ["Glute max", "Core"] },
    steps: ["Stand with feet hip-width apart, knees soft, hands folded across your chest.", "Push your hips back as your torso tips forward.", "Keep your back flat, stopping when you feel the hamstrings load.", "Drive the hips forward to stand tall."],
    cues: ["Hips go back", "Flat back", "Squeeze glutes at the top"],
    benefits: ["Teaches bending from the hips, not the spine", "Strengthens hamstrings and lower back", "Protects the back during lifting and daily bending"],
    motion: {
      pin: { joint: "ankleF", x: 100, y: 128 },
      keys: [
        [180, 0, 0, 0, 0, 20, 100, 20, 100],
        [110, 15, -5, 15, -5, 20, 100, 20, 100],
      ],
    },
  },
  {
    id: "glute-bridge", cat: "hips", level: "easy", name: "Glute Bridge",
    tagline: "Lift your hips off the floor to strengthen your glutes and the back of your legs.",
    sets: 3, work: 40, rest: 20, cycle: 4,
    muscles: { primary: ["Glute max", "Hamstrings"], secondary: ["Core", "Adductors"] },
    steps: ["Lie on your back, knees bent, feet flat hip-width apart.", "Press through your heels and lift your hips until shoulders, hips and knees line up.", "Squeeze your glutes at the top without arching your back.", "Lower slowly."],
    cues: ["Push through heels", "Ribs down", "Squeeze at the top"],
    benefits: ["Strengthens the glutes and hamstrings", "Wakes up glutes that switch off from sitting", "A gentle base for every hip exercise"],
    motion: {
      pin: { joint: "ankleF", x: 120, y: 128 },
      keys: [
        [-90, 150, 20, 150, 20, 90, 90, 90, 90],
        [-70, 105, 0, 105, 0, 90, 90, 90, 90],
      ],
    },
  },
  {
    id: "single-leg-bridge", cat: "hips", level: "moderate", name: "Single-Leg Glute Bridge",
    tagline: "A glute bridge with one leg stretched out, so each side works on its own.",
    sets: 4, work: 30, rest: 20, cycle: 4, alternate: true,
    muscles: { primary: ["Glute max", "Glute medius"], secondary: ["Hamstrings", "Core"] },
    steps: ["Set up for a bridge, then extend one leg straight, thigh level with the other.", "Press through the planted heel and lift your hips.", "Keep your pelvis level; don't let it twist.", "Lower slowly. Switch legs each set."],
    cues: ["Pelvis level", "Heel pressing down", "Slow lowering"],
    benefits: ["Builds strength in each leg on its own", "Improves pelvic control and stability", "Strengthens the glutes that support the knee"],
    motion: {
      pin: { joint: "ankleF", x: 120, y: 128 },
      keys: [
        [-90, 150, 20, 150, 20, 90, 90, 90, 90],
        [-70, 105, 0, 110, 110, 90, 90, 90, 90],
      ],
    },
  },
  {
    id: "donkey-kick", cat: "hips", level: "easy", name: "Donkey Kicks",
    tagline: "On hands and knees, press one foot toward the ceiling to strengthen the glutes.",
    sets: 3, work: 40, rest: 20, cycle: 5,
    muscles: { primary: ["Glute max"], secondary: ["Hamstrings", "Core"] },
    steps: ["Start on hands and knees, back flat.", "Keeping the knee bent 90°, press one foot toward the ceiling.", "Stop when the thigh is level with your back. Do not arch.", "Lower with control and alternate."],
    cues: ["Level hips", "Press the sole up", "No arching"],
    benefits: ["Isolates the glutes from a stable base", "Builds hip strength without loading the knees", "Easy to learn"],
    motion: {
      pin: { joint: "hip", x: 82, y: 98 },
      keys: [
        [90, 0, -80, 0, -80, 0, 0, 0, 0],
        [90, 0, -80, -95, 175, 0, 0, 0, 0],
        [90, 0, -80, 0, -80, 0, 0, 0, 0],
        [90, -95, 175, 0, -80, 0, 0, 0, 0],
      ],
    },
  },
  {
    id: "bodyweight-squat", cat: "hips", level: "moderate", name: "Bodyweight Squats",
    tagline: "Strong hips and legs, the foundation lift.",
    sets: 3, work: 40, rest: 20, cycle: 4,
    muscles: { primary: ["Quadriceps", "Glute max"], secondary: ["Hamstrings", "Adductors", "Core"] },
    steps: ["Stand with feet shoulder-width apart, arms forward.", "Sit your hips back and down, chest tall.", "Go as deep as you can with your heels down and knees tracking over toes.", "Drive up through the whole foot."],
    cues: ["Heels down", "Knees follow toes", "Chest tall"],
    benefits: ["Builds leg and hip strength", "Trains the movement of sitting down and standing up", "Supports knee and hip health when done with control"],
    motion: {
      pin: { joint: "ankleF", x: 100, y: 128 },
      keys: [
        [180, 0, 0, 0, 0, 85, 90, 85, 90],
        [150, 80, -30, 80, -30, 90, 92, 90, 92],
      ],
    },
  },
  {
    id: "arm-circles", cat: "shoulder", level: "easy", phase: "warmup", suits: ["upper", "shoulder", "posture", "core"], name: "Arm Circles",
    tagline: "Warm up the shoulder joint through its full range.",
    sets: 3, work: 30, rest: 15, cycle: 3,
    muscles: { primary: ["Deltoids", "Rotator cuff"], secondary: ["Upper traps", "Serratus"] },
    steps: ["Stand tall with arms straight out to the sides.", "Draw slow circles, starting small and getting bigger.", "Keep your ribs down and shoulders away from your ears.", "Reverse direction halfway."],
    cues: ["Slow and smooth", "Ribs down", "Reverse halfway"],
    benefits: ["Warms up the shoulder joints", "Improves shoulder range of motion", "Prepares you for upper-body work"],
    motion: {
      pin: { joint: "ankleF", x: 100, y: 128 },
      keys: [
        [180, 0, 0, 0, 0, 90, 90, 90, 90],
        [180, 0, 0, 0, 0, 180, 180, 180, 180],
        [180, 0, 0, 0, 0, 270, 270, 270, 270],
        [180, 0, 0, 0, 0, 360, 360, 360, 360],
      ],
    },
  },
  {
    id: "wall-angels", cat: "shoulder", level: "easy", name: "Wall Angels",
    tagline: "Slide your arms up and down a wall to loosen the shoulders and strengthen the upper back.",
    sets: 3, work: 40, rest: 15, cycle: 5,
    muscles: { primary: ["Lower trapezius", "Serratus"], secondary: ["Rhomboids", "Deltoids"] },
    steps: [
      "Stand with your back, head and hips against a wall, feet a few inches in front of it.",
      "Raise your arms to the sides with elbows bent at 90°, so your arms look like a goalpost, with the backs of your arms and hands touching the wall.",
      "Slowly slide your arms up the wall as far as you can while everything keeps touching the wall.",
      "Slide them back down to the goalpost position. Keep your ribs down and your lower back gently against the wall.",
    ],
    cues: ["Keep contact", "Ribs down", "Smooth slide"],
    benefits: ["Improves overhead shoulder mobility", "Strengthens the muscles that hold the shoulder blades", "Helps with slouched posture"],
    motion: {
      pin: { joint: "ankleF", x: 90, y: 128 },
      props: [{ t: "line", x1: 83, y1: 14, x2: 83, y2: 128 }],
      keys: [
        [180, 0, 0, 0, 0, 10, 170, 10, 170],
        [180, 0, 0, 0, 0, 175, 178, 175, 178],
      ],
    },
  },
  {
    id: "overhead-reach", cat: "shoulder", level: "easy", name: "Overhead Reaches",
    tagline: "Reach your arms overhead to loosen your shoulders and stretch the sides of your back.",
    sets: 3, work: 30, rest: 15, cycle: 5,
    muscles: { primary: ["Anterior deltoids", "Serratus"], secondary: ["Lats", "Triceps"] },
    steps: ["Stand tall, arms by your sides.", "Raise your arms forward and up, reaching long.", "Reach until the biceps are near your ears without arching.", "Lower slowly."],
    cues: ["Ribs down", "Reach tall", "Biceps by ears"],
    benefits: ["Improves how high your arms can reach", "Gently stretches the sides of the back", "Opens the chest and shoulders"],
    motion: {
      pin: { joint: "ankleF", x: 100, y: 128 },
      keys: [
        [180, 0, 0, 0, 0, 0, 0, 0, 0],
        [180, 0, 0, 0, 0, 175, 178, 175, 178],
      ],
    },
  },
  {
    id: "doorway-chest", cat: "shoulder", level: "easy", name: "Doorway Chest Opener",
    tagline: "Counter the desk slouch by opening the front of the shoulder.",
    sets: 3, work: 30, rest: 10, cycle: 6, hold: true,
    muscles: { primary: ["Pectoralis major", "Anterior deltoids"], secondary: ["Biceps", "Pectoralis minor"] },
    steps: ["Stand in a doorway with forearms on the frame, elbows at shoulder height.", "Step one foot through until you feel a stretch across the chest.", "Keep your ribs down and your neck long.", "Breathe slowly and hold."],
    cues: ["Ribs down", "Soft knees", "Breathe into the stretch"],
    benefits: ["Opens tight chest and front-of-shoulder muscles", "Counters desk and phone slouch", "Helps shoulders sit back"],
    motion: {
      pin: { joint: "ankleF", x: 88, y: 128 },
      props: [{ t: "line", x1: 108, y1: 14, x2: 108, y2: 128 }],
      keys: [
        [180, 0, 0, 0, 0, 20, 100, 20, 100],
        [168, 0, 0, 0, 0, 150, 178, 150, 178],
      ],
    },
  },
  {
    id: "high-knees", cat: "cardio", level: "moderate", phase: "warmup", suits: ["hips", "cardio"], name: "High Knees",
    tagline: "Fast, light cardio that fires up the hips.",
    sets: 4, work: 30, rest: 20, cycle: 1.2,
    muscles: { primary: ["Hip flexors", "Quadriceps"], secondary: ["Calves", "Core"] },
    steps: ["Stand tall and start running in place.", "Drive each knee to hip height.", "Pump your arms and land softly on the balls of your feet.", "Stay tall and keep a quick tempo."],
    cues: ["Knees to hip height", "Quiet landings", "Tall chest"],
    benefits: ["Raises your heart rate quickly", "Warms up hips and thighs", "Builds light, springy leg coordination"],
    motion: {
      pin: { joint: "hip", x: 100, y: 84 },
      keys: [
        [175, 100, 10, 0, 0, -40, 20, 40, 140],
        [175, 0, 0, 100, 10, 40, 140, -40, 20],
      ],
    },
  },
  {
    id: "butt-kicks", cat: "cardio", level: "easy", phase: "warmup", suits: ["hips", "cardio"], name: "Butt Kicks",
    tagline: "Dynamic hamstring warm-up that raises your heart rate.",
    sets: 4, work: 30, rest: 20, cycle: 1.2,
    muscles: { primary: ["Hamstrings"], secondary: ["Calves", "Glutes"] },
    steps: ["Jog in place, heels flicking up toward your glutes.", "Keep your thighs pointing down.", "Swing your arms naturally.", "Stay light on your feet."],
    cues: ["Heels to glutes", "Thighs point down", "Quick and light"],
    benefits: ["Warms up the hamstrings", "Raises your heart rate", "Improves leg speed and rhythm"],
    motion: {
      pin: { joint: "hip", x: 100, y: 84 },
      keys: [
        [178, 5, -170, 0, 0, -40, 20, 40, 140],
        [178, 0, 0, 5, -170, 40, 140, -40, 20],
      ],
    },
  },
  {
    id: "shadow-boxing", cat: "cardio", level: "moderate", name: "Shadow Boxing",
    tagline: "Rhythmic full-body cardio with punches.",
    sets: 4, work: 40, rest: 20, cycle: 2.4,
    muscles: { primary: ["Deltoids", "Triceps"], secondary: ["Core", "Calves", "Glutes"] },
    steps: ["Stand in a staggered stance, fists by your chin.", "Throw a straight jab, then a cross, rotating your hips.", "Return your hands to guard after every punch.", "Stay light on your feet and breathe out on each punch."],
    cues: ["Hands back to guard", "Rotate the hips", "Exhale on the punch"],
    benefits: ["Raises your heart rate with full-body movement", "Trains shoulders, arms and core together", "Improves rhythm and coordination"],
    motion: {
      pin: { joint: "ankleF", x: 95, y: 128 },
      keys: [
        [172, 20, 0, -20, -20, 30, 160, 30, 160],
        [168, 20, 0, -20, -20, 90, 90, 30, 160],
        [172, 20, 0, -20, -20, 30, 160, 30, 160],
        [168, 20, 0, -20, -20, 30, 160, 90, 90],
      ],
    },
  },
  {
    id: "marches", cat: "cardio", level: "easy", phase: "warmup", name: "Standing Marches",
    tagline: "A low-impact way to raise your heart rate.",
    sets: 3, work: 40, rest: 20, cycle: 3,
    muscles: { primary: ["Hip flexors", "Quadriceps"], secondary: ["Core", "Calves"] },
    steps: ["Stand tall, arms bent at your sides.", "Lift one knee to hip height, then the other, marching steadily.", "Swing the opposite arm with each step.", "Keep your core braced and posture tall."],
    cues: ["Tall posture", "Knees to hip height", "Opposite arm swings"],
    benefits: ["Raises your heart rate with low impact", "Warms up hips and legs gently", "Good as a first warm-up"],
    motion: {
      pin: { joint: "hip", x: 100, y: 84 },
      keys: [
        [180, 90, 0, 0, 0, -30, 10, 40, 140],
        [180, 0, 0, 90, 0, 40, 140, -30, 10],
      ],
    },
  },
  {
    id: "hip-flexor-stretch", cat: "stretch", level: "easy", phase: "cooldown", suits: ["knee", "hike", "hips", "core", "cardio"], name: "Half-Kneeling Hip Flexor Stretch",
    tagline: "Lengthen the front of the hip after sitting or squatting.",
    sets: 2, work: 30, rest: 10, cycle: 8, hold: true, alternate: true,
    muscles: { primary: ["Hip flexors", "Quadriceps"], secondary: ["Glutes", "Abdominals"] },
    steps: ["Kneel on one knee with the other foot flat in front.", "Tuck your pelvis under and squeeze the glute of the back leg.", "Shift your weight forward until you feel the stretch.", "Reach the same-side arm overhead. Breathe slowly."],
    cues: ["Tuck the pelvis", "Squeeze back glute", "Ribs down"],
    benefits: ["Lengthens hip flexors tight from sitting", "Can ease pulling at the front of the hip", "Helps you stand and walk more freely"],
    motion: {
      pin: { joint: "ankleF", x: 110, y: 128 },
      keys: [
        [180, 90, 0, 0, -90, 20, 120, 20, 120],
        [185, 80, -15, 5, -85, 175, 175, 175, 175],
      ],
    },
  },
  {
    id: "childs-pose", cat: "stretch", level: "easy", phase: "cooldown", suits: ["core", "posture", "upper", "shoulder", "hips"], name: "Child's Pose",
    tagline: "Gently stretch the back, hips and shoulders.",
    sets: 2, work: 30, rest: 10, cycle: 8, hold: true,
    muscles: { primary: ["Spinal erectors", "Lats"], secondary: ["Glutes", "Shoulders"] },
    steps: ["Kneel with your big toes together and knees apart.", "Sit your hips back toward your heels.", "Walk your hands forward and rest your forehead down.", "Breathe slowly into your back."],
    cues: ["Hips back", "Long arms", "Slow breaths"],
    benefits: ["Gently stretches back, hips and shoulders", "Helps the body relax after a workout", "Easy to hold and breathe in"],
    motion: {
      pin: { joint: "ankleF", x: 60, y: 124 },
      keys: [
        [165, 53, -90, 53, -90, 40, 100, 40, 100],
        [82, 53, -90, 53, -90, 88, 90, 88, 90],
      ],
    },
  },
  {
    id: "quad-stretch", cat: "stretch", level: "easy", phase: "cooldown", suits: ["knee", "hike", "hips", "cardio"], name: "Standing Quad Stretch",
    tagline: "Release tight thighs after leg work.",
    sets: 2, work: 30, rest: 10, cycle: 8, hold: true, alternate: true,
    muscles: { primary: ["Quadriceps", "Hip flexors"], secondary: ["Calves", "Core"] },
    steps: ["Stand tall, holding a wall for balance if needed.", "Bend one knee and catch the foot behind you.", "Draw your heel to your glute, knees together and pelvis tucked.", "Hold, then switch sides."],
    cues: ["Knees together", "Pelvis tucked", "Stand tall"],
    benefits: ["Releases tight thighs after leg work", "Lengthens the front of the hip", "Helps legs feel lighter after a hike"],
    motion: {
      pin: { joint: "ankleF", x: 100, y: 128 },
      keys: [
        [180, 0, 0, 0, -60, 0, 0, 0, 0],
        [175, 0, 0, 10, -165, 0, 0, 0, 0],
      ],
    },
  },
  {
    id: "forward-fold", cat: "stretch", level: "easy", phase: "cooldown", suits: ["knee", "hike", "hips", "posture", "core", "cardio"], name: "Standing Forward Fold",
    tagline: "Release the hamstrings and lower back.",
    sets: 2, work: 30, rest: 10, cycle: 8, hold: true,
    muscles: { primary: ["Hamstrings", "Spinal erectors"], secondary: ["Calves", "Glutes"] },
    steps: ["Stand with feet hip-width apart and reach your arms overhead.", "Hinge from the hips and fold forward with soft knees.", "Let your head and arms hang heavy.", "Bend the knees if your back rounds sharply."],
    cues: ["Soft knees", "Heavy head", "Breathe out"],
    benefits: ["Releases the hamstrings and lower back", "Takes tension out of the spine", "Calms the body after training"],
    motion: {
      pin: { joint: "ankleF", x: 100, y: 128 },
      keys: [
        [180, 0, 0, 0, 0, 175, 175, 175, 175],
        [75, 0, 0, 0, 0, 5, 5, 5, 5],
      ],
    },
  },
  // ───────── Added: easier knee work ─────────
  {
    id: "wall-sit-double", cat: "knee", level: "easy", name: "Wall Sit",
    tagline: "Hold a seated position against a wall: the stepping stone to the single-leg version.",
    sets: 3, work: 30, rest: 30, cycle: 5, hold: true,
    muscles: { primary: ["Quadriceps", "Glutes"], secondary: ["Hamstrings", "Calves", "Core"] },
    steps: [
      "Lean your back flat against a wall, feet hip-width apart and about two foot-lengths out.",
      "Slide down only to a shallow bend (around 45–60°). Go deeper only when it stays pain-free.",
      "Hold with your weight in your heels and your knees in line with your toes.",
      "Press up the wall to stand and rest. Work toward 90° over the weeks.",
    ],
    cues: ["Shallow is fine", "Weight in the heels", "Breathe out, don't brace"],
    benefits: ["Builds thigh endurance with both legs sharing the load", "A stepping stone to the single-leg wall sit", "Teaches the knee to stay steady under load"],
    motion: {
      pin: { joint: "ankleF", x: 88, y: 128 },
      props: [{ t: "line", x1: 63, y1: 14, x2: 63, y2: 128 }],
      keys: [[180, 50, 0, 50, 0, 60, 90, 60, 90], [180, 62, 0, 62, 0, 60, 90, 60, 90]],
    },
  },
  {
    id: "calf-raise", cat: "knee", level: "easy", name: "Slow Calf Raises",
    tagline: "Strong calves share the load with the knee, especially on descents.",
    sets: 3, work: 40, rest: 20, cycle: 6,
    muscles: { primary: ["Gastrocnemius", "Soleus"], secondary: ["Foot stabilisers", "Glutes"] },
    steps: [
      "Stand tall with your fingertips on a wall or chair for balance.",
      "Rise onto the balls of your feet over 2 seconds.",
      "Pause for 1 second at the top.",
      "Lower your heels over 3 seconds. When this is easy, progress to one leg at a time.",
    ],
    cues: ["Straight up, don't roll out", "Pause at the top", "Three seconds down"],
    benefits: ["Strengthens the calves that help absorb each step", "Takes load off the knee on descents", "Builds ankle stability"],
    motion: {
      pin: { joint: "ankleF", x: 100, y: 128 },
      props: [{ t: "line", x1: 132, y1: 14, x2: 132, y2: 128 }],
      keys: [[180, 10, -10, 10, -10, 80, 90, 80, 90], [180, 0, 0, 0, 0, 80, 90, 80, 90]],
    },
  },
  {
    id: "quad-set", cat: "knee", level: "easy", name: "Quad Sets",
    tagline: "The gentlest way to wake the thigh muscle: no movement at the knee.",
    sets: 4, work: 30, rest: 15, cycle: 5, hold: true, alternate: true,
    muscles: { primary: ["Quadriceps"], secondary: ["Hip flexors"] },
    steps: [
      "Lie on your back, one knee bent with the foot flat, the other leg straight. A rolled towel under the straight knee is optional.",
      "Tighten the thigh of the straight leg and press the back of the knee down.",
      "Hold the squeeze for 5 seconds, then relax fully for a moment. Repeat for the whole set.",
      "Switch legs each set.",
    ],
    cues: ["Press the knee down", "Toes pulled back", "Breathe normally"],
    benefits: ["Wakes up the thigh without moving the knee", "A gentle start when the knee is sensitive", "Builds the base for squats and steps"],
    motion: {
      pin: { joint: "hip", x: 110, y: 124 },
      keys: [[-90, 90, 90, 150, 20, 90, 90, 90, 90], [-90, 86, 86, 150, 20, 90, 90, 90, 90]],
    },
  },
  {
    id: "heel-slide", cat: "knee", level: "easy", name: "Heel Slides",
    tagline: "Gentle knee bending with the floor taking your weight.",
    sets: 4, work: 40, rest: 20, cycle: 5, alternate: true,
    muscles: { primary: ["Hamstrings", "Quadriceps"], secondary: ["Hip flexors", "Calves"] },
    steps: [
      "Lie on your back with both legs straight.",
      "Slide one heel slowly toward your hips, bending the knee as far as is comfortable.",
      "Pause, then slide the heel back out until the leg is straight.",
      "Stay in a pain-free range. Switch legs each set.",
    ],
    cues: ["Slow and smooth", "Heel stays on the floor", "Stop before it pinches"],
    benefits: ["Gently improves knee bending", "Keeps the knee moving with little load", "Warms up the thigh and hamstring"],
    motion: {
      pin: { joint: "hip", x: 110, y: 124 },
      keys: [[-90, 90, 90, 150, 20, 90, 90, 90, 90], [-90, 150, 20, 150, 20, 90, 90, 90, 90]],
    },
  },
  {
    id: "mini-squat", cat: "knee", level: "easy", name: "Mini Squats",
    tagline: "A shallow, comfortable squat to groove the pattern before going deeper.",
    sets: 3, work: 40, rest: 20, cycle: 5,
    muscles: { primary: ["Quadriceps", "Glute max"], secondary: ["Hamstrings", "Calves", "Core"] },
    steps: [
      "Stand with feet hip-width apart, arms forward. Hold a counter if you need it.",
      "Sit your hips back and bend the knees only a quarter of the way down.",
      "Keep your heels down and your knees pointing the same way as your toes.",
      "Stand up by pressing through the whole foot.",
    ],
    cues: ["Quarter depth", "Heels down", "Knees follow toes"],
    benefits: ["Builds comfortable squat strength", "Grooves a safe squat pattern before going deeper", "Strengthens thighs and glutes"],
    motion: {
      pin: { joint: "ankleF", x: 100, y: 128 },
      keys: [[180, 0, 0, 0, 0, 85, 90, 85, 90], [172, 42, -14, 42, -14, 88, 90, 88, 90]],
    },
  },
  // ───────── Added: Hike Prep (descents) ─────────
  {
    id: "low-step-down", cat: "hike", level: "easy", name: "Low Step-Downs",
    tagline: "Lower yourself slowly from a small step: practice for stairs and downhill walking.",
    sets: 4, work: 40, rest: 20, cycle: 6, alternate: true,
    muscles: { primary: ["Quadriceps", "Glute medius"], secondary: ["Calves", "Glute max", "Core"] },
    steps: [
      "Stand on a low step (a thick book or the bottom stair works) near the edge, holding a rail or wall.",
      "Shift your weight onto the step leg and slowly lower the other heel toward the floor over 3 seconds.",
      "Tap the floor lightly. Don't put weight on it.",
      "Press through the step heel to stand tall. Switch legs each set.",
    ],
    cues: ["Three seconds down", "Knee over second toe", "Light tap only"],
    benefits: ["Builds control for downhill steps at a small height", "Strengthens thighs and the side of the hip", "Trains the knee to track steadily"],
    motion: {
      pin: { joint: "ankleF", x: 50, y: 120 },
      props: [{ t: "rect", x: 14, y: 120, w: 44, h: 8 }],
      keys: [[180, 0, 0, 40, 15, 40, 60, 40, 60], [174, 45, -25, 40, 15, 40, 60, 40, 60]],
    },
  },
  {
    id: "slow-sit-down", cat: "hike", level: "easy", name: "Slow Sit-Downs",
    tagline: "Practise the slow, controlled lowering that downhill steps demand.",
    sets: 3, work: 40, rest: 20, cycle: 8,
    muscles: { primary: ["Quadriceps", "Glute max"], secondary: ["Hamstrings", "Calves", "Core"] },
    steps: [
      "Stand in front of a sturdy chair, feet hip-width apart.",
      "Send your hips back and lower over 5 seconds, like a very slow elevator.",
      "Touch the seat lightly, then stand back up (use your hands if you need to).",
      "Keep your knees tracking over your toes the whole way down.",
    ],
    cues: ["Five seconds down", "Hips back first", "Knees over toes"],
    benefits: ["Builds the slow lowering that downhill steps need", "Strengthens thighs and glutes", "Teaches soft, controlled landings"],
    motion: {
      pin: { joint: "ankleF", x: 90, y: 128 },
      props: [{ t: "rect", x: 44, y: 106, w: 32, h: 5 }, { t: "line", x1: 46, y1: 72, x2: 46, y2: 106 }, { t: "line", x1: 50, y1: 111, x2: 50, y2: 128 }, { t: "line", x1: 72, y1: 111, x2: 72, y2: 128 }],
      keys: [[180, 0, 0, 0, 0, 85, 90, 85, 90], [170, 85, 0, 85, 0, 85, 90, 85, 90]],
    },
  },
  {
    id: "backward-steps", cat: "hike", level: "easy", name: "Slow Backward Steps",
    tagline: "Soft, quiet foot placement with light, controlled load on the quads.",
    sets: 3, work: 40, rest: 20, cycle: 3,
    muscles: { primary: ["Quadriceps", "Calves"], secondary: ["Glutes", "Core", "Foot stabilisers"] },
    steps: [
      "Stand tall next to a wall or counter for support, with clear space behind you.",
      "Step one foot back, landing softly on the toes, then lower the heel.",
      "Shift your weight back, then bring the other foot to meet it.",
      "Keep the steps small and quiet. Turn around and go the other way when you run out of room.",
    ],
    cues: ["Soft landing", "Small steps", "Stay tall"],
    benefits: ["Trains quiet, soft foot placement", "Strengthens thighs and calves with light load", "Prepares the legs for descents"],
    motion: {
      pin: { joint: "hip", x: 100, y: 84 },
      keys: [[180, 25, 5, -25, -25, -20, 10, 20, 10], [180, -25, -25, 25, 5, 20, 10, -20, 10]],
    },
  },
  {
    id: "single-leg-stand", cat: "hike", level: "easy", name: "Single-Leg Stand",
    tagline: "Balance on one leg to train the ankle, knee and hip to work together.",
    sets: 4, work: 30, rest: 15, cycle: 6, hold: true, alternate: true,
    muscles: { primary: ["Glute medius", "Calves"], secondary: ["Foot stabilisers", "Quadriceps", "Core"] },
    steps: [
      "Stand next to a wall or counter, feet together.",
      "Shift your weight onto one foot and lift the other a few inches.",
      "Keep the standing knee soft, hips level and eyes on a fixed point.",
      "Hold, then switch sides. Progress by closing your eyes or standing on a folded towel.",
    ],
    cues: ["Soft knee", "Hips level", "Eyes on a point"],
    benefits: ["Improves balance", "Builds ankle, knee and hip control", "Strengthens the muscles that steady each step"],
    motion: {
      pin: { joint: "ankleF", x: 100, y: 128 },
      keys: [[180, 0, 0, 40, 0, 40, 50, 40, 50], [180, 0, 0, 55, 10, 40, 50, 40, 50]],
    },
  },
  // ───────── Added: warm-ups ─────────
  {
    id: "ankle-circles", cat: "warmup", level: "easy", phase: "warmup", suits: ["knee", "hike", "hips", "cardio"], name: "Ankle Circles",
    tagline: "Lubricate the ankle before any leg or hike-prep work.",
    sets: 2, work: 30, rest: 10, cycle: 3, alternate: true,
    muscles: { primary: ["Ankle stabilisers"], secondary: ["Calves", "Shins"] },
    steps: [
      "Stand tall near a wall for support and lift one foot just off the floor.",
      "Draw slow, full circles with your toes, 15 seconds clockwise.",
      "Reverse direction for the second half.",
      "Switch legs for the next set.",
    ],
    cues: ["Big, slow circles", "Move only the ankle", "Stay tall"],
    benefits: ["Loosens the ankle joints", "Improves ankle mobility", "Prepares the legs for hike-prep work"],
    motion: {
      pin: { joint: "ankleF", x: 100, y: 128 },
      keys: [[180, 0, 0, 30, 10, 0, 0, 0, 0], [180, 0, 0, 30, -20, 0, 0, 0, 0]],
    },
  },
  {
    id: "leg-swings", cat: "warmup", level: "easy", phase: "warmup", suits: ["knee", "hike", "hips", "cardio"], name: "Leg Swings",
    tagline: "Dynamic hip and hamstring warm-up with a light, easy swing.",
    sets: 2, work: 30, rest: 10, cycle: 3, alternate: true,
    muscles: { primary: ["Hip flexors", "Hamstrings"], secondary: ["Glutes", "Core"] },
    steps: [
      "Stand side-on to a wall, one hand resting on it.",
      "Swing the outside leg forward and back like a pendulum.",
      "Keep your torso tall and the swing small at first, growing it gradually.",
      "Switch legs for the next set.",
    ],
    cues: ["Relaxed pendulum", "Tall torso", "Small to bigger"],
    benefits: ["Warms up hips and hamstrings", "Improves hip mobility", "Prepares the legs for movement"],
    motion: {
      pin: { joint: "ankleF", x: 100, y: 128 },
      props: [{ t: "line", x1: 130, y1: 14, x2: 130, y2: 128 }],
      keys: [[180, 0, 0, 45, 25, 70, 80, 70, 80], [180, 0, 0, -30, -45, 70, 80, 70, 80]],
    },
  },
  {
    id: "cat-cow", cat: "warmup", level: "easy", phase: "warmup", suits: ["core", "posture", "hips", "upper", "shoulder"], name: "Cat-Cow",
    tagline: "Wake up the spine and shoulders before core, posture and upper-body work.",
    sets: 2, work: 40, rest: 10, cycle: 6,
    muscles: { primary: ["Spinal erectors", "Abdominals"], secondary: ["Shoulders", "Hips"] },
    steps: [
      "Start on hands and knees, wrists under shoulders, knees under hips.",
      "Inhale and let your belly sink as you lift your chest and tailbone.",
      "Exhale and round your back toward the ceiling, tucking your chin.",
      "Flow slowly between the two with your breath.",
    ],
    cues: ["Move with the breath", "Whole spine moves", "Slow and smooth"],
    benefits: ["Loosens the spine", "Wakes up the shoulders and hips", "Prepares the back for core and posture work"],
    motion: {
      pin: { joint: "hip", x: 82, y: 98 },
      keys: [[84, 0, -80, 0, -80, 0, 0, 0, 0], [96, 0, -80, 0, -80, 0, 0, 0, 0]],
    },
  },
  {
    id: "arm-swings", cat: "warmup", level: "easy", phase: "warmup", suits: ["upper", "shoulder", "posture", "cardio"], name: "Front-Back Arm Swings",
    tagline: "Loosen the shoulders and chest before upper-body work.",
    sets: 2, work: 30, rest: 10, cycle: 3,
    muscles: { primary: ["Deltoids", "Pectoralis major"], secondary: ["Lats", "Upper back"] },
    steps: [
      "Stand tall with your feet hip-width apart.",
      "Swing both arms forward and up, then back and down in a relaxed rhythm.",
      "Let the swing grow gradually. Keep your ribs down.",
      "Breathe out as the arms swing forward.",
    ],
    cues: ["Loose and relaxed", "Ribs down", "Grow the swing"],
    benefits: ["Loosens the shoulders and chest", "Warms up the upper body", "Gets the arms ready for pushing and pulling"],
    motion: {
      pin: { joint: "ankleF", x: 100, y: 128 },
      keys: [[180, 0, 0, 0, 0, 110, 110, 110, 110], [180, 0, 0, 0, 0, -40, -40, -40, -40]],
    },
  },
  // ───────── Added: cool-downs ─────────
  {
    id: "calf-stretch", cat: "stretch", level: "easy", phase: "cooldown", suits: ["knee", "hike", "cardio", "hips"], name: "Wall Calf Stretch",
    tagline: "Release the calves after leg work and hikes.",
    sets: 2, work: 30, rest: 10, cycle: 8, hold: true, alternate: true,
    muscles: { primary: ["Gastrocnemius", "Soleus"], secondary: ["Achilles tendon"] },
    steps: [
      "Stand facing a wall, hands on it at chest height, one foot back.",
      "Keep the back leg straight and press its heel into the floor.",
      "Lean into the wall until you feel a stretch in the back calf.",
      "Hold, then switch legs for the next set.",
    ],
    cues: ["Back heel down", "Back knee straight", "Toes point forward"],
    benefits: ["Releases tight calves after leg work", "Helps ankles move more freely", "Good after a hike"],
    motion: {
      pin: { joint: "ankleB", x: 80, y: 128 },
      props: [{ t: "line", x1: 142, y1: 14, x2: 142, y2: 128 }],
      keys: [[180, 0, 0, 0, 0, 85, 90, 85, 90], [155, 50, 0, -25, -25, 90, 90, 90, 90]],
    },
  },
  {
    id: "hamstring-stretch", cat: "stretch", level: "easy", phase: "cooldown", suits: ["knee", "hike", "hips", "core", "cardio", "posture"], name: "Lying Hamstring Stretch",
    tagline: "Back-supported and easy on the knee: lengthen the back of the thigh.",
    sets: 2, work: 30, rest: 10, cycle: 8, hold: true, alternate: true,
    muscles: { primary: ["Hamstrings"], secondary: ["Calves", "Glutes"] },
    steps: [
      "Lie on your back with one knee bent, foot flat. Loop a towel or strap round the other foot if you have one.",
      "Raise the straight leg toward the ceiling until you feel a stretch behind the thigh.",
      "Keep the lower back on the floor and the foot relaxed.",
      "Hold, breathing slowly, then switch legs.",
    ],
    cues: ["Lower back stays down", "Gentle, no bouncing", "Breathe out"],
    benefits: ["Lengthens the back of the thigh", "Easy on the knees and back", "Helps legs feel looser after training"],
    motion: {
      pin: { joint: "hip", x: 110, y: 124 },
      keys: [[-90, 90, 90, 150, 20, 90, 90, 90, 90], [-90, 172, 172, 150, 20, 90, 90, 90, 90]],
    },
  },
  {
    id: "knees-to-chest", cat: "stretch", level: "easy", phase: "cooldown", suits: ["core", "hips", "posture", "knee", "hike"], name: "Knees-to-Chest",
    tagline: "Soothe the lower back and hips after core and leg work.",
    sets: 2, work: 30, rest: 10, cycle: 8, hold: true,
    muscles: { primary: ["Glutes", "Spinal erectors"], secondary: ["Hip extensors"] },
    steps: [
      "Lie on your back with both knees bent.",
      "Draw your knees gently toward your chest and wrap your arms around your shins.",
      "Let your lower back rest and your shoulders stay heavy on the floor.",
      "Breathe slowly into your belly.",
    ],
    cues: ["Gentle pull", "Shoulders heavy", "Slow breaths"],
    benefits: ["Soothes the lower back and hips", "Releases tension after core and leg work", "Easy to do on the floor"],
    motion: {
      pin: { joint: "hip", x: 110, y: 124 },
      keys: [[-90, 150, 20, 150, 20, 90, 90, 90, 90], [-90, 230, 110, 230, 110, 100, 150, 100, 150]],
    },
  },
  {
    id: "triceps-stretch", cat: "stretch", level: "easy", phase: "cooldown", suits: ["upper", "shoulder", "posture"], name: "Overhead Triceps Stretch",
    tagline: "Release the back of the arm and the shoulder after pressing work.",
    sets: 2, work: 30, rest: 10, cycle: 8, hold: true, alternate: true,
    muscles: { primary: ["Triceps"], secondary: ["Lats", "Rear deltoids"] },
    steps: [
      "Stand tall and raise one arm, bending the elbow so the hand drops behind your head.",
      "Use the other hand to ease the elbow back gently.",
      "Keep your ribs down and your neck long.",
      "Hold, then switch arms for the next set.",
    ],
    cues: ["Ribs down", "Gentle pressure", "Neck long"],
    benefits: ["Releases the back of the arm after pressing", "Gently opens the shoulder", "Helps the upper body relax"],
    motion: {
      pin: { joint: "ankleF", x: 100, y: 128 },
      keys: [[180, 0, 0, 0, 0, 10, 10, 10, 10], [180, 0, 0, 0, 0, 175, -20, 10, 10]],
    },
  },
  {
    id: "belly-breathing", cat: "stretch", level: "easy", phase: "cooldown", name: "Lying Belly Breathing",
    tagline: "Slow your heart rate and let everything settle at the end.",
    sets: 2, work: 45, rest: 10, cycle: 6, hold: true,
    muscles: { primary: ["Diaphragm"], secondary: ["Pelvic floor", "Abdominals"] },
    steps: [
      "Lie on your back, knees bent, one hand on your belly.",
      "Breathe in through your nose for about 4 seconds, letting the belly rise.",
      "Breathe out slowly for about 6 seconds.",
      "Let the shoulders, jaw and hands soften.",
    ],
    cues: ["Longer out than in", "Belly rises first", "Everything soft"],
    benefits: ["Slows the heart rate", "Helps the body settle at the end of a workout", "Teaches slow breathing from the diaphragm"],
    motion: {
      pin: { joint: "hip", x: 110, y: 124 },
      keys: [[-90, 150, 20, 150, 20, 90, 90, 90, 90], [-88, 150, 20, 150, 20, 90, 90, 90, 90]],
    },
  },
  // ───────── Added: more knee, hike, core, hip and upper-body options ─────────
  {
    id: "step-ups", cat: "hike", level: "easy", name: "Step-Ups",
    tagline: "The climbing movement itself, on a small step and with full control.",
    sets: 4, work: 40, rest: 20, cycle: 4, alternate: true,
    muscles: { primary: ["Quadriceps", "Glute max"], secondary: ["Glute medius", "Calves", "Core"] },
    steps: [
      "Stand facing a low, sturdy step (a thick book or the bottom stair works), holding a rail or wall if you need to.",
      "Place your whole foot on the step, with the knee above the ankle.",
      "Press through that heel to stand tall on the step, bringing the other knee up.",
      "Lower the trailing foot back down slowly and lightly. Finish the set, then switch legs.",
    ],
    cues: ["Whole foot on the step", "Push through the heel", "Slow on the way down"],
    benefits: ["Trains the exact movement of climbing", "Builds thigh and glute strength one leg at a time", "Builds confidence on stairs and trails"],
    motion: {
      pin: { joint: "ankleF", x: 78, y: 114 },
      props: [{ t: "rect", x: 58, y: 114, w: 44, h: 14 }],
      keys: [[172, 70, -12, -10, -27, 60, 70, 60, 70], [180, 0, 0, 60, -5, 20, 40, 20, 40]],
    },
  },
  {
    id: "seated-knee-extension", cat: "knee", level: "easy", name: "Seated Knee Extensions",
    tagline: "Gentle thigh strength from a chair, with no weight through the knee.",
    sets: 3, work: 40, rest: 20, cycle: 6, alternate: true,
    muscles: { primary: ["Quadriceps"], secondary: ["Hip flexors"] },
    steps: [
      "Sit tall on a sturdy chair, feet flat on the floor, hands resting on your thighs or the seat.",
      "Slowly straighten one knee as far as is comfortable, until the leg is level with the seat, and tighten the thigh.",
      "Hold for 2 seconds with the thigh tight.",
      "Lower slowly over 3 seconds. Switch legs each set.",
    ],
    cues: ["Tall spine", "Squeeze the thigh", "Slow lowering"],
    benefits: ["Strengthens the thigh with no weight through the knee", "A gentle option when squats feel uncomfortable", "Easy to do at a desk or in front of the TV"],
    motion: {
      pin: { joint: "hip", x: 68, y: 104 },
      props: [{ t: "rect", x: 44, y: 106, w: 32, h: 5 }, { t: "line", x1: 46, y1: 72, x2: 46, y2: 106 }, { t: "line", x1: 50, y1: 111, x2: 50, y2: 128 }, { t: "line", x1: 72, y1: 111, x2: 72, y2: 128 }],
      // rest → extend → hold → lower
      keys: [[172, 85, 0, 85, 0, 40, 80, 40, 80], [172, 85, 85, 85, 0, 40, 80, 40, 80], [172, 85, 85, 85, 0, 40, 80, 40, 80], [172, 85, 0, 85, 0, 40, 80, 40, 80]],
    },
  },
  {
    id: "hamstring-curl", cat: "knee", level: "easy", name: "Standing Hamstring Curls",
    tagline: "Balance the front of the thigh by strengthening the back of the leg.",
    sets: 3, work: 40, rest: 20, cycle: 5, alternate: true,
    muscles: { primary: ["Hamstrings"], secondary: ["Calves", "Glute medius", "Core"] },
    steps: [
      "Stand facing a wall or counter, one hand resting on it, feet hip-width apart.",
      "Shift your weight onto one leg and keep that knee soft.",
      "Bend the other knee and lift the heel toward your glute without moving the thigh forward.",
      "Pause for a second, lower with control, and switch legs each set.",
    ],
    cues: ["Thigh stays still", "Heel to glute", "Slow lowering"],
    benefits: ["Strengthens the back of the thigh to balance the front", "Supports the knee on descents", "Trains balance on the standing leg"],
    motion: {
      pin: { joint: "ankleF", x: 100, y: 128 },
      props: [{ t: "line", x1: 130, y1: 14, x2: 130, y2: 128 }],
      // stand → curl → hold → lower
      keys: [[180, 0, 0, 0, 0, 70, 80, 70, 80], [180, 0, 0, -6, -148, 70, 80, 70, 80], [180, 0, 0, -6, -148, 70, 80, 70, 80], [180, 0, 0, 0, 0, 70, 80, 70, 80]],
    },
  },
  {
    id: "heel-taps", cat: "core", level: "easy", name: "Lying Heel Taps",
    tagline: "A gentler step toward deadbugs: the lower back stays flat.",
    sets: 3, work: 40, rest: 20, cycle: 6,
    muscles: { primary: ["Transverse abdominis", "Rectus abdominis"], secondary: ["Hip flexors", "Pelvic floor"] },
    steps: [
      "Lie on your back with your hips and knees bent to 90° and your arms by your sides.",
      "Press your lower back gently into the floor and keep it there.",
      "Slowly lower one foot toward the floor, tap the heel lightly, and exhale.",
      "Bring the leg back to the start and alternate sides. Stop short if your back arches.",
    ],
    cues: ["Back stays glued down", "Exhale on the tap", "Slow and light"],
    benefits: ["Builds core control without straining the back", "A gentle step toward deadbugs", "Strengthens the deep abdominal muscles"],
    motion: {
      pin: { joint: "hip", x: 112, y: 124 },
      keys: [[-90, 180, 90, 180, 90, 90, 90, 90, 90], [-90, 120, 47, 180, 90, 90, 90, 90, 90], [-90, 180, 90, 180, 90, 90, 90, 90, 90], [-90, 180, 90, 120, 47, 90, 90, 90, 90]],
    },
  },
  {
    id: "glute-bridge-march", cat: "hips", level: "moderate", name: "Glute Bridge Marches",
    tagline: "Hold the bridge while the legs take turns lifting.",
    sets: 3, work: 40, rest: 20, cycle: 6,
    muscles: { primary: ["Glute max", "Glute medius"], secondary: ["Hamstrings", "Core", "Hip flexors"] },
    steps: [
      "Set up for a glute bridge: lie on your back, knees bent, feet flat hip-width apart.",
      "Lift your hips until shoulders, hips and knees line up, and keep them there.",
      "Slowly lift one knee toward your chest without letting the hips drop or twist.",
      "Return that foot to the floor and alternate legs. Keep breathing.",
    ],
    cues: ["Hips stay high and level", "Ribs down", "Slow, no rocking"],
    benefits: ["Builds glute strength while the core keeps the hips level", "Trains each leg on its own", "A step up from the basic glute bridge"],
    motion: {
      pin: { joint: "hip", x: 99, y: 112 },
      keys: [[-70, 105, 0, 105, 0, 85, 85, 85, 85], [-70, 105, 0, 160, 90, 85, 85, 85, 85], [-70, 105, 0, 105, 0, 85, 85, 85, 85], [-70, 160, 90, 105, 0, 85, 85, 85, 85]],
    },
  },
  {
    id: "hip-thrust", cat: "hips", level: "moderate", name: "Bench Hip Thrusts",
    tagline: "A bigger range for the glutes, with your upper back on a bench.",
    sets: 3, work: 40, rest: 20, cycle: 4,
    muscles: { primary: ["Glute max"], secondary: ["Hamstrings", "Quadriceps", "Core"] },
    steps: [
      "Sit on the floor with your upper back against the edge of a sturdy bench or sofa, knees bent, feet flat.",
      "Press through your heels and lift your hips until your thighs are level with the floor.",
      "Squeeze your glutes at the top, ribs down and chin slightly tucked.",
      "Lower your hips slowly without dropping, and repeat.",
    ],
    cues: ["Shins vertical at the top", "Chin tucked", "Squeeze, don't arch"],
    benefits: ["Builds strong glutes through a bigger range", "Supports hip power for climbing and stairs", "Works the glutes with little load on the knees"],
    motion: {
      pin: { joint: "ankleF", x: 120, y: 128 },
      props: [{ t: "rect", x: 18, y: 108, w: 48, h: 6 }, { t: "line", x1: 24, y1: 114, x2: 24, y2: 128 }, { t: "line", x1: 60, y1: 114, x2: 60, y2: 128 }],
      // down → up → hold → down
      keys: [[-110, 130, 0, 130, 0, 90, 90, 90, 90], [-90, 90, 0, 90, 0, 90, 90, 90, 90], [-90, 90, 0, 90, 0, 90, 90, 90, 90], [-110, 130, 0, 130, 0, 90, 90, 90, 90]],
    },
  },
  {
    id: "wall-pushup", cat: "upper", level: "easy", name: "Wall Push-Ups",
    tagline: "The gentlest way to start building push-up strength.",
    sets: 3, work: 40, rest: 20, cycle: 3,
    muscles: { primary: ["Pectoralis major", "Triceps"], secondary: ["Front deltoids", "Serratus", "Core"] },
    steps: [
      "Stand an arm's length from a wall, hands on it at shoulder height, slightly wider than your shoulders.",
      "Step your feet back a little so your body forms one straight line from head to heels.",
      "Bend your elbows and bring your chest toward the wall, elbows about 45° from your ribs.",
      "Press back until your arms are straight. Step your feet further back to make it harder.",
    ],
    cues: ["Straight line head to heels", "Elbows 45°", "Chest to the wall"],
    benefits: ["Builds chest, shoulder and arm strength gently", "Easy on the wrists and shoulders", "The first step toward floor push-ups"],
    motion: {
      pin: { joint: "ankleF", x: 88, y: 128 },
      props: [{ t: "line", x1: 141, y1: 14, x2: 141, y2: 128 }],
      keys: [[165, -15, -15, -15, -15, 85, 85, 85, 85], [150, -30, -30, -30, -30, 50, 184, 50, 184]],
    },
  },
  {
    id: "inchworm", cat: "warmup", level: "moderate", phase: "warmup", suits: ["upper", "shoulder", "posture", "core", "cardio", "hips"], name: "Inchworms",
    tagline: "Dynamic full-body warm-up for hamstrings, shoulders and core.",
    sets: 2, work: 40, rest: 10, cycle: 9,
    muscles: { primary: ["Hamstrings", "Core"], secondary: ["Shoulders", "Calves"] },
    steps: [
      "Stand tall, then hinge forward and place your hands on the floor, bending your knees if you need to.",
      "Walk your hands forward until you reach a straight, high plank.",
      "Pause for a moment, keeping your hips level and your core braced.",
      "Walk your feet toward your hands in small steps and stand up. Repeat smoothly.",
    ],
    cues: ["Small, quiet steps", "Hips level in the plank", "Breathe throughout"],
    benefits: ["Warms up hamstrings, shoulders and core together", "Raises your heart rate gently", "Prepares the body for plank and push-up work"],
    motion: {
      pin: { joint: "ankleF", x: 45, y: 128 },
      // stand → fold → walk hands out → plank → walk back (hands stay on the floor)
      keys: [[180, 0, 0, 0, 0, 0, 0, 0, 0], [67, 5, 5, 5, 5, 0, 0, 0, 0], [72, -20, -20, -20, -20, 0, 0, 0, 0], [84, -40, -40, -40, -40, 0, 0, 0, 0], [98, -55, -55, -55, -55, 0, 0, 0, 0], [112, -68, -68, -68, -68, 0, 0, 0, 0], [98, -55, -55, -55, -55, 0, 0, 0, 0], [84, -40, -40, -40, -40, 0, 0, 0, 0], [72, -20, -20, -20, -20, 0, 0, 0, 0], [67, 5, 5, 5, 5, 0, 0, 0, 0]],
    },
  },
];

const catIndex = (id: string) => categories.findIndex((c) => c.id === id);

/** Catalog order: category order, then easy → hard (stable within a level). */
export const exercises: Exercise[] = [...raw].sort(
  (a, b) => catIndex(a.cat) - catIndex(b.cat) || levelOrder.indexOf(a.level) - levelOrder.indexOf(b.level),
);

const suitsCat = (e: Exercise, cat: string) => !e.suits || e.suits.includes(cat);

/** Up to `limit` warm-up and cool-down suggestions for an exercise's category, easiest first. */
export function bookends(cat: string, limit = 3) {
  const pick = (p: Phase) => exercises.filter((e) => e.phase === p && suitsCat(e, cat)).slice(0, limit);
  return { warmup: pick("warmup"), cooldown: pick("cooldown") };
}

export const byId = (id: string) => exercises.find((e) => e.id === id) ?? exercises[0];
