"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { LOCALE_COOKIE, dirOf, isLocale, type Locale } from "@/lib/i18n/config";
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

export default function LocaleProvider({ initial, children }: { initial: Locale; children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof document !== "undefined") {
      const htmlLang = document.documentElement.lang;
      if (isLocale(htmlLang)) return htmlLang;
    }
    return initial;
  });

  useEffect(() => {
    document.title = messages[locale].meta.title;
  }, [locale]);

  const setLocale = useCallback((l: Locale) => {
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
