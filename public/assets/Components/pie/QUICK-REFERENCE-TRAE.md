# ⚡ QUICK FIX: ScopeIQ Footer (For Trae)

## 🎯 Goal
Make ScopeIQ footer match The Hub's main page footer exactly.

---

## 📝 What to Do

### 1. Find This in ScopeIQ file (line ~1944):
```html
<!-- Standardized footer injected via hub-navigation.js -->
<script src="/hub-navigation.js"></script>
```

### 2. DELETE Those 2 Lines ☝️

### 3. Find This (line ~2026):
```html
</body>
</html>
```

### 4. BEFORE `</body>`, Add Footer
Paste the entire contents of **SCOPEIQ-FOOTER-COMPLETE.html**

---

## ✅ Result

### Your file should end like this:
```html
  ... (existing scripts)
  </script>

  <!-- STANDARDIZED FOOTER -->
  <footer class="hub-footer">
    ... (footer HTML)
  </footer>

  <style>
    ... (footer CSS)
  </style>

</body>
</html>
```

---

## 🧪 Test

1. Save file
2. Clear cache (Ctrl+Shift+R)
3. Check footer appears correctly
4. Resize browser to test responsive behavior
5. Verify all links work

---

## 📂 Files You Need

1. **SCOPEIQ-FOOTER-COMPLETE.html** ← Paste this entire file before `</body>`
2. This reference card

---

## ⏱️ Time: ~2 minutes

That's it! Simple replacement. The footer HTML + CSS is all in one file ready to paste.

---

## 🆘 Issues?

- Footer doesn't show? → Make sure you pasted BEFORE `</body>`
- Styling wrong? → Did you paste the complete file including both `<style>` blocks?
- Logo missing? → Image path should be `/TheHub/advisory/assets/DUA.svg`

---

**Good luck!** 🚀
