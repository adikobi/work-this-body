"use client";
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { LOCALE_COOKIE, dirOf, type Locale } from "@/lib/i18n/config";
import { getContent, type Content } from "@/lib/i18n/content";
import { messages, type Messages } from "@/lib/i18n/messages";

interface I18n {
  locale: Locale;
  dir: "ltr" | "rtl";
  /** UI strings. */
  t: Messages;
  /** The exercise catalog in the active language. */
  content: Content;
  setLocale: (l: Locale) => void;
}

const Ctx = createContext<I18n | null>(null);

/** `initial` comes from the server (cookie, then Accept-Language), so the first paint is already in the right language. */
export default function LocaleProvider({ initial, children }: { initial: Locale; children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(initial);

  const setLocale = useCallback((l: Locale) => {
    // <html> is updated in the same tick as the state, so there is never a frame of Hebrew text laid out left-to-right.
    const el = document.documentElement;
    el.lang = l;
    el.dir = dirOf(l);
    document.title = messages[l].meta.title;
    document.cookie = `${LOCALE_COOKIE}=${l}; path=/; max-age=31536000; samesite=lax`;
    setLocaleState(l);
  }, []);

  const value = useMemo<I18n>(
    () => ({ locale, dir: dirOf(locale), t: messages[locale], content: getContent(locale), setLocale }),
    [locale, setLocale],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useI18n(): I18n {
  const v = useContext(Ctx);
  if (!v) throw new Error("useI18n must be used inside <LocaleProvider>");
  return v;
}
