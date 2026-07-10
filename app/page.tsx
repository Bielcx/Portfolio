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
