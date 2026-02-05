# Church Website - Mood Board

## 🎨 Visual Identity

### Color Palette

#### Primary Colors
```css
--color-primary: #1E3A5F;      /* Deep Navy Blue - Trust, stability, faith */
--color-primary-dark: #152A45; /* Darker Navy - Headers, footer */
--color-primary-light: #2A4A73;/* Lighter Navy - Hover states */
```

#### Secondary Colors
```css
--color-secondary: #FFFFFF;    /* Pure White - Purity, cleanliness */
--color-secondary-off: #F8F9FA;/* Off White - Backgrounds */
--color-gray-light: #E9ECEF;   /* Light Gray - Borders, dividers */
```

#### Accent Colors
```css
--color-accent: #D4AF37;       /* Classic Gold - Value, warmth, premium */
--color-accent-light: #E5C158; /* Light Gold - Hover states */
--color-accent-dark: #B8962E;  /* Dark Gold - Active states */
```

#### Text Colors
```css
--color-text-primary: #2C3E50;   /* Dark Gray - Body text */
--color-text-secondary: #5D6D7E; /* Medium Gray - Secondary text */
--color-text-light: #95A5A6;     /* Light Gray - Captions */
```

---

## ✍️ Typography

### Font Families

#### Headings: Playfair Display
```css
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap');
```
- **Weights:** 400 (Regular), 600 (SemiBold), 700 (Bold)
- **Usage:** H1, H2, H3, Section titles
- **Style:** Elegant serif, traditional yet modern
- **Feel:** Trustworthy, established, welcoming

#### Body: Inter
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
```
- **Weights:** 300 (Light), 400 (Regular), 500 (Medium), 600 (SemiBold)
- **Usage:** Body text, navigation, buttons
- **Style:** Clean sans-serif, highly readable
- **Feel:** Modern, approachable, professional

#### Accent/Quotes: Cormorant Garamond
```css
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&display=swap');
```
- **Weights:** 400 (Regular), 400i (Italic), 600 (SemiBold)
- **Usage:** Scripture quotes, testimonials
- **Style:** Classic serif with elegance
- **Feel:** Spiritual, timeless, inspiring

---

## 📐 Typography Scale

```css
/* Heading Hierarchy */
--text-h1: 4rem;      /* 64px - Hero headline */
--text-h2: 2.5rem;    /* 40px - Section titles */
--text-h3: 1.75rem;   /* 28px - Subsection titles */
--text-h4: 1.25rem;   /* 20px - Card titles */

/* Body Text */
--text-body: 1rem;        /* 16px - Standard body */
--text-body-lg: 1.125rem; /* 18px - Lead paragraphs */
--text-body-sm: 0.875rem; /* 14px - Captions, meta */

/* Special */
--text-nav: 0.9375rem;    /* 15px - Navigation */
--text-button: 0.9375rem; /* 15px - Buttons */
--text-caption: 0.75rem;  /* 12px - Small text */
```

---

## 🖼️ Imagery Style

### Photography Style
- **Tone:** Warm, inviting, authentic
- **Lighting:** Natural, soft, golden hour when possible
- **Subjects:** Diverse people, community moments, worship
- **Composition:** Candid shots, genuine emotions
- **Editing:** Slightly warm color grade, natural saturation

### Image Types
1. **Hero Image:** Wide shot of congregation or church exterior
2. **Pastor Photo:** Professional headshot, warm smile
3. **Ministry Photos:** Action shots of people serving
4. **Community Photos:** Fellowship, events, gatherings
5. **Background Textures:** Subtle patterns, gradients

### Unsplash Keywords
- "church congregation worship"
- "diverse community gathering"
- "modern church interior"
- "people praying together"
- "church volunteer service"

---

## 🎯 UI Components

### Buttons

#### Primary Button (Gold)
```css
background: linear-gradient(135deg, #D4AF37 0%, #E5C158 100%);
color: #1E3A5F;
padding: 14px 32px;
border-radius: 4px;
font-weight: 600;
text-transform: uppercase;
letter-spacing: 0.5px;
box-shadow: 0 4px 6px rgba(212, 175, 55, 0.3);
transition: all 0.3s ease;
```

#### Secondary Button (Navy)
```css
background: #1E3A5F;
color: #FFFFFF;
padding: 14px 32px;
border-radius: 4px;
font-weight: 500;
border: 2px solid #1E3A5F;
transition: all 0.3s ease;
```

#### Ghost Button (White)
```css
background: transparent;
color: #FFFFFF;
padding: 14px 32px;
border-radius: 4px;
font-weight: 500;
border: 2px solid #FFFFFF;
transition: all 0.3s ease;
```

### Cards

```css
background: #FFFFFF;
border-radius: 8px;
box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
padding: 32px;
transition: transform 0.3s ease, box-shadow 0.3s ease;

/* Hover State */
transform: translateY(-4px);
box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
```

### Form Inputs

```css
background: #FFFFFF;
border: 2px solid #E9ECEF;
border-radius: 6px;
padding: 14px 18px;
font-size: 1rem;
transition: border-color 0.3s ease;

/* Focus State */
border-color: #1E3A5F;
box-shadow: 0 0 0 3px rgba(30, 58, 95, 0.1);
```

---

## 🎬 Animation Guidelines

### Entrance Animations
- **Fade Up:** opacity 0→1, translateY 30px→0, duration 0.6s
- **Fade In:** opacity 0→1, duration 0.4s
- **Scale In:** scale 0.95→1, opacity 0→1, duration 0.5s

### Scroll Animations
- **Trigger:** When element enters viewport (20% visible)
- **Stagger:** 0.1s delay between elements
- **Easing:** cubic-bezier(0.4, 0, 0.2, 1)

### Hover Effects
- **Buttons:** translateY -2px, shadow increase
- **Cards:** translateY -4px, shadow increase
- **Links:** Color shift to accent gold
- **Images:** Scale 1.05, subtle brightness

### Timing
- **Fast:** 0.2s (hover states)
- **Normal:** 0.3s (transitions)
- **Slow:** 0.6s (scroll reveals)
- **Easing:** cubic-bezier(0.4, 0, 0.2, 1)

---

## 📱 Responsive Breakpoints

```css
/* Mobile First */
/* Default: 0-639px */

/* Small tablets */
@media (min-width: 640px) { /* sm */ }

/* Tablets */
@media (min-width: 768px) { /* md */ }

/* Desktop */
@media (min-width: 1024px) { /* lg */ }

/* Large Desktop */
@media (min-width: 1280px) { /* xl */ }
```

---

## 🎨 Mood References

### Overall Feel
- **Warm:** Welcoming, not cold or corporate
- **Professional:** Quality design, trustworthy
- **Modern:** Current trends, not dated
- **Spiritual:** Inspiring, uplifting atmosphere
- **Inclusive:** Diverse, community-focused

### Design Comparables
- Hillsong (modern, bold)
- Saddleback (warm, community)
- Local high-end business websites
- Premium nonprofit organizations

---

## ✅ Implementation Checklist

- [ ] Import Google Fonts (Playfair, Inter, Cormorant)
- [ ] Set up CSS custom properties (colors)
- [ ] Create button components
- [ ] Style form inputs
- [ ] Design card layouts
- [ ] Add hover/scroll animations
- [ ] Test on mobile devices
- [ ] Verify color contrast (accessibility)
- [ ] Optimize images
- [ ] Test form functionality
