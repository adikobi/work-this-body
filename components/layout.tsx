import type { Metadata, Viewport } from "next";
import { cookies, headers } from "next/headers";
import { Bricolage_Grotesque, Heebo, Instrument_Sans, Rubik } from "next/font/google";
import LocaleProvider from "@/components/LocaleProvider";
import { LOCALE_COOKIE, dirOf, fromAcceptLanguage, isLocale, type Locale } from "@/lib/i18n/config";
import { messages } from "@/lib/i18n/messages";
import "./globals.css";

// One CSS variable per face. globals.css points --font-display / --font-body (what Tailwind reads) at the right pair for the
// active language. The Hebrew faces carry Latin glyphs too, so digits and the odd English term match the surrounding text.
// They are not preloaded: English visitors never download them, and Hebrew visitors fetch them on first use.
const displayEn = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display-en", display: "swap" });
const bodyEn = Instrument_Sans({ subsets: ["latin"], variable: "--font-body-en", display: "swap" });
const displayHe = Rubik({ subsets: ["hebrew", "latin"], variable: "--font-display-he", display: "swap", preload: false });
const bodyHe = Heebo({ subsets: ["hebrew", "latin"], variable: "--font-body-he", display: "swap", preload: false });

/** The saved choice wins; otherwise the browser's Accept-Language; otherwise English. */
async function getLocale(): Promise<Locale> {
  const saved = (await cookies()).get(LOCALE_COOKIE)?.value;
  if (isLocale(saved)) return saved;
  return fromAcceptLanguage((await headers()).get("accept-language"));
}

export async function generateMetadata(): Promise<Metadata> {
  const { title, description } = messages[await getLocale()].meta;
  return { title, description };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#070908",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  return (
    <html
      lang={locale}
      dir={dirOf(locale)}
      className={`${displayEn.variable} ${bodyEn.variable} ${displayHe.variable} ${bodyHe.variable}`}
    >
      <body className="font-sans antialiased">
        <LocaleProvider initial={locale}>{children}</LocaleProvider>
      </body>
    </html>
  );
}
