import Image from "next/image";
// O HeroSection é server component: a entrada raiz do phosphor é client-only
// (usa createContext) e quebra o `collect page data` do build. O `/ssr` é a
// mesma arte sem contexto.
import { ArrowUUpLeft, EnvelopeSimple, XLogo } from "@phosphor-icons/react/ssr";
import { MorphingText } from "./ui/morphing-text";

type Profile = {
  email: string;
  x: string;
  /** O portfólio comercial — o destino do CTA `← web2`. */
  web2: string;
};

/** As três linhas chave/valor. Texto fixo, vindo do handoff. */
const rows = [
  ["role", "Full Stack Developer · Web3"],
  ["scope", "end-to-end product — from interface to contract"],
  ["chain", "EVM · Solana · Hive — multichain, in production"],
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

          {/* O nick alterna entre o apelido e o nome. O `aria-label` no <h1> é
              o que segura o nome acessível: os dois <span> do MorphingText
              nascem VAZIOS e só recebem texto pelo rAF no cliente, então sem
              ele o <h1> chega vazio no HTML e para o leitor de tela.

              As sobrescritas de classe existem porque o padrão do Magic UI é
              centrado, `font-sans`, 40pt, `max-w-3xl` e de altura fixa — aqui é
              o nick da hero: à esquerda, Archivo Black, no mesmo clamp de
              antes. A caixa vem da cópia invisível dentro do componente, então
              aqui é só desligar as medidas dele (`h-auto`, `w-auto`,
              `max-w-none`) e herdar o tamanho de fonte do <h1>. */}
          <h1
            aria-label="Bielcx — Gabriel Cavalcanti"
            className="font-display text-[clamp(56px,11vw,112px)] leading-[0.94] tracking-[-0.02em] uppercase text-ink"
          >
            <MorphingText
              texts={["Bielcx", "Gabriel"]}
              className="mx-0 h-auto w-auto max-w-none text-left font-display text-[length:inherit] leading-[inherit] font-normal md:h-auto lg:text-[length:inherit]"
            />
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

        {/* O AGENT PACK — o boneco é a arte dentro do pacote de mylar.

            O artboard é fechado em 300x420 (as medidas de dentro são calibradas
            para essa caixa), então no estreito ele é ESCALADO, não remedido: o
            invólucro reserva os 240x336 que a escala de 0,8 ocupa, e o artboard
            encolhe a partir do canto superior esquerdo. Todo o desenho mora no
            `globals.css`, sob `.agent-pack`. */}
        <div className="h-[336px] w-[240px] shrink-0 self-center min-[900px]:h-[420px] min-[900px]:w-[300px]">
          <div className="agent-pack origin-top-left scale-[0.8] min-[900px]:scale-100">
            <div className="agent-pack__float">
              <div className="agent-pack__foil">
                <div className="agent-pack__crimp agent-pack__crimp--top" />
                <div className="agent-pack__crimp agent-pack__crimp--bottom" />
                <div className="agent-pack__corner agent-pack__corner--tl" />
                <div className="agent-pack__corner agent-pack__corner--tr" />
                <div className="agent-pack__corner agent-pack__corner--bl" />
                <div className="agent-pack__corner agent-pack__corner--br" />

                <div className="agent-pack__head">
                  <span className="agent-pack__title">Agent Pack</span>
                  <span className="agent-pack__sub">BIELCX · WEB3 · AI</span>
                </div>

                <div className="agent-pack__window">
                  <div className="agent-pack__glow" />
                  <div className="agent-pack__ribs" />
                  {/* width/height são os do ARQUIVO (1024x1536), não os da caixa:
                      é assim que o next/image acerta a proporção e não reclama de
                      `height:auto` no CSS. Quem manda no tamanho na tela é o
                      `.agent-pack__art`, e o `sizes` evita baixar a variante
                      grande para um desenho de ~140px de largura. */}
                  <Image
                    src="/biel-avatar.png"
                    alt=""
                    width={1024}
                    height={1536}
                    sizes="200px"
                    priority
                    className="agent-pack__art"
                  />
                  <div className="agent-pack__code">S01 · 05/05</div>
                  <div className="agent-pack__bar">
                    <span>agent.bielcx</span>
                    <span style={{ color: "#aebf92" }}>● live</span>
                  </div>
                </div>

                <div className="agent-pack__legend">
                  <span>5 AGENTS PER PACK</span>
                  <span>TEAR HERE ▸</span>
                </div>

                <div className="agent-pack__gloss" />
                <div className="agent-pack__shade" />              </div>
            </div>
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
