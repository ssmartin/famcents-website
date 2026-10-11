# famcents.app

The website for FamCents, the private family expense tracker: homepage, privacy policy, support and terms.
Plain HTML and CSS, no build step; hosted with GitHub Pages on the custom domain in `CNAME`.

| Page | URL | File |
|---|---|---|
| Homepage | https://famcents.app/ | `index.html` |
| Privacy policy | https://famcents.app/privacy | `privacy/index.html` |
| Support | https://famcents.app/support | `support/index.html` |
| Terms | https://famcents.app/terms | `terms/index.html` |

## Before launch

- [ ] Set up the **support@famcents.app** mailbox (or forwarding) — it's used on every page.
- [ ] **Terms**: fill in the developer name and address and the effective date; have the terms reviewed.
- [ ] **Privacy policy**: keep the text in sync with the app (`src/lib/legal.ts` and `docs/privacy-policy.md` in
      the FamCents repository) and update the effective date.
- [ ] **Screenshots**: add real ones to `assets/screenshots/` and an `<img>` in each `.shot` on the homepage.
- [ ] **Store links**: replace the "Coming soon" buttons with the official App Store / Google Play badges and links.
- [ ] Use a real FamCents icon for `assets/favicon.png` once the app icon is final.

## Hosting with GitHub Pages

1. Repository → **Settings → Pages** → Source: **Deploy from a branch**, branch `main`, folder `/ (root)`.
2. Custom domain: `famcents.app` (already in `CNAME`), then tick **Enforce HTTPS** once the certificate is ready.
3. At your domain registrar, add DNS records for the apex domain:
   - `A` records for `@`: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `AAAA` records for `@`: `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`
   - optional `CNAME` for `www` → `ssmartin.github.io`
   (`.app` domains always require HTTPS; GitHub Pages provides the certificate.)

## Preview locally

Open `index.html` in a browser, or run a small server so the `/privacy/`-style links work:

```bash
npx serve .
```
