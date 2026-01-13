# Case Study Navigation System — Annotated Spec (Family Safety → template for all articles)

**Owner:** Luis Gilberto  
**Implementer:** Trae  
**Scope:** Family Safety article first, then roll across all case studies.  
**Principles:** Fast, thumb-first, no-library JS; consistent IDs; elegant + minimal.

---

## 1) Objectives (what success looks like)
- **Readers never feel lost:** current section highlighted, visible progress, clear “what’s next.”
- **Mobile-first navigation:** bottom thumb bar with quick actions (TOC / Up / % / Share / End).
- **Smooth, offset scrolling:** headings never hide under the fixed header.
- **Low-jank gallery:** lightbox opens and closes without jumping the page back to top.
- **Reusable template:** same IDs and components across all case studies.

---

## 2) Information architecture (section IDs)
Use **exactly** these IDs and data-titles in the Family Safety article:
```html
<section id="story" data-title="Story">…</section>
<section id="highlights" data-title="Highlights">…</section>
<section id="my-role" data-title="My Role">…</section>
<section id="results" data-title="Results">…</section>
<section id="gallery" data-title="Gallery">…</section>
<section id="credits" data-title="Credits">…</section>
```
> If existing markup differs, remap IDs rather than changing the JS.

---

## 3) Components (UX and rationale)

### A) Sticky Mini‑TOC
- **Desktop:** under hero; sticky; buttons highlight current section.
- **Mobile:** shown as a **bottom tab bar** (see Mobile Bar below).
- **Why:** orientation + fast jumps without losing reading flow.

**HTML (place right after the hero):**
```html
<nav class="case-toc" aria-label="Article sections">
  <button data-target="#story">Story</button>
  <button data-target="#highlights">Highlights</button>
  <button data-target="#my-role">My Role</button>
  <button data-target="#results">Results</button>
  <button data-target="#gallery">Gallery</button>
  <button data-target="#credits">Credits</button>
</nav>
```

### B) Reading Progress (top bar)
- 3px coral bar at very top; updates on scroll.
- **Why:** sets expectations; reduces “how long is this?” anxiety.

**HTML (first child in `<body>`):**
```html
<div class="read-progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"></div>
```

### C) “Next section” Pill (desktop only)
- Appears ~bottom-right as readers near section end: `Next: Highlights →`.
- **Why:** gentle nudge forward; prevents dead-ends.

_No extra HTML needed; injected by JS._

### D) Mobile Bottom Bar (thumb zone)
- **5 actions:** TOC • Up • % • Share • End
- Reveals after leaving hero; hides at the top.
- **Why:** replaces “back to top” links; keeps actions within thumb reach.

**HTML (before `</body>`):**
```html
<nav class="case-mobilebar" aria-label="Quick actions">
  <button class="toc-open" aria-label="Table of contents">TOC</button>
  <button class="jump-up" aria-label="Back to top">Up</button>
  <div class="progress-read" aria-live="polite">0%</div>
  <button class="share" aria-label="Share link">Share</button>
  <button class="jump-end" aria-label="Skip to results">End</button>
</nav>
```

### E) Section “peek” sublines
- Autoinsert a one‑line subhead under each H2 (JS) that previews the section (“The brief, the bet, and the creative spine.”)
- **Why:** skimmers get context instantly.

### F) Lightbox (no library)
- `<a class="lightbox" href="img-large.jpg"><img …></a>` opens an overlay; click/tap anywhere to close; restores previous scroll position.
- **Why:** check artwork without destroying reading flow.

---

