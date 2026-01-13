# Quick Reference: Adding New Articles

## Article Template

Copy this template when adding a new article to `articles-metadata.json`:

```json
{
  "id": "",
  "title": "",
  "slug": "",
  "publishDate": "YYYY-MM-DD",
  "series": "",
  "seriesSlug": null,
  "topics": [],
  "url": "/insights/",
  "excerpt": ""
}
```

---

## Series Quick Reference

### Building Series
```json
"series": "Building Series",
"seriesSlug": "building-the-hub"     // or "building-insights" or "building-portfolio"
```

### Use Cases
```json
"series": "Use Cases",
"seriesSlug": null
```

### Reflections
```json
"series": "Reflections",
"seriesSlug": null
```

### Standalone Article
```json
"series": null,
"seriesSlug": null
```

---

## Common Topics

Strategy • Design • Marketing • Business • Consulting • Content • Publishing • Product • Technology • Career • Purpose • Transition • Creativity • Writing • Process • Productivity • Philosophy • Personal Brand

---

## Example: Building Series Article

```json
{
  "id": "building-scopeiq",
  "title": "Building ScopeIQ",
  "slug": "building-scopeiq",
  "publishDate": "2024-12-04",
  "series": "Building Series",
  "seriesSlug": "building-the-hub",
  "topics": ["Product", "Strategy", "Technology"],
  "url": "/insights/building-scopeiq",
  "excerpt": "How we created an intelligent scoping wizard for strategic projects"
}
```

---

## Example: Reflection Article

```json
{
  "id": "the-magic-of-misdirection",
  "title": "The Magic of Misdirection",
  "slug": "the-magic-of-misdirection",
  "publishDate": "2024-12-04",
  "series": "Reflections",
  "seriesSlug": null,
  "topics": ["Strategy", "Marketing", "Philosophy"],
  "url": "/insights/the-magic-of-misdirection",
  "excerpt": "What a career in magic taught me about strategic marketing"
}
```

---

## Example: Use Case Article

```json
{
  "id": "microsoft-surface-launch",
  "title": "Launching Microsoft Surface",
  "slug": "microsoft-surface-launch",
  "publishDate": "2024-12-04",
  "series": "Use Cases",
  "seriesSlug": null,
  "topics": ["Marketing", "Product", "Strategy"],
  "url": "/insights/microsoft-surface-launch",
  "excerpt": "Behind the scenes of a billion-dollar product introduction"
}
```

---

## Checklist Before Publishing

- [ ] Unique `id` (no duplicates)
- [ ] Date in ISO format: YYYY-MM-DD
- [ ] URL matches article location
- [ ] 2-4 topics selected
- [ ] Excerpt written (1-2 sentences)
- [ ] Series assigned correctly
- [ ] `seriesSlug` only used for Building Series
- [ ] JSON syntax valid (no trailing commas)
- [ ] Test in browser after adding

---

## Date Format Examples

✅ Correct:
- "2024-12-04"
- "2024-01-15"
- "2024-11-30"

❌ Incorrect:
- "12/04/2024"
- "Dec 4, 2024"
- "2024-12-4" (missing leading zero)

---

## Where Articles Appear

| Publish Date | Appears In |
|--------------|-----------|
| Last 90 days | **Latest** section |
| Any date | **Series** section (if series assigned) |
| Any date | **Topics** section (all articles) |

---

## Tips

1. **Keep slugs simple**: lowercase, hyphens only
2. **Use existing topics**: Creates cohesive taxonomy
3. **Write for scanners**: Titles should be self-explanatory
4. **Update regularly**: Aim for 1-2 articles per month
5. **Test immediately**: Open drawer after adding article

---

**File Location**: `/data/articles-metadata.json`  
**After Editing**: Clear browser cache and refresh
