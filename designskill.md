# Design Skill: Runway & Try the Look Design System

This document is the authoritative design system and architectural specification for the **Try the Look — Runway** project. Any agent, engineer, or designer adding new features, sections, components, or pages **MUST** read and adhere to these guidelines to preserve absolute visual consistency, motion feel, accessibility, and high-fashion streetwear editorial quality.

---

## 1. Design Philosophy & Aesthetic Identity

- **Brand Spirit**: Premium Nike streetwear editorial lookbook. Clean, stark, highly disciplined minimalism inspired by runway fashion installations and contemporary Japanese/European architecture.
- **Palette Discipline**: Strictly monochromatic with warm stone undertones. Never introduce saturated primary colors (no blues, purples, greens, or neon glows). Contrast is achieved through scale, typographic weight, spatial tension, and delicate 1px architectural divider lines.
- **Surface Elevation**: Avoid heavy shadows or floating cards. Flat white stages (`#ffffff`) with realistic contact ground shadows (`radial-gradient`), subtle frosted glass surfaces (`backdrop-filter: blur(...)`), and crisp 1px borders (`#c8c8c8` and `#e4e4e4`).
- **Physicality & Weight**: Micro-interactions react with tangible mechanical weight: button clicks scale down (`scale(0.94)` or `scale(0.985)`), hover rings expand gently (`scale(0.55)` to `scale(1)` at `opacity: 0.22`), and outlines feature exact `outline-offset: 4px`.

---

## 2. Color Palette & Design Tokens

### 2.1 Core Hex Codes
| Token | Value | Semantic Role |
|---|---|---|
| `--rw-c-stage` | `#ffffff` | Stage background (runway floor) |
| `--rw-c-panel` | `#ffffff` | Right-side product sidebar background |
| `--rw-c-text` | `#151413` | Deep obsidian black for primary headings, body text, buttons |
| `--rw-c-accent` | `#0e0e0e` | Pitch black for active states, checkmarks, hot badges |
| `--rw-c-on-accent` | `#ffffff` | Pure white text on dark accents or buttons |
| `--rw-c-muted` | `#66625c` | Warm stone gray for subtitles, piece counts, secondary info |
| `--rw-c-line` | `#c8c8c8` | Boundary rules, divider lines, inactive pill borders |
| `--site-header-border` | `#e4e4e4` | Header bottom divider rule |
| `--rw-card` | `#DFDFDF` | Inactive card surface token |
| `--scrim-bg` | `rgb(12 10 8 / .38)` | Mobile bottom-sheet scrim backdrop |

### 2.2 Root Theme Tokens (Shopify Horizon Tokens)
```css
:root {
  --font-body--family: Helvetica, Arial, sans-serif;
  --font-body--weight: 400;
  --font-heading--family: Helvetica, Arial, sans-serif;
  --font-heading--weight: 400;
  --color-primary-button-background: #151413;
  --color-primary-button-text: #ffffff;
  --style-border-radius-buttons-primary: 0px;
  color-scheme: light;
}
```

### 2.3 Component Dimension Tokens
```css
--rw-panel-w: 380px;            /* Fixed width of desktop product panel */
--rw-panel-pad-d: 32px;         /* Desktop sidebar padding */
--rw-panel-pad-m: 20px;         /* Mobile sidebar padding */
--rw-thumb-d: 92px;             /* Desktop product thumbnail width */
--rw-thumb-m: 62px;             /* Mobile product thumbnail width */
--rw-btn-radius: 0px;           /* Sharp architectural buttons */
--rw-pill-radius: 30px;         /* Size selector pills */
--rw-add-radius: 20px;          /* Plus/Add button circular hover ring */
--rw-bar-r: 20px;               /* Mobile docked panel top border radius */
```

---

## 3. Typography & Hierarchy

### 3.1 Typeface Families
1. **Inter 600 (`Inter, Helvetica, Arial, sans-serif`)**:
   - Used **only** for the top header navigation (`.site-header nav a`).
   - Embedded locally as base64 WOFF2 to ensure instant render without flash of unstyled text.
2. **System Helvetica (`Helvetica, Arial, sans-serif`)**:
   - Used for **everything else**: headings, subtitles, product names, price tags, button labels, dialogs, and tooltips.
   - Headings default to weight `400` (no heavy bold display fonts; elegance comes from scale and letter spacing).
   - Product names, buttons, and bundle titles use weight `500`.
   - Number badges, pin numbers, and the "New" badge use weight `600`.
   - Never load Google Fonts.

