"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, X } from "@phosphor-icons/react";
import { Safari } from "./ui/safari";
import { Iphone } from "./ui/iphone";

// ponytail: ogl (WebGL) is real weight — keep it out of the initial page
// bundle entirely and only fetch it the first time a panel with a
// terminalHeader actually opens. ssr:false because it touches the canvas/GL
// APIs that don't exist on the server.
const Galaxy = dynamic(() => import("./Galaxy"), {
  ssr: false,
});

type PRStatus = "merged" | "open" | "closed";

type Contribution = {
  number: number;
  title: string;
  status: PRStatus;
  // ponytail: only `featured` PRs render in the panel list — keeps it to the
  // most representative work instead of all 20. The merged/open/closed counts
  // above the list still reflect every PR in this array, not just featured
  // ones, so the credential stays accurate even though the list is curated.
  featured?: boolean;
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
  // ponytail: real mobile-viewport screenshot for the Iphone mock in the
  // panel — falls back to `screenshotSrc` (the desktop shot) as a placeholder
  // for projects that don't have a dedicated mobile capture yet.
  screenshotMobileSrc?: string;
  // ponytail: one-line result/nature phrase shown in the list row instead of
  // a stack preview — "Next.js TypeScript Supabase" repeated across projects
  // was noise, not differentiation. Full stack is still in the panel below.
  outcome: string;
  // ponytail: short highlight tag next to the outcome (e.g. "Open Source").
  badge?: string;
  // ponytail: shorter version of `badge` for the list row itself (redesign
  // 2a) — the full text only shows in the hover-revealed detail line below.
  badgeShort?: string;
  // ponytail: marks a project still in progress (mock data, no real backend
  // yet) so it doesn't read as equivalent to the finished, real-client work.
  wip?: boolean;
  // ponytail: opt-in flag for the WebGL panel header (Galaxy, testing —
  // was FaultyTerminal) — SkateHive was the design pilot, now replicated
  // across all projects (see issue #3).
  terminalHeader?: boolean;
  // ponytail: unused while the header renders Galaxy (which is hardcoded to
  // the site accent, see SelectedWork's render). Kept on the data model in
  // case per-project tinting comes back.
  terminalTint?: string;
  // ponytail: SkateHive-only — open source contribution history. Other
  // projects don't have a PR trail so this stays undefined for them.
  contributions?: Contribution[];
  // ponytail: authoritative merged/open/closed/total counts for the
  // Contributions summary line — overrides counting `contributions` directly,
  // since that array is a curated highlight subset, not the full PR history.
  contributionStats?: { merged: number; open: number; closed: number; total: number };
};

// ponytail: snapshot from github.com/SkateHive/skatehive3.0/pulls/Bielcx —
// update manually as new PRs land.
const skatehiveContributions: Contribution[] = [
  { number: 189, title: "fix: profile-not-found flash on first load + SSR crashes on /user/[username]", status: "merged", featured: true },
  { number: 171, title: "fix: false unread notification badge (Hive timestamps parsed as local time)", status: "merged", featured: true },
  { number: 168, title: "[Fix] Video trim not applied on publish + UX improvements", status: "open" },
  { number: 165, title: "feat(homepage): redesign post action bar and reply composer footer", status: "open" },
  { number: 162, title: "fix: Skatehive logo broken on every page reload (external URL → local asset)", status: "merged" },
  { number: 160, title: "fix: /settings chunk error (useFormControlStyles) caused by optimizePackageImports", status: "merged" },
  { number: 158, title: "fix: notifications unread badge clears on first click (race condition in markNotificationsAsRead)", status: "merged", featured: true },
  { number: 156, title: "feat: /tricks redesign — tutorial embeds, clip previews, Skate or Dice & tag-collision fix", status: "merged", featured: true },
  { number: 154, title: "Add autosave draft support for Snap editor (Compose/Drafts tabs)", status: "open" },
  { number: 150, title: "fix(#91): profile header data not loading on initial load + follow counter lag", status: "merged", featured: true },
  { number: 135, title: "Add scheduled posts via Hive Posting Authority (closes #130)", status: "open", featured: true },
  { number: 133, title: "fix: avatar fallback shown despite valid profile image", status: "merged" },
  { number: 129, title: "fix(#128): markdown preview shows raw syntax instead of rendered formatting", status: "merged" },
  { number: 126, title: "fix(#121): improve hashtag input placeholder for clarity", status: "closed" },
  { number: 111, title: "fix: open ConnectionModal instead of dead /sign-in route in settings", status: "merged" },
  { number: 106, title: "fix(#97): recover from ChunkLoadError on skatehive.app home page", status: "merged", featured: true },
  { number: 103, title: "fix(#99): one-click bug reporting from error toasts", status: "merged" },
  { number: 102, title: "feat(homepage): add mobile-first SpotNearYou dialog", status: "closed" },
  { number: 92, title: "feat(homepage): add SpotNearYou widget to right sidebar", status: "merged", featured: true },
  { number: 88, title: "feat(i18n): add missing pt-BR translations", status: "merged" },
];

