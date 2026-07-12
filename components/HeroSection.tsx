"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import {
  EnvelopeSimple,
  GithubLogo,
  LinkedinLogo,
} from "@phosphor-icons/react";
import { IconCloud } from "@/components/IconCloud";

type Profile = {
  name: string;
  email: string;
  github: string;
  linkedin: string;
};

const techSlugs = [
  "react",
  "nextdotjs",
  "typescript",
  "javascript",
  "nodedotjs",
  "tailwindcss",
  "supabase",
  "postgresql",
  "threedotjs",
  "git",
  "github",
  "vercel",
  "vite",
  "figma",
  "express",
  "prisma",
  "html5",
  "docker",
  "npm",
  "pnpm",
  "jest",
  "eslint",
  "prettier",
  "framer",
  "redux",
  "reactrouter",
  "radixui",
  "bun",
];

const techImages = techSlugs.map(
  (slug) => `https://cdn.simpleicons.org/${slug}/${slug}`,
);

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
            className="font-mono text-xs text-[#b497cf] light:text-[#8a6bab] tracking-[0.2em] uppercase mb-6"
          >
            Available for work
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl sm:text-5xl font-black text-[#F3E6C4] light:text-neutral-900 tracking-tight leading-[1.05] mb-4"
          >
            Gabriel
            <br />
            Cavalcanti
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.35 }}
            className="font-mono text-sm text-[#948F85] light:text-neutral-500 mb-6"
          >
            Full Stack Developer — React, Next.js, Node.js
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
              className="flex items-center gap-2 font-mono text-xs text-[#948F85] hover:text-[#F3E6C4] light:text-neutral-500 light:hover:text-neutral-900 transition-colors"
            >
              <GithubLogo size={14} weight="bold" /> GitHub
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 font-mono text-xs text-[#948F85] hover:text-[#F3E6C4] light:text-neutral-500 light:hover:text-neutral-900 transition-colors"
            >
              <LinkedinLogo size={14} weight="bold" /> LinkedIn
            </a>
            <a
              href={`mailto:${profile.email}`}
              className="flex items-center gap-2 font-mono text-xs text-[#948F85] hover:text-[#F3E6C4] light:text-neutral-500 light:hover:text-neutral-900 transition-colors"
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
          <IconCloud images={techImages} />
        </motion.div>
      </motion.div>
    </section>
  );
}
