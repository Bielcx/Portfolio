import HeroSection from "@/components/HeroSection";
import SelectedWork from "@/components/SelectedWork";
import { AnimatedThemeToggler } from "@/components/AnimatedThemeToggler";

const profile = {
  name: "Gabriel Cavalcanti",
  location: "Brasil",
  email: "biel.cavalcanti1@hotmail.com",
  github: "https://github.com/Bielcx",
  x: "https://x.com/bielthegoat",
  // O portfólio comercial — o outro lado do portal, e o destino do `← web2`.
  web2: "https://gabriel.doabridge.com",
};


export default function Home() {
  return (
      <main className="relative w-full min-h-screen overflow-hidden bg-surface text-ink">
        {/* O FUNDO — as quatro camadas do handoff, na ordem: holofote, banho de
            acento, grão e vinheta. Elas cobrem a PÁGINA INTEIRA, que é o ponto:
            o hero não é uma caixa com fundo próprio, é uma seção sobre este
            fundo.

            `absolute inset-0` e não `fixed`, e isso importa: preso na viewport,
            o gradiente de 120%×110% se refaz a cada tela e a vinheta pulsa em
            cima do conteúdo a cada rolagem — foi o que deixou tudo empoeirado
            na primeira tentativa. Esticado no documento, o mesmo gradiente se
            espalha pela altura toda e vira o que o handoff desenha. O
            `overflow-hidden` no <main> é o par disso. */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="bg-spot absolute inset-0" />
          <div className="bg-wash absolute inset-0" />
          <div className="grain absolute inset-0" />
          <div className="bg-vignette absolute inset-0" />
        </div>

        <AnimatedThemeToggler className="theme-toggle fixed top-6 right-6 z-50" />

        <div className="relative z-10">
          <HeroSection profile={profile} />

          <SelectedWork />

          <section
            id="contact"
            className="mx-auto w-full max-w-[1200px] px-6 min-[900px]:px-16 py-24 border-t border-line"
          >
            <p className="font-mono text-xs text-ink-faint tracking-[0.2em] uppercase mb-8">
              Contact
            </p>

            <div className="terminal-block border border-line-strong bg-surface-2 p-8 font-mono text-sm leading-loose text-ink-muted">
              <p>
                <span className="text-ok">$</span> bielcx contact --new-project
              </p>
              <p className="text-ink-faint">
                Tem um projeto em mente? Vamos conversar.
              </p>
              <p className="mt-4">
                <span className="text-ok">→</span>{" "}
                <a
                  href={`mailto:${profile.email}`}
                  className="font-bold text-brand hover:text-ink transition-colors"
                >
                  email
                </a>{" "}
                <span className="text-ink-faint">
                  // {profile.email}
                </span>
              </p>
              <p>
                <span className="text-ok">→</span>{" "}
                <a
                  href="https://wa.me/5511960137983"
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-brand hover:text-ink transition-colors"
                >
                  whatsapp
                </a>{" "}
                <span className="text-ink-faint">
                  // resposta mais rápida
                </span>
                <span
                  aria-hidden
                  className="ml-2 inline-block h-[18px] w-[9px] align-middle bg-brand animate-[blink_1.1s_step-end_infinite] motion-reduce:animate-none"
                />
              </p>
            </div>

            <div className="flex gap-8 mt-6 font-mono text-xs">
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer"
                className="flex min-h-11 items-center text-ink-muted hover:text-ink transition-colors"
              >
                GitHub ↗
              </a>
              <a
                href={profile.x}
                target="_blank"
                rel="noreferrer"
                className="flex min-h-11 items-center text-ink-muted hover:text-ink transition-colors"
              >
                X ↗
              </a>
            </div>
          </section>

          <footer className="mx-auto w-full max-w-[1200px] px-6 min-[900px]:px-16 py-8 border-t border-line flex items-center justify-between">
            <span className="font-mono text-xs text-ink-faint">
              © {new Date().getFullYear()} Gabriel Cavalcanti
            </span>
            <span className="font-mono text-xs text-ink-faint">
              Built with Next.js
            </span>
          </footer>
        </div>
      </main>
  );
}
