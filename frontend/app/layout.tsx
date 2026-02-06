import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const satoshi = localFont({
  src: [
    {
      path: "./fonts/Satoshi-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Satoshi-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/Satoshi-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-sans",
  display: "swap",
});

const fraunces = localFont({
  src: [
    {
      path: "./fonts/Fraunces-Soft.woff2",
      weight: "300 700",
      style: "normal",
    },
  ],
  variable: "--font-accent",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Calmry — AI Mental Therapist",
  description:
    "A calm, private, emotionally intelligent AI therapist designed for reflection, grounding, and mental clarity.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`
          ${satoshi.variable}
          ${fraunces.variable}
          antialiased
        `}
      >
        {children}
      </body>
    </html>
  );
}
