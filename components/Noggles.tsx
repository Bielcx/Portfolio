/**
 * Noggles ⌐◨-◨ em pixel (CC0, cultura Nouns): duas lentes ◨ ligadas, com o braço ⌐.
 * Grade 16×6, desenhada em <rect> com `crispEdges` para os pixels não borrarem.
 * Aparece só como marca pequena no topo — os do NFT da hero já são o destaque
 * (o dono achou que os óculos estavam "repetindo demais").
 */
export function Noggles({ px = 2, color = "var(--nx-red)" }: { px?: number; color?: string }) {
  const r: [number, number, number, number, string][] = [];
  const lens = (x0: number) => {
    r.push([x0, 0, 6, 1, color], [x0, 5, 6, 1, color], [x0, 0, 1, 6, color], [x0 + 5, 0, 1, 6, color]);
    r.push([x0 + 1, 1, 2, 4, "#fff"], [x0 + 3, 1, 2, 4, "#000"]);
  };
  lens(2);
  lens(10);
  r.push([8, 1, 2, 1, color], [0, 1, 2, 1, color], [0, 2, 1, 2, color]);
  return (
    <svg width={16 * px} height={6 * px} viewBox="0 0 16 6" shapeRendering="crispEdges" role="img" aria-label="noggles ⌐◨-◨">
      {r.map(([x, y, w, h, f], i) => (
        <rect key={i} x={x} y={y} width={w} height={h} fill={f} />
      ))}
    </svg>
  );
}
