---
title: Tech Stack Profile
tags: [techstack, setup, infrastructure]
created: 2026-06-22
updated: 2026-06-22
sources: [techstack-session]
summary: Marketing landing page + documentation site for the SuperSpecs AI coding framework. Next.js 15 SSG, TypeScript, Tailwind CSS, shadcn/ui, Velite for MDX content, deployed on Vercel.
---

# Tech Stack Profile

## Summary

SuperSpecs homepage: a marketing landing page combined with full project documentation for the SuperSpecs AI coding framework. Statically generated (SSG) with Next.js 15, TypeScript strict, Tailwind CSS + shadcn/ui for UI, and Velite as the MDX/YAML content layer for the docs section. Deployed on Vercel with built-in preview deployments.

## Stack Overview

| Domain | Technology |
|---|---|
| Frontend | Next.js 15 + TypeScript + Tailwind CSS + shadcn/ui |
| Content Layer | Velite (MDX/YAML) + Shiki (syntax highlighting) |
| Rendering | SSG (Static Site Generation) |
| Backend | None — static only |
| Deployment | Vercel |
| CI/CD | Vercel built-in pipeline (Preview per PR, auto-deploy on merge) |
| Quality | Biome + TypeScript strict |
| Monitoring | @vercel/analytics + @vercel/speed-insights |

## Frontend

### Core

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript 5 (strict mode)
- **Rendering:** SSG — no server-side runtime
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **State:** None (static site, no client state management needed)
- **Content:** Velite for MDX/YAML docs, next-mdx-remote for rendering
- **Testing:** None defined yet

### Recommended Skills

- `nextjs-developer` — App Router, SSG, generateMetadata, Vercel deployment
- `react-expert` — React 18+ components, shadcn/ui integration, TypeScript patterns
- `typescript-pro` — strict TypeScript config, advanced types for Velite content schemas
- `landing-page` — marketing section design: Hero, Features, CTA, conversion patterns
- `code-documenter` — MDX/Velite content structure, docs-site information architecture

### Key Libraries

| Package | Purpose | Status |
|---|---|---|
| `next@15` | App Router, SSG, Image Optimization | required |
| `react@19` | UI foundation | required |
| `typescript@5` | type safety | required |
| `tailwindcss@4` | utility-first styling | required |
| `@shadcn/ui` | UI components on Tailwind | required |
| `velite@latest` | MDX/YAML content layer for docs | required |
| `next-mdx-remote` | MDX rendering in Next.js | recommended |
| `shiki` | syntax highlighting in docs | recommended |
| `next-themes` | dark/light mode | optional |
| `framer-motion` | animations for landing page | optional |

## Deployment & Infrastructure

- **Cloud:** Vercel
- **Compute:** Static (SSG — no serverless functions needed at this stage)
- **IaC:** none
- **Environments:** local dev + production (Vercel preview per PR acts as staging)

### Key Tools

| Tool | Purpose | Status |
|---|---|---|
| Vercel | hosting + preview deployments | required |
| `@vercel/analytics` | pageview tracking, no external deps | recommended |
| `@vercel/speed-insights` | Core Web Vitals monitoring | recommended |

## CI/CD

- **Pipeline:** Vercel built-in
- **Merge gates:** Biome check + TypeScript `tsc --noEmit` (pre-commit via husky)
- **Staging deploy:** Vercel Preview Deployment on every PR (automatic)
- **Production deploy:** auto-deploy on merge to `main`
- **Release strategy:** manual / no release automation (solo project)

### Quality Tools

| Tool | Purpose | Status |
|---|---|---|
| `@biomejs/biome` | linting + formatting (replaces ESLint + Prettier) | required |
| `typescript` strict | compile-time type checking | required |
| `husky` | pre-commit hooks | recommended |
| `lint-staged` | run Biome only on changed files | recommended |

## Production-Readiness Checklist

### Frontend — Next.js + Tailwind + shadcn/ui

- [ ] Lighthouse score ≥ 90 (Performance, Accessibility, Best Practices, SEO)
- [ ] Core Web Vitals: LCP < 2.5s, CLS < 0.1, INP < 200ms
- [ ] `generateMetadata()` für jede Route (title, description, og:image)
- [ ] `sitemap.xml` und `robots.txt` generiert (App Router built-in)
- [ ] Alle Velite Content-Schemas vollständig typisiert
- [ ] Shiki Syntax Highlighting für alle Code-Blöcke im Doku-Teil
- [ ] Dark Mode via `next-themes` ohne Flash-of-unstyled-content
- [ ] Alle shadcn/ui Komponenten mit ARIA-Attributen geprüft (axe-core)
- [ ] `next/image` für alle Bilder (keine raw `<img>` Tags)
- [ ] Bundle size: keine einzelne Route über 200kb JS (First Load JS)
- [ ] Keine hardcodierten Secrets im Client-Bundle
- [ ] `404` und `error.tsx` Seiten vorhanden

