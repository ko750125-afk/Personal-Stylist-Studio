---
name: Luminous Editorial
colors:
  surface: '#faf8ff'
  surface-dim: '#dad9e0'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f3fa'
  surface-container: '#eeedf4'
  surface-container-high: '#e8e7ee'
  surface-container-highest: '#e2e2e9'
  on-surface: '#1a1b20'
  on-surface-variant: '#4b444f'
  inverse-surface: '#2f3035'
  inverse-on-surface: '#f1f0f7'
  outline: '#7d7480'
  outline-variant: '#cec3d0'
  surface-tint: '#754c97'
  primary: '#010004'
  on-primary: '#ffffff'
  primary-container: '#2e004f'
  on-primary-container: '#9d72c0'
  inverse-primary: '#e0b6ff'
  secondary: '#67587b'
  on-secondary: '#ffffff'
  secondary-container: '#e9d5ff'
  on-secondary-container: '#6a5a7e'
  tertiary: '#020000'
  on-tertiary: '#ffffff'
  tertiary-container: '#3f001c'
  on-tertiary-container: '#ec3e86'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#f2daff'
  primary-fixed-dim: '#e0b6ff'
  on-primary-fixed: '#2e004e'
  on-primary-fixed-variant: '#5c347d'
  secondary-fixed: '#eddcff'
  secondary-fixed-dim: '#d2bfe8'
  on-secondary-fixed: '#221534'
  on-secondary-fixed-variant: '#4f4062'
  tertiary-fixed: '#ffd9e2'
  tertiary-fixed-dim: '#ffb1c7'
  on-tertiary-fixed: '#3f001c'
  on-tertiary-fixed-variant: '#8e0048'
  background: '#faf8ff'
  on-background: '#1a1b20'
  surface-variant: '#e2e2e9'
typography:
  display-lg:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '800'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-caps:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1.0'
    letterSpacing: 0.1em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  container-max: 1280px
  stack-xl: 80px
  stack-md: 40px
  gutter: 24px
  margin-mobile: 20px
---

## Brand & Style

The design system is engineered for a premium Personal Stylist service, focusing on a demographic of women aged 20-40. The brand personality is **sophisticated, aspirational, and ethereal**. It moves away from the heavy, dark interface of the previous iteration toward a "Modern Light & Glow" aesthetic that mimics a high-end digital fashion magazine.

The visual style leverages **Glassmorphism** and **Minimalism** to create a sense of breathability. By utilizing generous whitespace and light, airy backgrounds, the UI allows high-quality fashion imagery to serve as the primary communication tool. Vibrant gradients provide a sense of energy and "glow," acting as focal points that guide the user through the personal style journey.

**Key Visual Principles:**
- **Editorial Layout:** Priority is given to large-scale imagery and bold typographic hierarchy.
- **Luminosity:** Elements should appear to emit or reflect light, achieved through subtle gradients and backdrops.
- **Visual Cues over Text:** Information is distilled into iconography, chips, and visual scales to reduce cognitive load.

## Colors

The palette is anchored in a professional **Deep Purple** for text and structural hierarchy, paired with a **Soft Lavender** background that feels more personal and inviting than pure white.

- **Primary (Deep Purple):** Used for typography and high-contrast UI elements to ensure accessibility.
- **Secondary (Soft Lavender):** The foundation for surfaces and subtle section backgrounds.
- **Accent (Vibrant Gradient):** A dynamic mix of Electric Blue, Purple, and Pink used exclusively for primary calls-to-action, active states, and "magic" moments like AI results.
- **Neutral (Off-white/Light Gray):** Provides the necessary whitespace to maintain the magazine-like feel.

Implement "Glow" effects using low-opacity versions of the accent gradient behind glass containers to create depth without clutter.

## Typography

This design system uses **Hanken Grotesk** for headings to provide a sharp, modern, and authoritative look. Its tight apertures and bold weights create the "Editorial" impact required for key styling results. **Plus Jakarta Sans** is used for body copy and labels; its rounded, open nature maintains the "friendly and approachable" brand pillar.

**Visual Hierarchy Rules:**
- **Primary Results:** Use `display-lg` for the "Style Identity" (e.g., "Rectangle Body Type").
- **Section Headers:** Use `headline-md` with generous top-margin spacing.
- **Utility Text:** Use `label-caps` for metadata like dates or small category tags.
- **Mobile Scaling:** On devices smaller than 768px, display sizes must scale down to the `-mobile` variants to prevent horizontal overflow and maintain legibility.

## Layout & Spacing

The system follows a **Fixed Grid** philosophy for desktop to maintain the "Editorial" structure, switching to a **Fluid Grid** for mobile.

- **Desktop (12-column):** Max-width of 1280px. Columns are used to separate imagery from data-heavy panels. Use asymmetrical layouts (e.g., 7 columns for an image, 5 for text) to mimic print magazines.
- **Vertical Rhythm:** Utilize "Stack" units. Large sections are separated by `stack-xl` (80px) to ensure the design feels expensive and unhurried.
- **Imagery:** Photos should often break the grid or bleed to the edge of containers to enhance the tactile feel.
- **Mobile:** Transition to a single-column stack with `margin-mobile` (20px). High-priority imagery should occupy at least 40% of the viewport height.

## Elevation & Depth

Depth is achieved through **Glassmorphism** rather than traditional shadows. Surfaces should feel like layered sheets of frosted acrylic.

- **Surface Layers:** Base level is the Soft Lavender background. Cards use a semi-transparent white (rgba 255, 255, 255, 0.7) with a `backdrop-filter: blur(20px)`.
- **Glow Effects:** Instead of drop shadows, use `box-shadow` with very large blur radii (40px-60px) and low-opacity accent colors (e.g., `rgba(168, 85, 247, 0.2)`) to make cards appear as if they are floating over a light source.
- **Border Treatment:** Use 1px solid white borders with 30% opacity on glass elements to define their edges against light backgrounds.

## Shapes

The design system uses a **Pill-shaped (3)** roundedness level to convey a soft, feminine, and modern aesthetic. 

- **Primary Cards:** Use `rounded-3xl` (1.5rem / 24px to 2rem / 32px) to create a friendly, organic feel.
- **Buttons & Chips:** Always fully pill-shaped (rounded-full) to encourage interaction and touch-friendliness.
- **Images:** Should follow the card roundedness (24px+) to remain consistent with the container language.

## Components

### Buttons
- **Primary:** Gradient background (`glow-linear`), white text, pill-shaped. On hover, increase the glow intensity using a larger box-shadow.
- **Secondary:** Transparent background with a 1px deep purple border or a soft lavender fill.

### Cards (The "Stylist" Card)
- The core container for results. Use the glassmorphism treatment. Top section contains the image with `rounded-2xl`, bottom section contains a white-space heavy summary.

### Chips & Tags
- Used for "Style Attributes" (e.g., "Minimalist", "Summer Tone"). Light lavender background with deep purple text. No borders.

### Input Fields
- Soft gray-white background, pill-shaped. Focus state should trigger a subtle purple "outer glow" rather than a sharp border change.

### Progress Indicators
- Use a slim, gradient-filled bar for "AI Analysis" states to maintain the "magical" aesthetic.

### Interactive Imagery
- Image galleries should use subtle scale-up transforms on hover (1.02x) to feel responsive and high-quality.