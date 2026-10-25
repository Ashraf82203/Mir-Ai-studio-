import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import SWRegister from "@/components/SWRegister";

export const metadata: Metadata = {
  title: "Mir AI Studio — AI Video Generator · Urdu / Hindi",
  description: "Mir AI Studio — AI Video Generator for Urdu / Hindi creators. Text-to-Video, AI Avatars, AI voices, auto subtitles, timeline editor & 4K export. JazzCash/EasyPaisa supported. Installable mobile app.",
  appleWebApp: { capable: true, title: "Mir AI", statusBarStyle: "black-translucent" },
  icons: { apple: "/icons/icon-512.png", icon: "/icons/icon-512.png" },
};
export const viewport: Viewport = {
  themeColor: "#0b0e15",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <SWRegister />
      </body>
    </html>
  );
}
