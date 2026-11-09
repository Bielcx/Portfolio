import type { Metadata } from "next";
import { Geist, Geist_Mono, JetBrains_Mono, Londrina_Solid } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

// Londrina Solid é a fonte dos Nouns: títulos, o nome e os tokens da coleção (redesign de 09/11/2026).
const londrina = Londrina_Solid({ subsets: ["latin"], weight: ["400", "900"], variable: "--font-nouns" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://web3.gabriel.doabridge.com";
const title = "bielcx.eth — onchain builder";
const description =
  "bielcx.eth — onchain builder. Ethereum, Base, Solana & Hive. Nounish by heart, cypherpunk by habit: every claim here links to something you can check.";

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
    siteName: "bielcx.eth",
    locale: "en_US",
    type: "website",
    images: [{ url: "/OGimage.png", width: 1200, height: 630, alt: title }],
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
    // Só tema escuro desde o redesign: não há mais `light` nem toggle.
    <html
      lang="en"
      className={cn(
        "h-full scroll-smooth antialiased dark",
        geistSans.variable,
        geistMono.variable,
        jetbrainsMono.variable,
        londrina.variable,
        "font-mono"
      )}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
