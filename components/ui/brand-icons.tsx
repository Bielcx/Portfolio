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

/** O hexágono partido da Hive: duas metades em losango, deslocadas. */
export function HiveLogo({ size = 18 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M8.2 3h3.1l-5.1 9 5.1 9H8.2L3 12z" />
      <path d="M12.6 3h3.2L21 12l-5.2 9h-3.2l5.2-9z" />
    </svg>
  );
}
