import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Poppins } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";
import ThemeSync from "@/components/ThemeSync";
import RevealObserver from "@/components/RevealObserver";
import { AuthProvider } from "@/components/AuthProvider";

const SITE_URL = "https://relateworld.org";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Relate World | Free Community Clubs, Skills & Support for Every Age",
    template: "%s | Relate World",
  },
  description:
    "Relate World brings community, skills and spiritual growth together. Join free clubs for every age — Sprout, Surge, Pulse, Prime, Anchor, Spark and Synergy — with weekly meetups, mentoring, season guides and practical support for families. 100% free to join.",
  applicationName: "Relate World",
  authors: [{ name: "Relate World", url: SITE_URL }],
  keywords: [
    "RelateWorld",
    "Relate World",
    "community clubs",
    "free clubs",
    "Bible study",
    "Bible quiz",
    "season guides",
    "prayer times",
    "youth groups",
    "Christian community",
  ],
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Relate World",
    title: "Relate World | Free Community Clubs, Skills & Support for Every Age",
    description:
      "Relate World — free clubs for every age with weekly meetups, mentoring, season guides and practical support for families.",
    locale: "en_ZA",
    images: [
      {
        url: "/images/relate-world-logo.png",
        width: 500,
        height: 500,
        alt: "Relate World",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Relate World | Free Community Clubs, Skills & Support for Every Age",
    description:
      "Relate World — free clubs for every age with weekly meetups, mentoring, season guides and practical support for families.",
    images: ["/images/relate-world-logo.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0b192c",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-dvh flex flex-col">
        <ThemeSync />
        <RevealObserver />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-navy focus:shadow-xl"
        >
          Skip to main content
        </a>
        <AuthProvider>{children}</AuthProvider>
        <Footer />
        <CookieConsent />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": `${SITE_URL}/#org`,
                  name: "Relate World",
                  alternateName: ["RelateWorld", "Relate World"],
                  url: SITE_URL,
                  logo: `${SITE_URL}/images/relate-world-logo.png`,
                  description:
                    "Relate World — free community clubs for every age — Sprout, Surge, Pulse, Prime, Anchor, Spark and Synergy — with weekly meetups, mentoring, season guides and practical support for families.",
                  areaServed: "ZA",
                },
                {
                  "@type": "WebSite",
                  "@id": `${SITE_URL}/#website`,
                  url: SITE_URL,
                  name: "Relate World",
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
