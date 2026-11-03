"use client";
import { useState } from "react";
import Workout from "@/components/Workout";
import { byId, categories, exercises } from "@/lib/exercises";

const pill = "shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-[background-color,color,transform] duration-150 ease-snap active:scale-95";
const on = "border-work/40 bg-work/15 text-work";
const off = "border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10";

export default function AppShell() {
  const [exId, setExId] = useState(exercises[0].id);
  const exercise = byId(exId);
  const category = categories.find((c) => c.id === exercise.cat) ?? categories[0];

  return (
    <div className="mx-auto min-h-dvh max-w-6xl px-3 pb-6 pt-4 sm:px-6 lg:grid lg:grid-cols-12 lg:gap-8 lg:pt-8">
      {/* Desktop catalog */}
      <aside className="hidden lg:col-span-3 lg:block">
        <div className="sticky top-8 max-h-screen overflow-y-auto pb-8 no-scrollbar">
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-zinc-50">
            work<span className="text-work">-this-</span>body
          </h1>
          <nav className="mt-6 space-y-6" aria-label="Exercises">
            {categories.map((c) => (
              <div key={c.id}>
                <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-zinc-500">
                  <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
                  {c.name}
                </p>
                <ul className="space-y-1">
                  {exercises.filter((e) => e.cat === c.id).map((e) => (
                    <li key={e.id}>
                      <button
                        type="button"
                        onClick={() => setExId(e.id)}
                        aria-current={e.id === exId}
                        className={`w-full rounded-xl px-3 py-2 text-left text-sm transition-[background-color,color] duration-150 ease-snap ${e.id === exId ? "bg-white/10 font-semibold text-zinc-50" : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"}`}
                      >
                        {e.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </aside>

      <main className="lg:col-span-9">
        {/* Mobile catalog */}
        <div className="lg:hidden">
          <h1 className="mb-3 font-display text-xl font-extrabold tracking-tight text-zinc-50">
            work<span className="text-work">-this-</span>body
          </h1>
          <div className="no-scrollbar -mx-3 flex gap-2 overflow-x-auto px-3 pb-2">
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                className={`${pill} ${c.id === exercise.cat ? on : off}`}
                onClick={() => setExId(exercises.find((e) => e.cat === c.id)?.id ?? exId)}
              >
                {c.short}
              </button>
            ))}
          </div>
          <div className="no-scrollbar -mx-3 mb-3 flex gap-2 overflow-x-auto px-3 pb-2">
            {exercises.filter((e) => e.cat === exercise.cat).map((e) => (
              <button key={e.id} type="button" className={`${pill} text-xs ${e.id === exId ? "border-white/30 bg-white/15 text-zinc-50" : off}`} onClick={() => setExId(e.id)}>
                {e.name}
              </button>
            ))}
          </div>
        </div>

        <Workout key={exercise.id} exercise={exercise} category={category} />
      </main>
    </div>
  );
}
