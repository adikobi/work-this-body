"use client";
import { dirOf, locales, type Locale } from "@/lib/i18n/config";
import { useI18n } from "@/components/LocaleProvider";

// Each language is always labelled in itself, so you can find your own language whichever one is showing.
const name: Record<Locale, string> = { en: "English", he: "עברית" };

export default function LocaleSwitcher() {
  const { locale, setLocale, t } = useI18n();
  return (
    <div role="group" aria-label={t.language} className="flex shrink-0 rounded-full bg-white/10 p-0.5">
      {locales.map((l) => (
        <button
          key={l}
          type="button"
          lang={l}
          dir={dirOf(l)}
          aria-label={name[l]}
          aria-pressed={locale === l}
          onClick={() => setLocale(l)}
          className={`min-h-9 rounded-full px-3 text-xs font-medium transition-[background-color,color] duration-150 ease-snap ${
            locale === l ? "bg-work/20 text-work" : "text-zinc-200 hover:bg-white/10"
          }`}
        >
          {l === "en" ? (
            <>
              <span aria-hidden="true" className="sm:hidden">EN</span>
              <span aria-hidden="true" className="hidden sm:inline">English</span>
            </>
          ) : (
            name[l]
          )}
        </button>
      ))}
    </div>
  );
}
