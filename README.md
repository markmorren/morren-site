# morren-site

Source for **[morren.uk](https://morren.uk/)** — Mark Morren's product-showcase site.

Plain HTML, CSS, and a single Cloudflare Pages Function for the contact form. No build step.

## How the site is put together

| File | Purpose |
|---|---|
| `index.html` | Single-page homepage (hero, work, about, contact) |
| `privacy.html` | Privacy notice |
| `styles.css` | Everything visual — tokens at top of file |
| `script.js` | Fade-in on scroll + contact form submit |
| `functions/api/contact.js` | Pages Function: validates + sends form via Resend |
| `_headers` | Security headers + caching for Cloudflare Pages |
| `_redirects` | www → apex |
| `screenshots/` | Product screenshots (drop PNGs here) |

## Editing copy

Open `index.html`. All product copy lives in `<article class="product">` blocks — change the text directly and commit.

## Deploying

Pushes to `main` auto-deploy to Cloudflare Pages. Preview URL: `morren-site.pages.dev`.

## Setup

First-time setup (Cloudflare Pages, Email Routing, Resend, Turnstile, DNS): see **[SETUP.md](./SETUP.md)**.