### Content / Velite

- [ ] Alle MDX-Dateien validieren gegen Schema (`velite build` fehlerfrei)
- [ ] Frontmatter-Pflichtfelder definiert und erzwungen (title, description, date)
- [ ] Broken Links im Doku-Teil geprüft (z.B. `remark-validate-links`)
- [ ] Code-Beispiele in Docs getestet und aktuell

### Deployment — Vercel

- [ ] Environment Variables in Vercel-Dashboard gesetzt (keine `.env` im Repo)
- [ ] Preview Deployments für jeden PR aktiv
- [ ] Production Domain mit Custom Domain + SSL konfiguriert
- [ ] `@vercel/analytics` und `@vercel/speed-insights` eingebunden
- [ ] Vercel Deployment Protection für Preview URLs konfiguriert

### CI/CD — Vercel Pipeline

- [ ] Biome check als Pre-commit Hook (husky + lint-staged)
- [ ] TypeScript strict `tsc --noEmit` als Build-Gate
- [ ] Velite build fehlerfrei bevor `next build` startet
- [ ] Build schlägt fehl bei TypeScript-Fehlern

### Quality

- [ ] Biome konfiguriert mit `recommended` + format rules
- [ ] `husky` pre-commit: `biome check --apply` + `tsc --noEmit`
- [ ] `"strict": true` in `tsconfig.json`

## Decisions & Constraints

- **SSG only** — kein Backend, keine API Routes, kein Server-Runtime (vorerst)
- **Solo project** — kein Team-Coordination-Overhead nötig
- **Biome statt ESLint/Prettier** — ein Tool für Linting + Formatting
- **Velite statt Contentlayer** — aktiv maintained, bessere Next.js 15 Kompatibilität
- **Vercel Pipeline** — kein separates CI/CD (GitHub Actions etc.) nötig

## Open Questions

- [ ] Welche Docs-Struktur? (Guides / API Reference / Changelog als separate Sections?)
- [ ] Newsletter / Waitlist-Signup benötigt? (würde eine Serverless Function erfordern)
- [ ] i18n? (Deutsch + Englisch, oder nur Englisch?)
- [ ] Versionierung der Doku? (ein Branch pro Major-Version oder single latest?)
- [ ] Analytics-Anforderungen jenseits von @vercel/analytics?

## Community Skills

### Universal

- **[Karpathy Guidelines](https://github.com/forrestchang/andrej-karpathy-skills)** ⭐ 125k — behavioral LLM coding guidelines (Think Before Coding, Simplicity First, Surgical Changes)
  `/install forrestchang/andrej-karpathy-skills`

- **[mattpocock/skills](https://github.com/mattpocock/skills)** ⭐ 136k — `/grill-me`, `/tdd`, `/handoff` — composable engineering discipline
  `npx skills@latest add mattpocock/skills`

### Stack-spezifisch

- **[Interface Design](https://github.com/Dammyjay93/interface-design)** ⭐ 4,799 · Self-contained — principle-based UI design system for consistent component patterns
  `/plugin marketplace add Dammyjay93/interface-design`

- **[Stitch Skills](https://github.com/google-labs-code/stitch-skills)** ⭐ 5,348 · External deps — Google Labs React/shadcn/ui conversion + design-to-code
  `npx skills add google-labs-code/stitch-skills --skill shadcn-ui --global`
  ⚠️ Externe Calls zu Google Cloud Storage für Design-Assets

- **[Marketing Skills](https://github.com/coreyhaines31/marketingskills)** ⭐ 27,907 · Self-contained — 25+ skills für CRO, Copywriting, SEO
  `git clone https://github.com/coreyhaines31/marketingskills ~/.claude/skills/marketing`

_Browse all community skills: https://awesome-skills.com/_

## Recommended Next Steps

1. Projekt initialisieren: `npx create-next-app@latest --typescript --tailwind --app`
2. shadcn/ui einrichten: `npx shadcn@latest init`
3. Velite installieren und Content-Schema definieren
4. Biome + husky + lint-staged konfigurieren
5. Community Skills installieren (Install-Commands oben)
6. `/discuss` — erste Feature planen (z.B. Landing Page Hero Section)
