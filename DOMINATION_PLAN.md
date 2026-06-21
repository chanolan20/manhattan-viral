# Manhattan Viral — Domination Plan

## North Star
www.manhattanviral.com becomes the hottest streetwear website on the internet.
Top 3 Google for streetwear + AI keywords. Viral loops. Brand recognition.
Frank + Jules automate everything end-to-end.

---

## Phase 1: Foundation (Week 1)

### 1.1 Visual Identity Overhaul
- [ ] **Hero 3D product viewer** — replace canvas blobs with a WebGL 3D viewer (Three.js) showing a rotating streetwear garment. Users can drag to rotate. The hero becomes an interactive product experience.
- [ ] **Custom typeface** — Commission or generate a bespoke display font for the "MV" monogram. Every luxury streetwear brand has a signature typeface.
- [ ] **Lookbook layout** — Replace card grids with full-bleed editorial spreads. Large product imagery with model context. Asymmetric, magazine-style composition.
- [ ] **Micro-animation system** — Every interactive element has a purpose-built animation (button press = scale dip, card hover = subtle parallax, nav = line draw, scroll = sticky reveals). Consistent motion language.
- [ ] **Video backgrounds** — Short 5-10s seamless loops of product details (fabric texture, print close-up, packaging) as card backgrounds instead of gradients.

### 1.2 Performance (Lighthouse 100)
- [ ] **Perfect Core Web Vitals**: LCP <1.2s, FID <50ms, CLS <0.05
- [ ] **Font subsetting** — Subset Instrument Serif and Sora to only used characters (save ~100KB)
- [ ] **Critical CSS inline** — No render-blocking CSS. Above-fold styles in `<style>` tag, rest lazy-loaded.
- [ ] **Image optimization** — WebP/AVIF with responsive srcset. Preload hero image.
- [ ] **JS code splitting** — Fluid canvas is 2KB but runs on every page. Lazy-load it until after interaction.
- [ ] **CDN tuning** — Custom cache rules on Vercel for static assets (immutable, 1 year cache)

### 1.3 Technical SEO
- [ ] **Semantic HTML audit** — Proper `<article>`, `<section>`, `<header>`, `<nav>`, `<main>`, `<footer>` hierarchy with correct heading levels
- [ ] **Structured data rich results** — Product schema with price, availability, reviews. Organization schema. Site search schema.
- [ ] **Breadcrumb schema** — Every product page gets breadcrumb structured data
- [ ] **XML sitemap with images** — Full sitemap including product image URLs with captions
- [ ] **RSS feed for drops** — RSS/Atom feed for new products and drops (Google picks up RSS for news)
- [ ] **oEmbed support** — When someone pastes a product URL, it renders as a rich card (drives social shares)

---

## Phase 2: AI & Google Domination (Week 2-3)

### 2.1 AI Crawler Optimization
- [ ] **LLM-friendly content** — Add structured `<meta>` tags for AI crawlers (Claude, ChatGPT, Gemini, Perplexity). Each product page has a perfect AI summary.
- [ ] **`/ai-summary.json` endpoint** — JSON endpoint that returns clean, parseable product data for AI agents. Frank auto-updates it.
- [ ] **Pages for AI training** — Create seed pages that rank for "best streetwear brands", "streetwear trends 2026" etc. with comprehensive, original content optimized for both humans and AI crawlers.
- [ ] **Answer in SERP** — Target featured snippets for long-tail queries. FAQ schema with common streetwear questions.
- [ ] **Video sitemap** — Submit product detail videos to Google Video search.

### 2.2 Content Engine (Frank-powered)
- [ ] **Automated lookbook generator** — Frank generates a weekly lookbook page. New products, styled shots, editorial copy. Fresh content every week = Google loves it.
- [ ] **AI fashion blog** — Frank posts 3x/week on streetwear topics: trend analysis, brand deep-dives, styling guides. Original research and AI-generated insights.
- [ ] **Product detail pages** — Every product gets its own URL (`/product/automation-toolkit`) with unique, high-quality 500+ word descriptions, specs, and usage guides.
- [ ] **Social proof aggregation** — Frank scrapes and displays real social mentions, tweets, and posts about Manhattan Viral products.

