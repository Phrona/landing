# Phrona — phrona.io marketing site

This is the public marketing site for [Phrona, Inc.](https://phrona.io). Pre-product, private-beta, founder-cohort recruiting.

## Project structure

```
src/app/                  Next.js App Router routes (/, /privacy, /terms)
  ├── page.tsx            Landing page (hero, pain grid, bio, inquire form)
  ├── privacy/            /privacy → MarkdownPage rendering src/content/privacy.md
  ├── terms/              /terms → MarkdownPage rendering src/content/terms.md
  ├── actions/inquire.ts  Server action: validates form, sends via SMTP
  ├── icon.png/svg        Favicon (navy badge + white P-mark)
  ├── apple-icon.png      Apple touch icon (180x180)
  └── opengraph-image.png OG share image (1200x630, navy + wordmark)

src/components/
  ├── header.tsx          Hides on /, shows on legal pages with "← Back to Home"
  ├── footer.tsx          Global, "© 2026 Phrona, Inc."
  ├── inquire-form.tsx    Client form, calls submitInquiry server action
  └── markdown-page.tsx   Renders markdown with TOC + numbered section badges

src/content/              Markdown source for legal pages
  ├── privacy.md          Phrona, Inc. as data controller
  └── terms.md            Phrona, Inc. as operating entity

public/logos/             SVG sources (Light/Dark, full lockup + P-mark only)
scripts/                  Brand asset generators
```

## Brand discipline

- **Background:** `#081122` navy (full-bleed dark canvas)
- **Foreground:** white type (`#ffffff`)
- **Single accent:** cyan-blue `rgb(120, 180, 255)` — exclusively in the logo glow + CTA hover halo + section badges + accent underlines
- **Fonts:** Montserrat (headings, body), Geist Mono (numerals only — has slashed zero)
- **Aesthetic:** dark-mode marketing site, asymmetric density per the briefing-dossier framing in the broader Phrona work (B146)

## Headline + framing (locked)

- Hero headline: *"Your strategy. Made coherent. Brought to life."* (one line, non-italic, max-w-5xl)
- Pain section eyebrow: "Strategy is complex. It's easy to get lost." (uppercase, tracked)
- Pain section H2: "Does any of this feel familiar?"
- Unifier: "These breakdowns share a root cause: **strategy without infrastructure.**"
- 3-beat pattern: "Sales has Salesforce. / Finance has NetSuite. / HR has Workday." → punchline: **"Strategy has nothing."** (uppercase tracked, white)
- Resolution: "Phrona is the missing link — it brings your strategy to life and keeps it current while the world changes around you."
- All CTAs: **"Join our founding cohort"** (final form CTA: **"Submit"**)

## Legal entity

- **Phrona, Inc.** — the operating entity for this site (per April 2026 incorporation plan)
- Address: 6209 Hewetson Dr, Austin, TX 78738
- Email: hello@phrona.io
- Effective date for legal docs: April 28, 2026
- Privacy + terms drafted; lawyer-review punch list captured in MEMORY (`project_lawyer_review_punch_list.md`)

## Related work (NOT in this repo)

The broader Phrona product (app, backend, design specs, LOCKED L0–L5 prompts) still lives at `~/Desktop/ACSG/ClaudeCode/products/phrona/`. That migration to `~/Desktop/Phrona/{app,backend}/` is a deferred refactor tied to product launch. For now:

- **This repo (`Phrona/landing`)** — public marketing site, deployed to phrona.io via Vercel
- **`~/Desktop/ACSG/ClaudeCode/products/phrona/`** — product app, backend, internal docs, action register, handoffs
- **`~/Desktop/ACSG/ClaudeCode/_handoffs/phrona/`** — Phrona session handoffs (continue here for now)

## Deploy

- **GitHub:** [Phrona/landing](https://github.com/Phrona/landing) (private)
- **Hosting:** Vercel — project `phrona-marketing-landing` on Aaron's personal Hobby account (`aaronchockla's projects`); no Phrona team exists. Hobby retention limits: runtime logs ~1 hour, observability ~12 hours — treat Vercel logs as non-durable.
- **Domain:** phrona.io (apex) + www.phrona.io (redirect)
- **Email infra:** Google Workspace (aaron@phrona.io, hello@phrona.io); SPF/DKIM/DMARC all PASS as of 2026-04-27
- **Form backend:** server action → nodemailer over Workspace SMTP. Env vars: `SMTP_USER`, `SMTP_PASS` (Workspace App Password), `INQUIRY_TO` (unset in prod = correct: defaults to aaron@phrona.io direct, dodging the hello@ alias self-send quirk). Honeypot field must keep an autofill-meaningless name (never url/company/website — Chrome fills hidden fields it recognizes and the submission silently drops); submissions are NOT persisted anywhere — the notification email is the only durable record.

## Sessions

Slash commands available globally (`/handoff`, `/enrich`, `/enrich-investor`) — promoted to `~/.claude/commands/` so they work in every working directory.

Memory is path-keyed: this directory's memory is separate from the broader ACSG/ClaudeCode memory. Important Phrona context — incorporation, positioning, pricing, etc. — currently lives in the ACSG memory; bridge by reading what's needed at session start.

When starting a new session here:
1. Read this `CLAUDE.md`
2. Read `README.md`
3. If working on legal copy: also read `src/content/privacy.md` and `src/content/terms.md`
4. If working on positioning: cross-reference `~/Desktop/ACSG/ClaudeCode/products/phrona/docs/POSITIONING_DECISIONS.md` and `COHERENCE_RESONANCE_CONCEPT.md`
