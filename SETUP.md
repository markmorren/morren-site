# Setup — morren.uk first-time deploy

Everything below is a one-time setup. Once done, deploys happen automatically on `git push`.

Order matters — do the steps in sequence. Total time: ~30 minutes, most of it waiting for DNS.

---

## 1. Create the GitHub repo

1. Go to <https://github.com/new>.
2. **Repository name:** `morren-site`
3. **Visibility:** Public
4. **Do NOT** tick "Add a README" / "Add .gitignore" / "Choose a license" — the repo already has those locally.
5. Click **Create repository**.
6. Copy the remote URL (it'll look like `git@github.com:<your-username>/morren-site.git` or `https://github.com/<your-username>/morren-site.git`).

Then in Terminal:

```sh
cd ~/Developer/morren-site
git remote add origin <the URL you copied>
git branch -M main
git push -u origin main
```

---

## 2. Connect Cloudflare Pages to the repo

1. Go to <https://dash.cloudflare.com> → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
2. Authorise GitHub if prompted, pick the `morren-site` repo.
3. **Project name:** `morren-site`
4. **Production branch:** `main`
5. **Build settings:**
   - Framework preset: **None**
   - Build command: *(leave empty)*
   - Build output directory: *(leave as `/` — root of the repo)*
6. Click **Save and Deploy**. First build takes ~30 seconds.
7. Preview URL appears: `https://morren-site.pages.dev`. Open it — the site should render (screenshots will show placeholders until you add PNGs).

---

## 3. Set up Cloudflare Email Routing → `hello@morren.uk`

1. Cloudflare dashboard → pick `morren.uk` → **Email → Email Routing**.
2. If not enabled, click **Enable Email Routing** — it'll add the required MX + TXT records automatically.
3. **Custom addresses → Create address:**
   - Custom address: `hello`
   - Action: **Send to an email**
   - Destination: your private address (`mmorren@me.com`)
4. Verify the destination address from the email Cloudflare sends.

Test: email `hello@morren.uk` from any other inbox. It should land in your private inbox within seconds.

---

## 4. Create a Turnstile widget

1. Cloudflare dashboard → **Turnstile** → **Add site**.
2. Site name: `morren.uk`
3. Domains: `morren.uk`, `morren-site.pages.dev` (add both so it works on preview + prod)
4. Widget mode: **Managed**
5. Click **Create**. You'll get a **Site Key** and a **Secret Key**.
6. Open `index.html`, find `data-sitekey="YOUR_TURNSTILE_SITE_KEY"`, replace with the real Site Key, commit, push.
7. Keep the **Secret Key** handy for step 6.

---

## 5. Sign up for Resend + verify `morren.uk`

1. Go to <https://resend.com>, sign up (free tier = 100 emails/day, plenty).
2. **Domains → Add Domain** → `morren.uk`. Resend shows a set of DNS records (typically: one MX, one TXT for SPF, one TXT for DKIM).
3. Back in Cloudflare → `morren.uk` → **DNS**, add each record Resend asked for. Important: **set the DKIM record's Cloudflare proxy to "DNS only"** (grey cloud), not proxied.
4. Back in Resend, click **Verify**. May take a few minutes for DNS to propagate.
5. Once verified, **API Keys → Create API Key**, name it `morren-site`, copy the key (you only see it once).

> Note: your existing Cloudflare Email Routing MX record handles *incoming* mail. Resend's records are for *outbound* sending. They don't conflict — Email Routing uses its own MX, Resend uses SPF/DKIM TXT records.

---

## 6. Add environment variables to the Pages project

1. Cloudflare dashboard → **Workers & Pages** → `morren-site` → **Settings** → **Environment variables**.
2. Under **Production**, add four variables:

| Name | Value |
|---|---|
| `TURNSTILE_SECRET_KEY` | the Secret Key from step 4 |
| `RESEND_API_KEY` | the API key from step 5 |
| `CONTACT_EMAIL` | `hello@morren.uk` |
| `FROM_EMAIL` | `form@morren.uk` (any address on the verified domain works) |

3. **Mark `TURNSTILE_SECRET_KEY` and `RESEND_API_KEY` as "Encrypt"** (click the padlock icon).
4. Copy the same four variables into the **Preview** environment so the form works on `*.pages.dev` previews too.
5. Trigger a new deploy (Pages → Deployments → Retry deployment) so the env vars take effect.

---

## 7. Enable Cloudflare Web Analytics

1. Cloudflare dashboard → **Analytics & Logs** → **Web Analytics** → **Add a site**.
2. Hostname: `morren.uk`
3. Cloudflare gives you a short `<script>` tag with a `token`. Copy the token.
4. Open `index.html`, find the commented-out analytics block near the bottom, uncomment it, replace `YOUR_CWA_TOKEN` with the real one, commit, push.

No banner or consent needed — Cloudflare Web Analytics is cookie-less and collects no personal data.

---

## 8. Point `morren.uk` at the Pages project

Only do this once you're happy with the preview.

1. Cloudflare dashboard → **Workers & Pages** → `morren-site` → **Custom domains** → **Set up a custom domain**.
2. Enter `morren.uk`. Cloudflare handles the DNS automatically (since the domain is already in your Cloudflare account).
3. Also add `www.morren.uk` as a second custom domain — the `_redirects` file in the repo forwards it to the apex.
4. HTTPS cert issues in ~60 seconds. Test <https://morren.uk>.

---

## 9. End-to-end test the form

1. Open <https://morren.uk/#contact>.
2. Fill in name, email, message. Complete the Turnstile check. Hit **Send**.
3. Check `hello@morren.uk` → it should arrive in your private inbox via Email Routing.
4. Reply-to is set to the sender's email, so hitting reply goes to them, not back to yourself.

If it fails, check **Workers & Pages → `morren-site` → Functions → Real-time logs** for the error.

---

## 10. Pre-launch review (before telling anyone about it)

- **SENTINEL (security):** ask for a quick CSP + headers sanity check. The `_headers` file is a sensible starting point but worth a second pair of eyes.
- **AEGIS (data protection):** ask for a sanity-check on `privacy.html` wording — especially the "last updated" date and the retention line.
- Lighthouse run on the live URL — target ≥95 across Performance, Accessibility, Best Practices, SEO.

---

## After launch — day-to-day editing

- **Changing copy:** edit `index.html`, commit, push → Pages redeploys in ~20 seconds.
- **Adding a screenshot:** drop a PNG into `/screenshots/` with the correct filename (see `screenshots/README.md`), commit, push.
- **Changing a product status:** edit the `<span class="chip …">` in `index.html`.
- **Adding a sixth product later:** copy one `<article class="product">` block, change the content. No component system needed — it's five blocks, not fifty.
