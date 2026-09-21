/**
 * O PORTAL DE CHEGADA — a outra metade da passagem que começa no portfólio
 * comercial (`gabriel.doabridge.com`). Lá o clique no botão "Web3" abre um
 * anel verde que engole a tela; aqui ele se fecha e entrega o site.
 *
 * **É o MESMO shader dos dois lados, tocado ao contrário.** Lá o progresso vai
 * de 0 a 1 e a boca cresce; aqui vai de 1 a 0 e ela encolhe até sumir. Não há
 * o que sincronizar entre os dois — são origens diferentes, e `@view-transition`
 * entre documentos só funciona same-origin. A continuidade é combinada, não
 * técnica: mesma forma, mesma cor, mesmo tempo.
 *
 * **A duplicação entre os dois repositórios é deliberada.** Eles são
 * independentes — outro git, outro deploy, outra stack — e não há nada
 * compartilhado entre os dois além de uma nota. Um pacote comum para ~90
 * linhas de GLSL custaria mais do que copiá-las. Mexeu na forma de um lado,
 * copie para o outro: a emenda só funciona se as duas metades combinarem.
 *
 * O GLSL mora numa template string: NENHUMA crase abaixo daqui, nem em
 * comentário — é a armadilha que o AGENTS.md deste repositório já registra.
 */

/**
 * As DUAS cores são as do losango do Ethereum do site de saída, medidas do
 * `ethShaders.ts` de lá: o portal abre a partir do botão que tem o losango
 * dentro, então ele chega aqui com a cor de quem o abriu. Antes eram o verde
 * ácido e a menta daquele tema, que não são as cores deste site nem daquele
 * botão. Elas NÃO seguem o accent daqui pelo mesmo motivo do miolo abaixo: a
 * régua é a outra ponta da viagem.
 */
/** O realce do losango, na borda. */
const AZUL_CLARO = "vec3(0.750, 0.880, 1.000)"
/** A base do losango — o `--color-accent-cool` de lá, `#4f9bf0`. */
const AZUL = "vec3(0.310, 0.608, 0.941)"
/**
 * O miolo, que é o `--surface` do tema escuro (`#000`).
 *
 * É a cor com que a outra ponta termina, e por isso ela é fixa aqui mesmo no
 * tema claro: o portal é escuro dos dois lados da viagem, e quem chega no
 * claro vê o disco escuro encolher e revelar o papel. Pintar o miolo de branco
 * no tema claro quebraria a emenda com o site de saída, que não tem como saber
 * qual tema este visitante tem — é outra origem, outro `localStorage`.
 */
const MIOLO = "vec3(0.000, 0.000, 0.000)"

export const PORTAL_FRAG = `#version 300 es
precision highp float;
out vec4 o;
uniform vec2  uRes;
uniform float uT;
uniform float uB;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++){
    v += a * noise(p);
    p *= 2.02;
    a *= 0.5;
  }
  return v;
}

void main(){
  vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / min(uRes.x, uRes.y);
  uv.y += 0.06;

  float r = length(uv);
  float ang = atan(uv.y, uv.x);

  float R = uB * 1.15;

  float giro = fbm(vec2(ang * 1.6 + r * 3.0 - uT * 0.9, r * 2.4 - uT * 0.35));
  float borda = R * (1.0 + 0.16 * (giro - 0.5));

  float esp = 0.055 + 0.10 * uB;
  float anel = 1.0 - smoothstep(0.0, esp, abs(r - borda));
  anel = pow(anel, 1.7);

  float fio = fbm(vec2(ang * 5.0 - uT * 1.6, r * 6.0));
  anel *= 0.55 + 0.75 * fio;

  vec3 cor = mix(${AZUL}, ${AZUL_CLARO}, clamp(fio * 1.2, 0.0, 1.0));

  float dentro = 1.0 - smoothstep(borda - esp * 1.4, borda, r);
  vec3 miolo = mix(${MIOLO}, cor * 0.55, dentro * (1.0 - dentro) * 1.6);

  vec3 col = mix(miolo, cor, clamp(anel, 0.0, 1.0));

  float alfa = clamp(dentro + anel, 0.0, 1.0);
  alfa = max(alfa, (1.0 - smoothstep(borda, borda + 0.09, r)) * anel);

  o = vec4(col * (0.85 + 0.5 * anel), alfa);
}
`
