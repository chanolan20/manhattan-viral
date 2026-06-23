# Manhattan Viral — Iconography

## Style

- **Outline style**, single weight
- **Stroke:** 1.5px on 24×24 grid; 1px on 16×16
- **Caps:** rounded
- **Corners:** sharp 90° where appropriate, 2px radius on outer corners
- **Optical correction:** allowed for visual balance

## Grid

- Base size: **24×24px**
- Compact size: **16×16px**
- Touch target: minimum **44×44px** when used as a button

## Color

- Dark surfaces: white `#ffffff` or gold `#d4a844`
- Light surfaces: black `#0a0a0a` or orange `#e8613a`
- Disabled: mid gray `#555555`

## Core icon set

| Icon | Usage |
|------|-------|
| `cart` | Add to cart, cart drawer |
| `menu` | Mobile navigation |
| `search` | Predictive search |
| `close` | Dismiss modals, drawers |
| `arrow-right` | CTAs, links |
| `arrow-down` | Expand accordions |
| `chevron` | Carousels, breadcrumbs |
| `social-instagram` | Footer, social links |
| `social-tiktok` | Footer, social links |
| `social-x` | Footer, social links |
| `social-facebook` | Footer, social links |
| `social-pinterest` | Footer, social links |
| `truck` | Shipping info |
| `shield` | Security/trust |
| `check` | Success states |
| `warning` | Alerts |
| `fire` | Limited drop, hype |
| `tag` | Sale badge |
| `location` | NYC / borough context |

## Rules

- Use the same stroke weight across every icon in a composition.
- Do not mix filled and outline icons in the same UI region.
- Icons should be geometric and minimal — no illustrations inside icons.
- Always pair with a text label when the icon meaning is ambiguous.

## Adding new icons

1. Start from the 24×24 Figma/Sketch template.
2. Use a 1.5px stroke on a 2px grid.
3. Convert strokes to outlines before exporting SVG.
4. Name with `mv-icon-[name].svg`.
5. Add to `iconography/` and update this file.
