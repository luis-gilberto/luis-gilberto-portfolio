# Kitchen

Interim client-review folders. Each artifact is a self-contained page. A proper client portal comes later.

## Add the next review

1. Create `studio/kitchen/<slug>/`.
2. Put a self-contained `index.html` in that folder, plus any assets it needs (PDF, images) as relative paths.
3. Do not add the folder to nav, sitemaps, feeds, or `ecosystem-status.yml`.

That’s it. Every folder under `studio/kitchen/` automatically gets:

- `robots.txt` disallow
- `X-Robots-Tag: noindex, nofollow`
- `Cache-Control: no-store`
- the shared-password gate

Live URL: `https://www.luis-gilberto.com/studio/kitchen/<slug>/`

## Gate

The password is the Cloudflare Pages environment variable `KITCHEN_PASSWORD` (Production, and Preview if you want previews locked). It is never committed. After a correct unlock, a signed `httpOnly` cookie keeps the folder open for 14 days.
