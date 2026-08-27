"use client";

// Sourced from React Bits (reactbits.dev/backgrounds/ripple-grid) — ogl based,
// same dependency Galaxy.tsx already uses, so nothing new was installed.
// Two deliberate changes from the stock component: it's typed, and the CSS
// file was dropped in favour of the className prop (the stock stylesheet only
// set width/height/overflow, which Tailwind already does).
import { Renderer, Program, Triangle, Mesh } from "ogl";
import { useEffect, useRef, useState } from "react";

const vertexShader = `
attribute vec2 position;
varying vec2 vUv;
void main() {
    vUv = position * 0.5 + 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
}`;

const fragmentShader = `precision highp float;
uniform float iTime;
uniform vec2 iResolution;
uniform bool enableRainbow;
uniform vec3 gridColor;
uniform float rippleIntensity;
uniform float gridSize;
uniform float gridThickness;
uniform float fadeDistance;
uniform float vignetteStrength;
uniform float glowIntensity;
uniform float opacity;
uniform float gridRotation;
uniform bool mouseInteraction;
uniform vec2 mousePosition;
uniform float mouseInfluence;
uniform float mouseInteractionRadius;
varying vec2 vUv;

float pi = 3.141592;

mat2 rotate(float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return mat2(c, -s, s, c);
}

void main() {
    vec2 uv = vUv * 2.0 - 1.0;
    uv.x *= iResolution.x / iResolution.y;

    if (gridRotation != 0.0) {
        uv = rotate(gridRotation * pi / 180.0) * uv;
    }

    // Aspect-corrected distance, used for the ripple so the wave stays a
    // circle. The radial fade below deliberately does NOT use it: on a wide
    // viewport the x stretch makes dist grow ~60% faster sideways, so the
    // stock fade is a circle inscribed in a rectangle and dies at the sides
    // long before the top. Measuring the fade on the raw uv makes it an
    // ellipse that reaches all four edges evenly.
    float dist = length(uv);
    float fadeDist = length(vUv * 2.0 - 1.0);
    float func = sin(pi * (iTime - dist));
    vec2 rippleUv = uv + uv * func * rippleIntensity;

    if (mouseInteraction && mouseInfluence > 0.0) {
        vec2 mouseUv = (mousePosition * 2.0 - 1.0);
        mouseUv.x *= iResolution.x / iResolution.y;
        float mouseDist = length(uv - mouseUv);

        float influence = mouseInfluence * exp(-mouseDist * mouseDist / (mouseInteractionRadius * mouseInteractionRadius));

        float mouseWave = sin(pi * (iTime * 2.0 - mouseDist * 3.0)) * influence;
        rippleUv += normalize(uv - mouseUv) * mouseWave * rippleIntensity * 0.3;
    }

    vec2 a = sin(gridSize * 0.5 * pi * rippleUv - pi / 2.0);
    vec2 b = abs(a);

    float aaWidth = 0.5;
    vec2 smoothB = vec2(
        smoothstep(0.0, aaWidth, b.x),
        smoothstep(0.0, aaWidth, b.y)
    );

    vec3 color = vec3(0.0);
    color += exp(-gridThickness * smoothB.x * (0.8 + 0.5 * sin(pi * iTime)));
    color += exp(-gridThickness * smoothB.y);
    color += 0.5 * exp(-(gridThickness / 4.0) * sin(smoothB.x));
    color += 0.5 * exp(-(gridThickness / 3.0) * smoothB.y);

    if (glowIntensity > 0.0) {
        color += glowIntensity * exp(-gridThickness * 0.5 * smoothB.x);
        color += glowIntensity * exp(-gridThickness * 0.5 * smoothB.y);
    }

    float ddd = exp(-2.0 * clamp(pow(fadeDist, fadeDistance), 0.0, 1.0));

    vec2 vignetteCoords = vUv - 0.5;
    float vignetteDistance = length(vignetteCoords);
    float vignette = 1.0 - pow(vignetteDistance * 2.0, vignetteStrength);
    vignette = clamp(vignette, 0.0, 1.0);

    vec3 t;
    if (enableRainbow) {
        t = vec3(
            uv.x * 0.5 + 0.5 * sin(iTime),
            uv.y * 0.5 + 0.5 * cos(iTime),
            pow(cos(iTime), 4.0)
        ) + 0.5;
    } else {
        t = gridColor;
    }

    float finalFade = ddd * vignette;
    // Straight (non-premultiplied) output: RGB é a cor pedida, alpha é só a
    // intensidade da linha. O canvas é criado com premultipliedAlpha: false,
    // então a composição do navegador ja faz rgb * alpha + fundo * (1 - alpha).
    // Emitir t * alpha aqui, como o componente original fazia, multiplicava
    // pelo alpha duas vezes e o branco puro saía como linha escura — visível no
    // Chrome/Edge, mas não no Safari do iOS, que interpretava como
    // pré-multiplicado. Era a origem do grid preto no PC e branco no celular.
    float intensity = clamp(max(color.r, max(color.g, color.b)), 0.0, 1.0);
    gl_FragColor = vec4(t, intensity * finalFade * opacity);
}`;

