"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { EnvelopeSimple, GithubLogo, XLogo } from "@phosphor-icons/react";

type Profile = {
  name: string;
  email: string;
  github: string;
  x: string;
};

export default function HeroSection({ profile }: { profile: Profile }) {
  const containerRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.06]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -40]);

  return (
    <section
      ref={containerRef}
      id="home"
      // pt menor no mobile: os 160px do pt-40 comiam ~24% da altura útil do
      // iPhone (≈662px depois das barras do Safari) antes de qualquer conteúdo.
      className="relative w-full max-w-5xl mx-auto px-8 pt-12 pb-16 md:pt-40"
    >
      <motion.div
        style={{ scale, opacity, y }}
        className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between md:gap-12"
      >
        <div className="flex flex-col text-center md:text-left">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex items-center justify-center gap-2.5 font-mono text-xs text-brand tracking-[0.2em] uppercase mb-6 md:justify-start"
          >
            <span className="size-[7px] shrink-0 bg-brand pulse-dot" />
            Available for work
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="uppercase font-black text-ink tracking-[-0.01em] leading-[1.05] text-[clamp(48px,6.5vw,84px)] mb-4"
          >
            Bielcx
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="font-mono text-sm text-ink-muted mb-2"
          >
            Full Stack Developer · Web3
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="font-mono text-sm text-ink-muted max-w-[420px] mx-auto leading-7 mb-8 md:mx-0"
          >
            Front, back e on-chain — produtos open source na Hive e
            aplicações web3 em produção.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.65 }}
            // Só os ícones. O -ml puxa a fileira de volta para a margem do
            // texto: cada ícone de 18px vive centrado numa área de toque de
            // 44px, então sobram 13px de respiro à esquerda do primeiro.
            className="flex items-center justify-center md:justify-start md:-ml-[13px]"
          >
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="flex size-11 items-center justify-center text-brand hover:text-ink transition-colors"
            >
              <GithubLogo size={18} weight="bold" />
            </a>
            <a
              href={`mailto:${profile.email}`}
              aria-label="Email"
              className="flex size-11 items-center justify-center text-brand hover:text-ink transition-colors"
            >
              <EnvelopeSimple size={18} weight="bold" />
            </a>
            <a
              href={profile.x}
              target="_blank"
              rel="noreferrer"
              aria-label="X"
              className="flex size-11 items-center justify-center text-brand hover:text-ink transition-colors"
            >
              <XLogo size={18} weight="bold" />
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="shrink-0 self-center md:self-auto"
        >
          {/* Desktop mantém a caixa 340x340 que o PixelBlast ocupava, para a
              borda direita e a centralização vertical do hero não mudarem.

              No mobile a altura é 33svh, não um valor fixo: `svh` é a viewport
              com a barra do Safari EXPANDIDA, que é o pior caso e o estado em
              que a página abre. Com 260px fixos as pernas ficavam cortadas na
              canela, porque o pé caía ~39px abaixo da dobra. Em svh a figura
              acompanha o aparelho em vez de ser calibrada para um só. O w-180
              é folga: com object-contain quem manda é a altura. */}
          <div className="relative h-[33svh] max-h-[260px] w-[180px] md:h-[340px] md:max-h-none md:w-[340px]">
            <Image
              src="/biel-avatar.png"
              alt=""
              fill
              priority
              sizes="(min-width: 768px) 340px, 180px"
              className="object-contain"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
