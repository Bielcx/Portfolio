import Image from "next/image";
import { ArrowUUpLeft, EnvelopeSimple, XLogo } from "@phosphor-icons/react";

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
 * 64px, e a caixa da direita em 300×420 — que era o frame de captura e hoje é o
 * pacote de figurinha. A partir de 900px ela fica ao lado do conteúdo; abaixo
 * disso empilham.
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
              comercial, me achar fora daqui.

              Só os ícones, os três iguais — o handoff tinha uma pílula cheia e
              uma vazada aqui, e o usuário pediu a fileira. O `-ml` puxa a
              fileira de volta para a margem do texto: cada ícone de 18px vive
              centrado numa área de toque de 44px, então sobram 13px de respiro
              à esquerda do primeiro.

              O `title` não é decoração: sem o rótulo, "envelope" e "seta para
              trás" são adivinhação. Ele dá o balão no mouse, e o `aria-label`
              dá o nome no leitor de tela. */}
          <div className="-ml-[13px] mt-1 flex items-center">
            <a
              href={`mailto:${profile.email}`}
              aria-label="Entrar em contato por email"
              title="entrar em contato"
              className="flex size-11 items-center justify-center text-brand transition-colors hover:text-ink"
            >
              <EnvelopeSimple size={18} weight="bold" />
            </a>
            <a
              href={profile.web2}
              aria-label="Ir para o portfólio web2"
              title="web2"
              className="flex size-11 items-center justify-center text-brand transition-colors hover:text-ink"
            >
              <ArrowUUpLeft size={18} weight="bold" />
            </a>
            <a
              href={profile.x}
              target="_blank"
              rel="noreferrer"
              aria-label="Perfil no X"
              title="x"
              className="flex size-11 items-center justify-center text-brand transition-colors hover:text-ink"
            >
              <XLogo size={18} weight="bold" />
            </a>
          </div>
        </div>

        {/* O PACOTE DE FIGURINHA — o boneco é a arte impressa nele.

            O papelão é escuro NOS DOIS TEMAS, e isso não é escolha de cor: o
            recorte do avatar tem a camiseta preta transparente, então qualquer
            fundo claro atrás vazaria através da figura. Aqui isso deixou de ser
            uma restrição e virou o material — pacote preto com prensa terracota.

            No estreito a altura é `35svh` em vez de fixa: com 340px o pé do
            boneco caía abaixo da dobra em aparelho pequeno. */}
        <div className="relative h-[35svh] max-h-[340px] w-[240px] shrink-0 self-center overflow-hidden rounded-xl bg-[linear-gradient(180deg,#14120f,#000)] min-[900px]:h-[420px] min-[900px]:max-h-none min-[900px]:w-[300px]">
          {/* A prensa de cima, com a linha de rasgar logo abaixo dela. */}
          <div className="pack-crimp absolute inset-x-0 top-0 z-10 h-[26px] border-b border-dashed border-black/40 bg-brand" />

          <Image
            src="/biel-avatar.png"
            alt=""
            width={240}
            height={352}
            priority
            className="absolute bottom-[38px] left-1/2 h-[72%] w-auto -translate-x-1/2 object-contain min-[900px]:h-[330px]"
          />

          {/* O rótulo impresso, sobre um degradê que o separa da arte. */}
          <div className="absolute inset-x-0 bottom-[26px] flex justify-between bg-[linear-gradient(to_top,#000_60%,transparent)] px-5 pb-2.5 pt-6 text-[11px] tracking-[0.1em] text-[#645c50]">
            <span>bielcx · série 01</span>
            <span className="text-[#aebf92]">● foil</span>
          </div>

          {/* A prensa de baixo. */}
          <div className="pack-crimp absolute inset-x-0 bottom-0 z-10 h-[26px] bg-brand" />

          <div
            aria-hidden
            className="foil-sweep pointer-events-none absolute inset-0 z-20"
          />
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
