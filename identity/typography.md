# Manhattan Viral — Typography System

## Brand idea

The type system mixes **streetwear signage** (condensed, all-caps, tight tracking) with **editorial luxury** (serif display) and **clean tech UI** (geometric sans). This mirrors the brand: NYC street culture, premium presentation, AI-native operation.

---

## Typefaces

### 1. Display / Wordmark — Bebas Neue

- **Role:** Logo wordmark, large headlines, section titles, nav links, product names on cards
- **Why:** Condensed, all-caps, high impact. Reads like a billboard or storefront sign.
- **Weights used:** 400 (regular)
- **Google Fonts URL:** `https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap`
- **License:** SIL Open Font License — free for web and print

### 2. Editorial Display — Instrument Serif

- **Role:** Hero headlines, large editorial statements, "Limited run. Never restocked." moments
- **Why:** Adds refinement and contrast to the condensed sans. Softens the system without going soft.
- **Weights used:** 400, 400 italic
- **Google Fonts URL:** included with Sora bundle
- **License:** SIL Open Font License

### 3. Body / UI — Sora

- **Role:** Body copy, buttons, captions, prices, metadata, footer
- **Why:** Geometric sans with slightly squared terminals; modern, technical, legible at small sizes.
- **Weights used:** 300, 400, 500, 600, 700
- **Google Fonts URL:** `https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap`
- **License:** SIL Open Font License

### 4. Technical / Code — Space Mono

- **Role:** Code snippets, AI/agent references, product specs, data labels, small technical asides
- **Why:** Monospace signals the AI-native, builder-first story.
- **Weights used:** 400, 700
- **Google Fonts URL:** `https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap`
- **License:** SIL Open Font License

---

## Pairing rules

| Context | Typeface | Weight | Case | Tracking |
|---------|----------|--------|------|----------|
| Logo wordmark | Bebas Neue | 400 | UPPERCASE | +0.02em |
| Hero headline | Instrument Serif | 400 | Title Case or UPPERCASE | -0.01em |
| Section headline | Bebas Neue | 400 | UPPERCASE | +0.04em |
| Body copy | Sora | 400 | Sentence case | 0 |
| Button / CTA | Sora | 700 | UPPERCASE | +0.12em |
| Caption / label | Sora | 600 | UPPERCASE | +0.18em |
| Price | Sora | 600 | — | 0 |
| Technical note | Space Mono | 400 | — | 0 |

**Never use:**
- Brush script, graffiti, or decorative display fonts
- More than one weight of Bebas Neue in the same composition
- Italic Bebas Neue (does not exist; use Instrument Serif italic for emphasis)

---

## Type scale

| Token | Size | Line height | Use |
|-------|------|-------------|-----|
| `hero` | `clamp(3.5rem, 12vw, 8rem)` | 0.95 | Hero headline |
| `display` | `clamp(2.2rem, 5vw, 3.5rem)` | 1.1 | Section editorial headline |
| `title` | `clamp(2rem, 4vw, 2.8rem)` | 1.1 | Card/feature titles |
| `headline` | `1.8rem` | 1.1 | Borough names, sub-section titles |
| `body` | `1rem` | 1.5 | Long-form reading |
| `lead` | `0.9rem` | 1.7 | Descriptions, lead paragraphs |
| `ui` | `0.82rem` | 1.4 | Cards, product info |
| `caption` | `0.65rem` | 1.3 | Labels, tags, metadata |
| `micro` | `0.55rem` | 1.2 | Brand taglines, fine print |

---

## Fallback stacks

```css
--font-display: "Bebas Neue", Impact, "Arial Narrow", sans-serif;
--font-serif: "Instrument Serif", Georgia, "Times New Roman", serif;
--font-body: "Sora", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
--font-mono: "Space Mono", "SF Mono", Menlo, Consolas, monospace;
```

---

## Performance

- Load only the weights used.
- Use `font-display: swap` to avoid invisible text during load.
- Subset fonts if serving self-hosted versions (current Latin + basic punctuation is sufficient).
- Prefer preconnect to `https://fonts.gstatic.com`.

---

## Licensing note

All four typefaces are Google Fonts under SIL Open Font License. No pageview limits. Safe for Shopify, Vercel, social templates, and print.
