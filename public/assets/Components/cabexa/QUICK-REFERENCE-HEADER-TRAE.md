# ⚡ QUICK FIX: ScopeIQ Header (For Trae)

## 🎯 Goal
Make ScopeIQ header match The Hub's main page + fix broken hamburger menu.

---

## 📝 What to Do

### 1. Remove Old Header Code
Find and **DELETE/COMMENT OUT**:
```html
<script src="../hub-integration-component.js?v=2.8"></script>
```

### 2. Add New Header (3 Parts)

Use file: **SCOPEIQ-HEADER-COMPLETE.html**

#### Part 1: CSS → Add to `<head>`
```html
<head>
  <!-- Existing styles -->
  
  <!-- ADD HEADER CSS HERE (from file) -->
  <style>
    .hub-header { ... }
  </style>
</head>
```

#### Part 2: HTML → Add after `<body>`
```html
<body>
  <!-- ADD HEADER HTML HERE (from file) -->
  <header class="hub-header">
    ...
  </header>
  
  <!-- Existing content -->
```

#### Part 3: JavaScript → Add before `</body>`
```html
  <!-- Existing scripts -->
  
  <!-- ADD HEADER JS HERE (from file) -->
  <script>
    (function(){ ... })();
  </script>
</body>
```

---

## ✅ Result

### Desktop:
- Fixed header with logo + 5 nav items
- ScopeIQ highlighted as "active"
- Smooth hover effects

### Mobile:
- Logo + hamburger menu
- Click to open full-screen navigation
- Touch-friendly, working menu

---

## 🧪 Quick Test

1. **Desktop (1440px):**
   - [ ] Header visible at top
   - [ ] 5 nav items showing
   - [ ] ScopeIQ has teal highlight

2. **Mobile (375px):**
   - [ ] Hamburger visible
   - [ ] Click hamburger → menu opens
   - [ ] Click nav item → navigates
   - [ ] Press ESC → menu closes

---

## 🆘 Issues?

- **Header doesn't show?** → Check you added HTML to `<body>`
- **Menu doesn't work?** → Check JavaScript is before `</body>`
- **Styling wrong?** → Check CSS is in `<head>`

---

## 📂 Files You Need

1. **SCOPEIQ-HEADER-COMPLETE.html** ← All the code
2. This reference card ← Instructions

---

## ⏱️ Time: ~5 minutes

Remove old script → Add CSS, HTML, JS → Test → Done!

---

**Good luck!** 🚀
