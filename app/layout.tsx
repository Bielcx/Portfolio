import type { Metadata } from "next";
import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://gabrielcavalcanti.vercel.app";
const title = "Gabriel Cavalcanti — Full Stack Developer";
const description =
  "Portfolio de Gabriel Cavalcanti, desenvolvedor Full Stack especializado em React, Next.js e Web3. Baseado no Brasil.";

export const metadata: Metadata = {
  // metadataBase é o que faz o Next resolver /OGimage.png para uma URL
  // absoluta — sem ele o crawler recebe um caminho relativo e ignora a imagem.
  metadataBase: new URL(siteUrl),
  title,
  description,
  openGraph: {
    title,
    description,
    url: siteUrl,
    siteName: "Gabriel Cavalcanti",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/OGimage.png",
        width: 1200,
        height: 630,
        alt: "Gabriel Cavalcanti — Full Stack Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/OGimage.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={cn(
        "h-full scroll-smooth antialiased",
        geistSans.variable,
        geistMono.variable,
        jetbrainsMono.variable,
        "font-mono"
      )}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
