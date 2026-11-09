/**
 * Logos que o Phosphor não tem (Farcaster e Hive), desenhados em SVG simples no
 * mesmo tamanho e peso dos ícones `bold` do Phosphor ao lado deles. Herdam a cor
 * de quem os contém (`currentColor`). Server-safe: sem hooks.
 */
type Props = { size?: number };

/** O arco do Farcaster: a viga de cima e as duas pernas com o vão no meio. */
export function FarcasterLogo({ size = 18 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M4 3.5h16v3h-1.6V20.5h-4.2v-7.2a2.2 2.2 0 0 0-4.4 0v7.2H5.6V6.5H4z" />
    </svg>
  );
}

/**
 * O hexágono partido da Hive: uma divisa fina à esquerda e uma peça cheia à
 * direita, com um vão diagonal entre as duas. Juntas, as duas fecham a silhueta
 * do hexágono — é isso que a faz ler como Hive e não como `< >` (a primeira
 * versão eram duas divisas iguais e parecia símbolo de código).
 */
export function HiveLogo({ size = 18 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M1.5 12 6.7 3h3.4L4.9 12l5.2 9H6.7z" />
      <path d="M12 3h5.3l5.2 9-5.2 9H12l5.2-9z" />
      <path d="M8.6 12 11.2 7.5 13.8 12l-2.6 4.5z" />
    </svg>
  );
}
