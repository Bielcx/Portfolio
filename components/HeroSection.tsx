import Image from "next/image";

type Profile = {
  email: string;
  x: string;
  /** O portfólio comercial — o destino do CTA `← web2`. */
  web2: string;
};

/** As três linhas chave/valor. Texto fixo, vindo do handoff. */
const rows = [
  ["role", "Full Stack Developer · Web3"],
  ["stack", "front · back · on-chain · agentes IA"],
  ["chain", "Hive — open source em produção"],
];

/**
 * A telemetria do rodapé é DECORATIVA e estática, como o handoff pede. Não são
 * medidas de nada — se um dia virarem, elas passam a vir de fora daqui.
 */
const telemetry = ["lat 38ms", "node br-01", "uptime 99.9%"];

/**
 * O HERO — a primeira tela inteira, e só ela.
 *
 * `min-h-svh` não é enfeite: o hero tem barra de contexto em cima e barra de
 * status embaixo, e as duas só fazem sentido nas bordas da tela. Sem a altura
 * travada, a seção seguinte sobe e aparece por baixo da barra de status, que é
 * exatamente o que ela não pode fazer. `svh` (e não `vh`) é a viewport com a
 * barra do Safari EXPANDIDA — o pior caso, e o estado em que a página abre.
 *
 * O fundo NÃO mora aqui. As quatro camadas do handoff (holofote, banho de
 * acento, grão e vinheta) cobrem a página inteira, no `page.tsx` — o hero é uma
 * seção sobre esse fundo, não uma caixa com fundo próprio.
 *
 * As medidas são as do handoff: sarjeta de 40px nas duas barras, conteúdo em
 * 64px, frame de 300×420. A partir de 900px conteúdo e frame ficam lado a lado;
 * abaixo disso empilham.
 */
export default function HeroSection({ profile }: { profile: Profile }) {
  return (
    <section
      id="home"
      aria-label="Bielcx"
      className="relative mx-auto flex min-h-svh w-full max-w-[1200px] flex-col justify-between"
    >
      {/* BARRA DE CONTEXTO. O pr extra no estreito abre espaço para o toggle de
          tema, que é `fixed` em `top-6 right-6` e cairia em cima do `online`. */}
      <div className="flex items-center justify-between border-b border-line px-6 pr-12 py-5 text-xs tracking-[0.1em] text-ink-faint min-[900px]:px-10">
        <span>~/bielcx/portfolio</span>
        <span className="flex gap-[22px]">
          {/* `full-stack` é o primeiro a sair no estreito: é o item redundante,
              a linha `role` logo abaixo diz o mesmo com mais precisão. */}
          <span className="hidden min-[900px]:inline">full-stack</span>
          <span>web3</span>
          <span className="text-ok">online</span>
        </span>
      </div>

      <div className="flex flex-1 flex-col items-start justify-center gap-12 px-6 py-12 min-[900px]:flex-row min-[900px]:items-center min-[900px]:justify-between min-[900px]:px-16 min-[900px]:py-10">
        <div className="flex max-w-[660px] flex-col items-start gap-6">
          <p className="flex items-center gap-2.5 text-[13px] tracking-[0.08em] text-ok">
            <span className="opacity-70">$</span>
            <span>whoami</span>
          </p>

          <h1 className="font-display text-[clamp(56px,11vw,112px)] leading-[0.94] tracking-[-0.02em] uppercase text-ink">
            Bielcx
          </h1>

          <dl className="flex flex-col gap-[9px] text-sm leading-normal">
            {rows.map(([key, value]) => (
              <div key={key} className="flex gap-[18px]">
                <dt className="w-[76px] shrink-0 text-ink-faint">{key}</dt>
                <dd className="text-ink-muted">{value}</dd>
              </div>
            ))}
          </dl>

          {/* Os três caminhos, em ordem de intenção: falar comigo, ver o lado
              comercial, me achar fora daqui. */}
          <div className="mt-1 flex flex-wrap items-center gap-3">
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center gap-2.5 rounded-full bg-brand px-[26px] py-3.5 text-sm font-medium tracking-[0.04em] text-on-brand transition-colors hover:bg-[#b2622d] active:bg-[#8c491a]"
            >
              entrar em contato ↗
            </a>
            <a
              href={profile.web2}
              className="inline-flex items-center gap-2.5 rounded-full border border-line-strong px-6 py-[13px] text-sm tracking-[0.04em] text-ink-muted transition-colors hover:bg-ink/[0.07]"
            >
              ← web2
            </a>
            <a
              href={profile.x}
              target="_blank"
              rel="noreferrer"
              aria-label="Perfil no X"
              className="inline-flex items-center rounded-full px-[18px] py-[13px] text-sm tracking-[0.04em] text-ink-faint transition-colors hover:text-ink"
            >
              x
            </a>
          </div>
        </div>

        {/* O FRAME DE CAPTURA — escuro NOS DOIS TEMAS, e isso não é escolha de
            cor: o recorte do avatar tem a camiseta preta transparente, então
            qualquer fundo claro atrás vazaria através da figura.

            No estreito a altura é `35svh` em vez de fixa: com 340px o pé do
            boneco caía abaixo da dobra em aparelho pequeno. */}
        <div className="relative h-[35svh] max-h-[340px] w-[240px] shrink-0 self-center overflow-hidden rounded-3xl border border-dashed border-[color:var(--frame-border)] bg-[linear-gradient(180deg,#14120f,#000)] min-[900px]:h-[420px] min-[900px]:max-h-none min-[900px]:w-[300px]">
          <div className="scan-line absolute inset-x-0 top-0 h-16 bg-[linear-gradient(180deg,rgba(143,160,115,0.22),transparent)]" />

          <Image
            src="/biel-avatar.png"
            alt=""
            width={240}
            height={352}
            priority
            className="absolute bottom-[22px] left-1/2 h-[80%] w-auto -translate-x-1/2 object-contain min-[900px]:h-[352px]"
          />

          {/* Os quatro cantos em L. */}
          <span className="absolute left-4 top-3.5 size-[18px] border-l-2 border-t-2 border-brand" />
          <span className="absolute right-4 top-3.5 size-[18px] border-r-2 border-t-2 border-brand" />
          <span className="absolute bottom-3.5 left-4 size-[18px] border-b-2 border-l-2 border-brand" />
          <span className="absolute bottom-3.5 right-4 size-[18px] border-b-2 border-r-2 border-brand" />

          <div className="absolute inset-x-0 bottom-0 flex justify-between bg-[linear-gradient(to_top,#000_60%,transparent)] px-5 py-3.5 text-[11px] tracking-[0.1em] text-[#645c50]">
            <span>agent.bielcx</span>
            <span className="text-[#aebf92]">● live</span>
          </div>
        </div>
      </div>

      {/* BARRA DE STATUS */}
      <div className="flex items-center justify-between border-t border-line px-6 py-[18px] text-[11px] tracking-[0.12em] text-ink-faint min-[900px]:px-10">
        <span className="flex gap-6 min-[900px]:gap-[26px]">
          {telemetry.map((item) => (
            <span
              key={item}
              className={
                item.startsWith("uptime") ? "hidden min-[900px]:inline" : undefined
              }
            >
              {item}
            </span>
          ))}
        </span>
        <span>2026</span>
      </div>
    </section>
  );
}
