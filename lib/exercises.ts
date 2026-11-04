import type { Motion } from "./rig";

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
  { id: "hips", name: "Hips & Glutes", short: "Hips", dot: "bg-orange-300" },
  { id: "shoulder", name: "Shoulder Mobility", short: "Shoulders", dot: "bg-teal-300" },
  { id: "cardio", name: "Full-Body Conditioning", short: "Conditioning", dot: "bg-fuchsia-300" },
  { id: "stretch", name: "Stretch & Recovery", short: "Stretch", dot: "bg-violet-300" },
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
  {
    id: "reverse-lunge", cat: "knee", name: "Reverse Lunges",
    tagline: "Knee-friendly single-leg strength: the shin stays vertical.",
    sets: 3, work: 40, rest: 20, cycle: 4, alternate: true,
    muscles: { primary: ["Quadriceps", "Glute max"], secondary: ["Hamstrings", "Calves", "Core"] },
    steps: ["Stand tall with arms forward for balance.", "Step one foot back and lower until the front thigh is near parallel.", "Keep the front shin vertical and your torso upright.", "Push through the front heel to return. Alternate legs each rep."],
    cues: ["Shin stays vertical", "Back knee hovers", "Push through the heel"],
    motion: {
      pin: { joint: "ankleF", x: 100, y: 128 },
      keys: [
        [180, 0, 0, 0, 0, 85, 90, 85, 90],
        [176, 75, -5, -25, -75, 85, 90, 85, 90],
      ],
    },
  },
  {
    id: "sit-to-stand", cat: "knee", name: "Chair Sit-to-Stands",
    tagline: "Everyday squat pattern with a tempo that protects the knee.",
    sets: 3, work: 40, rest: 20, cycle: 5,
    muscles: { primary: ["Quadriceps", "Glute max"], secondary: ["Hamstrings", "Core", "Calves"] },
    steps: ["Sit near the front of a sturdy chair, feet hip-width apart.", "Lean forward slightly and stand up over three seconds, pressing through your heels.", "Pause tall, squeezing your glutes.", "Sit back slowly over three seconds. Lightly touch the seat, don't drop."],
    cues: ["Heels heavy", "Knees over toes", "Slow on the way down"],
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
    id: "straight-leg-raise", cat: "knee", name: "Straight-Leg Raises",
    tagline: "Quad activation without bending the knee.",
    sets: 3, work: 40, rest: 20, cycle: 4, alternate: true,
    muscles: { primary: ["Quadriceps", "Hip flexors"], secondary: ["Core"] },
    steps: ["Lie on your back, one knee bent with the foot flat, the other leg straight.", "Tighten the thigh of the straight leg so the knee locks out.", "Lift the leg to the height of the bent knee, keeping the toes pointing up.", "Lower slowly. Switch legs each set."],
    cues: ["Knee fully locked", "Lower back flat", "Slow lowering"],
    motion: {
      pin: { joint: "hip", x: 110, y: 124 },
      keys: [
        [-90, 90, 90, 150, 20, 90, 90, 90, 90],
        [-90, 135, 135, 150, 20, 90, 90, 90, 90],
      ],
    },
  },
  {
    id: "plank", cat: "core", name: "Forearm Plank",
    tagline: "The reference isometric for the whole trunk.",
    sets: 3, work: 30, rest: 20, cycle: 4, hold: true,
    muscles: { primary: ["Transverse abdominis", "Rectus abdominis"], secondary: ["Glutes", "Shoulders", "Quads"] },
    steps: ["Set your elbows under your shoulders, forearms flat on the floor.", "Tuck your pelvis slightly and squeeze your glutes.", "Form one line from head to heels. Do not let the hips sag or pike.", "Breathe steadily and hold."],
    cues: ["Ribs down", "Squeeze glutes", "Push the floor away"],
    motion: {
      pin: { joint: "ankleF", x: 40, y: 127 },
      keys: [
        [101, -79, -79, -79, -79, 0, 90, 0, 90],
        [97, -83, -83, -83, -83, 0, 90, 0, 90],
      ],
    },
  },
  {
    id: "mountain-climbers", cat: "core", name: "Mountain Climbers",
    tagline: "Core control with a conditioning edge.",
    sets: 3, work: 30, rest: 20, cycle: 2.4,
    muscles: { primary: ["Rectus abdominis", "Hip flexors"], secondary: ["Shoulders", "Quads", "Obliques"] },
    steps: ["Start in a high plank, hands under shoulders.", "Drive one knee toward your chest without lifting the hips.", "Switch legs in a steady rhythm.", "Slow the pace if your hips start to bounce."],
    cues: ["Hips low and level", "Hands stay planted", "Quick, quiet feet"],
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
    id: "bicycle-crunch", cat: "core", name: "Bicycle Crunches",
    tagline: "Rotational core work with a long lever.",
    sets: 3, work: 40, rest: 20, cycle: 3,
    muscles: { primary: ["Rectus abdominis", "Obliques"], secondary: ["Hip flexors"] },
    steps: ["Lie on your back, hands lightly behind your head, shoulders lifted.", "Bring one knee in as the opposite elbow travels toward it.", "Extend the other leg long and low.", "Pedal slowly. Rotate your ribs, not just your elbows."],
    cues: ["Rotate from the ribs", "Low back stays down", "Slow pedal"],
    motion: {
      pin: { joint: "hip", x: 112, y: 124 },
      keys: [
        [-125, -170, 100, 110, 110, -150, 60, -150, 60],
        [-125, 110, 110, -170, 100, -150, 60, -150, 60],
      ],
    },
  },
  {
    id: "knee-pushup", cat: "upper", name: "Knee Push-Ups",
    tagline: "Build push-up strength with a shorter lever.",
    sets: 3, work: 40, rest: 25, cycle: 3,
    muscles: { primary: ["Pectoralis major", "Triceps"], secondary: ["Front deltoids", "Serratus", "Core"] },
    steps: ["Kneel with hands slightly wider than your shoulders.", "Walk your hands forward so your body is one line from head to knees.", "Lower your chest toward the floor with elbows at about 45°.", "Press back up without letting your hips sag."],
    cues: ["Line from head to knees", "Elbows 45°", "Chest to the floor"],
    motion: {
      pin: { joint: "wristF", x: 120, y: 128 },
      keys: [
        [121, -59, -120, -59, -120, 0, 0, 0, 0],
        [114, -66, -120, -66, -120, -35, 40, -35, 40],
      ],
    },
  },
  {
    id: "shoulder-taps", cat: "upper", name: "Shoulder Taps",
    tagline: "Anti-rotation stability over a high plank.",
    sets: 3, work: 30, rest: 20, cycle: 4,
    muscles: { primary: ["Obliques", "Deltoids"], secondary: ["Pectorals", "Serratus", "Glutes"] },
    steps: ["Start in a high plank with feet slightly wider than hip-width.", "Lift one hand and tap the opposite shoulder.", "Keep your hips from rocking side to side.", "Alternate hands at a controlled pace."],
    cues: ["Hips stay square", "Wide feet", "Slow taps"],
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
    id: "superman", cat: "posture", name: "Superman Lifts",
    tagline: "Back-extensor endurance without loading the spine.",
    sets: 3, work: 30, rest: 20, cycle: 4,
    muscles: { primary: ["Spinal erectors", "Glute max"], secondary: ["Rear deltoids", "Hamstrings"] },
    steps: ["Lie face down, arms reaching overhead, legs long.", "Lift arms, chest and legs a few inches together.", "Keep your gaze down and the neck long.", "Lower slowly. Small range is enough."],
    cues: ["Long neck", "Reach, don't crank", "Squeeze glutes"],
    motion: {
      pin: { joint: "hip", x: 118, y: 124 },
      keys: [
        [-95, 90, 90, 90, 90, -95, -95, -95, -95],
        [-110, 100, 100, 100, 100, -112, -112, -112, -112],
      ],
    },
  },
  {
    id: "reverse-plank", cat: "posture", name: "Reverse Plank",
    tagline: "Open the chest and strengthen the whole back line.",
    sets: 3, work: 25, rest: 20, cycle: 4, hold: true,
    muscles: { primary: ["Glute max", "Hamstrings"], secondary: ["Rear deltoids", "Triceps", "Spinal erectors"] },
    steps: ["Sit with legs long, hands behind you with fingers pointing forward.", "Press the floor away and lift your hips.", "Make one line from shoulders to heels, chest open.", "Keep your neck neutral and hold."],
    cues: ["Hips high", "Chest open", "Shoulders away from ears"],
    motion: {
      pin: { joint: "wristF", x: 60, y: 128 },
      keys: [
        [-118, 62, 62, 62, 62, 0, 0, 0, 0],
        [-112, 68, 68, 68, 68, 0, 0, 0, 0],
      ],
    },
  },
  {
    id: "good-morning", cat: "posture", name: "Hip Hinge Good Mornings",
    tagline: "Learn to bend from the hips, not the spine.",
    sets: 3, work: 40, rest: 20, cycle: 4,
    muscles: { primary: ["Hamstrings", "Spinal erectors"], secondary: ["Glute max", "Core"] },
    steps: ["Stand with feet hip-width apart, knees soft, hands folded across your chest.", "Push your hips back as your torso tips forward.", "Keep your back flat, stopping when you feel the hamstrings load.", "Drive the hips forward to stand tall."],
    cues: ["Hips go back", "Flat back", "Squeeze glutes at the top"],
    motion: {
      pin: { joint: "ankleF", x: 100, y: 128 },
      keys: [
        [180, 0, 0, 0, 0, 20, 100, 20, 100],
        [110, 15, -5, 15, -5, 20, 100, 20, 100],
      ],
    },
  },
  {
    id: "glute-bridge", cat: "hips", name: "Glute Bridge",
    tagline: "The foundation hip-extension drill.",
    sets: 3, work: 40, rest: 20, cycle: 4,
    muscles: { primary: ["Glute max", "Hamstrings"], secondary: ["Core", "Adductors"] },
    steps: ["Lie on your back, knees bent, feet flat hip-width apart.", "Press through your heels and lift your hips until shoulders, hips and knees line up.", "Squeeze your glutes at the top without arching your back.", "Lower slowly."],
    cues: ["Push through heels", "Ribs down", "Squeeze at the top"],
    motion: {
      pin: { joint: "ankleF", x: 120, y: 128 },
      keys: [
        [-90, 150, 20, 150, 20, 90, 90, 90, 90],
        [-70, 105, 0, 105, 0, 90, 90, 90, 90],
      ],
    },
  },
  {
    id: "single-leg-bridge", cat: "hips", name: "Single-Leg Glute Bridge",
    tagline: "Hip strength and pelvic control on one side.",
    sets: 3, work: 30, rest: 20, cycle: 4, alternate: true,
    muscles: { primary: ["Glute max", "Glute medius"], secondary: ["Hamstrings", "Core"] },
    steps: ["Set up for a bridge, then extend one leg straight, thigh level with the other.", "Press through the planted heel and lift your hips.", "Keep your pelvis level; don't let it twist.", "Lower slowly. Switch legs each set."],
    cues: ["Pelvis level", "Heel pressing down", "Slow lowering"],
    motion: {
      pin: { joint: "ankleF", x: 120, y: 128 },
      keys: [
        [-90, 150, 20, 150, 20, 90, 90, 90, 90],
        [-70, 105, 0, 110, 110, 90, 90, 90, 90],
      ],
    },
  },
  {
    id: "donkey-kick", cat: "hips", name: "Donkey Kicks",
    tagline: "Glute isolation from a stable quadruped base.",
    sets: 3, work: 40, rest: 20, cycle: 5,
    muscles: { primary: ["Glute max"], secondary: ["Hamstrings", "Core"] },
    steps: ["Start on hands and knees, back flat.", "Keeping the knee bent 90°, press one foot toward the ceiling.", "Stop when the thigh is level with your back. Do not arch.", "Lower with control and alternate."],
    cues: ["Level hips", "Press the sole up", "No arching"],
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
    id: "bodyweight-squat", cat: "hips", name: "Bodyweight Squats",
    tagline: "Strong hips and legs, the foundation lift.",
    sets: 3, work: 40, rest: 20, cycle: 4,
    muscles: { primary: ["Quadriceps", "Glute max"], secondary: ["Hamstrings", "Adductors", "Core"] },
    steps: ["Stand with feet shoulder-width apart, arms forward.", "Sit your hips back and down, chest tall.", "Go as deep as you can with your heels down and knees tracking over toes.", "Drive up through the whole foot."],
    cues: ["Heels down", "Knees follow toes", "Chest tall"],
    motion: {
      pin: { joint: "ankleF", x: 100, y: 128 },
      keys: [
        [180, 0, 0, 0, 0, 85, 90, 85, 90],
        [150, 80, -30, 80, -30, 90, 92, 90, 92],
      ],
    },
  },
  {
    id: "arm-circles", cat: "shoulder", name: "Arm Circles",
    tagline: "Warm up the shoulder joint through its full range.",
    sets: 3, work: 30, rest: 15, cycle: 3,
    muscles: { primary: ["Deltoids", "Rotator cuff"], secondary: ["Upper traps", "Serratus"] },
    steps: ["Stand tall with arms straight out to the sides.", "Draw slow circles, starting small and getting bigger.", "Keep your ribs down and shoulders away from your ears.", "Reverse direction halfway."],
    cues: ["Slow and smooth", "Ribs down", "Reverse halfway"],
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
    id: "wall-angels", cat: "shoulder", name: "Wall Angels",
    tagline: "Active overhead mobility with the back supported.",
    sets: 3, work: 40, rest: 15, cycle: 5,
    muscles: { primary: ["Lower trapezius", "Serratus"], secondary: ["Rhomboids", "Deltoids"] },
    steps: ["Stand with your back, head and hips against a wall, feet slightly forward.", "Bring your arms into a goalpost position against the wall.", "Slide them up as far as you can while keeping contact.", "Slide back down slowly."],
    cues: ["Keep contact", "Ribs down", "Smooth slide"],
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
    id: "overhead-reach", cat: "shoulder", name: "Overhead Reaches",
    tagline: "Full flexion mobility with a gentle lat stretch.",
    sets: 3, work: 30, rest: 15, cycle: 5,
    muscles: { primary: ["Anterior deltoids", "Serratus"], secondary: ["Lats", "Triceps"] },
    steps: ["Stand tall, arms by your sides.", "Raise your arms forward and up, reaching long.", "Reach until the biceps are near your ears without arching.", "Lower slowly."],
    cues: ["Ribs down", "Reach tall", "Biceps by ears"],
    motion: {
      pin: { joint: "ankleF", x: 100, y: 128 },
      keys: [
        [180, 0, 0, 0, 0, 0, 0, 0, 0],
        [180, 0, 0, 0, 0, 175, 178, 175, 178],
      ],
    },
  },
  {
    id: "doorway-chest", cat: "shoulder", name: "Doorway Chest Opener",
    tagline: "Counter the desk slouch by opening the front of the shoulder.",
    sets: 3, work: 30, rest: 10, cycle: 6, hold: true,
    muscles: { primary: ["Pectoralis major", "Anterior deltoids"], secondary: ["Biceps", "Pectoralis minor"] },
    steps: ["Stand in a doorway with forearms on the frame, elbows at shoulder height.", "Step one foot through until you feel a stretch across the chest.", "Keep your ribs down and your neck long.", "Breathe slowly and hold."],
    cues: ["Ribs down", "Soft knees", "Breathe into the stretch"],
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
    id: "high-knees", cat: "cardio", name: "High Knees",
    tagline: "Fast, light cardio that fires up the hips.",
    sets: 4, work: 30, rest: 20, cycle: 1.2,
    muscles: { primary: ["Hip flexors", "Quadriceps"], secondary: ["Calves", "Core"] },
    steps: ["Stand tall and start running in place.", "Drive each knee to hip height.", "Pump your arms and land softly on the balls of your feet.", "Stay tall and keep a quick tempo."],
    cues: ["Knees to hip height", "Quiet landings", "Tall chest"],
    motion: {
      pin: { joint: "hip", x: 100, y: 84 },
      keys: [
        [175, 100, 10, 0, 0, -40, 20, 40, 140],
        [175, 0, 0, 100, 10, 40, 140, -40, 20],
      ],
    },
  },
  {
    id: "butt-kicks", cat: "cardio", name: "Butt Kicks",
    tagline: "Dynamic hamstring warm-up that raises your heart rate.",
    sets: 4, work: 30, rest: 20, cycle: 1.2,
    muscles: { primary: ["Hamstrings"], secondary: ["Calves", "Glutes"] },
    steps: ["Jog in place, heels flicking up toward your glutes.", "Keep your thighs pointing down.", "Swing your arms naturally.", "Stay light on your feet."],
    cues: ["Heels to glutes", "Thighs point down", "Quick and light"],
    motion: {
      pin: { joint: "hip", x: 100, y: 84 },
      keys: [
        [178, 5, -170, 0, 0, -40, 20, 40, 140],
        [178, 0, 0, 5, -170, 40, 140, -40, 20],
      ],
    },
  },
  {
    id: "shadow-boxing", cat: "cardio", name: "Shadow Boxing",
    tagline: "Rhythmic full-body cardio with punches.",
    sets: 4, work: 40, rest: 20, cycle: 2.4,
    muscles: { primary: ["Deltoids", "Triceps"], secondary: ["Core", "Calves", "Glutes"] },
    steps: ["Stand in a staggered stance, fists by your chin.", "Throw a straight jab, then a cross, rotating your hips.", "Return your hands to guard after every punch.", "Stay light on your feet and breathe out on each punch."],
    cues: ["Hands back to guard", "Rotate the hips", "Exhale on the punch"],
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
    id: "marches", cat: "cardio", name: "Standing Marches",
    tagline: "A low-impact way to raise your heart rate.",
    sets: 3, work: 40, rest: 20, cycle: 3,
    muscles: { primary: ["Hip flexors", "Quadriceps"], secondary: ["Core", "Calves"] },
    steps: ["Stand tall, arms bent at your sides.", "Lift one knee to hip height, then the other, marching steadily.", "Swing the opposite arm with each step.", "Keep your core braced and posture tall."],
    cues: ["Tall posture", "Knees to hip height", "Opposite arm swings"],
    motion: {
      pin: { joint: "hip", x: 100, y: 84 },
      keys: [
        [180, 90, 0, 0, 0, -30, 10, 40, 140],
        [180, 0, 0, 90, 0, 40, 140, -30, 10],
      ],
    },
  },
  {
    id: "hip-flexor-stretch", cat: "stretch", name: "Half-Kneeling Hip Flexor Stretch",
    tagline: "Lengthen the front of the hip after sitting or squatting.",
    sets: 2, work: 30, rest: 10, cycle: 8, hold: true, alternate: true,
    muscles: { primary: ["Hip flexors", "Quadriceps"], secondary: ["Glutes", "Abdominals"] },
    steps: ["Kneel on one knee with the other foot flat in front.", "Tuck your pelvis under and squeeze the glute of the back leg.", "Shift your weight forward until you feel the stretch.", "Reach the same-side arm overhead. Breathe slowly."],
    cues: ["Tuck the pelvis", "Squeeze back glute", "Ribs down"],
    motion: {
      pin: { joint: "ankleF", x: 110, y: 128 },
      keys: [
        [180, 90, 0, 0, -90, 20, 120, 20, 120],
        [185, 80, -15, 5, -85, 175, 175, 175, 175],
      ],
    },
  },
  {
    id: "childs-pose", cat: "stretch", name: "Child's Pose",
    tagline: "Gently stretch the back, hips and shoulders.",
    sets: 2, work: 30, rest: 10, cycle: 8, hold: true,
    muscles: { primary: ["Spinal erectors", "Lats"], secondary: ["Glutes", "Shoulders"] },
    steps: ["Kneel with your big toes together and knees apart.", "Sit your hips back toward your heels.", "Walk your hands forward and rest your forehead down.", "Breathe slowly into your back."],
    cues: ["Hips back", "Long arms", "Slow breaths"],
    motion: {
      pin: { joint: "ankleF", x: 60, y: 124 },
      keys: [
        [165, 53, -90, 53, -90, 40, 100, 40, 100],
        [82, 53, -90, 53, -90, 88, 90, 88, 90],
      ],
    },
  },
  {
    id: "quad-stretch", cat: "stretch", name: "Standing Quad Stretch",
    tagline: "Release tight thighs after leg work.",
    sets: 2, work: 30, rest: 10, cycle: 8, hold: true, alternate: true,
    muscles: { primary: ["Quadriceps", "Hip flexors"], secondary: ["Calves", "Core"] },
    steps: ["Stand tall, holding a wall for balance if needed.", "Bend one knee and catch the foot behind you.", "Draw your heel to your glute, knees together and pelvis tucked.", "Hold, then switch sides."],
    cues: ["Knees together", "Pelvis tucked", "Stand tall"],
    motion: {
      pin: { joint: "ankleF", x: 100, y: 128 },
      keys: [
        [180, 0, 0, 0, -60, 0, 0, 0, 0],
        [175, 0, 0, 10, -165, 0, 0, 0, 0],
      ],
    },
  },
  {
    id: "forward-fold", cat: "stretch", name: "Standing Forward Fold",
    tagline: "Release the hamstrings and lower back.",
    sets: 2, work: 30, rest: 10, cycle: 8, hold: true,
    muscles: { primary: ["Hamstrings", "Spinal erectors"], secondary: ["Calves", "Glutes"] },
    steps: ["Stand with feet hip-width apart and reach your arms overhead.", "Hinge from the hips and fold forward with soft knees.", "Let your head and arms hang heavy.", "Bend the knees if your back rounds sharply."],
    cues: ["Soft knees", "Heavy head", "Breathe out"],
    motion: {
      pin: { joint: "ankleF", x: 100, y: 128 },
      keys: [
        [180, 0, 0, 0, 0, 175, 175, 175, 175],
        [75, 0, 0, 0, 0, 5, 5, 5, 5],
      ],
    },
  },
];

export const byId = (id: string) => exercises.find((e) => e.id === id) ?? exercises[0];
