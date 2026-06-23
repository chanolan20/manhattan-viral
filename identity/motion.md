# Manhattan Viral — Motion Principles

## Brand idea

Motion should feel **physical and intentional**, like a subway door closing or a storefront gate rolling up. Fast for UI, dramatic only for brand moments.

---

## Easing

| Name | Curve | Use |
|------|-------|-----|
| `ease-default` | `cubic-bezier(0.4, 0, 0.2, 1)` | Most UI transitions |
| `ease-in` | `cubic-bezier(0.4, 0, 1, 1)` | Elements exiting |
| `ease-out` | `cubic-bezier(0, 0, 0.2, 1)` | Elements entering |
| `ease-snap` | `cubic-bezier(0.16, 1, 0.3, 1)` | CTAs, hover pops |

---

## Duration scale

| Token | Duration | Use |
|-------|----------|-----|
| `instant` | `100ms` | Micro-feedback: color change, opacity |
| `fast` | `200ms` | Hover states, button press, link underlines |
| `medium` | `300ms` | Card transitions, drawer open, accordion |
| `slow` | `500ms` | Page transitions, section reveals, logo builds |
| `ambient` | `8–20s` | Ticker loops, background gradients, hero video |

---

## Choreography

### Entering elements

- Fade + translate Y `20px → 0`
- Stagger children by `80ms`
- Use `ease-out`

### Hover interactions

- Cards: `translateY(-4px)` + subtle shadow increase
- Buttons: background color shift + `translateY(-1px)`
- Links: underline draws from left to right

### Scroll behavior

- Section headlines reveal on scroll into view
- Product cards stagger in as user scrolls horizontally
- Parallax limited to `±15px` — never disorienting

### Brand moments

- **Logo build:** monogram strokes draw in over 600ms on page load
- **Hero headline:** words reveal with 100ms stagger
- **Drop countdown:** numbers flip/swap with 200ms snap easing

---

## Performance

- Animate only `transform` and `opacity`.
- Avoid animating `width`, `height`, `top`, `left`, `margin`.
- Use `will-change` sparingly and remove after animation.
- Target **60fps** on mid-range mobile devices.

---

## Reduced motion

Always respect `prefers-reduced-motion: reduce`:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

For users who prefer reduced motion:
- Disable parallax
- Replace fades with instant state changes
- Keep essential state changes (hover, focus) but remove travel distance

---

## Don'ts

- No bounce, elastic, or spring effects on UI elements
- No long fade-ins on content the user is waiting for
- No auto-playing video with sound
- No flashing or rapid strobing