### 2.3 Search Dominance
- [ ] **Keyword cluster strategy** — Target clusters:
  - "luxury streetwear" + "digital streetwear" + "AI streetwear"
  - "limited drop" + "exclusive streetwear" + "hype streetwear"
  - "Manhattan Viral" + "Frank AI" + "Jules coding"
- [ ] **Backlink machine** — Frank automates outreach to streetwear blogs, AI publications, and developer blogs for guest posts and backlinks.
- [ ] **Google Discover optimization** — High-quality, original images with proper alt text. Compelling titles. Timely content = Google Discover traffic.
- [ ] **Programmatic SEO** — Category pages, tag pages, "best [category] streetwear" pages auto-generated from product data.

---

## Phase 3: Streetwear Experience (Week 3-4)

### 3.1 Hype Mechanics
- [ ] **Live drop countdown** — Timer showing when next drop launches. Creates urgency.
- [ ] **Scarcity indicators** — "Only X remaining" with real inventory tracking. Fake scarcity kills trust — real scarcity builds it.
- [ ] **Waitlist system** — Out-of-stock products let users join a waitlist. Notify when restocked.
- [ ] **Collection tiers** — "Common / Rare / Legendary" tier system for digital products. NFTs without the blockchain.
- [ ] **Random drop** — Every day at a random time, one product gets a 24h discount or exclusive variant. Users check constantly.

### 3.2 Social Integration
- [ ] **Instagram feed embed** — Live Instagram grid showing real people wearing/screencapping products. Social proof.
- [ ] **Twitter/X drop announcements** — Frank auto-posts when new products launch. Thread with product details.
- [ ] **Share-to-unlock** — Users unlock exclusive content (wallpaper, lookbook PDF) by sharing a product link.
- [ ] **User-generated content wall** — Buyers submit photos/reviews that get featured on the product page.
- [ ] **TikTok-style short videos** — 15s product showcase loops autoplaying on product cards.

### 3.3 Community
- [ ] **VIP tier system** — Free / Silver / Gold / Platinum based on purchase history or referrals.
- [ ] **Referral program** — "Share with a friend, both get 10% off." Tracked via unique links.
- [ ] **Leaderboard** — Top referrers and most engaged users displayed on a hall-of-fame page.
- [ ] **Discord integration** — Real-time drop alerts in a Discord server. Frank posts there automatically.
- [ ] **Exclusive drops for members** — Private checkout links only visible to logged-in users.

---

## Phase 4: Technical Excellence (Week 4-5)

### 4.1 Infrastructure
- [ ] **Edge Functions** — Move catalog API to Vercel Edge Functions. Zero cold starts, global latency <50ms.
- [ ] **ISR for product pages** — Incremental Static Regeneration. Product pages are static HTML, revalidated when Frank updates the catalog.
- [ ] **Streaming SSR** — Hero section streams immediately, rest loads progressively.
- [ ] **Service worker** — Offline support, push notifications for drops, background sync.
- [ ] **Observability** — Real User Monitoring (RUM) for Core Web Vitals. Frank auto-detects regressions.

### 4.2 Security
- [ ] **CSP headers** — Strict Content Security Policy. No inline scripts except trusted hashes.
- [ ] **Subresource Integrity** — SRI on all external resources.
- [ ] **Rate limiting** — Vercel WAF rules on API endpoints.
- [ ] **Automated security scan** — Frank runs `npm audit`, dependency checks, and OWASP scan weekly.
- [ ] **Bug bounty page** — `/security` page with disclosure policy.

### 4.3 Automation (Frank + Jules)
- [ ] **Auto-catalog updates** — Frank pushes new products to catalog.json → site redeploys. Zero manual steps.
- [ ] **Auto-social** — New product → Frank posts to X, Instagram, Discord, and RSS simultaneously.
- [ ] **Auto-SEO audit** — Weekly Lighthouse + SEO audit run by Frank. PR filed if scores drop.
- [ ] **Auto-performance budget** — Frank monitors bundle size. PR filed if JS/CSS exceeds budget.
- [ ] **Auto-backlink monitor** — Frank tracks new backlinks weekly. Reports new opportunities.

