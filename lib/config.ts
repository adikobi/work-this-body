export const locales = ["en", "he"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

/** Remembers the choice so the server can render the right language and direction on first paint. */
export const LOCALE_COOKIE = "wtb-lang";

export const isLocale = (v: unknown): v is Locale => typeof v === "string" && (locales as readonly string[]).includes(v);

export const dirOf = (l: Locale): "ltr" | "rtl" => (l === "he" ? "rtl" : "ltr");

/** First supported language in an Accept-Language header, highest q first. English when nothing matches. */
export function fromAcceptLanguage(header: string | null | undefined): Locale {
  if (!header) return defaultLocale;
  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params.map((p) => p.trim()).find((p) => p.startsWith("q="));
      return { lang: tag.trim().toLowerCase().split("-")[0], q: q ? Number(q.slice(2)) : 1 };
    })
    .filter((x) => x.lang && x.q > 0)
    .sort((a, b) => b.q - a.q);
  for (const { lang } of ranked) {
    const l = lang === "iw" ? "he" : lang; // legacy ISO code some browsers still send for Hebrew
    if (isLocale(l)) return l;
  }
  return defaultLocale;
}
