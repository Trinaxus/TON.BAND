import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import ModernBackground from "./components/ModernBackground";
import Header from "./components/Header";
import Footer from "./components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TON.BAND - Fotogalerie",
  description: "TON.BAND Fotogalerie und Mediathek",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        {/* Moderner, einfacher Hintergrund */}
        <ModernBackground 
          primaryColor="#1a0500" 
          accentColor="#ff6b00" 
          pattern="gradient" 
        />
        
        
        {/* Header-Komponente mit bedingtem Admin-Link */}
        <Header />
        
        {children}
        <Footer />
      </body>
    </html>
  );
}