---

## Phase 5: Growth Loops (Week 5-6)

### 5.1 Viral Mechanics
- [ ] **"Build your look" tool** — Interactive mix-and-match product combinations. Users create and share their outfit. Drives massive referral traffic.
- [ ] **Digital lookbook PDF** — Premium downloadable lookbook with every purchase. Users share it = free marketing.
- [ ] **Limited edition digital art** — Each product includes a unique AI-generated artwork piece. Collectible. Shareable.
- [ ] **Streak system** — Daily visits earn points. Points unlock exclusive content and discounts.
- [ ] **Unlockable badges** — "First drop", "OG collector", "VIP member" badges displayed on profile.

### 5.2 Revenue Expansion
- [ ] **Stripe checkout** — Actually integrate Stripe (requires new API key). One-click buy for returning users.
- [ ] **Bundle deals** — "Complete the look" bundles at discount. Algorithmically suggested by Frank.
- [ ] **Subscription tier** — "$X/month = early access + exclusive drops + discount on everything." Recurring revenue.
- [ ] **Digital/physical hybrids** — Buy a digital product, get a physical sticker/sticker pack shipped.
- [ ] **Crypto payments** — Accept SOL, ETH for drops. Niche but culture-relevant for streetwear.

### 5.3 Marketplace Positioning
- [ ] **"AI-native streetwear" narrative** — First streetwear brand built and operated by AI agents. Media-worthy angle.
- [ ] **Press kit** — `/press` page with brand assets, logo, product photos, founder story, AI angle.
- [ ] **Case studies** — "How Frank automated a streetwear brand" — publish on HackerNews, IndieHackers, dev blogs.
- [ ] **Product Hunt launch** — Launch the "AI streetwear storefront" as a product. Massive traffic spike.
- [ ] **Collaborations** — Partner with AI artists for limited drops. Each collab = new audience.

---

## Phase 6: Sustained Dominance (Ongoing)

### 6.1 Analytics & Optimization
- [ ] **Frank runs weekly analytics review** — Traffic, conversion, bounce rate, top pages, keyword rankings.
- [ ] **A/B testing framework** — Test headlines, CTAs, pricing, layouts. Frank picks the winner.
- [ ] **Heatmap analysis** — Hotjar/Clarity integration. Frank reviews recordings weekly.
- [ ] **Funnel optimization** — Drop-off analysis from landing → product → checkout. Frank files improvement PRs.
- [ ] **Conversion rate target** — >5% overall, >15% for returning visitors.

### 6.2 Continuous Improvement
- [ ] **Jules weekly code review** — Scans for tech debt, performance issues, security vulnerabilities.
- [ ] **Frank agent squad** — Dedicated Frank agents for SEO, Content, Social, and Analytics running 24/7.
- [ ] **Monthly major release** — One significant feature every month. Keeps the site fresh and gives Google new content to index.
- [ ] **Quarterly design refresh** — Subtle visual updates every 3 months. Prevents the site from looking stale.
- [ ] **Daily uptime monitoring** — Frank checks site health every 5 minutes. Auto-deploys fix if down.

### 6.3 Key Metrics Dashboard
| Metric | Target |
|--------|--------|
| Google ranking (streetwear) | Top 3 |
| Monthly organic traffic | 100k+ visitors |
| Page load time | <1s globally |
| Conversion rate | >5% |
| Returning visitors | >40% |
| Social followers | 10k+ across platforms |
| Monthly revenue | $10k+ |
| Backlinks | 500+ unique domains |
| AI crawler index rate | 100% of pages |

---

## Immediate Next Steps (Do Today)

1. Add structured data (Product + Organization JSON-LD) to every product — already partially done, needs per-product pages
2. Set up Frank auto-posting for new products (X + RSS + Discord)
3. Build `/product/` slug pages for SEO (each product gets unique URL)
4. Enable Vercel Analytics for RUM data
5. Create press kit page

---

*This plan is living. Frank updates it weekly based on what's working.*
