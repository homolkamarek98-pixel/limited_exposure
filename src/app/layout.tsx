import type { Metadata } from "next";
import { Jost } from "next/font/google";
import Providers from "@/components/Providers";
import "./globals.css";

// Jost — geometrický sans inspirovaný Futurou (jako rezidencehury.cz).
// Jediný typeface pro celý web: ultra moderní, architektonicky čistý.
// Variabilní (100–900), latin-ext = plná česká diakritika.
const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Otisk — Limitované fotografie od současných autorů",
    template: "%s — Otisk",
  },
  description:
    "Limitované fotografické edice s certifikátem pravosti. Každé dílo má pevně daný počet kusů — po vyprodání nekoupíte znovu.",
  openGraph: {
    siteName: "Otisk",
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
      className={`${jost.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#f7f3ec] text-[#2f2a22]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
