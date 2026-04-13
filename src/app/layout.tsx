import type { Metadata } from "next";
import { Noto_Serif, Inter, Manrope } from "next/font/google";
import Providers from "@/components/Providers";
import "./globals.css";

// Noto Serif — display, headlines, artist names, curated statements
const notoSerif = Noto_Serif({
  variable: "--font-noto-serif",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
});

// Inter — body text, descriptions, metadata values
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

// Manrope — labels, UI, uppercase tracking, navigation
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "Limited Exposure — Limitované fotografie od současných autorů",
    template: "%s — Limited Exposure",
  },
  description:
    "Limitované fotografické edice s certifikátem pravosti. Každé dílo má pevně daný počet kusů — po vyprodání nekoupíte znovu.",
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
      className={`${notoSerif.variable} ${inter.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#f9f9f9] text-[#1a1c1c]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
