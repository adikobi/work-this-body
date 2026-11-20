import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Heebo, Instrument_Sans, Rubik } from "next/font/google";
import LocaleProvider from "@/components/LocaleProvider";
import { LOCALE_COOKIE, defaultLocale, dirOf } from "@/lib/i18n/config";
import { messages } from "@/lib/i18n/messages";
import { THEMES, THEME_KEY, defaultTheme } from "@/lib/theme";
import "./globals.css";

const displayEn = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display-en", display: "swap", preload: false });
const bodyEn = Instrument_Sans({ subsets: ["latin"], variable: "--font-body-en", display: "swap", preload: false });
const displayHe = Rubik({ subsets: ["hebrew", "latin"], variable: "--font-display-he", display: "swap" });
const bodyHe = Heebo({ subsets: ["hebrew", "latin"], variable: "--font-body-he", display: "swap" });

export const metadata: Metadata = {
  title: messages[defaultLocale].meta.title,
  description: messages[defaultLocale].meta.description,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#070908",
};

// Runs synchronously before first paint so <html> already has the right lang, dir, and CSS font variables.
const localeBootstrapScript = `
(function() {
  try {
    var m = document.cookie.match(/(?:^|; )${LOCALE_COOKIE}=(en|he)(?:;|$)/);
    var lang = m ? m[1] : null;
    if (!lang) {
      var list = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || ""];
      for (var i = 0; i < list.length; i++) {
        var code = String(list[i]).toLowerCase().split("-")[0];
        if (code === "iw") code = "he";
        if (code === "en" || code === "he") { lang = code; break; }
      }
    }
    if (!lang) lang = "${defaultLocale}";
    var el = document.documentElement;
    el.lang = lang;
    el.dir = lang === "he" ? "rtl" : "ltr";
  } catch (e) {}
})();
`;

// Applies the saved theme (and the browser's theme-color) before first paint so there is no flash.
const themeBootstrapScript = `
(function() {
  try {
    var colors = ${JSON.stringify(Object.fromEntries(THEMES.map((t) => [t.id, t.page])))};
    var id = localStorage.getItem("${THEME_KEY}");
    if (!colors[id]) id = "${defaultTheme}";
    document.documentElement.setAttribute("data-theme", id);
    var set = function() {
      var m = document.querySelector('meta[name="theme-color"]');
      if (m) m.setAttribute("content", colors[id]);
    };
    set();
    document.addEventListener("DOMContentLoaded", set);
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang={defaultLocale}
      dir={dirOf(defaultLocale)}
      suppressHydrationWarning
      className={`${displayEn.variable} ${bodyEn.variable} ${displayHe.variable} ${bodyHe.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrapScript }} />
        <script dangerouslySetInnerHTML={{ __html: localeBootstrapScript }} />
      </head>
      <body className="font-sans antialiased">
        <LocaleProvider initial={defaultLocale}>{children}</LocaleProvider>
      </body>
    </html>
  );
}
