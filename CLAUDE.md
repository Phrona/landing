# Phrona — phrona.io marketing site

This is the public marketing site for [Phrona, Inc.](https://phrona.io). Pre-product, private-beta, founder-cohort recruiting.

## Project structure

```
src/app/                  Next.js App Router routes
  ├── page.tsx            Home: hero → problem → how it works (short) → two paths → Connect
  ├── how-it-works/       The full explainer (was /understanding-phrona; redirects)
  ├── for-operators/      Operator brief (email-gated), then the shared next steps (Snapshot, founding beta)
  ├── for-investors/      Investor brief (email-gated), then the same next steps
  ├── snapshot/           Request a free Strategy Snapshot (?for=investor preselects a portfolio company)
  ├── connect/            "Start with one important decision" + inquiry form (operator/investor/other)
  ├── download/           Counted PDF downloads; briefs need a signed link (BRIEF_LINK_SECRET)
  ├── privacy/            /privacy → MarkdownPage rendering src/content/privacy.md
  ├── terms/              /terms → MarkdownPage rendering src/content/terms.md
  ├── actions/inquire.ts  Cohort application (submitInquiry) and /connect (submitConnect)
  ├── actions/request-brief.ts  "Email me the brief": records the request, emails a signed link
  ├── actions/request-snapshot.ts  Snapshot request: records it, notifies Aaron, acknowledges by email
  ├── actions/subscribe.ts      Newsletter sign-up (footer, /how-it-works band)
  ├── icon.png/svg        Favicon (navy badge + white P-mark)
  ├── apple-icon.png      Apple touch icon (180x180)
  └── opengraph-image.png OG share image (1200x630, navy + wordmark)

src/components/
  ├── header.tsx          Every page: wordmark, How it works · For operators · For investors, Connect button
  ├── footer.tsx          Global, four columns: Phrona · Get started · Stay informed (newsletter) · Company
  ├── next-steps.tsx      Shared close of both audience pages: test it out (Snapshot), join the founding beta
  ├── snapshot-request-form.tsx, newsletter-form.tsx
  ├── inquire-form.tsx    Client form, calls submitInquiry server action
  └── markdown-page.tsx   Renders markdown with TOC + numbered section badges

src/lib/mail.ts           The emails' shared shell, header, colours and Workspace SMTP transport

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

**2026-11-13, Aaron: the site is due a full reorganisation around decisions, and the list below is out of date.** The ruled H1 is *"Decisions are expensive."*; its second line is not yet ruled. It goes live with the reorganisation; until then the live hero still reads "Phrona is infrastructure for strategy." The pain-section lines below (eyebrow, "Does any of this feel familiar?", the unifier, the resolution) describe an earlier home page, not the live one. Canonical record: the Phrona repo's `docs/POSITIONING_DECISIONS.md`, P2 "Decisions-led messaging".

- Hero headline (live until the reorganisation): *"Phrona is infrastructure for strategy."* (the older "Your strategy. Made coherent. Brought to life." is retired)
- Pain section eyebrow: "Strategy is complex. It's easy to get lost." (uppercase, tracked)
- Pain section H2: "Does any of this feel familiar?"
- Unifier: "These breakdowns share a root cause: **strategy without infrastructure.**"
- 3-beat pattern: "Sales has Salesforce. / Finance has NetSuite. / HR has Workday." → punchline: **"Strategy has nothing."** (uppercase tracked, white)
- Resolution: "Phrona is the missing link — it brings your strategy to life and keeps it current while the world changes around you."
- **Calls to action (2026-11-07, Aaron):** the site is organised by audience. **Connect** is the one persistent header button; **Connect with Phrona** is the fuller form where a page closes. Home's only hero action is **See how it works**. Both audience pages close the same way (2026-11-09, Aaron): **test it out** (a free Strategy Snapshot, /snapshot) then **join the founding beta** ("Apply to join"); investors may join. The site never states a cohort size; it says availability is limited. The Snapshot sits beside Connect at page closes and in the footer, never in the header. The newsletter sign-up is the footer's Stay informed column and a band at the end of /how-it-works; the brief forms' unticked box is the product-updates list. Explanatory links go to `/how-it-works`; conversation and inquiry links go to `/connect`. `/learn-more` redirects to `/connect` because circulating briefs link there.

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
- **Form backend:** server action → nodemailer over Workspace SMTP. Env vars: `SMTP_USER`, `SMTP_PASS` (Workspace App Password), `INQUIRY_TO` (unset in prod = correct: defaults to aaron@phrona.io direct, dodging the hello@ alias self-send quirk). Honeypot field must keep an autofill-meaningless name (never url/company/website — Chrome fills hidden fields it recognizes and the submission silently drops); submissions are persisted to Neon (`landing_inquiries`, `landing_brief_requests`, `landing_subscribers`, `landing_downloads`, `landing_snapshot_requests`, created by the product backend's migrations 013, 085, 086, 092) through `DATABASE_URL`, which logs in as `phrona_site`, a role limited to those five tables. `landing_subscribers.audience` separates the two lists: `newsletter`, and `operators`/`investors` for product updates (Production only; see the Phrona repo's `docs/SECRETS.md`). The notification email is sent as well.

## Sessions

Slash commands available globally (`/handoff`, `/enrich`, `/enrich-investor`) — promoted to `~/.claude/commands/` so they work in every working directory.

Memory is path-keyed: this directory's memory is separate from the broader ACSG/ClaudeCode memory. Important Phrona context — incorporation, positioning, pricing, etc. — currently lives in the ACSG memory; bridge by reading what's needed at session start.

When starting a new session here:
1. Read this `CLAUDE.md`
2. Read `README.md`
3. If working on legal copy: also read `src/content/privacy.md` and `src/content/terms.md`
4. If working on positioning: cross-reference `~/Desktop/ACSG/ClaudeCode/products/phrona/docs/POSITIONING_DECISIONS.md` and `COHERENCE_RESONANCE_CONCEPT.md`
