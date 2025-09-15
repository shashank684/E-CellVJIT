# E-Cell VJIT Website Design Guidelines

## Design Approach
**Reference-Based Approach**: Drawing inspiration from modern tech startup websites like Linear, Vercel, and GitHub, combined with university entrepreneurship cell aesthetics. The design emphasizes bold animations, clean layouts, and professional credibility.

## Core Design Elements

### A. Color Palette
**Primary Colors:**
- Background: 0 0% 8% (Deep black)
- Text: 0 0% 95% (Off-white)
- Brand Red: 0 85% 60% (Vibrant red for CTAs and highlights)
- Accent Red: 0 70% 45% (Darker red for hover states)

**Supporting Colors:**
- Gray-800: 0 0% 15% (Card backgrounds)
- Gray-700: 0 0% 25% (Borders, dividers)
- Gray-600: 0 0% 40% (Secondary text)

### B. Typography
**Font Stack:**
- Primary: Inter (headings, body text)
- Accent: JetBrains Mono (code-like elements, timestamps)

**Hierarchy:**
- Hero Title: 4xl-6xl, font-bold, letter-spacing tight
- Section Headers: 2xl-3xl, font-semibold
- Body Text: base-lg, font-normal, leading-relaxed
- Captions: sm, font-medium, text-gray-400

### C. Layout System
**Spacing Units:** Consistent use of Tailwind units 4, 8, 12, 16, 24 for padding, margins, and gaps (p-4, h-8, m-12, etc.)

**Grid System:**
- Max width: 7xl (1280px) with px-4 padding
- Responsive columns: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Section spacing: py-16 md:py-24

### D. Component Library

**Navigation:**
- Fixed header with backdrop-blur-md effect
- Logo left, menu items center, CTA button right
- Mobile: Hamburger menu with slide-in drawer

**Cards:**
- Team cards: Rounded-xl, bg-gray-800, border border-gray-700
- Event cards: Hover lift effect with subtle shadow
- Admin dashboard: Clean data tables with stripe backgrounds

**Forms:**
- Input fields: bg-gray-800, border-gray-600, focus:border-red-500
- Buttons: Primary (bg-red-600), Secondary (border-gray-600)
- Validation: Red error states, green success states

**Data Displays:**
- Tables: Striped rows, sortable headers, pagination controls
- Metrics: Large numbers with descriptive labels
- Status indicators: Color-coded badges

### E. Animations
**Hero Section:**
- Letter-by-letter neon flicker effect on main title
- 3D wave/grid background with Three.js
- Animated particle canvas overlay
- SVG rocket with path animation

**Page Interactions:**
- Scroll-triggered fade-ins for sections
- Hover animations on team member cards
- Button hover states with scale and glow effects
- Page transitions with subtle slide effects

**Performance Considerations:**
- prefers-reduced-motion support
- Lazy loading for heavy animations
- Optimized asset loading

## Images
The website features a **large hero background** with animated 3D elements rather than static images. Additional imagery includes:

- **Team Member Photos**: Professional headshots in circular frames with hover overlay effects
- **Event Gallery**: Grid layout showcasing past events and activities
- **Logo Assets**: E-Cell VJIT branding elements integrated into navigation and footer
- **Icon Library**: Heroicons for UI elements, social media icons for team profiles

## Accessibility & Performance
- WCAG AA contrast compliance
- Keyboard navigation support
- Screen reader friendly structure
- Responsive design for all device sizes
- SEO optimized with proper meta tags

This design creates a professional, modern appearance that reflects the innovative spirit of an entrepreneurship cell while maintaining excellent usability and performance.