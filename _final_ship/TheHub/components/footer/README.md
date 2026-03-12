# The Hub Footer Component

A reusable, responsive footer component that maintains The Hub's brand identity and design language.

## Features

- Responsive grid layout
- Brand section with logo and tagline
- Social media links with hover effects
- Navigation menus
- Copyright notice
- Glassmorphism design elements
- Accessibility-compliant structure
- Mobile-first approach

## Dependencies

- Fonts:
  - Inter (300, 400, 500, 600, 700) via Google Fonts
  - Playfair Display (700) via Google Fonts

## Installation

1. Copy the `footer` directory into your project's components folder
2. Include the required CSS and HTML in your project
3. Ensure the font dependencies are loaded

## Usage

### 1. Add Font Dependencies

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet">
```

### 2. Include the CSS

```html
<link rel="stylesheet" href="components/footer/footer.css">
```

### 3. Add the HTML Structure

```html
<!-- Copy the footer HTML structure from footer.html -->
```

## Customization

### CSS Variables

The footer uses CSS variables that can be customized:

```css
:root {
  --coral: #F96F6E;
  --teal: #2ED3C6;
  --bg-darker: #050505;
  --text-primary: rgba(255, 255, 255, 0.95);
  --text-secondary: rgba(255, 255, 255, 0.6);
  --text-muted: rgba(255, 255, 255, 0.35);
  --glass-border: rgba(255, 255, 255, 0.08);
}
```

### Social Links

Update the social media links in the HTML structure to point to your profiles:

```html
<div class="footer-social">
  <a href="your-linkedin-url" class="social-link">...</a>
  <a href="your-website-url" class="social-link">...</a>
</div>
```

### Navigation Links

Modify the navigation links in both columns to match your site structure:

```html
<ul class="footer-nav-list">
  <li><a href="your-page.html">Your Page</a></li>
</ul>
```

## Accessibility

The footer component follows WCAG guidelines:

- Semantic HTML structure
- Proper heading hierarchy
- ARIA labels where needed
- Sufficient color contrast
- Keyboard navigation support

## Responsive Behavior

The footer is responsive across all device sizes:

- Desktop: Three-column grid layout
- Tablet (≤1024px): Two-column grid layout
- Mobile (≤768px): Single-column stacked layout

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Opera (latest)

## License

MIT License - Feel free to use in personal and commercial projects.