// ponytail: NOT derived from the array above — that array is only the
// curated *featured* subset shown in the panel (20 entries, hand-picked),
// so filtering/counting it undercounts the real total (proved wrong twice:
// first hardcoded "14", then a derived count that was still only 14/20
// because the array itself was stale). These numbers were checked directly
// against GitHub's search API on 2026-07-21:
//   is:pr author:Bielcx repo:SkateHive/skatehive3.0             → 25 total
//   is:pr is:merged author:Bielcx repo:SkateHive/skatehive3.0   → 20 merged
//   is:pr is:open author:Bielcx repo:SkateHive/skatehive3.0     → 3 open
//   is:pr is:unmerged is:closed author:Bielcx repo:...          → 2 closed
// Re-run those queries to refresh when this drifts again — don't try to
// derive it from the curated array, that's what caused the drift.
const skatehiveStats = { merged: 20, open: 3, closed: 2, total: 25 };

const projects: Project[] = [
  {
    slug: "skatehive",
    title: "SkateHive",
    year: "2026",
    description:
      "Plataforma Web3 de skateboarding — rede social descentralizada com criação de conteúdo, curadoria de vídeos e recompensas em crypto. Blockchain Hive.",
    stack: ["Next.js", "TypeScript", "Web3", "Hive Blockchain"],
    outcome: `Contribuidor ativo em plataforma Web3 de skate em produção — ${skatehiveStats.total}+ PRs entre fixes de SSR, race conditions e features de homepage.`,
    badge: `${skatehiveStats.merged}+ PRs merged · open source`,
    badgeShort: `${skatehiveStats.merged}+ PRs`,
    contributionStats: skatehiveStats,
    href: "https://skatehive.app",
    repo: "https://github.com/SkateHive/skatehive3.0",
    screenshotSrc: "/screenshots/skatehive.png",
    screenshotMobileSrc: "/screenshots/skatehive-mobile.png",
    terminalHeader: true,
    terminalTint: "#4ade80",
    contributions: skatehiveContributions,
  },
  {
    slug: "fiveout",
    title: "Fiveoout",
    year: "2025",
    description:
      "Catálogo e painel de gestão desenvolvidos para a Fiveoout, cliente real do setor de streetwear — cadastro de peças, controle de estoque em tempo real e catálogo público com fechamento de pedido via WhatsApp. Autenticação SSR com Supabase.",
    stack: ["Next.js", "TypeScript", "Supabase", "PostgreSQL", "Tailwind"],
    outcome:
      "Catálogo e gestão de estoque para cliente real de streetwear — pedidos via WhatsApp, auth SSR com Supabase.",
    badge: "Em produção · cliente real",
    badgeShort: "PROD",
    href: "https://www.fiveoout.com.br",
    repo: "https://github.com/Bielcx/fiveout-dashboard",
    screenshotSrc: "/screenshots/fiveout.png",
    screenshotMobileSrc: "/screenshots/fiveout-mobile.png",
    terminalHeader: true,
  },
  {
    slug: "mirante",
    title: "Mirante Skateshop",
    year: "2025",
    description:
      "Landing page demo para skateshop real — modelo 3D interativo de skate com parallax de mouse, animações scroll-triggered e estética street culture.",
    stack: ["React 19", "Three.js", "R3F", "Framer Motion", "Vite"],
    outcome:
      "Skate 3D interativo com parallax de mouse e animações scroll-triggered.",
    badge: "Demo — template, não é cliente real",
    badgeShort: "DEMO",
    href: "https://mirante-skateshop.vercel.app",
    repo: "https://github.com/Bielcx/mirante-skateshop",
    screenshotSrc: "/screenshots/mirante.png",
    screenshotMobileSrc: "/screenshots/mirante-mobile.png",
    terminalHeader: true,
  },
  {
    slug: "voha",
    title: "Voha",
    year: "2026",
    description:
      "Plataforma SaaS mobile-first para planejamento, aprovação e agendamento de conteúdo no Instagram — calendário editorial, fluxo de aprovação por cliente e biblioteca de mídia centralizada. Backend em produção (Supabase + Cloudflare R2); interface em desenvolvimento ativo, hoje validada com dados fictícios.",
    stack: ["Next.js", "TypeScript", "Supabase", "Cloudflare R2", "PostgreSQL"],
    outcome:
      "Planejamento e aprovação de conteúdo para Instagram, com calendário editorial e fluxo de aprovação por cliente — backend em produção (Supabase + R2), interface em desenvolvimento ativo.",
    wip: true,
    href: "https://voha-lab.vercel.app",
    repo: "https://github.com/Bielcx/voha-lab",
    screenshotSrc: "/screenshots/voha.png",
    screenshotMobileSrc: "/screenshots/voha-mobile.png",
    terminalHeader: true,
  },
  {
    slug: "jcm",
    title: "JCM Soluções Gráficas",
    year: "2026",
    description:
      "Catálogo digital desenvolvido para a JCM Soluções Gráficas, cliente real do setor de embalagens e impressos — carrinho e fechamento de pedido direto pelo WhatsApp, sem backend nem plataforma mensal. Site estático hospedado na Cloudflare.",
    stack: ["Astro", "TypeScript", "Tailwind CSS", "Cloudflare Pages"],
    outcome:
      "Catálogo para cliente real do setor de embalagens e impressos — pedido via WhatsApp, sem backend nem mensalidade, estático na Cloudflare.",
    badge: "Em produção · cliente real",
    badgeShort: "PROD",
    href: "https://jcm-solucoes-graficas.biel-cavalcanti1.workers.dev/",
    repo: "https://github.com/Bielcx/jcm-solucoes-graficas",
    screenshotSrc: "/screenshots/jcm.png",
    screenshotMobileSrc: "/screenshots/jcm-mobile.png",
    terminalHeader: true,
  },
];