### 3.2 Type Scale Reference
| Element | Desktop Size | Mobile Size | Weight | Tracking / Letter-spacing | Notes |
|---|---|---|---|---|---|
| Section Title | `46px` | `24px` | 400 | `-0.02em` | Line-height `1.0` |
| Subtitle / Description | `12px` | `12px` | 400 | Normal | Line-height `1.55`, color `#66625c` |
| Panel Heading | `18px` | `16px` | 400 | Normal | "In this look", line-height `1.1` |
| Header Nav Links | `14px` | `11px` | 600 | Normal | Inter font, underline on hover |
| Product Title | `13px` | `12px` | 500 | Normal | Animated underline on card hover |
| Vendor Line | `10px` | `9px` | 400 | `+0.14em` | Uppercase, muted |
| Price | `12px` | `12px` | 400 | Normal | Tabular numbers |
| Bundle Big Price | `16px` | `16px` | 400 | Normal | Bold emphasis with `<strong/>` |
| Category / Piece Label | `10px` | `9px` | 400 | `+0.16em` | Uppercase, muted |
| Ticks / Numeric Badges | `10px` | `10px` | 600 | `+0.12em` | `tabular-nums` |

---

## 4. Layout Architecture & Spatial Grid

### 4.1 Desktop ($\ge 1100\text{px}$)
- **Site Header**: Height `88px`, flex row, padding `0 40px`, gap `32px`, bottom border `1px solid #e4e4e4`. Brand link aligned left with `margin-right: auto`.
- **Runway Frame**: One screen height minus header: `var(--rw-frame-h, 100svh)` calculated dynamically as `Math.max(380, innerHeight - 88)`.
- **Grid Split**:
  ```css
  grid-template-columns: minmax(0, 1fr) 380px;
  grid-template-rows: minmax(0, 1fr);
  ```
- **Left Stage (`.rw__left`)**: Flexible 3D runway stage, controls bar at bottom, intro title at top-left. Overflow hidden.
- **Right Panel (`.rw__panel`)**: Sticky `380px` column with `border-left: 1px solid #c8c8c8`. Independent vertical scrolling for product list.

### 4.2 Tablet ($750\text{px} - 1099\text{px}$)
- Panel width scales up to `380px`.
- Stage intro padding compresses to `36px 32px 0`.
- Controls bar padding tightens to `6px 22px 26px`.
- Active carousel tick bar reduces width to `130px`.

### 4.3 Mobile ($\le 749\text{px}$)
- **Site Header**: Height `68px`, padding `0 20px`, gap `18px`. Swoosh image shrinks to `48×17`. Secondary nav links hidden, leaving `Home` and active `Runway`. Bag icon gets `margin-left: 8px`.
- **Vertical Stack**: The grid becomes a flex column. Frame height becomes `1.09 * window.innerHeight`.
- **Stage Reflow**: Switches automatically to `classic` diagonal mode. Bottom controls are hidden; replaced by bottom center progress line (`.rw__walk`).
- **Docked Sheet Panel**: Overlaps bottom of stage by `20px` (`margin-top: -20px`) with rounded top corners (`border-radius: 20px 20px 0 0`).
- **Horizontal Snap Carousel**: Outfit item rows switch from vertical list to horizontal touch carousel (`scroll-snap-type: x mandatory`). Each card width: `calc(100% - 64px)`.
- **Bottom Size Sheet**: Size selection opens as an iOS-style bottom sheet modal fixed over a dark scrim (`.rw-sheet-host`).

---

## 5. Motion Physics & Animation System

### 5.1 Easing Curves
```css
:root {
  --rw-ease: cubic-bezier(0.16, 1, 0.3, 1);         /* Primary smooth deceleration */
  --rw-ease-silk: cubic-bezier(0.65, 0, 0.35, 1);     /* Symmetric sweep & transitions */
  --rw-ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1); /* Bouncy micro-pops (pins, badges) */
  --rw-ease-sheet: cubic-bezier(0.32, 0.72, 0, 1);   /* Bottom-sheet slide upward */
}
```

### 5.2 Physics Constants
- **Spring Stiffness ($K$)**: `95`
- **Damping Constant ($C$)**: `2 * Math.sqrt(95)` $\approx 19.49$ (critically damped, zero oscillation or overshoot on continuous carousel positions).
- **Settling Tolerance**: Position difference $\le 0.0005$, velocity $\le 0.0005$.
- **Follow Lag**: `0.04s` per position in line for realistic staggered inertia.

### 5.3 3D Ring Perspective Geometry
When projecting figures in ring mode:
- $R = 0.62 \cdot W$ (circle radius)
- $P = 1.65 \cdot W$ (camera distance/perspective)
- Depth: $z = R \cdot (1 - \cos\phi)$
- Scale: $\text{persp} = P / (P + z)$
- Horizontal position: $x = \text{cx} + R \cdot \sin\phi \cdot \text{persp}$
- Depth Blur: Slot 0 = `0px`, Slot 1 = `1.8px`, Slot 2 = `3.8px`, Slot 3 = `5.8px`, Slot 4+ = `6.5px`.

