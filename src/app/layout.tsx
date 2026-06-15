import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import Providers from "@/components/Providers";
import "./globals.css";

// Fraunces — editorial serif s optickým osovým laděním: velké displej nadpisy.
// Galerijní, vysoký kontrast, charakter — opak generického cream-minimalu.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin", "latin-ext"],
  display: "swap",
  axes: ["opsz"],
});

// Inter — tělo, popisy, labely, UI, hodnoty. Čistý moderní sans, skvělá čitelnost.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
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
      className={`${fraunces.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#f7f3ec] text-[#2f2a22]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
