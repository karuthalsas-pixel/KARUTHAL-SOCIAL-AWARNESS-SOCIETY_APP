import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz", "SOFT", "WONK"]
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.karuthalsas.org";
const SITE_NAME = "Karuthal Social Awareness Society";
const SITE_TITLE = "Karuthal Social Awareness Society | Empowering Youth & Building Futures";
const SITE_DESCRIPTION =
  "Karuthal Social Awareness Society conducts interactive awareness programs for students from LKG to +2 against substance abuse, cyber traps, child abuse, and road safety hazards in Kerala.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s | Karuthal Social Awareness Society"
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "Karuthal Social Awareness Society",
    "social awareness program Kerala",
    "school mission program Thiruvalla",
    "substance abuse awareness for students",
    "cyber safety education Kerala",
    "child protection awareness",
    "road safety youth campaign",
    "Karuthal Thiruvalla"
  ],
  authors: [{ name: "Karuthal Social Awareness Society", url: SITE_URL }],
  creator: "Karuthal Social Awareness Society",
  publisher: "Karuthal Social Awareness Society",
  category: "Architecture & Design",
  referrer: "strict-origin-when-cross-origin",
  formatDetection: { email: true, address: true, telephone: true },
  alternates: {
    canonical: SITE_URL
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    locale: "en_US",
    images: [
      {
        url: "/images/og-cover.jpg",
        width: 1200,
        height: 630,
        alt: "Aterna Studio — Architecture & Interior Design"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/images/og-cover.jpg"],
    creator: "@aternastudio"
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" }
    ],
    apple: "/apple-touch-icon.png"
  },
  manifest: "/manifest.webmanifest",
  verification: {
    google: "GOOGLE_SEARCH_CONSOLE_VERIFICATION_CODE"
  }
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#EFEAE0" },
    { media: "(prefers-color-scheme: dark)", color: "#14120E" }
  ],
  width: "device-width",
  initialScale: 1
};

function StructuredData() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    alternateName: "Aterna Architecture & Interior Design",
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo.png`,
    image: `${SITE_URL}/images/og-cover.jpg`,
    telephone: "+1-503-555-0142",
    priceRange: "$$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: "118 Pine Mill Lane, Suite 4",
      addressLocality: "Portland",
      addressRegion: "OR",
      postalCode: "97209",
      addressCountry: "US"
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 45.5231,
      longitude: -122.6765
    },
    areaServed: "United States",
    sameAs: [
      "https://www.instagram.com/aternastudio",
      "https://www.linkedin.com/company/aternastudio",
      "https://www.pinterest.com/aternastudio"
    ],
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00"
    },
    makesOffer: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Residential Architecture" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Interior Design" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Adaptive Reuse & Renovation" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Hospitality Design" } }
    ]
  };

  const websiteLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    publisher: { "@id": `${SITE_URL}/#organization` },
    inLanguage: "en-US"
  };

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }}
      />
    </>
  );
}

import { FloatingContactButtons } from "@/components/ui/FloatingContactButtons";
import { Chatbot } from "@/components/ui/Chatbot";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        <StructuredData />
        <script
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark');}}catch(e){}})();`
          }}
        />
      </head>
      <body className="bg-paper text-ink dark:bg-paper-dark dark:text-ink-dark font-sans antialiased selection:bg-clay/30 selection:text-ink">
        {children}
        <Chatbot />
        <FloatingContactButtons />
      </body>
    </html>
  );
}