## 4) CSS (minimal; add to site stylesheet)
```css
:root{
  --accent:#F96F6E; /* Luis coral */
  --ink:#2A2A2A;
  --muted:rgba(42,42,42,.08);
}

/* Progress bar */
.read-progress{
  position:fixed; top:0; left:0; height:3px; width:0;
  background:var(--accent); z-index:1000; transition:width .15s linear;
}

/* Desktop TOC */
.case-toc{
  position:sticky; top:96px; display:flex; gap:12px; flex-wrap:wrap;
  padding:10px 0; border-bottom:1px solid var(--muted); margin:24px 0 32px;
}
.case-toc button{
  background:transparent; border:0; padding:6px 10px; cursor:pointer;
  font:500 14px/1.2 "General Sans",system-ui; color:#666; border-radius:999px;
}
.case-toc button.is-active{ color:var(--ink); background:rgba(249,111,110,.12); }

/* Next section pill (desktop only) */
.next-section{
  position:fixed; right:20px; bottom:24px; z-index:900;
  background:rgba(0,0,0,.75); color:#fff; padding:10px 14px; border-radius:999px;
  font:500 14px/1.2 "General Sans",system-ui; display:none;
}

/* Mobile bottom bar */
.case-mobilebar{
  position:fixed; left:0; right:0; bottom:0; display:flex; gap:10px;
  justify-content:space-between; align-items:center;
  padding:10px 14px; background:rgba(255,255,255,.9);
  backdrop-filter:saturate(120%) blur(8px); border-top:1px solid var(--muted);
  z-index:999; transform:translateY(100%); transition:transform .25s ease;
}
.case-mobilebar.show{ transform:translateY(0); }
.case-mobilebar button{ background:transparent; border:0; font:600 14px/1 "General Sans"; color:#333; }
.case-mobilebar .progress-read{ font:600 14px/1 "General Sans"; }

/* Responsive behavior */
@media (min-width: 980px){
  .case-mobilebar{ display:none; }
}
@media (max-width: 979px){
  .case-toc{ position:static; overflow-x:auto; white-space:nowrap; border-bottom:0; }
}

/* Headings offset so they don't hide under fixed headers */
[id]::before{ content:""; display:block; height:96px; margin-top:-96px; visibility:hidden; }

/* Section “peek” subline */
.section-peek{ color:#777; font:400 13px/1.4 "Inter"; margin:-6px 0 18px; }
```

---

