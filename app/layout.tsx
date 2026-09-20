import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import ThemeSync from "@/components/ThemeSync";
import { AuthProvider } from "@/components/AuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RelateWorld | Free Community Clubs, Skills & Support for Every Age",
  description:
    "RelateWorld brings community, skills and spiritual growth together. Join free clubs for every age — Sprout, Surge, Pulse, Prime, Anchor, Base and Nexus — with weekly meetups, mentoring, Bible reading guides and practical support for families. 100% free to join.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeSync />
        <AuthProvider>
          <main className={"flex-1"}>{children}</main>
        </AuthProvider>
        <Footer />
      </body>
    </html>
  );
}
