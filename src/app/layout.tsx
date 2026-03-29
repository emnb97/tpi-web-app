import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientProviders from "./components/ClientProviders";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#002D72",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.thephysicalinternet.uk"),
  title: {
    default: "The Physical Internet | Structured Cabling Training & Network Infrastructure",
    template: "%s | The Physical Internet",
  },
  description:
    "TPI delivers hands-on structured cabling training, ECS card guidance, and network infrastructure career pathways in the UK. Master copper and fibre cabling from beginner to professional.",
  keywords: [
    "structured cabling training",
    "data cabling course UK",
    "ECS card guidance",
    "fibre optic training",
    "network infrastructure training",
    "Cat6 termination course",
    "fiber splicing London",
    "data centre training UK",
    "cabling career pathway",
    "The Physical Internet",
    "TPI training",
  ],
  authors: [{ name: "The Physical Internet Ltd" }],
  creator: "The Physical Internet Ltd",
  publisher: "The Physical Internet Ltd",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://www.thephysicalinternet.uk",
    siteName: "The Physical Internet",
    title: "The Physical Internet | Structured Cabling Training & Network Infrastructure",
    description:
      "Hands-on structured cabling training, ECS card guidance, and UK network infrastructure career pathways.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "The Physical Internet – Structured Cabling Training",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Physical Internet | Structured Cabling Training",
    description:
      "Hands-on UK structured cabling training. Copper, fibre, ECS support & career pathways.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://www.thephysicalinternet.uk",
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png' },
    ],
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB">
      <head>
        {/* Structured data — Organisation */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "The Physical Internet Ltd",
              url: "https://www.thephysicalinternet.uk",
              logo: "https://www.thephysicalinternet.uk/tpilogo.png",
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+447487361240",
                contactType: "customer service",
                areaServed: "GB",
                availableLanguage: "English",
              },
              address: {
                "@type": "PostalAddress",
                streetAddress: "86-90 Paul Street, 3rd Floor",
                addressLocality: "London",
                postalCode: "EC2A 4NE",
                addressCountry: "GB",
              },
              sameAs: [
                "https://www.instagram.com/thephysicalinternet",
                "https://www.tiktok.com/@manny_tpi",
              ],
            }),
          }}
        />
        {/* Structured data — Educational Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationalOrganization",
              name: "The Physical Internet Ltd",
              description:
                "UK structured cabling training provider specialising in copper, fibre, ECS certification and network infrastructure career pathways.",
              url: "https://www.thephysicalinternet.uk",
              telephone: "+447487361240",
              email: "e.osobu@thephysicalinternet.uk",
              address: {
                "@type": "PostalAddress",
                streetAddress: "86-90 Paul Street, 3rd Floor",
                addressLocality: "London",
                postalCode: "EC2A 4NE",
                addressCountry: "GB",
              },
            }),
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}