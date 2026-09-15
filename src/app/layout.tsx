import type { Metadata } from "next";
import { Barlow_Condensed, DM_Sans } from "next/font/google";

import "./globals.css";

const displayFont = Barlow_Condensed({
  variable: "--font-display",
  subsets: ["latin"],
  weight: [
    "400",
    "500",
    "600",
    "700",
    "800",
    "900",
  ],
});

const bodyFont = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: [
    "400",
    "500",
    "600",
    "700",
  ],
});

export const metadata: Metadata = {
  title: "updtcl T10",
  description:
    "Uttar Pradesh District Tenish Cricket League",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${displayFont.variable} ${bodyFont.variable} font-[family-name:var(--font-body)]`}
      >
        {children}
      </body>
    </html>
  );
}