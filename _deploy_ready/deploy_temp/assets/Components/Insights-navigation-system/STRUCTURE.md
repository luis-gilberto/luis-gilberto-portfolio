# Insights Navigation Structure

## Visual Hierarchy

```
┌─────────────────────────────────────┐
│   INSIGHTS NAVIGATION DRAWER        │
├─────────────────────────────────────┤
│                                     │
│  GLOBAL                             │
│  ├─ Portfolio                       │
│  ├─ Insights (active)               │
│  └─ The Hub                         │
│                                     │
│  ─────────────────────────────────  │
│                                     │
│  INSIGHTS                           │
│                                     │
│  ▼ Latest (active)                  │
│     ├─ Article 1                    │
│     │  └─ Nov 20, 2024              │
│     ├─ Article 2                    │
│     │  └─ Oct 15, 2024              │
│     └─ Article 3                    │
│        └─ Sep 28, 2024              │
│                                     │
│  ▶ Series                           │
│     ├─ ▶ Building Series            │
│     │     ├─ ▶ The Hub (1)          │
│     │     │     └─ Building The Hub │
│     │     ├─ ▶ Insights (1)         │
│     │     │     └─ Building Insights│
│     │     └─ ▶ Portfolio (1)        │
│     │           └─ Building Portfolio│
│     │                               │
│     ├─ ▶ Use Cases (0)              │
│     │                               │
│     └─ ▶ Reflections (3)            │
│           ├─ Proof of Life          │
│           ├─ Move at Speed...       │
│           └─ Unlocking Blank Page   │
│                                     │
│  ▶ Topics                           │
│     [Career] [Content] [Creativity] │
│     [Design] [Philosophy] [Process] │
│     [Productivity] [Purpose]        │
│     [Strategy] [Transition]         │
│     [Writing]                       │
│                                     │
└─────────────────────────────────────┘
```

---

## Interaction States

### Collapsed Series
```
▶ Building Series
```

### Expanded Series
```
▼ Building Series
  ▶ The Hub (1)
  ▶ Insights (1)
  ▶ Portfolio (1)
```

### Fully Expanded
```
▼ Building Series
  ▼ The Hub (1)
    • Building The Hub
  ▶ Insights (1)
  ▶ Portfolio (1)
```

---

## Data Flow

```
articles-metadata.json
        ↓
InsightsNavigationFilter
        ↓
    Parse & Filter
        ↓
    ┌───────┬────────┬─────────┐
    │       │        │         │
  Latest  Series  Topics
    │       │        │
    └───────┴────────┴─────────┘
        ↓
InsightsNavigationRenderer
        ↓
    Generate HTML
        ↓
Inject into DOM
        ↓
User Interacts
        ↓
Toggle Accordions
```

---

## Article Routing Logic

### Latest Section
```
Is publishDate within last 90 days?
  ├─ YES → Show in Latest
  └─ NO  → Don't show in Latest
```

### Series Section
```
Does article have a series value?
  ├─ NO (null) → Don't show in Series
  │
  └─ YES → Which series?
           │
           ├─ "Building Series"
           │   └─ Group by seriesSlug
           │       ├─ "building-the-hub" → The Hub
           │       ├─ "building-insights" → Insights
           │       └─ "building-portfolio" → Portfolio
           │
           ├─ "Use Cases"
           │   └─ Show in Use Cases flat list
           │
           └─ "Reflections"
               └─ Show in Reflections flat list
```

### Topics Section
```
Extract all unique values from topics arrays
  ↓
Sort alphabetically
  ↓
Display as pill tags
  ↓
Link to topic filter pages
```

---

## Component Relationships

```
┌─────────────────────────────┐
│   InsightsNavigationFilter   │  ← Core filtering logic
│   • getLatestArticles()      │
│   • getSeriesStructure()     │
│   • getBuildingSeries()      │
│   • getAllTopics()           │
└──────────────┬──────────────┘
               │
               │ feeds data to
               ↓
┌─────────────────────────────┐
│ InsightsNavigationRenderer   │  ← HTML generation
│   • renderLatest()           │
│   • renderSeries()           │
│   • renderTopics()           │
└──────────────┬──────────────┘
               │
               │ outputs HTML to
               ↓
┌─────────────────────────────┐
│    DOM Elements              │  ← User interface
│   #nav-latest-content        │
│   #nav-series-content        │
│   #nav-topics-content        │
└──────────────┬──────────────┘
               │
               │ user interactions
               ↓
┌─────────────────────────────┐
│  Toggle Event Handlers       │  ← Accordion behavior
│   • .series-toggle           │
│   • .sub-series-toggle       │
└─────────────────────────────┘
```

---

## CSS Architecture

```
Base Styles
  ├─ Typography (Playfair Display, Inter)
  ├─ Colors (Coral #FF6B5A, Teal #4A90A4)
  └─ Spacing (consistent padding/margins)
      ↓
Component Styles
  ├─ Drawer Container (.insights-drawer)
  ├─ Section Headers (.nav-section-header)
  ├─ Article Items (.article-item)
  ├─ Series Toggles (.series-toggle)
  ├─ Topic Pills (.topic-link)
  └─ Overlay (.drawer-overlay)
      ↓
Interactive States
  ├─ Hover effects (border-left transitions)
  ├─ Open/closed (.open class)
  ├─ Active states (.active class)
  └─ Rotation animations (transform: rotate)
      ↓
Responsive Behavior
  ├─ Mobile breakpoints (@media)
  ├─ Touch scrolling (-webkit-overflow-scrolling)
  └─ Custom scrollbar styling
```

---

## File Dependencies

```
insights-page.html
    │
    ├─ requires → insights-navigation.css
    │                 └─ defines visual styles
    │
    ├─ requires → insights-navigation.js
    │                 ├─ fetches → articles-metadata.json
    │                 └─ generates → dynamic HTML
    │
    └─ requires → Google Fonts
                      ├─ Playfair Display
                      └─ Inter
```

---

## User Journey

```
1. User opens mobile drawer
   └─ Clicks menu button
       ↓
2. Drawer slides in from right
   └─ Overlay appears
       ↓
3. Global navigation visible
   └─ "Insights" is active
       ↓
4. Latest section expanded by default
   └─ Shows recent articles
       ↓
5. User clicks "Series" header
   └─ Series section expands
       ↓
6. User clicks "Building Series"
   └─ Sub-series appear
       ↓
7. User clicks "The Hub"
   └─ Articles in that sub-series show
       ↓
8. User clicks article link
   └─ Navigates to article
       └─ Drawer closes
```

---

## Key Benefits

✅ **Automatic categorization** - Articles sort themselves based on metadata  
✅ **Time-based filtering** - Latest section updates automatically  
✅ **Nested organization** - Building Series grouped by project  
✅ **Scalable** - Easy to add new series and topics  
✅ **Maintainable** - Single JSON file for all articles  
✅ **Fast** - Client-side filtering, no server calls  
✅ **Accessible** - Keyboard navigation and ARIA support  
✅ **Responsive** - Mobile-first design

---

This structure ensures that as your Insights library grows, the navigation remains organized and intuitive.
