"use client";

import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, X } from "@phosphor-icons/react";
import FaultyTerminal from "./FaultyTerminal";

type PRStatus = "merged" | "open" | "closed";

type Contribution = {
  number: number;
  title: string;
  status: PRStatus;
};

type Project = {
  slug: string;
  title: string;
  year: string;
  description: string;
  stack: string[];
  href: string;
  repo: string;
  screenshotSrc: string;
  // ponytail: opt-in flag for the FaultyTerminal WebGL header — SkateHive is
  // the design pilot for this treatment. Once finalized, flip this on for
  // the other projects too.
  terminalHeader?: boolean;
  // ponytail: SkateHive-only — open source contribution history. Other
  // projects don't have a PR trail so this stays undefined for them.
  contributions?: Contribution[];
};

// ponytail: snapshot from github.com/SkateHive/skatehive3.0/pulls/Bielcx —
// update manually as new PRs land.
const skatehiveContributions: Contribution[] = [
  { number: 189, title: "fix: profile-not-found flash on first load + SSR crashes on /user/[username]", status: "merged" },
  { number: 171, title: "fix: false unread notification badge (Hive timestamps parsed as local time)", status: "merged" },
  { number: 168, title: "[Fix] Video trim not applied on publish + UX improvements", status: "open" },
  { number: 165, title: "feat(homepage): redesign post action bar and reply composer footer", status: "open" },
  { number: 162, title: "fix: Skatehive logo broken on every page reload (external URL → local asset)", status: "merged" },
  { number: 160, title: "fix: /settings chunk error (useFormControlStyles) caused by optimizePackageImports", status: "merged" },
  { number: 158, title: "fix: notifications unread badge clears on first click (race condition in markNotificationsAsRead)", status: "merged" },
  { number: 156, title: "feat: /tricks redesign — tutorial embeds, clip previews, Skate or Dice & tag-collision fix", status: "merged" },
  { number: 154, title: "Add autosave draft support for Snap editor (Compose/Drafts tabs)", status: "open" },
  { number: 150, title: "fix(#91): profile header data not loading on initial load + follow counter lag", status: "merged" },
  { number: 135, title: "Add scheduled posts via Hive Posting Authority (closes #130)", status: "open" },
  { number: 133, title: "fix: avatar fallback shown despite valid profile image", status: "merged" },
  { number: 129, title: "fix(#128): markdown preview shows raw syntax instead of rendered formatting", status: "merged" },
  { number: 126, title: "fix(#121): improve hashtag input placeholder for clarity", status: "closed" },
  { number: 111, title: "fix: open ConnectionModal instead of dead /sign-in route in settings", status: "merged" },
  { number: 106, title: "fix(#97): recover from ChunkLoadError on skatehive.app home page", status: "merged" },
  { number: 103, title: "fix(#99): one-click bug reporting from error toasts", status: "merged" },
  { number: 102, title: "feat(homepage): add mobile-first SpotNearYou dialog", status: "closed" },
  { number: 92, title: "feat(homepage): add SpotNearYou widget to right sidebar", status: "merged" },
  { number: 88, title: "feat(i18n): add missing pt-BR translations", status: "merged" },
];

const projects: Project[] = [
  {
    slug: "skatehive",
    title: "SkateHive",
    year: "2026",
    description:
      "Plataforma Web3 de skateboarding — rede social descentralizada com criação de conteúdo, curadoria de vídeos e recompensas em crypto. Blockchain Hive.",
    stack: ["Next.js", "TypeScript", "Web3", "Hive Blockchain"],
    href: "https://skatehive.app",
    repo: "https://github.com/SkateHive/skatehive3.0",
    screenshotSrc: "/skatehive-preview.png",
    terminalHeader: true,
    contributions: skatehiveContributions,
  },
  {
    slug: "fiveout",
    title: "Fiveout Dashboard",
    year: "2025",
    description:
      "Painel fullstack para loja de streetwear — cadastro de peças, controle de estoque em tempo real e catálogo público com integração no WhatsApp. Auth SSR com Supabase.",
    stack: ["Next.js", "TypeScript", "Supabase", "PostgreSQL", "Tailwind"],
    href: "https://www.fiveoout.com.br",
    repo: "https://github.com/Bielcx/fiveout-dashboard",
    screenshotSrc: "/fiveout.png",
  },
  {
    slug: "mirante",
    title: "Mirante Skateshop",
    year: "2025",
    description:
      "Landing page demo para skateshop real — modelo 3D interativo de skate com parallax de mouse, animações scroll-triggered e estética street culture.",
    stack: ["React 19", "Three.js", "R3F", "Framer Motion", "Vite"],
    href: "https://mirante-skateshop.vercel.app",
    repo: "https://github.com/Bielcx/mirante-skateshop",
    screenshotSrc: "/mirante.png",
  },
  {
    slug: "venturefi",
    title: "VentureFi",
    year: "2025",
    description:
      "TCC em Sistemas de Informação (FIAP) — plataforma SaaS fullstack de gestão financeira, com sugestões inteligentes de investimento e relatórios interativos.",
    stack: ["Angular 20", "TypeScript", "Angular Material", "Chart.js"],
    href: "https://venturefi-gikn.vercel.app",
    repo: "https://github.com/Bielcx/VentureFi",
    screenshotSrc: "/venturefi.png",
  },
];

