"use client";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/components/LocaleProvider";
import { read, write } from "@/lib/storage";
import { THEMES, THEME_KEY, applyTheme, isTheme, type ThemeId } from "@/lib/theme";

// Half page colour, half accent: shows what the theme looks like at a glance.
const dot = (t: (typeof THEMES)[number]) => `linear-gradient(135deg, ${t.ground} 50%, ${t.accent} 50%)`;

export default function ThemeSwitcher() {
  const { t } = useI18n();
  const [theme, setTheme] = useState<ThemeId>("volt");
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  // The bootstrap script in layout.tsx already applied the saved theme; just mirror it into state.
  useEffect(() => {
    const cur = document.documentElement.getAttribute("data-theme");
    if (isTheme(cur)) setTheme(cur);
  }, []);

  useEffect(() => {
    if (!open) return;
    const down = (e: PointerEvent) => { if (!box.current?.contains(e.target as Node)) setOpen(false); };
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("pointerdown", down);
    document.addEventListener("keydown", key);
    return () => { document.removeEventListener("pointerdown", down); document.removeEventListener("keydown", key); };
  }, [open]);

  const pick = (id: ThemeId) => {
    setTheme(id);
    applyTheme(id);
    write(THEME_KEY, id);
  };
  const current = THEMES.find((x) => x.id === theme) ?? THEMES[0];

  return (
    <div ref={box} className="relative">
      <button
        type="button"
        className="btn btn-secondary btn-square"
        onClick={() => setOpen((o) => !o)}
        aria-label={t.theme}
        aria-haspopup="true"
        aria-expanded={open}
      >
        <span className="h-5 w-5 rounded-full border border-white/30" style={{ background: dot(current) }} />
      </button>
      {open && (
        <div className="animate-rise absolute end-0 top-full z-50 mt-2 w-72 rounded-2xl border border-white/10 bg-ink-800 p-3">
          <div role="radiogroup" aria-label={t.theme} className="grid grid-cols-5 gap-2.5">
            {THEMES.map((x) => (
              <button
                key={x.id}
                type="button"
                role="radio"
                aria-checked={x.id === theme}
                aria-label={t.themes[x.id]}
                title={t.themes[x.id]}
                onClick={() => pick(x.id)}
                className={`h-11 w-11 rounded-full border border-white/20 transition-transform duration-150 ease-snap hover:-translate-y-px active:scale-95 ${x.id === theme ? "ring-2 ring-work ring-offset-2 ring-offset-ink-800" : ""}`}
                style={{ background: dot(x) }}
              />
            ))}
          </div>
          <p className="mt-3 text-xs font-semibold uppercase tracking-widest text-zinc-300">{t.themes[theme]}</p>
        </div>
      )}
    </div>
  );
}
