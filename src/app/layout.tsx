import type { Metadata } from "next";
import { Schibsted_Grotesk, Spline_Sans_Mono } from "next/font/google";
import Providers from "@/components/Providers";
import "./globals.css";

// Schibsted Grotesk — jediný font: headliny, tělo, labely
const grotesk = Schibsted_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin", "latin-ext"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

// Spline Sans Mono — čísla edic, sériová čísla, certifikáty
const groteskMono = Spline_Sans_Mono({
  variable: "--font-grotesk-mono",
  subsets: ["latin", "latin-ext"],
  display: "swap",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: "OTISK — Limitované fotografické tisky",
    template: "%s — OTISK",
  },
  description:
    "Limitované fotografické edice s certifikátem pravosti. Každé dílo má pevně daný počet kusů — po vyprodání nekoupíte znovu.",
  openGraph: {
    siteName: "OTISK",
    locale: "cs_CZ",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="cs"
      className={`${grotesk.variable} ${groteskMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#faf6f0] text-[#1a1714]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
