# Move at the Speed of What Matters: Editorial Project

> A sophisticated editorial article with advanced dark/light mode theming and responsive design.

## 🎯 Project Overview

This is a parallel test version of the "Move at the Speed of What Matters: A Personal Reset" editorial, designed for A/B testing with professional colleagues. The project features a sophisticated visual approach with advanced theming capabilities and optimal responsive design.

## ✨ Key Features

### 🌓 Advanced Theme System
- **Sophisticated Light/Dark Mode Toggle**: Elegant circular button with smooth transitions
- **CSS Variables Architecture**: Comprehensive theming system using HSL-based colors
- **localStorage Persistence**: Theme preference saved across sessions
- **Accessibility Compliant**: Full keyboard navigation and WCAG guidelines

### 📱 Responsive Design
- **Two-Column Layout**: 65% content, 30% visual elements, 5% gap on desktop
- **CSS Grid Implementation**: Modern layout with proper responsive breakpoints
- **Mobile-First Approach**: Optimized for all device types
- **Visual Elements Only**: Right column contains exclusively visual content

### 🎨 Visual Excellence
- **Typography System**: Playfair Display (serif) + Inter (sans-serif)
- **Data Visualizations**: Interactive charts, progress indicators, and timelines
- **Sophisticated Color Palette**: Coral accent with subtle gradients
- **Smooth Animations**: 0.3s transitions for all interactive elements

## 🚀 Quick Start

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (optional, for development)

### Installation

1. **Clone or Download**
   ```bash
   git clone [repository-url]
   cd editorial-project
   ```

2. **Open in Browser**
   - Simply open `index.html` in your web browser
   - Or serve via local server for development:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```

3. **Access the Article**
   - Navigate to `http://localhost:8000` (if using local server)
   - Or open `index.html` directly in browser

## 📁 Project Structure

```
editorial-project/
├── index.html                 # Main article file
├── assets/
│   ├── css/
│   │   ├── styles.css        # Core styling and theme system
│   │   └── responsive.css    # Responsive design breakpoints
│   ├── js/
│   │   └── theme-toggle.js   # Theme switching functionality
│   └── images/
│       └── final_banner.png  # Hero image (external CDN)
├── README.md                 # This file
└── LICENSE                   # Project license
```

## 🎛️ Theme System

### CSS Variables Architecture

The project uses a comprehensive CSS variables system for theming:

```css
:root {
  /* Dark theme (default) */
  --bg-primary: #121212;
  --bg-secondary: #1e1e1e;
  --text-primary: rgba(255, 255, 255, 0.9);
  --accent-coral: #ff8a80;
  /* ... */
}

[data-theme="light"] {
  /* Light theme overrides */
  --bg-primary: #ffffff;
  --bg-secondary: #f8f9fa;
  --text-primary: rgba(0, 0, 0, 0.87);
  --accent-coral: #d32f2f;
  /* ... */
}
```

### Theme Toggle Usage

The theme system is automatically initialized and provides:

- **Automatic Detection**: Loads saved preference from localStorage
- **Manual Toggle**: Click the floating button in top-right corner
- **Keyboard Access**: Press Enter or Space when button is focused
- **Programmatic Control**: Access via `window.ThemeManager`

```javascript
// Available methods
window.ThemeManager.toggle();           // Toggle current theme
window.ThemeManager.apply('light');     // Apply specific theme
window.ThemeManager.getCurrent();       // Get current theme
```

## 📱 Responsive Breakpoints

| Device Type | Screen Width | Layout |
|-------------|--------------|--------|
| Mobile | 320px - 767px | Single column |
| Tablet | 768px - 1023px | 60% / 35% split |
| Desktop | 1024px - 1199px | 65% / 30% split |
| Large Desktop | 1200px+ | 68% / 27% split |

## 🎨 Visual Elements

The right column features exclusively visual content:

- **Pull Quotes**: Highlighted text excerpts with coral accent
- **Data Visualizations**: Progress bars and circular indicators
- **Timeline Graphics**: Project development milestones
- **Interactive Charts**: Productivity metrics comparison

## 🔧 Customization

### Modifying Colors

Update CSS variables in `assets/css/styles.css`:

```css
:root {
  --accent-coral: #your-color;        /* Primary accent */
  --accent-coral-muted: rgba(...);    /* Muted variant */
  /* ... */
}
```

### Adding New Themes

1. Define new theme variables:
```css
[data-theme="your-theme"] {
  --bg-primary: #your-bg;
  /* ... other variables */
}
```

2. Update JavaScript in `assets/js/theme-toggle.js` to include new theme option.

### Content Updates

Modify `index.html` directly. The structure follows semantic HTML5:

```html
<main class="content-grid">
  <article class="main-content">
    <!-- Main text content -->
  </article>
  <aside class="visual-element">
    <!-- Visual elements only -->
  </aside>
</main>
```

## 🧪 A/B Testing

This version is designed for professional colleague feedback. Key evaluation metrics:

- **Visual Appeal**: Professional design and typography
- **Readability**: Content flow and hierarchy
- **Engagement**: Interactive elements and visual interest
- **Effectiveness**: Visual elements supporting narrative

## 🌐 Browser Support

- **Chrome**: 88+
- **Firefox**: 85+
- **Safari**: 14+
- **Edge**: 88+

### Required Features
- CSS Grid
- CSS Custom Properties (Variables)
- localStorage API
- ES6+ JavaScript

## 📈 Performance

- **Optimized Assets**: Minimal external dependencies
- **Efficient CSS**: CSS Grid for layout, variables for theming
- **Smooth Transitions**: Hardware-accelerated animations
- **Accessibility**: Full keyboard navigation and screen reader support

## 🤝 Contributing

This is a focused editorial project for A/B testing. For suggestions or improvements:

1. Test the article thoroughly
2. Provide specific feedback on user experience
3. Note any accessibility or performance issues
4. Suggest visual or content improvements

## 📄 License

© 2025 Luis Gilberto. All Rights Reserved.

This editorial content and design system are proprietary. The code structure and techniques may be referenced for educational purposes.

## 📞 Contact

**Luis Gilberto**  
Creative Strategist & Thought Leader  
[LinkedIn](https://linkedin.com/in/luisgilberto) | [Website](https://luis-gilberto.com)

---

*Built with modern web standards and a focus on accessibility, performance, and visual excellence.*