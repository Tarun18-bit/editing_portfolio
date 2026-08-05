import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import LenisProvider from "@/component/providers/LenisProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tarun — Video Editor",
  description:
    "Crafting stories people don't just watch — they feel. The portfolio of Tarun, a cinematic video editor.",
  keywords: [
    "video editor",
    "cinematic editing",
    "portfolio",
    "motion design",
    "storytelling",
    "post-production",
  ],
  openGraph: {
    title: "Tarun — Video Editor",
    description: "Crafting stories people don't just watch — they feel.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col">
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
