# morren.uk

Source for **[morren.uk](https://morren.uk/)** — Mark Morren's product-showcase site.

Plain HTML, CSS and one small progressive-enhancement script. No build step, no framework. Deployed from this repo to Cloudflare Pages on every push to `main`.

## Structure

```
/
├── index.html       Homepage (Home / About / Work / CV / Contact)
├── privacy.html     Privacy notice
├── styles.css       All styling
├── script.js        Accordion + active-nav
├── _headers         Cloudflare security headers + CSP
├── favicon.svg
├── robots.txt
├── sitemap.xml
└── screenshots/     Product screenshots used on /
```

## Local preview

Any static file server will do:

```bash
cd /path/to/repo
python3 -m http.server 8080
# open http://localhost:8080
```

Or use `npx serve .`, `wrangler pages dev .`, whatever you have to hand.

## Deploy

Cloudflare Pages is wired up to auto-deploy this repo on push to `main`.

## Email

`hello@morren.uk` is routed via Cloudflare Email Routing — no mailboxes are hosted on this domain.

## Fonts

Served from Bunny Fonts (GDPR-friendly CDN, no Google) — see the `<link>` in the `<head>` of each HTML file.
