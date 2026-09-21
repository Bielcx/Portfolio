import type { Metadata } from "next";
import { Archivo_Black, Geist, Geist_Mono, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ArrivalPortal } from "@/components/ArrivalPortal";
import { cn } from "@/lib/utils";

const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

// Archivo Black só existe no peso 400 — o "black" está no desenho da fonte, não
// no eixo de peso. Só o nick da hero a usa.
const archivoBlack = Archivo_Black({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-archivo",
});

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
        archivoBlack.variable,
        "font-mono"
      )}
    >
      <head>
        {/* A CAPA DA CHEGADA, ligada antes da primeira pintura.

            Tem de ser script inline: o `ArrivalPortal` so monta depois da
            hidratacao, e quem vem pelo portal do portfolio comercial veria a
            pagina inteira antes de o portal aparecer por cima — o contrario da
            ilusao. Aqui isto roda no parse do <head>, entao o primeiro quadro
            que o visitante ve ja e a capa.

            O timeout e rede de seguranca, nao coreografia: se o JS do bundle
            falhar, a capa sai sozinha em 2,5s e o site aparece. Pagina
            escondida por causa de um enfeite e o pior desfecho possivel. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{
  var r = document.referrer && new URL(document.referrer).host;
  var meu = ["gabriel.doabridge.com","bielcx-portfolio.vercel.app"];
  var ok = r && (meu.indexOf(r) > -1 || /^(localhost|127\\.0\\.0\\.1):\\d+$/.test(r));
  if (!ok) return;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  document.documentElement.dataset.portal = "1";
  setTimeout(function(){ delete document.documentElement.dataset.portal }, 2500);
}catch(e){}})()`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <ArrivalPortal />
      </body>
    </html>
  );
}
