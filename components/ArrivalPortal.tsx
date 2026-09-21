"use client"

import { useEffect, useRef, useState } from "react"

import { PORTAL_FRAG } from "@/components/portalShader"

/**
 * O portal se fechando: a chegada de quem clicou em "Web3" no portfólio
 * comercial. Ver o `portalShader.ts` para o porquê de ser o mesmo desenho
 * tocado ao contrário.
 *
 * **Ele só aparece para quem VEIO de lá.** Quem digita a URL, quem chega pelo
 * LinkedIn ou pelo GitHub não tem contexto nenhum para um redemoinho verde
 * ocupando a tela — seria um susto, não uma piada. O porteiro é o
 * `document.referrer`, e ele já vem reduzido à origem pela política padrão dos
 * navegadores (`strict-origin-when-cross-origin`), que é exatamente o que
 * interessa aqui.
 *
 * **Quem cobre a tela no primeiro quadro não é este componente**, e não tem
 * como ser: o React só monta depois da hidratação, e até lá a página já
 * apareceu. Quem cobre é o `html[data-portal]::before` do `globals.css`,
 * ligado por um script inline no `layout.tsx` antes de qualquer pintura. Este
 * componente assume o lugar dele assim que o primeiro quadro do canvas sai —
 * é o `soltarCapa()`.
 */

/** De onde a viagem pode vir. Sem isso, o portal vira susto aleatório. */
const ORIGENS = ["gabriel.doabridge.com", "bielcx-portfolio.vercel.app"]

/** Duração do fechamento, em ms — o mesmo tempo da abertura, do outro lado. */
const DURACAO = 900

const veioDoPortal = () => {
  try {
    if (!document.referrer) return false
    const host = new URL(document.referrer).host
    return ORIGENS.includes(host) || /^(localhost|127\.0\.0\.1):\d+$/.test(host)
  } catch {
    return false
  }
}

/** Tira a capa opaca que o script inline pôs, revelando o canvas por baixo. */
const soltarCapa = () => {
  delete document.documentElement.dataset.portal
}

export function ArrivalPortal() {
  const canvas = useRef<HTMLCanvasElement>(null)
  const [ativo, setAtivo] = useState(false)

  /* Decidido no cliente, uma vez: no servidor não existe `referrer`, e o HTML
     precisa sair igual para os dois para não quebrar a hidratação. */
  useEffect(() => {
    if (!veioDoPortal()) return soltarCapa()
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return soltarCapa()
    setAtivo(true)
  }, [])

  useEffect(() => {
    if (!ativo) return
    const tela = canvas.current
    if (!tela) return

    const gl = tela.getContext("webgl2", { alpha: true, antialias: false, premultipliedAlpha: false })
    /* Sem WebGL2 não há portal, e o site não pode ficar refém disso: a capa
       sai na hora e a chegada é seca. Mesma linha de raciocínio do
       `AnimatedThemeToggler` e dos outros efeitos daqui — o conteúdo nunca
       depende do enfeite. */
    if (!gl) {
      soltarCapa()
      setAtivo(false)
      return
    }

    const compilar = (tipo: number, src: string) => {
      const sh = gl.createShader(tipo)!
      gl.shaderSource(sh, src)
      gl.compileShader(sh)
      return sh
    }

    const prog = gl.createProgram()!
    gl.attachShader(
      prog,
      compilar(
        gl.VERTEX_SHADER,
        `#version 300 es
in vec2 p;
void main(){ gl_Position = vec4(p, 0.0, 1.0); }`,
      ),
    )
    gl.attachShader(prog, compilar(gl.FRAGMENT_SHADER, PORTAL_FRAG))
    gl.linkProgram(prog)
    gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const p = gl.getAttribLocation(prog, "p")
    gl.enableVertexAttribArray(p)
    gl.vertexAttribPointer(p, 2, gl.FLOAT, false, 0, 0)

    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

    const uRes = gl.getUniformLocation(prog, "uRes")
    const uT = gl.getUniformLocation(prog, "uT")
    const uB = gl.getUniformLocation(prog, "uB")

    const medir = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      tela.width = Math.floor(innerWidth * dpr)
      tela.height = Math.floor(innerHeight * dpr)
      gl.viewport(0, 0, tela.width, tela.height)
    }
    medir()
    window.addEventListener("resize", medir)

    let raf = 0
    let capaSolta = false
    const inicio = performance.now()

    const quadro = (agora: number) => {
      const t = Math.min((agora - inicio) / DURACAO, 1)
      // easeInCubic: a boca segura e depois colapsa, que é o inverso da
      // abertura do outro lado (easeOutCubic)
      const b = 1 - t * t * t

      gl.uniform2f(uRes, tela.width, tela.height)
      gl.uniform1f(uT, (agora - inicio) / 1000)
      gl.uniform1f(uB, b)
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.drawArrays(gl.TRIANGLES, 0, 3)

      /* Só depois do PRIMEIRO quadro desenhado: tirar a capa antes deixaria um
         piscar da página entre ela e o canvas. */
      if (!capaSolta) {
        capaSolta = true
        soltarCapa()
      }

      if (t < 1) raf = requestAnimationFrame(quadro)
      else setAtivo(false)
    }

    raf = requestAnimationFrame(quadro)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", medir)
      gl.deleteProgram(prog)
      gl.deleteBuffer(buf)
      soltarCapa()
    }
  }, [ativo])

  if (!ativo) return null

  return (
    <canvas
      ref={canvas}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[70] size-full"
    />
  )
}
