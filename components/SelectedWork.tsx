// components/SelectedWork.tsx — RSC, no "use client" needed.
// Drop <SelectedWork /> into page.tsx where the current #work section is.

import { ArrowUpRight } from "@phosphor-icons/react/ssr";

const shot = (url: string) =>
  `https://api.microlink.io/?url=${url}&screenshot=true&meta=false&embed=screenshot.url`;

const projects = [
  {
    title: "SkateHive",
    description:
      "Plataforma Web3 de skateboarding — rede social descentralizada com criação de conteúdo, curadoria de vídeos e recompensas em crypto. Blockchain Hive.",
    stack: ["Next.js", "TypeScript", "Web3", "Hive Blockchain"],
    href: "https://skatehive.app/home",
    repo: "https://github.com/SkateHive/skatehive3.0",
    // ponytail: skatehive.app sits behind a bot-verification checkpoint that
    // serves screenshot bots a blank interstitial instead of the real page, so
    // the live microlink screenshot never renders. Using a pre-captured static
    // capture of /home instead — swap back to shot(href) if the checkpoint is
    // ever lifted.
    screenshotSrc: "/skatehive-preview.png",
  },
  {
    title: "Fiveout Dashboard",
    description:
      "Painel fullstack para loja de streetwear — cadastro de peças, controle de estoque em tempo real e catálogo público com integração no WhatsApp. Auth SSR com Supabase.",
    stack: ["Next.js", "TypeScript", "Supabase", "PostgreSQL", "Tailwind"],
    href: "https://www.fiveoout.com.br",
    repo: "https://github.com/Bielcx/fiveout-dashboard",
  },
  {
    title: "Mirante Skateshop",
    description:
      "Landing page demo para skateshop real — modelo 3D interativo de skate com parallax de mouse, animações scroll-triggered e estética street culture.",
    stack: ["React 19", "Three.js", "R3F", "Framer Motion", "Vite"],
    href: "https://mirante-skateshop.vercel.app",
    repo: "https://github.com/Bielcx/mirante-skateshop",
  },
  {
    title: "VentureFi",
    description:
      "TCC em Sistemas de Informação (FIAP) — plataforma SaaS fullstack de gestão financeira, com sugestões inteligentes de investimento e relatórios interativos.",
    stack: ["Angular 20", "TypeScript", "Angular Material", "Chart.js"],
    href: "https://venturefi-gikn.vercel.app",
    repo: "https://github.com/Bielcx/VentureFi",
    screenshotSrc: shot("https://venturefi-gikn.vercel.app/platform/dashboard"),
  },
];

// ponytail: CSS-only take on magicui's BorderBeam (no motion/react needed) —
// keyframe `border-beam` lives in globals.css.
function BorderBeam({ delay = 0 }: { delay?: number }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 border border-transparent [mask-clip:padding-box,border-box] [mask-composite:intersect] [mask-image:linear-gradient(transparent,transparent),linear-gradient(#000,#000)]"
    >
      <div
        className="absolute aspect-square w-24 bg-gradient-to-l from-[#b497cf] via-[#b497cf]/40 to-transparent light:from-[#8a6bab] light:via-[#8a6bab]/40"
        style={{
          offsetPath: "rect(0 auto auto 0)",
          animation: `border-beam 9s linear infinite`,
          animationDelay: `${delay}s`,
        }}
      />
    </div>
  );
}

function StackBadge({ label }: { label: string }) {
  return (
    <span className="whitespace-nowrap font-mono text-[11px] leading-none text-[#948F85]/90 light:text-neutral-500 border border-[#948F85]/25 light:border-neutral-300 px-2 py-1">
      {label}
    </span>
  );
}

function CardLinks({ href, repo }: { href: string; repo: string }) {
  return (
    <div className="mt-auto flex gap-6 pt-6 font-mono text-[11px] uppercase tracking-[0.08em]">
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-1 whitespace-nowrap text-[#b497cf] light:text-[#8a6bab] hover:text-[#F3E6C4] light:hover:text-neutral-900 transition-colors"
      >
        Live <ArrowUpRight className="size-3" weight="bold" />
      </a>
      <a
        href={repo}
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-1 whitespace-nowrap text-[#948F85]/70 light:text-neutral-400 hover:text-[#F3E6C4] light:hover:text-neutral-900 transition-colors"
      >
        Source <ArrowUpRight className="size-3" weight="bold" />
      </a>
    </div>
  );
}

function Screenshot({
  href,
  title,
  screenshotSrc,
  className = "",
}: {
  href: string;
  title: string;
  screenshotSrc?: string;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden bg-[#1a1a18] light:bg-neutral-100 ${className}`}>
      <img
        src={screenshotSrc ?? shot(href)}
        alt={`${title} — preview`}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover object-top grayscale contrast-105 brightness-[.85] transition-[filter,transform] duration-500 group-hover:grayscale-0 group-hover:contrast-100 group-hover:brightness-100 group-hover:scale-[1.03]"
      />
    </div>
  );
}

export default function SelectedWork() {
  return (
    <section id="work" className="mx-auto max-w-5xl px-8 py-24">
      {/* Header */}
      <div className="mb-10 flex items-baseline justify-between border-b border-[#948F85]/15 light:border-neutral-200 pb-4">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#b497cf] light:text-[#8a6bab]">
          Selected Work
        </p>
        <p className="font-mono text-xs text-[#948F85]/50 light:text-neutral-400">
          0{projects.length} — projects
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((project, i) => (
          <article
            key={project.title}
            className="group relative flex flex-col border border-[#948F85]/15 light:border-neutral-200 bg-[#F3E6C4]/[0.015] light:bg-neutral-900/[0.02] transition-colors hover:border-[#948F85]/35"
          >
            <BorderBeam delay={i * 2.25} />
            <Screenshot
              href={project.href}
              title={project.title}
              screenshotSrc={project.screenshotSrc}
              className="aspect-video border-b border-[#948F85]/15 light:border-neutral-200"
            />
            <div className="flex flex-1 flex-col p-6">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-[11px] text-[#948F85]/50 light:text-neutral-300">
                  0{i + 1}
                </span>
                <h3 className="text-[17px] font-bold tracking-tight text-[#F3E6C4] light:text-neutral-900 transition-colors group-hover:text-[#b497cf] light:group-hover:text-[#8a6bab]">
                  {project.title}
                </h3>
              </div>
              <p className="mt-3 text-[13px] leading-relaxed text-[#948F85] light:text-neutral-600">
                {project.description}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {project.stack.map((t) => (
                  <StackBadge key={t} label={t} />
                ))}
              </div>
              <CardLinks href={project.href} repo={project.repo} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
