# AADIL — Developer Portfolio (Next.js & TypeScript)

A developer portfolio built with Next.js 14 (App Router), TypeScript, Three.js, GSAP, and Lenis smooth scrolling.

## Features

- **Next.js 14 App Router** with full TypeScript support
- **Three.js 3D Interactive Torus Knot** with dynamic ambient reflection lighting
- **GSAP & ScrollTrigger** for smooth scroll animations and card reveals
- **Lenis Smooth Scroll** with custom cursor magnetic interaction
- **Modular Component Architecture** (`Backdrop`, `Hero`, `About`, `Skills`, `Projects`, `Achievements`, `Contact`, `Footer`)
- **Centralized Data Configuration**: Update all content in `src/data/portfolio.ts`

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run local development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for production

```bash
npm run build
npm start
```

## Customizing Content

All portfolio content is centralized in:
`src/data/portfolio.ts`

You can customize:
- Name, role, tagline & bio
- Education and interests facts
- Skills bento grid items
- Projects with GitHub links and tags
- Achievements categories
- Contact links (Email, LinkedIn, GitHub, Instagram)