// Accepts shorthand (#000) as well as full (#000000) hex. The stock React Bits
// version only matched 6 digits and fell back to white on anything else — and
// Tailwind's CSS pipeline collapses `--grid: #000000` to `#000`, so reading the
// token gave a white grid instead of a black one.
function hexToRgb(hex: string): [number, number, number] {
  const value = hex.trim().replace(/^#/, "");
  const full =
    value.length === 3 ? value.replace(/./g, (char) => char + char) : value;
  const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(full);
  return result
    ? [
        parseInt(result[1], 16) / 255,
        parseInt(result[2], 16) / 255,
        parseInt(result[3], 16) / 255,
      ]
    : [1, 1, 1];
}

// A WebGL uniform can't read a CSS variable, so resolve one off <html> and
// re-read it whenever AnimatedThemeToggler flips the `light` class. Lets a
// valor viver no globals.css junto do resto da paleta, em vez de hardcoded
// aqui ou no page.tsx — vale tanto para a cor quanto para a opacidade.
function readCssVar(varName: string, fallback: string) {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(varName)
    .trim();
  return raw || fallback;
}

function useCssVar(varName: string | undefined, fallback: string) {
  const [value, setValue] = useState(fallback);

  useEffect(() => {
    if (!varName) return;
    const read = () => setValue(readCssVar(varName, fallback));
    read();
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, [varName, fallback]);

  return varName ? value : fallback;
}

type RippleGridProps = {
  className?: string;
  /** CSS custom property holding the grid color, e.g. "--grid". Takes
   *  precedence over `gridColor` and follows the active theme. */
  colorVar?: string;
  /** CSS custom property holding the opacity, e.g. "--grid-opacity". Takes
   *  precedence over `opacity` e também acompanha o tema. */
  opacityVar?: string;
  enableRainbow?: boolean;
  gridColor?: string;
  rippleIntensity?: number;
  gridSize?: number;
  gridThickness?: number;
  fadeDistance?: number;
  vignetteStrength?: number;
  glowIntensity?: number;
  opacity?: number;
  gridRotation?: number;
  mouseInteraction?: boolean;
  mouseInteractionRadius?: number;
};

export default function RippleGrid({
  className,
  colorVar,
  opacityVar,
  enableRainbow = false,
  gridColor = "#ffffff",
  rippleIntensity = 0.05,
  gridSize = 10.0,
  gridThickness = 15.0,
  fadeDistance = 1.5,
  vignetteStrength = 2.0,
  glowIntensity = 0.1,
  opacity = 1.0,
  gridRotation = 0,
  mouseInteraction = true,
  mouseInteractionRadius = 1,
}: RippleGridProps) {
  const resolvedColor = useCssVar(colorVar, gridColor);
  // parseFloat explícito em vez de `Number(x) || opacity`: o token pode ser um
  // "0" legítimo, que o `||` descartaria como falsy.
  const rawOpacity = useCssVar(opacityVar, String(opacity));
  const parsedOpacity = Number.parseFloat(rawOpacity);
  const resolvedOpacity = Number.isFinite(parsedOpacity)
    ? parsedOpacity
    : opacity;
  // Desenha um frame avulso. Necessário no modo reduced-motion, onde não há
  // loop: sem isso, mudar de tema atualizava o uniform mas nada redesenhava, e
  // o grid ficava preso na cor do tema anterior para sempre.
  const drawRef = useRef<(() => void) | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mousePositionRef = useRef({ x: 0.5, y: 0.5 });
  const targetMouseRef = useRef({ x: 0.5, y: 0.5 });
  const mouseInfluenceRef = useRef(0);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const uniformsRef = useRef<any>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new Renderer({
      // Cap em 2. Chegou a ir para 3 achando que o grid sumia no iPhone por
      // falta de resolução; a causa real era o alpha (ver shader). Em dpr 3 são
      // 2,25x mais fragmentos por frame num fundo que roda o tempo todo, o que
      // pesa na rolagem e na bateria sem ganho visível.
      dpr: Math.min(window.devicePixelRatio, 2),
      alpha: true,
      // Explícito para não depender do default: o shader emite cor e alpha
      // separados (straight), e é o navegador que compõe sobre a página.
      premultipliedAlpha: false,
    });
    const gl = renderer.gl;
    // Sem blending: é um único triângulo cobrindo a tela, nada se sobrepõe.
    // Com BLEND ligado o alpha era elevado ao quadrado no framebuffer, o que
    // somava mais erro em cima do double-multiply da composição.
    gl.disable(gl.BLEND);
    gl.canvas.style.width = "100%";
    gl.canvas.style.height = "100%";
    container.appendChild(gl.canvas);

    const uniforms = {
      iTime: { value: 0 },
      iResolution: { value: [1, 1] },
      enableRainbow: { value: enableRainbow },
      gridColor: { value: hexToRgb(resolvedColor) },
      rippleIntensity: { value: rippleIntensity },
      gridSize: { value: gridSize },
      gridThickness: { value: gridThickness },
      fadeDistance: { value: fadeDistance },
      vignetteStrength: { value: vignetteStrength },
      glowIntensity: { value: glowIntensity },
      opacity: { value: resolvedOpacity },
      gridRotation: { value: gridRotation },
      mouseInteraction: { value: mouseInteraction },
      mousePosition: { value: [0.5, 0.5] },
      mouseInfluence: { value: 0 },
      mouseInteractionRadius: { value: mouseInteractionRadius },
    };

    uniformsRef.current = uniforms;

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms,
    });
    const mesh = new Mesh(gl, { geometry, program });
    drawRef.current = () => renderer.render({ scene: mesh });

    let lastW = 0;
    let lastH = 0;
    const resize = () => {
      const { clientWidth: w, clientHeight: h } = container;
      // Ignora medida zerada (acontece enquanto o splash do TerminalIntro está
      // na frente) e chamadas que não mudam nada — reconstruir o buffer à toa
      // custa caro e faz o grid piscar.
      if (w === 0 || h === 0) return;
      if (w === lastW && h === lastH) return;
      lastW = w;
      lastH = h;
      renderer.setSize(w, h);
      uniforms.iResolution.value = [w, h];
    };

    // Aplica cor e opacidade do tema DE FORMA SÍNCRONA quando a classe do
    // <html> muda, e redesenha na hora. O caminho via React (estado -> efeito
    // -> próximo frame) é assíncrono demais: a troca de tema roda dentro de um
    // startViewTransition, e o navegador fotografa o "depois" antes do canvas
    // repintar — quando a foto sai e a página ao vivo volta, o valor pulava e
    // dava a piscada. O efeito de sincronismo mais abaixo continua existindo
    // para mudanças de prop; escreve os mesmos valores, então não conflita.
    const applyThemeVars = () => {
      if (colorVar) {
        uniforms.gridColor.value = hexToRgb(readCssVar(colorVar, gridColor));
      }
      if (opacityVar) {
        const parsed = Number.parseFloat(
          readCssVar(opacityVar, String(opacity))
        );
        if (Number.isFinite(parsed)) uniforms.opacity.value = parsed;
      }
      renderer.render({ scene: mesh });
    };
    const themeObserver = new MutationObserver(applyThemeVars);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // The grid sits behind the whole page with pointer-events disabled, so the
    // stock component's mouseenter/mouseleave listeners on the container never
    // fire — track the pointer on window instead and derive enter/leave from
    // whether it's inside the container's box.
    const handleMouseMove = (e: MouseEvent) => {
      if (!mouseInteraction) return;
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1.0 - (e.clientY - rect.top) / rect.height;
      targetMouseRef.current = { x, y };
      mouseInfluenceRef.current =
        x >= 0 && x <= 1 && y >= 0 && y <= 1 ? 1.0 : 0.0;
    };

    // `window.resize` de propósito, e NÃO um ResizeObserver no container. O
    // container é filho de um `fixed inset-0`, então sua altura acompanha a
    // viewport — e no Safari do iOS a barra de endereço recolhe e reaparece a
    // cada rolagem. Um ResizeObserver dispara em todas essas mudanças e
    // reconstrói o buffer no meio do scroll, com o aspect do shader mudando
    // junto: o grid pula e treme. `window.resize` ignora a barra de endereço e
    // ainda pega rotação de tela, que é o que importa aqui.
    window.addEventListener("resize", resize);
    if (mouseInteraction) {
      window.addEventListener("mousemove", handleMouseMove);
    }
    resize();

    // Respect prefers-reduced-motion: render a single static frame of the grid
    // instead of running the ripple loop. Same principle as Galaxy in the
    // project panel — the visual stays, the motion doesn't.
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let animationFrameId = 0;
    const render = (t: number) => {
      uniforms.iTime.value = t * 0.001;

      const lerpFactor = 0.1;
      mousePositionRef.current.x +=
        (targetMouseRef.current.x - mousePositionRef.current.x) * lerpFactor;
      mousePositionRef.current.y +=
        (targetMouseRef.current.y - mousePositionRef.current.y) * lerpFactor;

      uniforms.mouseInfluence.value +=
        (mouseInfluenceRef.current - uniforms.mouseInfluence.value) * 0.05;

      uniforms.mousePosition.value = [
        mousePositionRef.current.x,
        mousePositionRef.current.y,
      ];

      renderer.render({ scene: mesh });
      animationFrameId = requestAnimationFrame(render);
    };

    if (reducedMotion) {
      renderer.render({ scene: mesh });
    } else {
      animationFrameId = requestAnimationFrame(render);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      themeObserver.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      drawRef.current = null;
      renderer.gl.getExtension("WEBGL_lose_context")?.loseContext();
      container.removeChild(gl.canvas);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!uniformsRef.current) return;
    const u = uniformsRef.current;
    u.enableRainbow.value = enableRainbow;
    u.gridColor.value = hexToRgb(resolvedColor);
    u.rippleIntensity.value = rippleIntensity;
    u.gridSize.value = gridSize;
    u.gridThickness.value = gridThickness;
    u.fadeDistance.value = fadeDistance;
    u.vignetteStrength.value = vignetteStrength;
    u.glowIntensity.value = glowIntensity;
    u.opacity.value = resolvedOpacity;
    u.gridRotation.value = gridRotation;
    u.mouseInteraction.value = mouseInteraction;
    u.mouseInteractionRadius.value = mouseInteractionRadius;
    // Redesenha na hora: com o loop rodando isso é um frame a mais, irrelevante;
    // sem o loop (reduced motion) é o que faz a mudança de tema aparecer.
    drawRef.current?.();
  }, [
    enableRainbow,
    resolvedColor,
    rippleIntensity,
    gridSize,
    gridThickness,
    fadeDistance,
    vignetteStrength,
    glowIntensity,
    resolvedOpacity,
    gridRotation,
    mouseInteraction,
    mouseInteractionRadius,
  ]);

  return <div ref={containerRef} className={className} />;
}
