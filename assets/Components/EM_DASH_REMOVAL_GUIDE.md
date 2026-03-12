# Em Dash Removal Guide
## Clean Up All Case Study Body Copy

---

## 🎯 WHAT WE'RE REMOVING

**Em dashes (—)** appear throughout the body copy in all 6 case studies. These are the long dashes used for emphasis or parenthetical statements.

**Examples:**
- "This wasn't about features—it was about reframing what 'together' means"
- "Zoom calls, work meetings, corporate productivity—the challenge was repositioning"
- "From hero films to social content to in-app onboarding—all reinforcing core narrative"

---

## ✂️ REPLACEMENT OPTIONS

### **Option 1: Replace with Regular Hyphens** (Recommended)
Maintains sentence flow with lighter punctuation.

**Before:**
```
This wasn't about features—it was about reframing what 'together' means
```

**After:**
```
This wasn't about features - it was about reframing what 'together' means
```

### **Option 2: Replace with Periods** (Creates Stronger Breaks)
Makes statements more declarative.

**Before:**
```
This wasn't about features—it was about reframing what 'together' means
```

**After:**
```
This wasn't about features. It was about reframing what 'together' means.
```

### **Option 3: Replace with Commas** (Softest Option)
Creates flow but may feel run-on in some places.

**Before:**
```
This wasn't about features—it was about reframing what 'together' means
```

**After:**
```
This wasn't about features, it was about reframing what 'together' means
```

---

## 🔍 FIND & REPLACE STRATEGY

### Method 1: Simple Global Find/Replace (Fastest)

**Using Text Editor (VS Code, Sublime, Notepad++):**

1. Open all 6 HTML files
2. Use Find & Replace (Ctrl+H / Cmd+H)
3. Find: `—` (em dash character)
4. Replace with one of:
   - ` - ` (space-hyphen-space) [RECOMMENDED]
   - `. ` (period-space) then manually capitalize next word
   - `, ` (comma-space)
5. Replace All in each file

**Using Word/Google Docs:**
1. Copy body text from HTML
2. Find & Replace `—` with ` - `
3. Copy cleaned text back to HTML

---

### Method 2: Contextual Replacement (More Accurate)

Some em dashes need different treatments depending on context:

#### **List items with em dashes:**
```html
<!-- BEFORE: -->
from hero films to social content to in-app onboarding—all reinforcing core narrative

<!-- AFTER (Option 1 - Hyphen): -->
from hero films to social content to in-app onboarding - all reinforcing core narrative

<!-- AFTER (Option 2 - Period): -->
from hero films to social content to in-app onboarding. All reinforcing core narrative.
```

#### **Mid-sentence emphasis:**
```html
<!-- BEFORE: -->
This wasn't about features—it was about reframing

<!-- AFTER (Option 1 - Hyphen): -->
This wasn't about features - it was about reframing

<!-- AFTER (Option 2 - Period): -->
This wasn't about features. It was about reframing.
```

#### **Parenthetical statements:**
```html
<!-- BEFORE: -->
Teams was synonymous with workplace collaboration—Zoom calls, work meetings, corporate productivity

<!-- AFTER (Option 1 - Hyphen): -->
Teams was synonymous with workplace collaboration - Zoom calls, work meetings, corporate productivity

<!-- AFTER (Option 2 - Colon): -->
Teams was synonymous with workplace collaboration: Zoom calls, work meetings, corporate productivity
```

---

## 📋 FILE-BY-FILE CHECKLIST

### Teams Consumer Launch
**Sections to clean:**
- [ ] Hero subtitle
- [ ] The Challenge section
- [ ] Strategic Approach section
- [ ] Feature descriptions
- [ ] Impact & Results section
- [ ] Reflection card quote

### Edge Mobile Rebrand
**Sections to clean:**
- [ ] Hero subtitle
- [ ] The Challenge section
- [ ] Strategic Approach section
- [ ] Feature descriptions
- [ ] Key Learnings section
- [ ] Reflection card quote

### Family Safety Launch
**Sections to clean:**
- [ ] Hero subtitle
- [ ] The Challenge section
- [ ] Strategic Approach section
- [ ] Feature descriptions
- [ ] Impact & Results section
- [ ] Reflection card quote

### Edge-ucational Series
**Sections to clean:**
- [ ] Hero subtitle
- [ ] The Vision section
- [ ] Strategic Approach section
- [ ] Feature descriptions
- [ ] Campaign Impact section
- [ ] Reflection card quote

### Free to Be Free
**Sections to clean:**
- [ ] Hero subtitle
- [ ] The Challenge section
- [ ] Strategic Approach section
- [ ] Feature descriptions
- [ ] Impact & Results section
- [ ] Reflection card quote

