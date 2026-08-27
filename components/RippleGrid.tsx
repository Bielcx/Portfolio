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
    // Alpha has to track the grid intensity per channel, not length(color):
    // the color vector is neutral, so its length is ~1.73x each channel, which
    // made the composited line always darker than the gridColor actually asked
    // for (pure white landed around mid grey). On the dark surface that still
    // reads as a light line so it went unnoticed, but on the light theme it
    // turned the grid into grey lines that washed the warm paper out.
    float intensity = clamp(max(color.r, max(color.g, color.b)), 0.0, 1.0);
    float alpha = intensity * finalFade * opacity;
    gl_FragColor = vec4(t * intensity * finalFade * opacity, alpha);
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
// re-read it whenever AnimatedThemeToggler flips the `light` class. Lets the
// grid color live in globals.css with the rest of the palette instead of
// being hardcoded here or in page.tsx.
function useCssColor(varName: string | undefined, fallback: string) {
  const [color, setColor] = useState(fallback);

  useEffect(() => {
    if (!varName) return;
    const read = () => {
      const value = getComputedStyle(document.documentElement)
        .getPropertyValue(varName)
        .trim();
      setColor(value || fallback);
    };
    read();
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, [varName, fallback]);

  return varName ? color : fallback;
}

type RippleGridProps = {
  className?: string;
  /** CSS custom property holding the grid color, e.g. "--grid". Takes
   *  precedence over `gridColor` and follows the active theme. */
  colorVar?: string;
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
  const resolvedColor = useCssColor(colorVar, gridColor);
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
      // Cap em 3, não em 2 (o valor do componente original): num iPhone dpr 3 o
      // buffer a 2x era esticado 1,5x pelo navegador, e as linhas do grid, que
      // têm 1–2px, borravam e perdiam pico de intensidade — no light, onde o
      // contraste com o papel já é de ~15%, isso as tornava quase invisíveis.
      dpr: Math.min(window.devicePixelRatio, 3),
      alpha: true,
    });
    const gl = renderer.gl;
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
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
      opacity: { value: opacity },
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

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = container;
      if (w === 0 || h === 0) return;
      renderer.setSize(w, h);
      uniforms.iResolution.value = [w, h];
    };

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

    // ResizeObserver no container, e não `window.resize`: o container é filho de
    // um `fixed inset-0`, então ele acompanha a viewport — e no Safari do iOS a
    // barra de endereço recolhendo muda essa altura sem disparar `resize`. Sem
    // observar, o canvas ficava com o backing store do tamanho errado e era
    // esticado por CSS, borrando as linhas de 1–2px do grid.
    const observer = new ResizeObserver(resize);
    observer.observe(container);
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
      observer.disconnect();
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
    u.opacity.value = opacity;
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
    opacity,
    gridRotation,
    mouseInteraction,
    mouseInteractionRadius,
  ]);

  return <div ref={containerRef} className={className} />;
}