## 5) JavaScript (vanilla; place before `</body>`)
```html
<script>
(function(){
  const sections = [...document.querySelectorAll('section[id]')];
  const toc = document.querySelector('.case-toc');
  const tocBtns = toc ? [...toc.querySelectorAll('button[data-target]')] : [];
  const progress = document.querySelector('.read-progress');
  const mobilebar = document.querySelector('.case-mobilebar');
  const pctEl = mobilebar?.querySelector('.progress-read');
  const nextPill = document.createElement('button');
  nextPill.className = 'next-section';
  document.body.appendChild(nextPill);

  function goTo(target){
    const el = document.querySelector(target);
    if(!el) return;
    const y = el.getBoundingClientRect().top + window.pageYOffset - 88;
    window.scrollTo({ top:y, behavior:'smooth' });
  }

  tocBtns.forEach(b=> b.addEventListener('click', e=>{ e.preventDefault(); goTo(b.dataset.target); }));

  // Scrollspy + progress
  let lastActive = null;
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        const id = '#'+entry.target.id;
        lastActive = id;
        tocBtns.forEach(b=> b.classList.toggle('is-active', b.dataset.target===id));
        const idx = sections.findIndex(s => '#'+s.id===id);
        const next = sections[idx+1];
        if(next){
          nextPill.textContent = `Next: ${next.dataset.title} →`;
          nextPill.onclick = ()=>goTo('#'+next.id);
          nextPill.style.display = (window.innerWidth>=980) ? 'block' : 'none';
        } else {
          nextPill.style.display = 'none';
        }
      }
    });
  }, { rootMargin:'-45% 0px -50% 0px', threshold:0.0 });
  sections.forEach(s=> io.observe(s));

  function onScroll(){
    const doc = document.documentElement;
    const scrollTop = window.pageYOffset || doc.scrollTop;
    const h = doc.scrollHeight - doc.clientHeight;
    const pct = Math.max(0, Math.min(100, (scrollTop / h) * 100));
    if(progress){
      progress.style.width = pct + '%';
      progress.setAttribute('aria-valuenow', pct.toFixed(0));
    }
    if(pctEl){ pctEl.textContent = Math.round(pct) + '%'; }
    if(mobilebar){ mobilebar.classList.toggle('show', scrollTop > 240); }
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  // Mobile quick actions
  mobilebar?.querySelector('.jump-up')?.addEventListener('click', ()=>goTo('#story'));
  mobilebar?.querySelector('.jump-end')?.addEventListener('click', ()=>goTo('#results'));
  mobilebar?.querySelector('.toc-open')?.addEventListener('click', ()=>{
    document.querySelector('.case-toc')?.scrollIntoView({behavior:'smooth', block:'start'});
  });
  mobilebar?.querySelector('.share')?.addEventListener('click', async ()=>{
    const url = location.href.split('#')[0] + (lastActive ? lastActive : '');
    if(navigator.share){ try{ await navigator.share({title:document.title, url}); }catch(e){} }
    else{ navigator.clipboard.writeText(url); alert('Link copied ✨'); }
  });

  // Section peek sublines (insert if missing)
  const peekCopy = {
    'story':'The brief, the bet, and the creative spine.',
    'highlights':'The crisp beats—assets, channels, and moments.',
    'my-role':'Where I steered, unblocked, and shipped.',
    'results':'Proof it worked—lifts, views, adoption.',
    'gallery':'Motion, stills, and behind-the-scenes.',
    'credits':'Agencies, partners, and thanks.'
  };
  sections.forEach(s=>{
    if(!s.querySelector('.section-peek')){
      const peek = document.createElement('p');
      peek.className = 'section-peek';
      peek.textContent = peekCopy[s.id] || '';
      s.firstElementChild?.after(peek);
    }
  });

  // Lightweight lightbox
  let lastScrollY=0;
  document.addEventListener('click', e=>{
    const a = e.target.closest('a.lightbox');
    if(!a) return;
    e.preventDefault();
    lastScrollY = window.scrollY;
    const overlay = Object.assign(document.createElement('div'), { className:'lb-ov' });
    overlay.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.95);display:flex;align-items:center;justify-content:center;z-index:10000;';
    const img = document.createElement('img');
    img.src = a.href; img.alt=''; img.style.maxWidth='95%'; img.style.maxHeight='92%';
    overlay.appendChild(img);
    overlay.addEventListener('click', ()=>{ overlay.remove(); window.scrollTo(0,lastScrollY); }, {once:true});
    document.body.appendChild(overlay);
  });
})();
</script>
```

---

## 6) Accessibility & semantics
- All nav controls have ARIA labels; progress bar exposes `aria-valuenow`.
- Headings offset pseudo-element preserves anchor accuracy for screen readers.
- Focus states: rely on browser default; avoid removing outlines.

---

## 7) Performance
- No external libraries; one small IntersectionObserver instance.
- Lazy-load large gallery images with native `loading="lazy"` on `<img>` where possible.
- Keep CSS in main bundle; JS at the end of body.

---

## 8) Rollout checklist (for each article)
- [ ] Match section IDs to the list in §2  
- [ ] Insert Mini‑TOC after hero  
- [ ] Insert Progress bar (top) & Mobile Bar (bottom)  
- [ ] Paste CSS into global stylesheet  
- [ ] Paste JS before `</body>`  
- [ ] Verify: desktop (>=1280), tablet (768–1024), mobile (<=767)  
- [ ] Test share: native share (mobile) and clipboard fallback (desktop)  
- [ ] Test gallery lightbox open/close returns to same scroll position

---

## 9) Optional polish (phase 2)
- “Resume reading”: persist `lastActive` to `localStorage` and offer a top toast on return.
- Structured data (`Article` JSON‑LD) with canonical URL and proper `headline`, `image`, `datePublished`.
- Metrics chips (small coral badges) that also appear in the TOC as section badges.
