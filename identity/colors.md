# Manhattan Viral — Color System

## Brand idea

Dark, premium, NYC. The palette is built on near-black with warm metallic gold and signal orange. Neutrals carry most of the surface area; color is used sparingly for hierarchy and heat.

---

## Primary colors

| Name | Hex | RGB | HSL | Role |
|------|-----|-----|-----|------|
| **MV Black** | `#0a0a0a` | `10, 10, 10` | `0°, 0%, 4%` | Primary background, dominant brand dark |
| **MV Gold** | `#d4a844` | `212, 168, 68` | `42°, 63%, 55%` | Signature accent, premium moments, links |
| **MV Orange** | `#e8613a` | `232, 97, 58` | `14°, 79%, 57%` | CTAs, badges, heat, urgency |

## Secondary / neutrals

| Name | Hex | RGB | HSL | Role |
|------|-----|-----|-----|------|
| **Card** | `#111111` | `17, 17, 17` | `0°, 0%, 7%` | Cards, panels, secondary surfaces |
| **Elevated** | `#141414` | `20, 20, 20` | `0°, 0%, 8%` | Hover states, raised surfaces |
| **Border** | `#222222` | `34, 34, 34` | `0°, 0%, 13%` | Dividers, borders, subtle separation |
| **Mid Gray** | `#555555` | `85, 85, 85` | `0°, 0%, 33%` | Disabled, tertiary text |
| **Muted** | `#888888` | `136, 136, 136` | `0°, 0%, 53%` | Captions, metadata, de-emphasized copy |
| **Soft** | `#aaaaaa` | `170, 170, 170` | `0°, 0%, 67%` | Placeholder text |
| **White** | `#ffffff` | `255, 255, 255` | `0°, 0%, 100%` | Primary text on dark, inverse surfaces |

## Semantic colors

| Name | Hex | Usage |
|------|-----|-------|
| **Success** | `#5cae5c` | In-stock, confirmations |
| **Warning** | `#e8c870` | Low stock, attention |
| **Error** | `#e85c5c` | Sold out, errors, sale badges |
| **Info** | `#5caead` | Announcements, neutral alerts |

---

## Contrast & accessibility

WCAG AA requires **4.5:1** for normal text and **3:1** for large text (18pt+ or 14pt+ bold).

| Foreground | Background | Ratio | Pass AA normal? | Pass AA large? |
|------------|------------|-------|-----------------|----------------|
| `#ffffff` on `#0a0a0a` | 19.9:1 | Yes | Yes |
| `#ffffff` on `#111111` | 18.4:1 | Yes | Yes |
| `#d4a844` on `#0a0a0a` | 8.4:1 | Yes | Yes |
| `#e8613a` on `#0a0a0a` | 6.8:1 | Yes | Yes |
| `#888888` on `#0a0a0a` | 5.0:1 | Yes | Yes |
| `#555555` on `#0a0a0a` | 2.4:1 | No | No |
| `#d4a844` on `#ffffff` | 2.4:1 | No | No |
| `#e8613a` on `#ffffff` | 3.1:1 | No | Yes (large only) |
| `#0a0a0a` on `#ffffff` | 19.9:1 | Yes | Yes |

**Key rule:** Gold and orange are accent colors on dark surfaces. Do not use them as body text on white. For gold/orange on light surfaces, use a dark outline or background block.

---

## Color pairings

### Allowed

- White text on MV Black — primary reading experience
- Gold on MV Black — premium links, hover states, "RIP X" highlights
- Orange on MV Black — primary CTAs, drop badges
- MV Black on White — inverse sections, press kit, printed matter
- Border `#222` on MV Black — subtle structure without visual noise

### Disallowed

- Gold on white for small text (fails contrast)
- Orange on white for body text (fails contrast)
- Pure `#000000` as a background (use `#0a0a0a`)
- Muted gray `#888` on white for body text (too low contrast; use `#555` or darker)

---

## Usage ratios

A typical Manhattan Viral composition should approximate:

- **80%** MV Black / Card / Border / White (neutrals)
- **15%** MV Gold (premium accent, links, highlights)
- **5%** MV Orange (CTAs, urgency)

Never let gold and orange compete at equal weight. One moment, one accent.

---

## Color blindness

- Do not rely on color alone for status. Pair semantic colors with text labels or icons.
- Gold (#d4a844) and orange (#e8613a) may appear similar to some deuteranopia users. Use shape/weight/label to distinguish CTAs from premium links.

---

## Print

For screen-printed apparel and packaging, the colors translate as:

| Digital | Suggested Pantone (coated) | Notes |
|---------|---------------------------|-------|
| `#0a0a0a` | Black C | Use solid black for fabric |
| `#d4a844` | 7555 C | Metallic gold foil where budget allows |
| `#e8613a` | 172 C | Bright signal orange |
| `#ffffff` | White | Use negative space on dark garments |

---

## Shopify theme mapping

The Shopify store should use these schemes:

| Scheme | Background | Text | Button | Button label |
|--------|------------|------|--------|--------------|
| `scheme-1` | `#0a0a0a` | `#ffffff` | `#e8613a` | `#ffffff` |
| `scheme-2` | `#111111` | `#ffffff` | `#d4a844` | `#0a0a0a` |
| `scheme-3` | `#ffffff` | `#0a0a0a` | `#0a0a0a` | `#ffffff` |
| `scheme-4` | `#d4a844` | `#0a0a0a` | `#0a0a0a` | `#d4a844` |
| `scheme-5` | `#e8613a` | `#ffffff` | `#ffffff` | `#e8613a` |
