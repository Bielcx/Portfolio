"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "motion/react";
import {
  EnvelopeSimple,
  GithubLogo,
  LinkedinLogo,
} from "@phosphor-icons/react";

// ponytail: three.js + postprocessing are real weight — keep them out of the
// initial bundle and only fetch on the client, same pattern as FaultyTerminal.
const PixelBlast = dynamic(() => import("./PixelBlast"), { ssr: false });

type Profile = {
  name: string;
  email: string;
  github: string;
  linkedin: string;
};

export default function HeroSection({ profile }: { profile: Profile }) {
  const containerRef = useRef<HTMLElement>(null);
  const [reducedMotion, setReducedMotion] = useState(true);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.06]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -40]);

  // ponytail: don't mount the WebGL canvas at all for users who asked for
  // reduced motion — not just pausing the animation, skipping it entirely.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <section
      ref={containerRef}
      id="home"
      className="relative w-full max-w-5xl mx-auto px-8 pt-40 pb-16"
    >
      <motion.div
        style={{ scale, opacity, y }}
        className="flex items-center justify-between gap-12"
      >
        <div className="flex flex-col">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex items-center gap-2.5 font-mono text-xs text-[#b497cf] light:text-[#8a6bab] tracking-[0.2em] uppercase mb-6"
          >
            <span className="size-[7px] shrink-0 bg-[#b497cf] pulse-dot" />
            Available for work
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="uppercase font-black text-[#F3E6C4] light:text-neutral-900 tracking-[-0.01em] leading-[1.05] text-[clamp(48px,6.5vw,84px)] mb-4"
          >
            Gabriel
            <br />
            Cavalcanti
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="font-mono text-sm text-[#948F85] light:text-neutral-500 mb-2"
          >
            Full Stack Developer
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="font-mono text-sm text-[#948F85] light:text-neutral-500 max-w-[420px] leading-7 mb-8"
          >
            Construo produtos web do banco ao deploy — React, Next.js e
            Node.js, para clientes reais no Brasil e projetos open source.
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
              className="flex min-h-11 items-center gap-2 font-mono text-xs text-[#948F85] hover:text-[#F3E6C4] light:text-neutral-500 light:hover:text-neutral-900 transition-colors"
            >
              <GithubLogo size={14} weight="bold" /> GitHub
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              className="flex min-h-11 items-center gap-2 font-mono text-xs text-[#948F85] hover:text-[#F3E6C4] light:text-neutral-500 light:hover:text-neutral-900 transition-colors"
            >
              <LinkedinLogo size={14} weight="bold" /> LinkedIn
            </a>
            <a
              href={`mailto:${profile.email}`}
              className="flex min-h-11 items-center gap-2 font-mono text-xs text-[#948F85] hover:text-[#F3E6C4] light:text-neutral-500 light:hover:text-neutral-900 transition-colors"
            >
              <EnvelopeSimple size={14} weight="bold" /> Email
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="hidden shrink-0 md:block"
        >
          <div className="relative w-[340px] h-[340px] overflow-hidden">
            {!reducedMotion && (
              <PixelBlast
                variant="square"
                pixelSize={7}
                color="#B497CF"
                patternScale={2}
                patternDensity={1}
                enableRipples
                rippleSpeed={0.4}
                rippleThickness={0.12}
                rippleIntensityScale={1.5}
                liquid
                liquidStrength={0.12}
                liquidRadius={1.2}
                liquidWobbleSpeed={5}
                edgeFade={0.25}
                transparent
              />
            )}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
