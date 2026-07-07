@AGENTS.md

# Portfolio — Gabriel Cavalcanti

## Project Overview
Personal developer portfolio. Repo: `C:\Users\bielc\Dev\portfolio`

## Stack
- Next.js 16.2.10 (App Router) + TypeScript
- Tailwind CSS v4
- Base UI (`@base-ui/react`) — Lyra preset
- IconCloud (magicui) no hero via canvas 2D — `components/IconCloud.tsx` (histórico: PixelBlast → LetterGlitch → IconCloud; todos os anteriores deletados, `three`/`postprocessing`/`@base-ui/react`/`class-variance-authority` desinstalados na limpeza de jul/2026)
- GlyphMatrix foi adicionado e removido (lagava o IconCloud) — não recriar. Fundo atual: grain estático estilo paperclip.ing (utility `.grain` no globals.css — SVG feTurbulence data-URI, mix-blend-overlay opacity-25), CSS puro em page.tsx, zero JS. O glow lavanda blur foi removido a pedido do usuário ("light on background") — não recriar
- Tema: dark por padrão (:root), light via classe `.light` no html + `@custom-variant light` no globals.css; toggler `components/AnimatedThemeToggler.tsx` (magicui adaptado — View Transitions circle reveal, persiste em localStorage("theme"), fixed top-6 right-6). Overrides `light:` espalhados em page.tsx/HeroSection
- Icons: `@phosphor-icons/react` (UI) + `react-icons/si` (ícones de tech no IconCloud)
- Fonts: Geist Sans, Geist Mono, JetBrains Mono
- Package manager: npm

## Current State
Reescrita minimalista (jul/2026) — princípio: "subtração é o design". Container `max-w-5xl mx-auto px-8` em todas as seções (era `max-w-3xl`, corrigido por ficar estreito demais). Fundo sólido `#0a0a0a`, sem background effect.
- [x] Terminal intro splash (`components/TerminalIntro.tsx` + `PortfolioWrapper.tsx`) — roda 3 tabs (install/build/deploy, delays reduzidos pela metade) e some com fade; botão skip
- LogoLoop (reactbits) entre hero e work foi adicionado e removido a pedido do usuário (jul/2026) — não recriar
- LightboardBanner (`components/LightboardBanner.tsx`) não está mais no page.tsx (arquivo ainda existe)
- Sem navbar/header — FloatingNavbar e ui/resizable-navbar foram deletados (jul/2026)
- [x] Hero com scroll zoom: `motion.div` externo usa `useScroll`/`useTransform` (scale 1→1.06, opacity 1→0, y 0→-40); layout `flex items-center gap-12` (IconCloud perto do nome, não justify-between), conteúdo à esquerda (nome + role + links, bio removida), IconCloud 400x400 à direita (`hidden md:block`, 28 slugs via cdn.simpleicons.org com cores de marca reais, arrastável)
- [x] Projetos reais: SkateHive, Fiveout Dashboard, Mirante Skateshop (sem placeholders)
- [x] Work — lista limpa inline em `page.tsx` (sem cards), divide-y, hover accent
- FeaturesSection "What I Do" (aceternity) foi adicionada e removida a pedido do usuário (jul/2026) — não recriar
- [x] Contact — só título + email link, sem formulário
- [x] Footer — copyright + "Built with Next.js"
- [x] Profile data real / SEO metadata (layout.tsx)
- Removidos: services, tech marquee, WorldMap, 3D cards, formulário de contato, header fixo (substituído pelo floating navbar)

## Architecture — Client/RSC split
- `app/page.tsx` — RSC (work, contact, footer inline)
- `components/HeroSection.tsx` — "use client" (motion/react: mount reveals + scroll-driven transform), recebe `profile` como prop
- `components/FloatingNavbar.tsx` — "use client" (scroll listener, hide-on-scroll-down)
- `components/TerminalIntro.tsx` / `PortfolioWrapper.tsx` — "use client"
- `components/LightboardBanner.tsx` — "use client"
- `components/PixelBlast.tsx` — "use client" (THREE.js/WebGL)

## Dependencies added
- `motion` — animações do HeroSection, TerminalIntro
- IconCloud usa imagens do cdn.simpleicons.org — sem dep de ícones de marca

## shadcn / third-party components
- `components/ui/terminal-animation.tsx` — cult-ui
- `components/ui/lightboard.tsx` — cult-ui
- Removidos: floating-navbar.tsx, badge, button, input, label, textarea, @tabler/icons-react

## Projects data
- **SkateHive** — skatehive.app | github.com/SkateHive/skatehive3.0 | Web3 skate platform, Hive blockchain
- **Fiveout Dashboard** — fiveoout.com.br | github.com/Bielcx/fiveout-dashboard | painel streetwear, Supabase SSR
- **Mirante Skateshop** — mirante-skateshop.vercel.app | github.com/Bielcx/mirante-skateshop | landing 3D, R3F

## IconCloud (hero) — Notes
- `IconCloud.tsx` é "use client", canvas lógico 400x400 (CANVAS_SIZE) com backing store escalado por devicePixelRatio (retina-sharp; offscreens de ícone também escalam por dpr)
- Prop única `images` com URLs `https://cdn.simpleicons.org/{slug}/{slug}` — cada ícone na cor de marca real (GitHub preto, TS azul...); slug inválido no path de cor → CDN usa a cor default da marca. Slugs em `techSlugs` no HeroSection. (O modo `icons`/renderToString do magicui original foi removido por não ter uso)
- Esfera Fibonacci interativa: arrastar rotaciona, clicar num ícone centraliza ele; ~28 ícones para a esfera parecer cheia como o demo do magicui
- react-icons foi desinstalado (jul/2026)

## Tema light — Notes
- Não usar `dark:` (o site foi escrito dark-first); usar `light:` (custom variant em globals.css)
- Cores light: bg #fafafa, títulos neutral-900, texto neutral-600, labels/tags neutral-400, bordas neutral-200, accent hover #8a6bab
- AnimatedThemeToggler alterna a classe `light` no `<html>` — não usa next-themes; default dark sem classe (sem FOUC pois dark é o default)

## Design Direction
- Sharp, zero border-radius, technical/dark aesthetic
- Paleta (jul/2026): fundo `#141413`, títulos `#F3E6C4` (creme), textos `#948F85` (cinza quente), hover de texto clicável `#F3E6C4`
- Tons secundários derivam de `#948F85` com opacity (labels/tags `/70`, números/footer `/50`, bordas `/15`)
- Accent `#B497CF` (lavanda) ainda usado em: label "Available for work", hover de título de projeto, link de email, ::selection
- Dark theme default, dev undertone; tema light usa neutrals sobre `#fafafa`

## Profile Data (to fill)
```ts
// in app/page.tsx — const profile = { ... }
name: "Gabriel Cavalcanti"
role: "Full Stack Developer"
location: "Brasil"
email: "biel.cavalcanti1@hotmail.com"
github: "https://github.com/Bielcx"
linkedin: "https://www.linkedin.com/in/gabrielcavalcanti-dev"
```

## Commands
```bash
npm run dev
npm run build
npx shadcn@latest add <component>
```

## What to Build Next
1. OG image personalizada (`app/opengraph-image.tsx`)
