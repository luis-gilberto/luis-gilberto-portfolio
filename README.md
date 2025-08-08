# Luis Gilberto - Creative Portfolio

A modern, responsive portfolio showcasing creative strategy, brand storytelling, and thought leadership work.

## 🌟 Features

- **Case Studies**: In-depth project showcases with interactive elements
- **Thought Leadership**: Editorial-style articles and reflections
- **Responsive Design**: Optimized for all devices
- **Modern UI/UX**: Clean, professional aesthetic with coral accent branding
- **Interactive Elements**: Smooth animations, hover effects, and scroll indicators

## 📁 Project Structure

```
├── assets/
│   ├── images/          # Project images and graphics
│   ├── icons/           # SVG icons
│   └── Components/      # Reusable code snippets
├── styles/
│   ├── main.css         # Global styles
│   ├── case-study.css   # Case study specific styles
│   └── *.css           # Page-specific stylesheets
├── scripts/
│   ├── main.js          # Core JavaScript functionality
│   ├── timeline.js      # Timeline interactions
│   └── video-modal.js   # Video modal functionality
├── thoughts/            # Thought leadership articles
│   ├── index.html       # Articles index page
│   └── *.html          # Individual articles
├── case-study-*.html    # Project case studies
├── index.html           # Homepage
├── about.html           # About page
├── cv.html             # Resume/CV
└── contact.html         # Contact information
```

## 🚀 Getting Started

### Prerequisites
- A modern web browser
- Local web server (optional, for development)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/luis-gilberto/luis-gilberto-portfolio.git
cd luis-gilberto-portfolio
```

2. Install dependencies (if using Node.js server):
```bash
npm install
```

3. Start local development server:
```bash
# Using Node.js
node server.js

# Or using Python
python -m http.server 8000

# Or using PHP
php -S localhost:8000
```

4. Open your browser and navigate to `http://localhost:8000`

## 🎨 Design System

### Colors
- **Primary**: Coral Red (#FF6B6B)
- **Background**: Dark theme with subtle gradients
- **Text**: White primary, gray secondary
- **Accents**: Coral variations for highlights

### Typography
- **Headings**: Playfair Display (serif)
- **Body**: Source Sans Pro (sans-serif)
- **Code**: Monospace fonts for technical content

### Components
- **Hero Sections**: Full-width with background images
- **Bento Cards**: Grid-based content cards
- **Meta Tags**: Coral button-style tags
- **Navigation**: Clean, minimal navigation bar

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🔧 Development

### Adding New Case Studies
1. Create new HTML file: `case-study-[project-name].html`
2. Follow existing case study structure
3. Add project images to `assets/images/[project-name]/`
4. Update navigation and portfolio grid

### Adding Thought Leadership Articles
1. Create new HTML file in `thoughts/` directory
2. Use editorial styling template
3. Update `thoughts/index.html` with new article card
4. Follow URL naming convention: `kebab-case.html`

### Customizing Styles
- Global styles: `styles/main.css`
- Component styles: `styles/case-study.css`
- Page-specific: Create new CSS file and link in HTML

## 🌐 Deployment

### Cloudflare Pages (Recommended)
1. Connect GitHub repository to Cloudflare Pages
2. **Build command**: Leave empty (static site)
3. **Deploy command**: Leave empty (remove any `npx wrangler deploy` commands)
4. Deploy automatically on push to main branch
5. Custom domain configuration available

### Vercel
1. Connect GitHub repository to Vercel
2. Deploy automatically on push to main branch
3. Custom domain configuration available

### GitHub Pages
1. Enable GitHub Pages in repository settings
2. Select source branch (main)
3. Access via `https://yourusername.github.io/repository-name`

### Netlify
1. Connect repository to Netlify
2. Configure build settings (if needed)
3. Deploy with custom domain support

## 📄 Content Guidelines

### Case Studies
- **Hero Section**: Project title, subtitle, and meta tags
- **Overview**: Problem statement and solution approach
- **Process**: Detailed methodology and insights
- **Results**: Measurable outcomes and impact
- **Visuals**: High-quality images and videos

### Thought Leadership
- **Editorial Style**: Magazine-like layout with serif fonts
- **Personal Voice**: Authentic, reflective tone
- **Professional Insights**: Industry expertise and lessons learned
- **Visual Hierarchy**: Clear structure with quotes and callouts

## 🔒 Privacy & Security

- No sensitive data in repository
- Environment variables for any API keys
- Image optimization for performance
- Clean URLs without exposing file structure

## 📞 Contact

**Luis Gilberto**
- Portfolio: [luis-gilberto.com](https://luis-gilberto.com)
- LinkedIn: [linkedin.com/in/luisgilberto](https://linkedin.com/in/luisgilberto)
- Email: [contact@luis-gilberto.com](mailto:contact@luis-gilberto.com)

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

*Built with HTML, CSS, JavaScript, and a focus on storytelling through design.*
