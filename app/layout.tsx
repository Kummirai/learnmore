import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import ThemeSync from "@/components/ThemeSync";
import { AuthProvider } from "@/components/AuthProvider";

const SITE_URL = "https://relateworld.org";
const SITE_NAME = "RelateWorld";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "RelateWorld | Free Community Clubs, Skills & Support for Every Age",
    template: "%s | RelateWorld",
  },
  description:
    "RelateWorld brings community, skills and spiritual growth together. Join free clubs for every age — Sprout, Surge, Pulse, Prime, Anchor, Base and Nexus — with weekly meetups, mentoring, Bible reading guides and practical support for families. 100% free to join.",
  keywords: [
    "RelateWorld",
    "Relate World",
    "community clubs",
    "free clubs",
    "Bible study",
    "Bible quiz",
    "reading plans",
    "prayer times",
    "youth groups",
    "Christian community",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "https://relateworld.org",
    siteName: "RelateWorld",
    title: "RelateWorld | Free Community Clubs, Skills & Support for Every Age",
    description:
      "Free clubs for every age with weekly meetups, mentoring, Bible reading guides and practical support for families.",
    locale: "en_ZA",
  },
  twitter: {
    card: "summary_large_image",
    title: "RelateWorld | Free Community Clubs, Skills & Support for Every Age",
    description:
      "Free clubs for every age with weekly meetups, mentoring, Bible reading guides and practical support for families.",
  },
  robots: {
    index: true,
    follow: true,
  },
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": `${SITE_URL}/#org`,
                  name: SITE_NAME,
                  url: SITE_URL,
                  logo: `${SITE_URL}/images/relate-world-logo.png`,
                  description:
                    "Free community clubs for every age — Sprout, Surge, Pulse, Prime, Anchor, Base and Nexus — with weekly meetups, mentoring, Bible reading guides and practical support for families.",
                  areaServed: "ZA",
                },
                {
                  "@type": "WebSite",
                  "@id": `${SITE_URL}/#website`,
                  url: SITE_URL,
                  name: SITE_NAME,
                  publisher: { "@id": `${SITE_URL}/#org` },
                },
              ],
            }),
          }}
        />
      </body>
    </html>
  );
}
