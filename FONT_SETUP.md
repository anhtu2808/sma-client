# Font Setup Instructions

## Current Status
✅ Font families configured in Tailwind CSS
✅ Google Fonts links added to HTML (Inter as fallback)
✅ Material Icons integrated

## Required Custom Fonts

### 1. Roobert (Heading Font)
- **Usage**: All headings (h1-h6), titles
- **Weights needed**: 400, 500, 600, 700, 800
- **Format**: .woff2, .woff (recommended)

### 2. Interdisplay (Body Font)
- **Usage**: Body text, paragraphs, UI elements
- **Weights needed**: 400, 500, 600, 700, 800
- **Format**: .woff2, .woff (recommended)

## Installation Steps

### Option 1: Add font files to project
1. Create folder: `src/assets/fonts/`
2. Add font files:
   ```
   src/assets/fonts/
   ├── Roobert/
   │   ├── Roobert-Regular.woff2
   │   ├── Roobert-Medium.woff2
   │   ├── Roobert-SemiBold.woff2
   │   ├── Roobert-Bold.woff2
   │   └── Roobert-ExtraBold.woff2
   └── Interdisplay/
       ├── Interdisplay-Regular.woff2
       ├── Interdisplay-Medium.woff2
       ├── Interdisplay-SemiBold.woff2
       ├── Interdisplay-Bold.woff2
       └── Interdisplay-ExtraBold.woff2
   ```

3. Update `src/index.css` with @font-face declarations:
   ```css
   /* Roobert Font */
   @font-face {
     font-family: 'Roobert';
     src: url('./assets/fonts/Roobert/Roobert-Regular.woff2') format('woff2');
     font-weight: 400;
     font-style: normal;
     font-display: swap;
   }
   
   @font-face {
     font-family: 'Roobert';
     src: url('./assets/fonts/Roobert/Roobert-Bold.woff2') format('woff2');
     font-weight: 700;
     font-style: normal;
     font-display: swap;
   }
   
   /* Interdisplay Font */
   @font-face {
     font-family: 'Interdisplay';
     src: url('./assets/fonts/Interdisplay/Interdisplay-Regular.woff2') format('woff2');
     font-weight: 400;
     font-style: normal;
     font-display: swap;
   }
   
   @font-face {
     font-family: 'Interdisplay';
     src: url('./assets/fonts/Interdisplay/Interdisplay-Bold.woff2') format('woff2');
     font-weight: 700;
     font-style: normal;
     font-display: swap;
   }
   ```

### Option 2: Use CDN or Google Fonts alternative
If Roobert and Interdisplay are not available or you need fallbacks:
- **Roobert alternative**: Plus Jakarta Sans (already in design), Poppins, or DM Sans
- **Interdisplay alternative**: Inter (already loaded), Work Sans, or Manrope

## Current Fallback
The project currently uses Inter from Google Fonts as a fallback. This will be used until custom fonts are added.

## Testing
After adding fonts, test with:
```jsx
// Test heading
<h1 className="font-heading text-4xl font-bold">Heading Text</h1>

// Test body
<p className="font-body text-base">Body text content</p>
```

Check browser DevTools → Elements → Computed to verify correct font is applied.
