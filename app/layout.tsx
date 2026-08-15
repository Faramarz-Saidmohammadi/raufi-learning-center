import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { getSiteUrl } from "@/lib/site-url";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "Raufi Learning Center | آموزشگاه رؤفی هرات",
    template: "%s | Raufi Learning Center",
  },
  description:
    "Raufi Learning Center in Herat — Kankor preparation, English, computer, science and professional skills programmes.",
  keywords: ["Raufi Learning Center","Herat learning center","Kankor preparation","English classes Herat","computer courses Herat","آموزشگاه رؤفی","د رؤفي ښوونیز مرکز"],
  alternates: { canonical: "/" },
  openGraph: {
    title: "Raufi Learning Center — Learn with direction",
    description: "Kankor, English, computer and practical skills programmes in Herat.",
    type: "website",
    locale: "fa_AF",
    alternateLocale: ["en_US","ps_AF"],
    images: [{ url: "/images/raufi-hero.webp", width: 1200, height: 800, alt: "Students learning at Raufi Learning Center" }],
  },
  twitter: { card: "summary_large_image", title: "Raufi Learning Center", description: "Purposeful learning in Herat.", images: ["/images/raufi-hero.webp"] },
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.png", shortcut: "/favicon.png", apple: "/favicon.png" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl">
      <body className={`${geistSans.variable} antialiased`}>{children}</body>
    </html>
  );
}
