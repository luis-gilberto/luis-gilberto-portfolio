# Copilot Instructions for Luis Gilberto Portfolio

This document provides essential guidance for AI coding assistants working in this codebase.

## Project Overview

This is a multi-component web portfolio/platform consisting of:
- Main portfolio site with interactive components
- Creative Portal for project/client management
- The Hub for partnership and service offerings
- Various deployment packages and components

## Core Architecture

### Project Structure
```
/
├── creative-portal/          # Client/Project Management Portal (Next.js)
├── TheHub/                   # Partnership Hub
│   ├── IMCServices/         # Services showcase
│   └── scopeiq/            # ScopeIQ Wizard
├── assets/                  # Shared assets and components
└── [various HTML pages]     # Static portfolio pages
```

### Key Technologies & Patterns

- **Frontend**: NextJS (Creative Portal), Static HTML/CSS/JS (Portfolio)
- **Deployment**: Netlify with automatic builds
- **Authentication**: Role-based (admin, team_member, client)
- **Data Storage**: JSON/Local for static, DB for Creative Portal

## Development Workflows

### Local Development
1. Use VS Code with recommended extensions
2. Run local servers for components that need them
3. Test builds with Netlify CLI before deployment

### Deployment Process
1. Changes are deployed via Netlify
2. Build command is configured in `netlify.toml`
3. Production deployments trigger backup procedures
4. Monitor deployment status in Netlify dashboard

## Project-Specific Conventions

### Component Architecture
- Components follow atomic design principles
- Shared components live in `/assets/Components`
- Each major section (Hub, Portal) has its own component structure

### File Naming
- Use kebab-case for files: `my-component.js`
- Backup files follow pattern: `{name}-backup-{date}.{ext}`
- Configuration files use standard names: `netlify.toml`, `package.json`

### Code Style
- ES6+ JavaScript features preferred
- CSS uses utility-first approach with custom components
- Follow existing patterns for animations and transitions

## Integration Points

### Creative Portal ↔ The Hub
- Shared authentication system
- Common asset pipeline
- Cross-linking between platforms

### External Services
- Netlify for hosting/deployment
- Email providers for notifications
- Analytics integration

## Common Pitfalls

1. **Deployment Issues**
   - Always check `netlify.toml` configuration
   - Verify build commands before deployment
   - Monitor backup procedures

2. **Asset Management**
   - Use absolute paths for cross-component assets
   - Follow established folder structure
   - Check image optimization settings

3. **State Management**
   - Creative Portal uses React state patterns
   - The Hub uses vanilla JS state management
   - Avoid mixing approaches

## Key Files to Know

- `netlify.toml` - Deployment configuration
- `creative-portal/src/app/projects/[id]/page.tsx` - Project management templates
- `TheHub/IMCServices/index.html` - Main services showcase
- `assets/Components/README.md` - Component documentation

## Task Examples

### Adding New Portfolio Content
```typescript
// Add to appropriate section in portfolio
// Example: New case study in case-studies/
const newCaseStudy = {
  title: "Project Name",
  description: "Project Description",
  // ... follow existing patterns
};
```

### Modifying Creative Portal
```typescript
// Follow established patterns in creative-portal/
interface Project {
  id: string;
  name: string;
  status: 'planning' | 'in_progress' | 'review' | 'completed';
  // ... follow type definitions
}
```

---

This document should be kept up to date as the codebase evolves. When making significant architectural changes, please update this guide accordingly.