# Talentora Design System - Color Reference

## Color Palette

### Primary Colors
- **Primary Orange**: `#FF6B35` - Brand main color
  - CSS: `bg-primary`, `text-primary`, `border-primary`
  - Usage: Primary buttons, highlights, CTAs
  
- **Primary Dark**: `#E55A2B` - Hover state
  - CSS: `bg-primary-dark`, `hover:bg-primary-dark`
  - Usage: Button hover states, active states

### Secondary
- **Secondary**: `#1F2937` - Dark grey
  - CSS: `bg-secondary`, `text-secondary`
  - Usage: Headings, important text

### Backgrounds
- **Background Light**: `#FFFFFF`
  - CSS: `bg-background-light`
- **Background Dark**: `#111827`
  - CSS: `bg-background-dark dark:bg-background-dark`

### Surfaces
- **Surface Light**: `#F9FAFB`
  - CSS: `bg-surface-light`
- **Surface Dark**: `#1F2937`
  - CSS: `bg-surface-dark dark:bg-surface-dark`

### Neutral Tones
- **Neutral 100**: `#F3F4F6` - Surface backgrounds
- **Neutral 200**: `#E5E7EB` - Borders, dividers
- **Neutral 300**: `#D1D5DB` - Disabled states
- **Neutral 400**: `#9CA3AF` - Icon colors
- **Neutral 500**: `#6B7280` - Body text
- **Neutral 600**: `#4B5563` - Paragraphs, secondary text
- **Neutral 800**: `#1F2937` - Headings
- **Neutral 900**: `#111827` - Dark backgrounds

## Typography

### Font Families
- **Heading Font**: `font-heading` → Roobert, sans-serif
  - For: All headings (h1-h6), titles
- **Body Font**: `font-body` → Interdisplay, Arial, sans-serif
  - For: All body text, paragraphs, UI elements
- **Sans Default**: `font-sans` → Interdisplay, Arial, sans-serif

### Text Sizes
- Display XL: `text-6xl font-extrabold` (60px)
- Heading L: `text-4xl font-bold` (36px)
- Heading M: `text-2xl font-bold` (24px)
- Body Large: `text-lg` (18px)
- Body Base: `text-base` (16px)
- Caption: `text-sm font-medium` (14px)
- Small: `text-xs font-semibold uppercase tracking-wider` (12px)

## Spacing & Borders

### Border Radius
- Default: `rounded` (0.5rem)
- XL: `rounded-xl` (0.75rem)
- 2XL: `rounded-2xl` (1rem)
- 3XL: `rounded-3xl` (1.5rem)

### Shadows
- Soft: `shadow-soft` - Subtle elevation
- Glow: `shadow-glow` - Primary color glow (for CTAs)

## Usage Examples

```jsx
// Primary Button
<button className="bg-primary hover:bg-primary-dark text-white font-medium rounded-full px-6 py-3 transition-transform hover:scale-105 shadow-glow">
  Primary Action
</button>

// Heading
<h1 className="font-heading text-4xl font-bold text-neutral-900 dark:text-white">
  Page Title
</h1>

// Body Text
<p className="font-body text-base text-neutral-600 dark:text-neutral-300">
  This is body text using Interdisplay font.
</p>

// Card
<div className="bg-white dark:bg-surface-dark rounded-2xl border border-neutral-200 dark:border-neutral-700 p-6 shadow-soft">
  Card content
</div>
```
