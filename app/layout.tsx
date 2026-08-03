import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl = "https://digital.nirajtharu.com.np";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "AI Marketing Expert in Nepal | Digital Niraj",
  description:
    "Grow your business with AI-powered digital marketing, Meta Ads, SEO, automation, and lead generation. Book a free consultation with Digital Niraj.",
  applicationName: "Digital Niraj",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Digital Niraj",
    title: "AI Marketing Expert in Nepal | Digital Niraj",
    description:
      "Grow your business with AI-powered digital marketing, Meta Ads, SEO, automation, and lead generation. Book a free consultation with Digital Niraj.",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Marketing Expert in Nepal | Digital Niraj",
    description:
      "Book a free consultation and discover practical AI-powered strategies tailored to your business.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f8fafc",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
