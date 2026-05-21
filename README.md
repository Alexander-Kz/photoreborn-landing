# photoreborn-landing

> The production marketing landing page for the PhotoReborn AI Telegram bot —
> dark theme, before/after comparison sliders, UTM first-touch attribution, and
> GitHub Actions CI/CD. Includes an in-progress Next.js 15 rebuild.

![HTML5](https://img.shields.io/badge/HTML5-vanilla-E34F26?logo=html5&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-15-000000?logo=next.js&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-2088FF?logo=githubactions&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

The conversion landing page for [PhotoReborn AI](https://github.com/Alexander-Kz/photoreborn-ai),
an AI photo-restoration product. It carries the visitor from a cold ad click to
a Telegram deep link — without losing attribution along the way.

This repository holds two things: the **production vanilla build** that actually
ran live, and an **in-progress migration** to a modern Next.js stack.

## Features

- **Hero video** with autoplay-on-scroll
- **Before/after comparison sliders** for restoration examples
- **UTM first-touch attribution** — UTM parameters are captured on entry and
  written into the outbound Telegram deep link, so attribution survives the jump
  off-platform into the bot
- **Yandex.Metrika** analytics with webvisor session recording
- **CI/CD** — GitHub Actions deploys over SSH with a post-deploy health check

## Two builds

### Production (vanilla) — repository root

The build that ran in production: hand-written `index.html`, `styles.css`
(glassmorphism, animations), and `script.js`, plus a standalone
`utm-tracker.js`. No framework, no build step — deployed as static files.

### Next.js migration — `new_landing/`

An in-progress rebuild on Next.js 15, React 19, TypeScript, Tailwind CSS v4,
Framer Motion, and shadcn/ui. See [`new_landing/MIGRATION_NOTES.md`](./new_landing/MIGRATION_NOTES.md).

## Repository layout

```
index.html            Production landing page
styles.css            Production styles (glassmorphism, animations)
script.js             Production interactions
utm-tracker.js        First-touch UTM attribution
assets/               Images, video, before/after pairs, local libraries
.github/workflows/    GitHub Actions deploy pipeline
new_landing/          In-progress Next.js 15 rebuild
```

## Tech stack

**Production:** HTML5, CSS3, vanilla JavaScript, `img-comparison-slider`,
Yandex.Metrika, a custom UTM tracker, GitHub Actions, nginx.

**Migration:** Next.js 15, React 19, TypeScript, Tailwind CSS v4, Framer Motion,
Radix UI, shadcn/ui, lucide-react.

## Running it

The production landing is static — open `index.html`, or serve the repo root
with any static file server. The Next.js rebuild runs from `new_landing/`:

```bash
cd new_landing
npm install
npm run dev
```

## Author

**Alex Kuzin** — independent AI engineer.

- GitHub: [@Alexander-Kz](https://github.com/Alexander-Kz)
- LinkedIn: [Alexander Kuzin](https://www.linkedin.com/in/alexander-kuzin-baa57a403/)
- Email: alexander.kz.mail@gmail.com

## License

Released under the [MIT License](./LICENSE).
