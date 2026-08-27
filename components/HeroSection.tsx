"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import {
  EnvelopeSimple,
  GithubLogo,
  LinkedinLogo,
} from "@phosphor-icons/react";

type Profile = {
  name: string;
  email: string;
  github: string;
  linkedin: string;
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
      className="relative w-full max-w-5xl mx-auto px-8 pt-16 pb-16 md:pt-40"
    >
      <motion.div
        style={{ scale, opacity, y }}
        className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between md:gap-12"
      >
        <div className="flex flex-col">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex items-center gap-2.5 font-mono text-xs text-brand tracking-[0.2em] uppercase mb-6"
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
            Gabriel
            <br />
            Cavalcanti
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="font-mono text-sm text-ink-muted mb-2"
          >
            Full Stack Developer
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="font-mono text-sm text-ink-muted max-w-[420px] leading-7 mb-8"
          >
            Front, back e deploy em produção — de produtos para clientes
            reais a contribuições em projetos open source.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.65 }}
            className="flex items-center gap-6"
          >
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer"
              className="group flex min-h-11 items-center gap-2 font-mono text-xs text-ink-muted hover:text-ink transition-colors"
            >
              <GithubLogo size={14} weight="bold" className="!text-brand" />
              <span className="relative after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-0 after:bg-brand after:transition-all after:duration-300 group-hover:after:w-full">
                GitHub
              </span>
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              className="group flex min-h-11 items-center gap-2 font-mono text-xs text-ink-muted hover:text-ink transition-colors"
            >
              <LinkedinLogo size={14} weight="bold" className="!text-brand" />
              <span className="relative after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-0 after:bg-brand after:transition-all after:duration-300 group-hover:after:w-full">
                LinkedIn
              </span>
            </a>
            <a
              href={`mailto:${profile.email}`}
              className="group flex min-h-11 items-center gap-2 font-mono text-xs text-ink-muted hover:text-ink transition-colors"
            >
              <EnvelopeSimple size={14} weight="bold" className="!text-brand" />
              <span className="relative after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-0 after:bg-brand after:transition-all after:duration-300 group-hover:after:w-full">
                Email
              </span>
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
              borda direita e a centralização vertical do hero não mudarem. No
              mobile a figura vai abaixo dos links, em 180x260 — o render é 2:3,
              então com object-contain isso dá um corpo de ~173x260, que cabe no
              espaço livre da primeira tela e ainda lê bem a 393px de largura. */}
          <div className="relative h-[260px] w-[180px] md:size-[340px]">
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
