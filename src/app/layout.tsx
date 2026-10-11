import type { Metadata, Viewport } from "next";
import { Archivo, Inter_Tight, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import { site } from "@/lib/site";
import { Cursor } from "@/components/fx/cursor";
import "./globals.css";

const display = Archivo({
  variable: "--font-display-face",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

const body = Inter_Tight({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const serif = Instrument_Serif({
  variable: "--font-serif-face",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono-face",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${site.name} | ${site.role}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#08080b",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-AU"
      className={`${display.variable} ${body.variable} ${serif.variable} ${mono.variable} antialiased`}
    >
      <body className="grain min-h-dvh overflow-x-clip">
        <noscript>
          <style>{`.reveal-line>span,.fade-up{transform:none!important;opacity:1!important}`}</style>
        </noscript>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-signal focus:px-4 focus:py-2 focus:text-ink-950"
        >
          Skip to content
        </a>
        {children}
        <Cursor />
      </body>
    </html>
  );
}