### Transforming Browsing with AI
**Sections to clean:**
- [ ] Hero subtitle
- [ ] The Vision section
- [ ] Strategic Approach section
- [ ] Feature descriptions
- [ ] Campaign Impact section
- [ ] Reflection card quote

---

## ⚡ QUICK REGEX SOLUTION (Advanced)

If you're comfortable with regex, this handles spaces around em dashes:

**Find:** `\s*—\s*`  
**Replace with:** ` - `

This finds em dashes with any amount of space around them and replaces with space-hyphen-space.

**VS Code / Sublime:**
1. Enable regex mode in Find & Replace
2. Use the pattern above
3. Replace All

---

## 🎨 RECOMMENDED APPROACH

**Option 1: Space-Hyphen-Space** ` - `

**Why:**
- ✅ Maintains sentence flow
- ✅ Lighter punctuation than em dash
- ✅ Consistent with modern web writing style
- ✅ No capitalization changes needed
- ✅ Quick find/replace (one pass)

**Implementation:**
1. Open each HTML file
2. Find: `—`
3. Replace: ` - ` (space-hyphen-space)
4. Replace All
5. Save

**Time estimate:** 2 minutes per file = 12 minutes total

---

## 🔧 ALTERNATIVE: AUTOMATED SCRIPT

If you want to automate this across all files, here's a simple approach:

### Using PowerShell (Windows):
```powershell
# Navigate to your case studies folder
cd "C:\path\to\insights"

# Replace em dashes with space-hyphen-space in all HTML files
Get-ChildItem -Filter "*.html" | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    $content = $content -replace '—', ' - '
    Set-Content $_.FullName -Value $content
}
```

### Using Bash/Terminal (Mac/Linux):
```bash
# Navigate to your case studies folder
cd /path/to/insights

# Replace em dashes with space-hyphen-space in all HTML files
for file in *.html; do
    sed -i '' 's/—/ - /g' "$file"
done
```

---

## 📊 BEFORE & AFTER EXAMPLES

### Example 1: Teams Consumer Launch
**Before:**
> "In Spring 2021, Microsoft Teams was synonymous with workplace collaboration—Zoom calls, work meetings, corporate productivity. The challenge was repositioning it as a consumer platform for families and friends without alienating the B2B base that made Teams successful."

**After (Hyphen):**
> "In Spring 2021, Microsoft Teams was synonymous with workplace collaboration - Zoom calls, work meetings, corporate productivity. The challenge was repositioning it as a consumer platform for families and friends without alienating the B2B base that made Teams successful."

**After (Period):**
> "In Spring 2021, Microsoft Teams was synonymous with workplace collaboration: Zoom calls, work meetings, corporate productivity. The challenge was repositioning it as a consumer platform for families and friends without alienating the B2B base that made Teams successful."

---

### Example 2: Strategic Approach Section
**Before:**
> "This wasn't about features—it was about reframing what 'together' means in a post-pandemic world."

**After (Hyphen):**
> "This wasn't about features - it was about reframing what 'together' means in a post-pandemic world."

**After (Period):**
> "This wasn't about features. It was about reframing what 'together' means in a post-pandemic world."

---

### Example 3: Feature Description
**Before:**
> "Built scalable campaign system ensuring cross-platform consistency—from hero films to social content to in-app onboarding—all reinforcing core narrative"

**After (Hyphen):**
> "Built scalable campaign system ensuring cross-platform consistency - from hero films to social content to in-app onboarding - all reinforcing core narrative"

**After (Period):**
> "Built scalable campaign system ensuring cross-platform consistency. From hero films to social content to in-app onboarding. All reinforcing core narrative."

---

## ⚠️ WATCH OUT FOR

### Don't Replace These:
- **Arrow characters** in navigation: `←` and `→` (these are different from em dashes)
- **Hyphens in compound words**: "AI-powered", "cross-platform", "platform-native"
- **Date ranges**: "2023-2024" (these use regular hyphens, not em dashes)

### Manual Check Needed:
Some sentences may read better with different punctuation after replacement. Review these sections:
- Reflection card quotes (may need periods for stronger statements)
- Feature list descriptions (may need colons for clarity)
- Hero subtitles (may need periods to separate ideas)

---

## 🎯 FINAL RECOMMENDATION

**Best Approach:**
1. Use **space-hyphen-space** ` - ` for global replacement
2. Do one quick pass through all 6 files (12 minutes)
3. Read through each file once to catch any awkward flows
4. Manually adjust 2-3 sentences where periods work better

**Alternative (if you want cleaner breaks):**
1. Replace em dashes with periods `. `
2. Manually capitalize the first letter after each new sentence
3. This takes longer (~30 minutes) but creates stronger, more declarative writing

---

**Your call:** Quick and consistent (hyphens) or cleaner but slower (periods)?

**Last Updated:** November 10, 2025
