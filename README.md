# Manhattan Viral storefront

This directory is the free-hostable storefront for `www.manhattanviral.com`.
It is styled as a premium streetwear house that also sells digital products,
with Frank, Hermes, and Jules running the shop, marketing, SEO, and social loop.

Deployment target:
- Vercel preview / production

Runtime model:
- static HTML/CSS/JS
- catalog data in `catalog.json`
- Stripe hosted checkout via payment links
- one storefront for streetwear and digital drops
- built for Frank, Hermes, and Jules to operate without a Wix dependency

Refresh the catalog from Frank's repo data:

```bash
python3 -m core.storefront
```

That command syncs the catalog JSON and exports the static bundle files.

If you add Stripe payment links later, Frank will attach them from
`memory/money/stripe/*.json` during catalog sync.