### 5.4 Reduced Motion Rules
Under `@media (prefers-reduced-motion: reduce)`:
- Autoplay must never auto-run.
- Spring loops snap immediately (`cur = target`).
- Entrance offsets ($1.15$) become $0$.
- Cursor lerp factor becomes $1$ (no lag).
- Continuous keyframe animations (pin halos, swings, shines) are suppressed.

---

## 6. Component Building Blocks

### 6.1 Buttons
- **Primary Action (CTA / Complete the Look)**:
  - Height: `56px` desktop, `54px` mobile. Full width.
  - Background: `#151413`, text: `#ffffff`.
  - Border radius: `0px`. Weight `500`, letter spacing `0.02em`.
  - Hover: `translateY(-2px)`, shadow `0 18px 34px -22px rgba(21, 20, 19, 0.8)`, and white linear-gradient shine sweep.
  - Active: `scale(0.985)`.
- **Add / Plus Button (`.rw__add`)**:
  - Size: `44×44px` hit target.
  - States: Plus icon $\rightarrow$ Loading spinner $\rightarrow$ Checkmark draw animation.
  - Hover ring: Inset `4px`, circular, 1px border at `0.22` opacity.
  - Active picking state: Rotates 45° to become an "×" close icon.
- **Pill Selectors (`.rw__pill`)**:
  - Height: `40px`, min-width `44px`, border-radius `30px`.
  - Border: `1px solid #c8c8c8`.
  - Checked state: `#151413` solid fill with `#ffffff` text.

### 6.2 Product Pins (`.rw__pin`)
- 44×44 touch target, centered on coordinate (`left: X%`, `top: Y%`).
- Dot: 24×24 circle, `rgba(255, 255, 255, 0.86)` with `backdrop-filter: blur(6px)`.
- Pulsing concentric ripple halos (`::before` and `::after`).
- Hover / Hot state: Expands to `scale(1.3)`, turns solid `#0e0e0e` with white number, and reveals floating glass tooltip (`left: calc(100% - 6px)`).

### 6.3 Custom Inertia Cursor (`.rw__cursor`)
- Mounted only when `(hover: hover) and (pointer: fine)`.
- Smooth spring lag lerp ($0.18$).
- 84×84 ring with blurred translucent background (`rgba(255, 255, 255, 0.40)` + blur 6px).
- Dynamic label:
  - Default: `DRAG` (uppercase, letter-spacing `0.24em`).
  - Over hero zoom button: `VIEW`.
  - Over interactive pin/button: Shrinks to `scale(0.2)` black dot (`.is-link`).
  - Active drag: `scale(0.74)` dark pill with white text and expanded tracking (`0.42em`).

### 6.4 Styling Bag (`#bag-dialog`)
- Native HTML `<dialog>` with backdrop blur (`#0005` + blur 4px).
- Border: `1px solid #d9d9d9`, radius `0px`, padding `24px`.
- Max width: `min(560px, 100vw - 32px)`.
- Displays item thumbnail, title, size, quantity, USD currency format, and external link with hostname security validation (`nike-makknzjs.myshopify.com`).
- Includes shortlist export button generating `runway-outfit-shortlist.txt`.

---

## 7. Rules for Adding New Features or Sections

When extending the application (e.g. adding a new outfit, an additional catalog item, a recommendation shelf, or a footer section):

1. **Keep Framework-Free Integrity**:
   - Write semantic HTML5, pure CSS variables, and vanilla Web Components or modular helper functions.
   - Do not pull in heavy UI component libraries or extra runtime frameworks.
2. **Reuse Existing Tokens**:
   - Never write arbitrary color hex codes in CSS. Always reference `--rw-c-text`, `--rw-c-muted`, `--rw-c-line`, `--rw-ease`, etc.
3. **Respect Layout Quotas**:
   - The desktop runway section is strictly designed to fill the remaining viewport below the 88px header. Never add fixed-height elements above or below that break screen alignment unless wrapped in a dedicated scroll container.
4. **Preserve Asset Standards**:
   - Runway model images must be transparent WebP cutouts (alpha channel), 9:16 aspect ratio (`--rw-ar: 0.5625`), positioned at `object-position: 50% 100%`.
   - Preload the first model in `<head>` with `fetchpriority="high"`.
5. **Protect Lifecycle & Observers**:
   - All `ResizeObserver` callbacks **must** defer recalculations via `requestAnimationFrame` and guard against redundant style mutations to prevent browser loop notifications.
   - Keep global ResizeObserver error suppressors active in `index.html` and `src/main.ts`.
6. **Accessible by Default**:
   - All interactive icons must have clear `aria-label`s.
   - Live regions (`role="status"`, `aria-live="polite"`) announce look changes and bag additions.
   - Every input radio must have an associated native `<label>`.
   - Focus visible must consistently show `outline: 2px solid #151413; outline-offset: 4px`.
