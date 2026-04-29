# phrona.io — landing site

The Phrona, Inc. marketing site at [phrona.io](https://phrona.io).

## Stack

- **Next.js 16** (App Router, server actions for the inquiry form)
- **Tailwind CSS v4**
- **Montserrat** (headings, body) + **Geist Mono** (numerals) via `next/font/google`
- **Vercel** for hosting + **Vercel Analytics** for traffic insight
- **nodemailer** over Google Workspace SMTP for transactional email

## Local development

```bash
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

## Environment variables

For inquiry-form submissions to send real email in production, set:

| Variable | Description |
|---|---|
| `SMTP_USER` | Sending mailbox (e.g. `aaron@phrona.io`) |
| `SMTP_PASS` | Google Workspace **App Password** (not the account login) |
| `INQUIRY_TO` | Recipient mailbox — defaults to `hello@phrona.io` |
| `SMTP_HOST` | Defaults to `smtp.gmail.com` |
| `SMTP_PORT` | Defaults to `587` |

If `SMTP_USER` / `SMTP_PASS` are unset, the action logs submissions to the server console and returns success — useful for local dev without configuring SMTP.

## Build

```bash
npm run build
```

All routes prerender as static; the form action stays dynamic for runtime SMTP.

## Brand assets

Generated via:

```bash
node scripts/generate-brand-assets.js
```

Reads source SVGs from `public/logos/` and writes:

- `src/app/icon.png` (32×32), `apple-icon.png` (180×180), `icon.svg` (vector)
- `src/app/opengraph-image.png` (1200×630), `twitter-image.png`
- `public/icon-192.png`, `icon-512.png`

## Legal pages

`/privacy` and `/terms` render markdown from `src/content/privacy.md` and `src/content/terms.md` via the `MarkdownPage` component (`src/components/markdown-page.tsx`).

## License

Proprietary. © 2026 Phrona, Inc.