function StackBadge({ label }: { label: string }) {
  return (
    <span className="whitespace-nowrap font-mono text-[11px] leading-none text-[#948F85]/90 light:text-neutral-500 border border-[#948F85]/25 light:border-neutral-300 px-2 py-1">
      {label}
    </span>
  );
}

const statusStyles: Record<PRStatus, string> = {
  merged: "text-[#4ade80] border-[#4ade80]/30",
  open: "text-[#b497cf] light:text-[#8a6bab] border-[#b497cf]/30 light:border-[#8a6bab]/30",
  closed: "text-[#948F85]/50 border-[#948F85]/25",
};

function ContributionsSection({ repo, items }: { repo: string; items: Contribution[] }) {
  const merged = items.filter((p) => p.status === "merged").length;
  const open = items.filter((p) => p.status === "open").length;
  const closed = items.filter((p) => p.status === "closed").length;

  return (
    <div>
      <div className="flex items-baseline justify-between mb-4">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#4ade80]">
          Contributions
        </span>
        <span className="font-mono text-[11px] text-[#948F85]/50 light:text-neutral-400">
          {merged} merged · {open} open · {closed} closed
        </span>
      </div>
      <div className="divide-y divide-[#948F85]/10 light:divide-neutral-200 border border-[#948F85]/15 light:border-neutral-200">
        {items.map((pr) => (
          <a
            key={pr.number}
            href={`${repo}/pull/${pr.number}`}
            target="_blank"
            rel="noreferrer"
            className="group flex items-start gap-3 px-4 py-3 hover:bg-[#F3E6C4]/[0.03] light:hover:bg-neutral-900/[0.03] transition-colors"
          >
            <span className="font-mono text-[11px] text-[#948F85]/40 light:text-neutral-300 shrink-0 mt-0.5">
              #{pr.number}
            </span>
            <span className="flex-1 text-[13px] leading-snug text-[#948F85] light:text-neutral-600 group-hover:text-[#F3E6C4] light:group-hover:text-neutral-900 transition-colors">
              {pr.title}
            </span>
            <span
              className={`shrink-0 whitespace-nowrap font-mono text-[10px] uppercase tracking-wide border px-1.5 py-0.5 ${statusStyles[pr.status]}`}
            >
              {pr.status}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}

export default function SelectedWork() {
  const [active, setActive] = useState<Project | null>(null);

  const close = useCallback(() => setActive(null), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  useEffect(() => {
    document.body.style.overflow = active ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [active]);

  return (
    <>
      <section id="work" className="mx-auto max-w-5xl px-8 py-24">
        <div className="mb-10 flex items-baseline justify-between border-b border-[#948F85]/15 light:border-neutral-200 pb-4">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#b497cf] light:text-[#8a6bab]">
            Selected Work
          </p>
          <p className="font-mono text-xs text-[#948F85]/50 light:text-neutral-400">
            0{projects.length} — projects
          </p>
        </div>

        <div className="divide-y divide-[#948F85]/15 light:divide-neutral-200">
          {projects.map((project, i) => (
            <button
              key={project.slug}
              onClick={() => setActive(project)}
              className="group w-full flex items-center gap-6 py-6 text-left transition-colors hover:bg-[#F3E6C4]/[0.025] light:hover:bg-neutral-900/[0.03] -mx-4 px-4"
            >
              <span className="font-mono text-[11px] text-[#948F85]/40 light:text-neutral-300 shrink-0 w-5">
                0{i + 1}
              </span>
              <span className="flex-1 text-base font-semibold tracking-tight text-[#F3E6C4] light:text-neutral-900 group-hover:text-[#b497cf] light:group-hover:text-[#8a6bab] transition-colors">
                {project.title}
              </span>
              <span className="hidden md:flex items-center gap-3 flex-1">
                {project.stack.slice(0, 3).map((t) => (
                  <span
                    key={t}
                    className="font-mono text-[11px] text-[#948F85]/50 light:text-neutral-400"
                  >
                    {t}
                  </span>
                ))}
              </span>
              <span className="font-mono text-[11px] text-[#948F85]/40 light:text-neutral-300 shrink-0">
                {project.year}
              </span>
              <ArrowUpRight
                className="size-4 text-[#948F85]/40 group-hover:text-[#b497cf] transition-colors shrink-0"
                weight="bold"
              />
            </button>
          ))}
        </div>
      </section>

      <AnimatePresence>
        {active && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={close}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            />

            <motion.aside
              key="panel"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed right-0 top-0 z-50 h-full w-full md:w-[48vw] md:min-w-[560px] bg-[#141413] light:bg-[#fafafa] border-l border-[#948F85]/15 light:border-neutral-200 overflow-y-auto"
            >
              <button
                onClick={close}
                aria-label="Close"
                className="fixed md:absolute top-6 right-6 z-20 text-[#F3E6C4]/80 hover:text-[#F3E6C4] mix-blend-difference transition-colors"
              >
                <X className="size-5" weight="bold" />
              </button>

              {active.terminalHeader ? (
                <div className="relative h-56 w-full overflow-hidden border-b border-[#948F85]/15 light:border-neutral-200">
                  <FaultyTerminal
                    className="absolute inset-0"
                    scale={1.8}
                    gridMul={[2, 1]}
                    digitSize={1.1}
                    timeScale={0.4}
                    scanlineIntensity={0.4}
                    glitchAmount={1}
                    flickerAmount={0.6}
                    noiseAmp={1}
                    chromaticAberration={0}
                    curvature={0}
                    tint="#4ade80"
                    mouseReact
                    mouseStrength={0.4}
                    pageLoadAnimation
                    brightness={0.6}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141413] via-transparent to-[#141413]/40" />
                  <div className="absolute inset-x-0 bottom-0 px-8 pb-6">
                    <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#4ade80]">
                      Project
                    </span>
                    <h2 className="text-2xl font-bold tracking-tight text-[#F3E6C4] mt-1">
                      {active.title}
                    </h2>
                  </div>
                </div>
              ) : (
                <div className="sticky top-0 z-10 flex items-center justify-between px-8 py-6 border-b border-[#948F85]/15 light:border-neutral-200 bg-[#141413]/95 light:bg-[#fafafa]/95 backdrop-blur-sm">
                  <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#b497cf] light:text-[#8a6bab]">
                    Project
                  </span>
                </div>
              )}

              <div className="px-8 py-8 flex flex-col gap-8">
                <div>
                  {!active.terminalHeader && (
                    <h2 className="text-2xl font-bold tracking-tight text-[#F3E6C4] light:text-neutral-900 mb-3">
                      {active.title}
                    </h2>
                  )}
                  <p className="text-[13px] leading-relaxed text-[#948F85] light:text-neutral-600">
                    {active.description}
                  </p>
                </div>

                <div className="aspect-video w-full overflow-hidden bg-[#1a1a18] light:bg-neutral-100 border border-[#948F85]/15 light:border-neutral-200">
                  <img
                    src={active.screenshotSrc}
                    alt={`${active.title} — preview`}
                    className="h-full w-full object-cover object-top"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {active.stack.map((t) => (
                    <StackBadge key={t} label={t} />
                  ))}
                </div>

                {active.contributions && (
                  <ContributionsSection repo={active.repo} items={active.contributions} />
                )}

                <div className="flex gap-6 font-mono text-[11px] uppercase tracking-[0.08em]">
                  <a
                    href={active.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-[#b497cf] light:text-[#8a6bab] hover:text-[#F3E6C4] light:hover:text-neutral-900 transition-colors"
                  >
                    Live <ArrowUpRight className="size-3" weight="bold" />
                  </a>
                  <a
                    href={active.repo}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-[#948F85]/70 light:text-neutral-400 hover:text-[#F3E6C4] light:hover:text-neutral-900 transition-colors"
                  >
                    Source <ArrowUpRight className="size-3" weight="bold" />
                  </a>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
