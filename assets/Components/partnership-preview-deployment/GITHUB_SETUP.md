# GitHub Repository Setup Guide

## 🚀 Creating Your GitHub Repository

### Step 1: Create Repository on GitHub
1. Go to [GitHub.com](https://github.com) and sign in
2. Click the "+" icon → "New repository"
3. **Repository name:** `partnership-preview`
4. **Description:** "Luis Gilberto's Partnership Preview page with evolving text animations"
5. Set to **Private** (recommended for partnership content)
6. ✅ Add a README file (will be replaced)
7. ✅ Add .gitignore → choose "Node"
8. Click "Create repository"

### Step 2: Clone and Setup Locally
```bash
# Clone the repository
git clone https://github.com/yourusername/partnership-preview.git
cd partnership-preview

# Remove default README if it exists
rm README.md

# Copy your deployment files here
# (Copy the entire partnership-preview-deployment folder contents)
```

### Step 3: Initial Commit
```bash
# Add all files
git add .

# Commit with descriptive message
git commit -m "Initial commit: Partnership preview page with evolving animations

- Clean HTML/CSS/JS separation
- LG100 passcode protection
- Mobile-responsive design
- AI strategy showcase
- Partnership-focused messaging"

# Push to GitHub
git push origin main
```

## 🌐 GitHub Pages Deployment (Optional)

### Enable GitHub Pages
1. Go to your repository on GitHub
2. Settings → Pages (in sidebar)
3. Source: "Deploy from a branch"
4. Branch: `main` → folder: `/ (root)`
5. Click "Save"
6. Your site will be available at: `https://yourusername.github.io/partnership-preview/`

### Custom Domain Setup (Advanced)
If you want to use your own domain:
1. Create CNAME file in repository root
2. Add your domain name (e.g., `partnerships.luisgilberto.com`)
3. Configure DNS at your domain registrar

## 🔄 Update Workflow

### Making Changes
```bash
# Make your edits to HTML, CSS, or JS files
# Test locally first

# Commit changes
git add .
git commit -m "Update: [describe your changes]"
git push origin main
```

### Branch Strategy (Optional)
For larger changes, use branches:
```bash
# Create feature branch
git checkout -b feature/new-animation

# Make changes, test, commit
git add .
git commit -m "Add new hover animation effects"

# Merge back to main
git checkout main
git merge feature/new-animation
git push origin main
```

## 🔐 Security Considerations

### Private Repository Benefits
- Content not publicly searchable
- Access control through GitHub permissions
- Professional presentation when sharing

### Sharing with Team
- Go to Settings → Manage access
- Click "Invite a collaborator"
- Add Trae's GitHub username
- Set permission level (Write recommended)

## 📝 Best Practices

### Commit Messages
Use descriptive commit messages:
- ✅ "Update partnership highlights with AI metrics"
- ✅ "Fix mobile responsiveness on tablet breakpoint" 
- ❌ "changes"
- ❌ "update"

### File Organization
Keep the structure clean:
```
partnership-preview/
├── index.html          # Never rename this
├── assets/
│   ├── css/style.css   # All styles here
│   └── js/script.js    # All JavaScript here
└── documentation files
```

## 🚨 Important Notes
- Keep the LG100 passcode secure
- Test changes locally before pushing
- Consider using branches for experimental features
- Regular backups recommended for critical updates

---
**Need help?** Contact Luis Gilberto for GitHub setup assistance.
