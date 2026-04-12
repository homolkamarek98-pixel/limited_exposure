import type { Metadata } from "next";
import { Playfair_Display, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// Playfair Display — nadpisy, galerijní estetika
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
});

// Inter — tělo textu, UI prvky
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

// JetBrains Mono — certifikátová čísla, kódy
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400"],
});

export const metadata: Metadata = {
  title: {
    default: "Limited Exposure — Sběratelská fotografie",
    template: "%s — Limited Exposure",
  },
  description:
    "Kurátorské tržiště limitovaných fotografických edic. Každý tisk je opatřen certifikátem pravosti.",
  openGraph: {
    siteName: "Limited Exposure",
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
      className={`${playfair.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
