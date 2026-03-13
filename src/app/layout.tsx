import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/header";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SF Skills — Salesforce Agent Skills Directory",
  description:
    "Discover and install agent skills for Salesforce development. Built for Claude, Cursor, and Windsurf.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-sf-cloud focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-medium"
        >
          Skip to content
        </a>
        <Header />
        {children}
      </body>
    </html>
  );
}
