import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import Providers from "@/components/Providers";
import "./globals.css";

// Manrope — moderní geometrický sans: nadpisy, displej, labely, UI
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "latin-ext"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

// Inter — tělo, popisy, hodnoty
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
      className={`${manrope.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#f7f3ec] text-[#2f2a22]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
