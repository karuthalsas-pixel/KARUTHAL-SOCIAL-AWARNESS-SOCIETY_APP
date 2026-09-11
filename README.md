# Aterna Studio — Single-Page Marketing Site

A production-grade, single-page website for a boutique architecture & interior
design studio, built with **Next.js 14 (App Router)**, **Tailwind CSS**,
**Framer Motion**, and **PostgreSQL** (via **Drizzle ORM**).

> The subject matter (an architecture/interior-design studio) is a placeholder
> brand — swap the copy, imagery, and business details in `app/layout.tsx`,
> `lib/gallery-data.ts`, and the `components/sections/*` files for your own.

---

## ✨ Features

- **Single-page smooth scroll** with `scroll-behavior: smooth` + `scroll-margin-top`
  on every section so the sticky header never overlaps a heading.
- **Frosted-glass sticky navbar** (`backdrop-blur`) with an **animated scrollspy
  pill** driven by `IntersectionObserver` (`lib/useActiveSection.ts`) and a
  Framer Motion `layoutId` indicator.
- **Animated mobile drawer** (Framer Motion spring transition) that closes
  automatically after a link is tapped.
- **Hero** with staggered motion typography and an animated stat strip.
- **About** with an animated milestone counter (`components/ui/Counter.tsx`)
  driven by `useInView` + a Framer Motion spring.
- **What We Do** — interactive card grid with hover-lift micro-interactions.
- **Gallery** — responsive media grid backed by Postgres, with a full
  keyboard-and-click lightbox/modal (prev/next, close on backdrop click).
- **Contact** — a fully wired form (client validation with Zod, honeypot
  spam field, loading/disabled button states, and toast notifications) that
  posts to a real Postgres-backed API route.
- **Loading skeletons** (`components/ui/Skeleton.tsx`) for async gallery states.
- **Full accessibility pass**: semantic landmarks, `aria-*` attributes on the
  drawer/modal/toasts, visible focus rings, honored `prefers-reduced-motion`.
- **Complete technical SEO** — see the dedicated section below.

---

## 🗂 Project structure

```
aterna-studio/
├── app/
│   ├── layout.tsx            # Root layout: fonts, full <head> metadata, JSON-LD
│   ├── page.tsx               # The single page — composes every section
│   ├── globals.css            # Tailwind layers, scroll offsets, a11y defaults
│   ├── sitemap.ts             # Auto-generated /sitemap.xml
│   ├── robots.ts              # Auto-generated /robots.txt
│   ├── manifest.ts            # Web app manifest (PWA + SEO richness)
│   └── api/
│       ├── contact/route.ts   # POST — validates + persists contact submissions
│       └── gallery/route.ts   # GET  — returns gallery items (ISR, revalidate: 1h)
├── components/
│   ├── Navbar.tsx              # Sticky glass header + scrollspy + mobile drawer
│   ├── Footer.tsx
│   ├── sections/
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Services.tsx        # "What We Do"
│   │   ├── Gallery.tsx         # Grid + lightbox
│   │   └── Contact.tsx         # Wired form
│   └── ui/
│       ├── Button.tsx          # hover/tap/loading states
│       ├── Toast.tsx           # toast provider + notifications
│       ├── Reveal.tsx          # scroll-reveal wrapper (viewport once:true)
│       ├── Counter.tsx         # animated number counter
│       └── Skeleton.tsx
├── lib/
│   ├── db.ts                   # Drizzle + pg Pool client
│   ├── schema.ts                # contact_submissions, gallery_items tables
│   ├── validations.ts           # Zod schemas (shared client + server)
│   ├── gallery-data.ts          # DB fetch with static fallback
│   ├── useActiveSection.ts      # scrollspy hook
│   ├── migrate.ts               # migration runner (tsx script)
│   ├── seed.ts                  # seeds demo gallery rows
│   └── utils.ts                 # cn(), NAV_ITEMS
├── drizzle/
│   ├── 0000_init.sql            # initial migration (tables + indexes)
│   └── meta/_journal.json
├── drizzle.config.ts
├── tailwind.config.ts
├── next.config.js
├── .env.example
└── package.json
```

---

## 🚀 Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up PostgreSQL

Create a database (locally, or with a hosted provider like Neon, Supabase, or
Vercel Postgres), then copy the env file:

```bash
cp .env.example .env
```

Fill in `DATABASE_URL` and `NEXT_PUBLIC_SITE_URL`.

### 3. Run migrations & seed demo data

```bash
npm run db:migrate   # creates contact_submissions + gallery_items tables
npm run db:seed       # inserts 6 demo gallery projects
```

