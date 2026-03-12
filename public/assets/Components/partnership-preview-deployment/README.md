# Partnership Preview - Deployment Guide

## 🚀 Quick Overview
This is Luis Gilberto's Partnership Preview page featuring custom evolving text animations and strategic partnership positioning. Designed for exclusive sharing with potential agency partners.

## 📁 File Structure
```
partnership-preview-deployment/
├── index.html              # Main HTML file
├── assets/
│   ├── css/
│   │   └── style.css       # All styles including animations
│   └── js/
│       └── script.js       # Interactive functionality
├── README.md               # This file
├── package.json            # Dependencies (if needed)
└── .gitignore             # Git ignore rules
```

## 🔧 Deployment Instructions for Trae

### Option 1: Direct Integration (Recommended)
1. **Upload files to your web server:**
   - Copy the entire `partnership-preview-deployment/` folder to your web server
   - Maintain the exact folder structure

2. **Create subdirectory route:**
   - Place in `/partnerships/` or `/preview/` directory on your domain
   - Example: `yoursite.com/partnerships/`

3. **Test the page:**
   - Visit the URL in browser
   - Enter passcode: **LG100**
   - Verify animations and functionality work

### Option 2: GitHub Integration
1. **Create new repository:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Partnership preview page"
   git branch -M main
   git remote add origin https://github.com/yourusername/partnership-preview.git
   git push -u origin main
   ```

2. **Deploy via GitHub Pages (optional):**
   - Enable GitHub Pages in repository settings
   - Use for staging/preview before main site integration

## 🔐 Access Control
- **Passcode:** LG100
- **Purpose:** Private sharing with potential partners
- **Security:** Client-side validation (upgrade to server-side for production)

## 🎨 Technical Features
- **Evolving Text Animations:** Custom CSS animations on scroll
- **Responsive Design:** Mobile-optimized layout
- **External Dependencies:** 
  - Tailwind CSS (CDN)
  - Font Awesome icons (CDN)
  - Google Fonts (Inter family)

## 🔄 Updates & Maintenance
- CSS and JS are separated for easy editing
- Color scheme uses CSS variables for quick theme changes
- Animation timing adjustable in CSS

## 🚨 Important Notes
- Keep file structure intact for proper asset loading
- Test thoroughly after deployment
- Passcode can be changed in `script.js` file
- Consider server-side authentication for enhanced security

## 📞 Support
For deployment questions or issues, contact Luis Gilberto.

---
**Built with:** HTML5, CSS3, JavaScript, Tailwind CSS  
**Browser Support:** Modern browsers (Chrome, Firefox, Safari, Edge)  
**Mobile Optimized:** Yes
