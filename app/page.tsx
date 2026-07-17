import HeroSection from "@/components/HeroSection";
import SelectedWork from "@/components/SelectedWork";
import { PortfolioWrapper } from "@/components/PortfolioWrapper";
import { AnimatedThemeToggler } from "@/components/AnimatedThemeToggler";

const profile = {
  name: "Gabriel Cavalcanti",
  role: "Full Stack Developer",
  location: "Brasil",
  email: "biel.cavalcanti1@hotmail.com",
  github: "https://github.com/Bielcx",
  linkedin: "https://www.linkedin.com/in/gabrielcavalcanti-dev",
};


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

          <SelectedWork />

          <section
            id="contact"
            className="mx-auto max-w-5xl px-8 py-24 border-t border-[#948F85]/15 light:border-neutral-200"
          >
            <p className="font-mono text-xs text-[#948F85]/70 light:text-neutral-400 tracking-[0.2em] uppercase mb-8">
              Contact
            </p>

            <div className="border border-[#948F85]/20 light:border-neutral-300 bg-[#111110] light:bg-neutral-50 p-8 font-mono text-sm leading-loose text-[#948F85] light:text-neutral-600">
              <p>
                <span className="text-[#4ade80]">$</span> gabriel contact --new-project
              </p>
              <p className="text-[#948F85]/70 light:text-neutral-500">
                Respondo projetos sérios de desenvolvimento web, mobile e consultoria técnica.
              </p>
              <p className="mt-4">
                <span className="text-[#4ade80]">→</span>{" "}
                <a
                  href={`mailto:${profile.email}`}
                  className="font-bold text-[#b497cf] light:text-[#8a6bab] hover:text-[#F3E6C4] light:hover:text-neutral-900 transition-colors"
                >
                  email
                </a>{" "}
                <span className="text-[#948F85]/60 light:text-neutral-400">
                  // {profile.email}
                </span>
              </p>
              <p>
                <span className="text-[#4ade80]">→</span>{" "}
                <a
                  href="https://wa.me/5511960137983"
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-[#b497cf] light:text-[#8a6bab] hover:text-[#F3E6C4] light:hover:text-neutral-900 transition-colors"
                >
                  whatsapp
                </a>{" "}
                <span className="text-[#948F85]/60 light:text-neutral-400">
                  // resposta mais rápida
                </span>
                <span
                  aria-hidden
                  className="ml-2 inline-block h-[18px] w-[9px] align-middle bg-[#b497cf] animate-[blink_1.1s_step-end_infinite] motion-reduce:animate-none"
                />
              </p>
            </div>

            <div className="flex gap-8 mt-6 font-mono text-xs">
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer"
                className="flex min-h-11 items-center text-[#948F85] hover:text-[#F3E6C4] light:text-neutral-500 light:hover:text-neutral-900 transition-colors"
              >
                GitHub ↗
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
                className="flex min-h-11 items-center text-[#948F85] hover:text-[#F3E6C4] light:text-neutral-500 light:hover:text-neutral-900 transition-colors"
              >
                LinkedIn ↗
              </a>
            </div>
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