// ponytail: strips the protocol/trailing slash so the URL reads clean inside
// the Safari mockup's address bar (e.g. "https://skatehive.app/" → "skatehive.app").
function hostLabel(url: string) {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

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

function ContributionsSection({
  repo,
  items,
  stats,
}: {
  repo: string;
  items: Contribution[];
  // ponytail: pass real totals in explicitly (see skatehiveStats above) —
  // falling back to counting `items` only works if that array is exhaustive,
  // which the curated/featured one here isn't.
  stats?: { merged: number; open: number; closed: number; total: number };
}) {
  const merged = stats?.merged ?? items.filter((p) => p.status === "merged").length;
  const open = stats?.open ?? items.filter((p) => p.status === "open").length;
  const closed = stats?.closed ?? items.filter((p) => p.status === "closed").length;
  const total = stats?.total ?? items.length;
  const featured = items.filter((p) => p.featured);

  return (
    <div>
      <div className="flex items-baseline justify-between mb-4">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#4ade80]">
          Contributions
        </span>
        <span className="font-mono text-[11px] text-[#948F85]/75 light:text-neutral-500">
          {merged} merged · {open} open · {closed} closed
        </span>
      </div>
      <div className="divide-y divide-[#948F85]/10 light:divide-neutral-200 border border-[#948F85]/15 light:border-neutral-200">
        {featured.map((pr) => (
          <a
            key={pr.number}
            href={`${repo}/pull/${pr.number}`}
            target="_blank"
            rel="noreferrer"
            className="group flex items-start gap-3 px-4 py-3 hover:bg-[#F3E6C4]/[0.03] light:hover:bg-neutral-900/[0.03] transition-colors"
          >
            <span className="font-mono text-[11px] text-[#948F85]/75 light:text-neutral-500 shrink-0 mt-0.5">
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
      <a
        href={`${repo}/pulls/Bielcx`}
        target="_blank"
        rel="noreferrer"
        className="mt-3 inline-flex items-center gap-1 font-mono text-[11px] text-[#948F85]/75 light:text-neutral-500 hover:text-[#F3E6C4] light:hover:text-neutral-900 transition-colors"
      >
        Ver todas as {total} PRs no GitHub <ArrowUpRight className="size-3" weight="bold" />
      </a>
    </div>
  );
}

export default function SelectedWork() {
  const [active, setActive] = useState<Project | null>(null);
  const panelRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  // Lightbox — click a project screenshot to see it uncropped. Separate from
  // the panel's own open/close state since it layers on top of it.
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const lightboxRef = useRef<HTMLDivElement>(null);
  const lightboxCloseRef = useRef<HTMLButtonElement>(null);
  const screenshotTriggerRef = useRef<HTMLButtonElement | null>(null);

  const openProject = useCallback(
    (project: Project, trigger: HTMLElement) => {
      triggerRef.current = trigger;
      setActive(project);
    },
    []
  );

  const close = useCallback(() => setActive(null), []);
  const closeLightbox = useCallback(() => setLightboxOpen(false), []);

  // Esc closes; Tab is trapped inside whichever layer is on top (basic focus
  // trap — dialog semantics without pulling in a whole a11y library).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!active) return;

      if (e.key === "Escape") {
        if (lightboxOpen) {
          closeLightbox();
          return;
        }
        close();
        return;
      }

      if (e.key === "Tab") {
        const scope = lightboxOpen ? lightboxRef.current : panelRef.current;
        if (!scope) return;
        const focusable = scope.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const list = Array.from(focusable);
        const first = list[0];
        const last = list[list.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, close, lightboxOpen, closeLightbox]);

  // Move focus into the lightbox on open, back to the screenshot button on
  // close — same pattern as the panel's own focus management below.
  useEffect(() => {
    if (lightboxOpen) {
      const raf = requestAnimationFrame(() => lightboxCloseRef.current?.focus());
      return () => cancelAnimationFrame(raf);
    }
    if (screenshotTriggerRef.current) {
      screenshotTriggerRef.current.focus();
      screenshotTriggerRef.current = null;
    }
  }, [lightboxOpen]);

  useEffect(() => {
    document.body.style.overflow = active ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [active]);

  // Move focus into the panel on open, return it to the row that opened it
  // on close — keyboard users never lose their place.
  useEffect(() => {
    if (active) {
      const raf = requestAnimationFrame(() => closeButtonRef.current?.focus());
      return () => cancelAnimationFrame(raf);
    }
    if (triggerRef.current) {
      triggerRef.current.focus();
      triggerRef.current = null;
    }
  }, [active]);

  return (
    <>
      <section id="work" className="mx-auto max-w-5xl px-8 py-24">
        <div className="mb-10 flex items-baseline justify-between border-b border-[#948F85]/15 light:border-neutral-200 pb-4">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#b497cf] light:text-[#8a6bab]">
            Selected Work
          </p>
          <p className="font-mono text-xs text-[#948F85]/75 light:text-neutral-500">
            0{projects.length} — projects
          </p>
        </div>

        <div className="border-t border-[#948F85]/15 light:border-neutral-200">
          {projects.map((project, i) => (
            <button
              key={project.slug}
              onClick={(e) => openProject(project, e.currentTarget)}
              className="group block w-full cursor-pointer border-b border-[#948F85]/15 light:border-neutral-200 py-7 text-left focus-visible:outline-2 focus-visible:outline-[#b497cf]"
            >
              <span className="flex items-start gap-6">
                <span className="w-7 shrink-0 pt-3.5 font-mono text-xs text-[#948F85]/60 light:text-neutral-400 transition-colors group-hover:text-[#b497cf] group-focus-visible:text-[#b497cf] light:group-hover:text-[#8a6bab] light:group-focus-visible:text-[#8a6bab]">
                  0{i + 1}
                </span>
                <span className="block flex-1 transition-transform duration-[350ms] ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:translate-x-3 group-focus-visible:translate-x-3 motion-reduce:transform-none motion-reduce:transition-none">
                  <span className="text-[clamp(28px,3vw,44px)] font-extrabold uppercase leading-[1.1] tracking-[-0.02em] text-[#F3E6C4] light:text-neutral-900 transition-colors group-hover:text-[#b497cf] group-focus-visible:text-[#b497cf] light:group-hover:text-[#8a6bab] light:group-focus-visible:text-[#8a6bab]">
                    {project.title}
                  </span>
                </span>
                {project.badgeShort && (
                  <span className="shrink-0 whitespace-nowrap pt-4 font-mono text-[10px] uppercase tracking-[0.08em] text-[#4ade80]">
                    {project.badgeShort}
                  </span>
                )}
                {project.wip && (
                  <span className="shrink-0 whitespace-nowrap pt-4 font-mono text-[10px] uppercase tracking-[0.08em] text-[#4ade80]">
                    wip
                  </span>
                )}
                <span className="shrink-0 pt-3.5 font-mono text-xs text-[#948F85]/60 light:text-neutral-400">
                  {project.year}
                </span>
                <ArrowUpRight
                  className="shrink-0 mt-2 size-5 text-[#b497cf] light:text-[#8a6bab] opacity-0 -translate-x-2 translate-y-2 transition-all duration-[350ms] delay-100 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 motion-reduce:transform-none motion-reduce:transition-none"
                  weight="bold"
                />
              </span>
              <span className="block max-h-0 overflow-hidden pl-[52px] opacity-0 transition-all duration-[400ms] ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:max-h-24 group-hover:opacity-100 group-focus-visible:max-h-24 group-focus-visible:opacity-100 motion-reduce:transition-none">
                <span className="block max-w-[560px] pt-3 font-mono text-[13px] leading-relaxed text-[#948F85] light:text-neutral-500">
                  {project.outcome}
                </span>
                {project.badge && (
                  <span className="block pt-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-[#4ade80]">
                    {project.badge}
                  </span>
                )}
              </span>
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
              ref={panelRef}
              key="panel"
              role="dialog"
              aria-modal="true"
              aria-label={`Projeto: ${active.title}`}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed right-0 top-0 z-50 h-full w-full md:w-[48vw] md:min-w-[560px] bg-[#141413] light:bg-[#fafafa] border-l border-[#948F85]/15 light:border-neutral-200 overflow-y-auto"
            >
              <button
                ref={closeButtonRef}
                onClick={close}
                aria-label="Fechar painel"
                className="fixed md:absolute top-3 right-3 z-20 flex size-11 cursor-pointer items-center justify-center text-[#b497cf] light:text-[#8a6bab] hover:text-[#F3E6C4] light:hover:text-neutral-900 transition-colors"
              >
                <X className="size-5" weight="bold" />
              </button>

              {active.terminalHeader ? (
                <div className="relative h-56 w-full overflow-hidden border-b border-[#948F85]/15 light:border-neutral-200">
                  <Galaxy
                    className="absolute inset-0"
                    color="#b497cf"
                    tintStrength={1}
                    density={1}
                    glowIntensity={0.3}
                    saturation={0}
                    hueShift={140}
                    twinkleIntensity={0.3}
                    rotationSpeed={0.1}
                    repulsionStrength={2}
                    autoCenterRepulsion={0}
                    starSpeed={0.5}
                    speed={1}
                    mouseInteraction
                    mouseRepulsion
                    transparent
                  />
                  {/* pointer-events-none — these sit on top of the Galaxy
                      canvas purely for the gradient/title legibility, and
                      would otherwise swallow the mousemove events Galaxy
                      needs for its hover repulsion effect. */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#141413] via-transparent to-[#141413]/40" />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 px-8 pb-6">
                    <span
                      className="font-mono text-xs uppercase tracking-[0.2em]"
                      style={{ color: active.terminalTint ?? "#b497cf" }}
                    >
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
                {/* Live/Source — the primary "prove it's real" action, moved
                    up from the bottom of the panel so it's not hidden below
                    the fold on shorter screens. */}
                <div className="flex gap-3 font-mono text-[11px] uppercase tracking-[0.08em]">
                  <a
                    href={active.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex min-h-11 items-center gap-1.5 border border-[#b497cf]/40 px-4 text-[#b497cf] light:text-[#8a6bab] hover:text-[#F3E6C4] hover:border-[#F3E6C4]/50 light:hover:text-neutral-900 transition-colors"
                  >
                    Live <ArrowUpRight className="size-3" weight="bold" />
                  </a>
                  <a
                    href={active.repo}
                    target="_blank"
                    rel="noreferrer"
                    className="flex min-h-11 items-center gap-1.5 border border-[#948F85]/25 px-4 text-[#948F85] hover:text-[#F3E6C4] hover:border-[#F3E6C4]/50 light:text-neutral-500 light:hover:text-neutral-900 transition-colors"
                  >
                    Source <ArrowUpRight className="size-3" weight="bold" />
                  </a>
                </div>

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

                {/* ponytail: two device mocks side by side instead of one flat
                    screenshot — Safari (desktop) wider on the left, iPhone
                    (mobile) narrower on the right, both height-matched so
                    neither towers over the other (their native aspect ratios
                    are wildly different: Safari ~1.6:1, iPhone ~0.49:1).
                    Both currently render the same source image as a
                    placeholder — real mobile-viewport screenshots per
                    project are still TODO (see project data/screenshotSrc). */}
                <div className="flex w-full items-center justify-center gap-12 overflow-x-auto py-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      screenshotTriggerRef.current = e.currentTarget;
                      setLightboxOpen(true);
                    }}
                    aria-label={`Ampliar preview desktop — ${active.title}`}
                    className="group/shot shrink-0 focus-visible:outline-2 focus-visible:outline-[#b497cf]"
                  >
                    <Safari
                      url={hostLabel(active.href)}
                      imageSrc={active.screenshotSrc}
                      style={{ height: "14rem", width: "auto" }}
                      className="transition-opacity group-hover/shot:opacity-80"
                    />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      screenshotTriggerRef.current = e.currentTarget;
                      setLightboxOpen(true);
                    }}
                    aria-label={`Ampliar preview mobile — ${active.title}`}
                    className="group/shot shrink-0 focus-visible:outline-2 focus-visible:outline-[#b497cf]"
                  >
                    <Iphone
                      src={active.screenshotMobileSrc ?? active.screenshotSrc}
                      style={{ height: "14rem", width: "auto" }}
                      className="transition-opacity group-hover/shot:opacity-80"
                    />
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {active.stack.map((t) => (
                    <StackBadge key={t} label={t} />
                  ))}
                </div>

                {active.contributions && (
                  <ContributionsSection
                    repo={active.repo}
                    items={active.contributions}
                    stats={active.contributionStats}
                  />
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {active && lightboxOpen && (
          <motion.div
            key="lightbox"
            ref={lightboxRef}
            role="dialog"
            aria-modal="true"
            aria-label={`Screenshot ampliado — ${active.title}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={closeLightbox}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-6 md:p-16"
          >
            <img
              src={active.screenshotSrc}
              alt={`${active.title} — screenshot ampliado`}
              onClick={(e) => e.stopPropagation()}
              className="max-h-full max-w-full object-contain"
            />
            <button
              ref={lightboxCloseRef}
              onClick={closeLightbox}
              aria-label="Fechar screenshot ampliado"
              className="fixed top-3 right-3 md:top-6 md:right-6 flex size-11 items-center justify-center bg-[#141413]/70 border border-[#948F85]/25 text-[#F3E6C4] hover:bg-[#141413]/95 hover:border-[#F3E6C4]/50 transition-colors"
            >
              <X className="size-5" weight="bold" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
