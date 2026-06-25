---
name: Kinetic Ledger
colors:
  surface: '#f9f9ff'
  surface-dim: '#d3daef'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f3ff'
  surface-container: '#e9edff'
  surface-container-high: '#e1e8fd'
  surface-container-highest: '#dce2f7'
  on-surface: '#141b2b'
  on-surface-variant: '#464554'
  inverse-surface: '#293040'
  inverse-on-surface: '#edf0ff'
  outline: '#767586'
  outline-variant: '#c7c4d7'
  surface-tint: '#494bd6'
  primary: '#4648d4'
  on-primary: '#ffffff'
  primary-container: '#6063ee'
  on-primary-container: '#fffbff'
  inverse-primary: '#c0c1ff'
  secondary: '#4e45d5'
  on-secondary: '#ffffff'
  secondary-container: '#6860ef'
  on-secondary-container: '#fffbff'
  tertiary: '#904900'
  on-tertiary: '#ffffff'
  tertiary-container: '#b55d00'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e1e0ff'
  primary-fixed-dim: '#c0c1ff'
  on-primary-fixed: '#07006c'
  on-primary-fixed-variant: '#2f2ebe'
  secondary-fixed: '#e3dfff'
  secondary-fixed-dim: '#c3c0ff'
  on-secondary-fixed: '#100069'
  on-secondary-fixed-variant: '#372abf'
  tertiary-fixed: '#ffdcc5'
  tertiary-fixed-dim: '#ffb783'
  on-tertiary-fixed: '#301400'
  on-tertiary-fixed-variant: '#703700'
  background: '#f9f9ff'
  on-background: '#141b2b'
  surface-variant: '#dce2f7'
  success: '#22c55e'
  danger: '#ef4444'
  surface-bg: '#f9fafb'
  surface-card: '#ffffff'
  gray-muted: '#6b7280'
  gray-border: '#e5e7eb'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  title-md:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  margin-mobile: 16px
  margin-desktop: 24px
  gutter: 16px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 24px
---

## Brand & Style

The brand identity centers on "SaaS Professionalism"—a balance of high-velocity efficiency and unwavering reliability. This design system is engineered for the modern sales professional who requires a tool that feels as fast as their workflow. The target audience values clarity over decoration and speed over flourish.

The visual style is **Modern Corporate** with a focus on **Tonal Minimalism**. It utilizes heavy white space and a precise color economy to direct attention toward actionable data. By employing a clean, high-contrast interface with soft structural elements, the UI evokes a sense of organized calm, ensuring the user feels in control of their pipeline. The aesthetic is "Light-First," prioritizing legibility and a sense of "air" within the mobile interface to prevent cognitive overload during high-stress sales cycles.

## Colors

The palette is anchored by a vibrant **Indigo (#6366f1)**, used strategically for primary actions and brand presence. To ensure a professional depth, a darker **Deep Indigo (#4338ca)** is used for hover states or active navigational indicators.

The functional color logic is strict: **Green (#22c55e)** is reserved exclusively for "Active" statuses, successful conversions, and positive growth metrics. **Red (#ef4444)** is utilized only for critical destructive actions or overdue follow-ups. The background uses a soft **Off-White (#f9fafb)** to reduce screen glare, while interactive cards and containers use pure **White (#ffffff)** to create a subtle natural elevation.

## Typography

This design system exclusively employs **Inter** for its neutral, systematic utility and exceptional legibility on mobile displays. 

The type hierarchy prioritizes high-contrast weight distribution. Headlines utilize a bold weight and tight letter-spacing to create a sense of authority. Body text is optimized for long-form readability with a generous line height. Label styles use a semi-bold weight and slight tracking to differentiate metadata from actionable content. For mobile views, headlines are scaled down to preserve vertical space while maintaining the bold font weight for hierarchy.

## Layout & Spacing

This design system follows a **4px baseline grid** to ensure mathematical consistency across all components. The layout uses a **Fluid Grid** model for mobile devices, moving to a **Fixed 12-column grid** for tablet and desktop views.

- **Mobile:** 16px side margins with a single column stack.
- **Tablet:** 24px margins with an 8-column layout.
- **Desktop:** Max-width of 1280px, 12-column layout.

Vertical spacing (stacking) should be generous. Use `stack-md` (16px) for related elements within a card and `stack-lg` (24px) for separating major content sections. This "breathable" approach prevents the CRM from feeling cluttered despite high data density.

## Elevation & Depth

Depth is communicated through **Tonal Layering** supplemented by **Ambient Shadows**. 

1.  **Level 0 (Base):** The main background (`#f9fafb`), flat.
2.  **Level 1 (Cards/Surface):** Pure white surfaces (`#ffffff`) with a very soft, high-diffusion shadow (Color: `rgba(17, 24, 39, 0.05)`, Blur: 12px, Offset-Y: 4px).
3.  **Level 2 (Overlays/Modals):** Increased shadow depth (Blur: 24px, Offset-Y: 8px) with a semi-transparent backdrop blur (12px) to maintain context.

Avoid harsh borders. Instead, use a 1px solid border in `gray-border` (#e5e7eb) for non-elevated containers like input fields or list items to define structure without adding visual weight.

## Shapes

The shape language is friendly yet structured. This design system uses the **Rounded** (Level 2) logic as its default.

- **Standard Components:** Buttons, Input Fields, and Chips use a 0.5rem (8px) radius.
- **Large Components:** Cards and main content containers use a `rounded-xl` (1.5rem / 24px) radius to create a soft, modern SaaS feel.
- **Indicators:** Status pills and avatars are fully rounded (pill-shaped) to distinguish them from structural layout elements.

## Components

- **Buttons:** Primary buttons use a solid Indigo background with white text. Tertiary/Ghost buttons use Indigo text on a transparent background. All buttons should have a minimum height of 48px for mobile tap targets.
- **Cards:** Cards are the primary container. They feature a white background, 24px corner radius, and the Level 1 Ambient Shadow. Internal padding should be a consistent 16px or 20px.
- **Input Fields:** Use a 1px border (`#e5e7eb`). On focus, the border transitions to Primary Indigo with a subtle outer glow. Labels sit above the field in `label-md` style.
- **Chips/Badges:** Use a light tinted background (10% opacity of the status color) with high-saturation text. For example, a "Success" badge uses a light green background with dark green text.
- **Lists:** Mobile list items should be separated by a light 1px divider, with 16px of vertical padding to ensure high scanability.
- **Active Status:** Indicated by a 8px circular green dot adjacent to the contact name or within a status chip.