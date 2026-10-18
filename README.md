# Sanjay Dharmarajou — Portfolio

A responsive portfolio featuring project case studies, architecture diagrams, an engineering notebook, certifications, and interactive desktop and mobile layouts.

## Technologies

- HTML, CSS, and JavaScript for the published portfolio
- React and TypeScript components, checked during the production build
- Vite for local development and production output
- Lenis and Three.js for motion and interactive visuals

## Run locally

Use a current Node.js LTS release and npm:

```sh
npm ci
npm run dev
```

The standalone page can also be opened directly from `index.html` for a quick static preview.

## Build and preview

```sh
npm run build
npm run preview
```

The production site is written to `dist/`. The build runs the TypeScript project checks before Vite creates the static site.

## Deploy to Vercel

Import this repository into Vercel and keep the project root at the repository root. Vercel can use the included `vercel.json` settings:

- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm install` (or `npm ci` from the lockfile)
- Environment variables: none are required by the current portfolio

The contact form calls EmailJS with browser-side service, template, and public-key identifiers. EmailJS documents the public key as intended for browser use; no private key is present in the client code. Restrict allowed origins and enable EmailJS abuse protections in its dashboard. Do not add a private key to this repository or to client-side Vercel variables.

The project uses relative asset paths and hash-based section links, so it can be hosted at the Vercel project URL without SPA rewrite rules.
