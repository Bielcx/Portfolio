import HeroSection from "@/components/HeroSection";
import { PortfolioWrapper } from "@/components/PortfolioWrapper";
import { ArrowUpRight } from "@phosphor-icons/react/ssr";
import { AnimatedThemeToggler } from "@/components/AnimatedThemeToggler";

const profile = {
  name: "Gabriel Cavalcanti",
  role: "Full Stack Developer",
  location: "Brasil",
  email: "biel.cavalcanti1@hotmail.com",
  github: "https://github.com/Bielcx",
  linkedin: "https://www.linkedin.com/in/gabrielcavalcanti-dev",
};

const projects = [
  {
    title: "SkateHive",
    description:
      "Plataforma Web3 de skateboarding — rede social descentralizada com criação de conteúdo, curadoria de vídeos e recompensas em crypto para skaters do mundo todo. Blockchain Hive.",
    stack: ["Next.js", "TypeScript", "Web3", "Hive Blockchain"],
    href: "https://skatehive.app",
    repo: "https://github.com/SkateHive/skatehive3.0",
  },
  {
    title: "Fiveout Dashboard",
    description:
      "Painel fullstack para loja de streetwear — cadastro de peças, controle de estoque em tempo real e catálogo público com integração direta no WhatsApp. Autenticação SSR com Supabase.",
    stack: ["Next.js", "TypeScript", "Supabase", "PostgreSQL", "Tailwind"],
    href: "https://www.fiveoout.com.br",
    repo: "https://github.com/Bielcx/fiveout-dashboard",
  },
  {
    title: "Mirante Skateshop",
    description:
      "Landing page demo para skateshop real — modelo 3D interativo de skate com parallax de mouse, animações scroll-triggered e estética street culture.",
    stack: [
      "React 19",
      "TypeScript",
      "Three.js",
      "React Three Fiber",
      "Framer Motion",
      "Vite",
    ],
    href: "https://mirante-skateshop.vercel.app",
    repo: "https://github.com/Bielcx/mirante-skateshop",
  },
];

export default function Home() {
  return (
    <PortfolioWrapper>
      <main className="relative w-full min-h-screen bg-[#141413] text-[#F3E6C4] light:bg-[#fafafa] light:text-neutral-900">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <div className="grain absolute inset-0 opacity-25 mix-blend-overlay" />
        </div>

        <AnimatedThemeToggler className="fixed top-6 right-6 z-50" />

        <div className="relative">
          <HeroSection profile={profile} />

          <section id="work" className="mx-auto max-w-5xl px-8 py-24">
            <p className="font-mono text-xs text-[#b497cf] tracking-[0.2em] uppercase mb-12">
              Selected Work
            </p>

            <div className="divide-y divide-[#948F85]/15 light:divide-neutral-200">
              {projects.map((project, i) => (
                <a
                  key={project.title}
                  href={project.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-start justify-between gap-8 py-8 hover:bg-[#F3E6C4]/[0.02] light:hover:bg-neutral-900/[0.03] transition-colors -mx-4 px-4"
                >
                  <div className="flex gap-6">
                    <span className="font-mono text-xs text-[#948F85]/50 light:text-neutral-300 mt-1 w-4 shrink-0">
                      0{i + 1}
                    </span>
                    <div>
                      <h3 className="text-base font-semibold text-[#F3E6C4] light:text-neutral-900 group-hover:text-[#b497cf] light:group-hover:text-[#8a6bab] transition-colors mb-2">
                        {project.title}
                      </h3>
                      <p className="text-sm text-[#948F85] light:text-neutral-600 leading-6 max-w-md">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-4">
                        {project.stack.map((t) => (
                          <span
                            key={t}
                            className="font-mono text-xs text-[#948F85]/70 light:text-neutral-400"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <ArrowUpRight
                    className="size-4 text-[#948F85]/50 light:text-neutral-300 group-hover:text-[#b497cf] transition-colors mt-1 shrink-0"
                    weight="bold"
                  />
                </a>
              ))}
            </div>
          </section>

          <section
            id="contact"
            className="mx-auto max-w-5xl px-8 py-24 border-t border-[#948F85]/15 light:border-neutral-200"
          >
            <p className="font-mono text-xs text-[#948F85]/70 light:text-neutral-400 tracking-[0.2em] uppercase mb-8">
              Contact
            </p>
            <h2 className="text-3xl font-black text-[#F3E6C4] light:text-neutral-900 tracking-tight mb-4">
              Tem um projeto em mente?
            </h2>
            <p className="text-sm text-[#948F85] light:text-neutral-600 max-w-md mb-10 leading-7">
              Me manda um email. Respondo projetos sérios de desenvolvimento
              web, mobile e consultoria técnica.
            </p>
            <a
              href={`mailto:${profile.email}`}
              className="font-mono text-sm text-[#b497cf] light:text-[#8a6bab] hover:text-[#F3E6C4] light:hover:text-neutral-900 transition-colors"
            >
              {profile.email} →
            </a>
          </section>

          <footer className="mx-auto max-w-5xl px-8 py-8 border-t border-[#948F85]/15 light:border-neutral-200 flex items-center justify-between">
            <span className="font-mono text-xs text-[#948F85]/50 light:text-neutral-400">
              © {new Date().getFullYear()} Gabriel Cavalcanti
            </span>
            <span className="font-mono text-xs text-[#948F85]/50 light:text-neutral-400">
              Built with Next.js
            </span>
          </footer>
        </div>
      </main>
    </PortfolioWrapper>
  );
}