> If you skip this step, the Gallery section still renders using the static
> fallback data in `lib/gallery-data.ts`, so the site works immediately even
> before the database is configured.

### 4. Run the dev server

```bash
npm run dev
```

Visit `http://localhost:3000`.

### 5. Build for production

```bash
npm run build
npm start
```

---

## 🧱 Database schema

```ts
contact_submissions
  id, name, email, phone, project_type, message,
  status ('new' | 'read' | 'responded'), ip_hash, created_at

gallery_items
  id, title, category, location, year, image_url,
  description, featured, order, created_at
```

Adjust `lib/schema.ts` and regenerate migrations with:

```bash
npm run db:generate   # drizzle-kit generate — writes a new SQL migration
npm run db:migrate
```

---

## 🔍 SEO — what's implemented, and an honest note on rankings

This project ships with a **complete technical SEO baseline**, so search
engines can fully discover, render, and understand every part of the page:

- **Rich, keyword-relevant metadata** in `app/layout.tsx`: title template,
  meta description, keywords, canonical URL, Open Graph + Twitter Card tags,
  and a full Open Graph image.
- **Structured data (JSON-LD)** — `ProfessionalService` schema (name, address,
  geo-coordinates, services offered, opening hours) plus `WebSite` schema, so
  Google can render rich results (business panels, sitelinks search box, etc.).
- **Auto-generated `sitemap.xml`** (`app/sitemap.ts`) and **`robots.txt`**
  (`app/robots.ts`) pointing crawlers at every section anchor.
- **Web app manifest** (`app/manifest.ts`) for installability and richer
  mobile search presentation.
- **Semantic HTML** — one `<h1>` in the hero, a logical `<h2>` per section,
  descriptive `alt` text on every gallery image (e.g. *"Marlowe Residence —
  Residential project in Portland, OR"*), and landmark elements (`<nav>`,
  `<main>`, `<footer>`).
- **Performance-friendly by default**: `next/font` (self-hosted, no
  render-blocking font requests), `next/image` with responsive `sizes`,
  AVIF/WebP output, and ISR (`revalidate: 3600`) on the gallery API route.
- **Security headers** (`next.config.js`) and crawlable-but-protected `/api/`
  routes (disallowed in `robots.txt`, since they return JSON, not pages).

### Honest expectations

Being transparent: **no combination of code can guarantee a website ranks
#1 for broad or unrelated search terms.** On-page technical SEO (everything
above) controls whether Google can find, render, and correctly understand
your page — it removes technical ceilings on ranking. Actual ranking position
also depends on factors outside any codebase:

- **Domain authority & backlinks** — reputable sites linking to you.
- **Content depth & freshness** — real project write-ups, blog/case-study
  content, and regular updates typically outrank a single static page for
  competitive terms.
- **Business signals** — a verified Google Business Profile, consistent
  NAP (name/address/phone) data, and reviews matter a lot for local
  "architect near me"-style queries.
- **Time** — new domains generally take weeks to months to be fully indexed
  and to accrue ranking signal.

**Recommended next steps once deployed:**
1. Replace all placeholder content (address, phone, images, `NEXT_PUBLIC_SITE_URL`,
   the `verification.google` code in `app/layout.tsx`) with real values.
2. Submit the site in [Google Search Console](https://search.google.com/search-console)
   and [Bing Webmaster Tools](https://www.bing.com/webmasters), and submit
   `sitemap.xml`.
3. Set up a free Google Business Profile with matching address/phone for
   local search visibility.
4. Add a handful of real backlinks (directories, press, partners).
5. Consider adding a `/blog` or `/case-studies` route later — Next.js's App
   Router makes this a straightforward addition — since fresh, in-depth
   content is one of the strongest ranking levers for topical queries.

---

## ♿ Accessibility & motion

- All interactive elements (drawer, modal, toasts, form fields) expose
  correct `aria-*` attributes and are keyboard-operable.
- Focus is visibly styled (`:focus-visible` in `globals.css`).
- `prefers-reduced-motion: reduce` disables/shortens all animation and smooth
  scrolling globally.

---

## 🛠 Tech stack

| Layer      | Choice                                   |
|------------|-------------------------------------------|
| Framework  | Next.js 14 (App Router, Server Actions/Route Handlers) |
| Styling    | Tailwind CSS                              |
| Animation  | Framer Motion                             |
| Database   | PostgreSQL                                |
| ORM        | Drizzle ORM (`drizzle-kit` for migrations)|
| Validation | Zod                                       |
| Icons      | lucide-react                              |
