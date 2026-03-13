// case-nav.js.Case Studies Navigation System (vanilla)
(function(){
  const sections = [...document.querySelectorAll('section[id]')];
  const toc = document.querySelector('.case-toc');
  const tocBtns = toc ? [...toc.querySelectorAll('button[data-target]')] : [];
  const progress = document.querySelector('.read-progress');
  const mobilebar = document.querySelector('.case-mobilebar');
  const pctEl = mobilebar?.querySelector('.progress-read');
  const nextPill = document.createElement('button'); nextPill.className = 'next-section'; document.body.appendChild(nextPill);

  function goTo(target){
    const el = document.querySelector(target); if(!el) return;
    const y = el.getBoundingClientRect().top + window.pageYOffset - 88;
    window.scrollTo({ top:y, behavior:'smooth' });
  }
  tocBtns.forEach(b=> b.addEventListener('click', e=>{ e.preventDefault(); goTo(b.dataset.target); }));

  let lastActive = null;
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        const id = '#'+entry.target.id; lastActive = id;
        tocBtns.forEach(b=> b.classList.toggle('is-active', b.dataset.target===id));
        const idx = sections.findIndex(s => '#'+s.id===id), next = sections[idx+1];
        if(next){ nextPill.textContent = `Next: ${next.dataset.title} →`; nextPill.onclick = ()=>goTo('#'+next.id); nextPill.style.display = (window.innerWidth>=980) ? 'block' : 'none'; }
        else{ nextPill.style.display = 'none'; }
      }
    });
  }, { rootMargin:'-45% 0px -50% 0px', threshold:0.0 });
  sections.forEach(s=> io.observe(s));

  function onScroll(){
    const doc = document.documentElement;
    const scrollTop = window.pageYOffset || doc.scrollTop;
    const h = doc.scrollHeight - doc.clientHeight;
    const pct = Math.max(0, Math.min(100, (scrollTop / h) * 100));
    if(progress){ progress.style.width = pct + '%'; progress.setAttribute('aria-valuenow', pct.toFixed(0)); }
    if(pctEl){ pctEl.textContent = Math.round(pct) + '%'; }
    if(mobilebar){ mobilebar.classList.toggle('show', scrollTop > 240); }
  }
  window.addEventListener('scroll', onScroll, {passive:true}); onScroll();

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

  const peekCopy = {
    'story':'The brief, the bet, and the creative spine.',
    'highlights':'The crisp beats - assets, channels, and moments.',
    'my-role':'Where I steered, unblocked, and shipped.',
    'results':'Proof it worked - lifts, views, adoption.',
    'gallery':'Motion, stills, and behind-the-scenes.',
    'credits':'Agencies, partners, and thanks.'
  };
  sections.forEach(s=>{
    if(!s.querySelector('.section-peek')){
      const peek = document.createElement('p'); peek.className = 'section-peek';
      peek.textContent = peekCopy[s.id] || ''; s.firstElementChild?.after(peek);
    }
  });

  // Lightbox
  let lastScrollY=0;
  document.addEventListener('click', e=>{
    const a = e.target.closest('a.lightbox'); if(!a) return;
    e.preventDefault(); lastScrollY = window.scrollY;
    const overlay = Object.assign(document.createElement('div'), { className:'lb-ov' });
    overlay.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.95);display:flex;align-items:center;justify-content:center;z-index:10000;';
    const img = document.createElement('img'); img.src = a.href; img.alt=''; img.style.maxWidth='95%'; img.style.maxHeight='92%';
    overlay.appendChild(img);
    overlay.addEventListener('click', ()=>{ overlay.remove(); window.scrollTo(0,lastScrollY); }, {once:true});
    document.body.appendChild(overlay);
  });

  // Hamburger
  const btn = document.querySelector('.hamburger');
  const menu = document.getElementById('mobileMenu');
  function openMenu(open){
    if(!btn || !menu) return;
    btn.setAttribute('aria-expanded', open);
    menu.classList.toggle('open', open);
    menu.setAttribute('aria-hidden', !open);
    document.body.style.overflow = open ? 'hidden' : '';
  }
  btn?.addEventListener('click', ()=>{ const open = btn.getAttribute('aria-expanded') != 'true'; openMenu(open); });
  document.addEventListener('keydown', e=>{ if(e.key === 'Escape') openMenu(false); });
  menu?.addEventListener('click', e=>{ if(e.target === menu) openMenu(false); });
})();
