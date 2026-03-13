// LG Timeline.Filmstrip logic
(function(){
  // Modal helpers
  function openTimelineModal(era){
    const modal=document.getElementById('timeline-modal'); const data=(window.timelineData||{})[era];
    if(!modal||!data) return;
    document.getElementById('modal-title').textContent=data.title;
    document.getElementById('modal-quote').textContent=data.quote||"";
    document.getElementById('modal-description').innerHTML=`<p>${data.description||""}</p>`;
    // Achievements
    const ul=document.querySelector('#modal-achievements ul'); ul.innerHTML='';
    (data.achievements||[]).forEach(a=>{ const li=document.createElement('li'); li.innerHTML=a; ul.appendChild(li); });
    // Brands logos
    const logos=document.querySelector('#modal-brands .brand-logos'); logos.innerHTML='';
    (data.brands||[]).forEach(b=>{ const img=document.createElement('img'); img.src=b.src; img.alt=b.alt||""; logos.appendChild(img); });
    // Brands supported (composite image)
    const bsc=document.querySelector('#modal-brands-supported .brands-supported-image');
    const bss=document.querySelector('#modal-brands-supported');
    if(data.brandsSupported && data.brandsSupported.image && data.brandsSupported.image.src){
      bsc.innerHTML='';
      const img=document.createElement('img');
      img.src=data.brandsSupported.image.src;
      img.alt=data.brandsSupported.image.alt||"";
      img.style.maxWidth='100%';
      bsc.appendChild(img);
      bss.style.display='block';
    } else {
      bss.style.display='none';
    }
    modal.classList.add('active');
    document.body.style.overflow='hidden';
  }
  function closeTimelineModal(){ const m=document.getElementById('timeline-modal'); if(m){ m.classList.remove('active'); document.body.style.overflow=''; }}

  function initializeFilmstrip(){
    const track=document.getElementById('fsTrack');
    const prev=document.querySelector('.fs-nav.prev');
    const next=document.querySelector('.fs-nav.next');
    const progress=document.getElementById('fsProgress');
    if(!track) return;

    // Open modal
    track.querySelectorAll('.fs-card').forEach(card=>{
      card.addEventListener('click',()=>openTimelineModal(card.getAttribute('data-era')));
    });

    // Arrow nav
    const cardWidth=()=> track.firstElementChild?.getBoundingClientRect().width || 420;
    function scrollByCard(dir=1){ track.scrollBy({left: dir*(cardWidth()+16), behavior:'smooth'}); }
    prev && prev.addEventListener('click',()=>scrollByCard(-1));
    next && next.addEventListener('click',()=>scrollByCard(1));

    // Keyboard
    track.addEventListener('keydown',(e)=>{
      if(e.key==='ArrowRight'){e.preventDefault(); scrollByCard(1);}
      if(e.key==='ArrowLeft'){e.preventDefault(); scrollByCard(-1);}
    });

    // Drag-to-scroll
    let isDown=false,startX=0,startLeft=0;
    track.addEventListener('pointerdown',e=>{isDown=true; startX=e.clientX; startLeft=track.scrollLeft; track.setPointerCapture(e.pointerId); track.style.cursor='grabbing';});
    track.addEventListener('pointermove',e=>{ if(!isDown) return; const dx=e.clientX-startX; track.scrollLeft=startLeft-dx; });
    track.addEventListener('pointerup',()=>{ isDown=false; track.style.cursor='auto'; });

    // Progress
    function updateProgress(){
      const max=track.scrollWidth-track.clientWidth;
      const ratio=max<=0 ? 1 : track.scrollLeft/max;
      progress.style.width=`${Math.max(0,Math.min(1,ratio))*100}%`;
    }
    updateProgress();
    track.addEventListener('scroll',updateProgress,{passive:true});
    window.addEventListener('resize',updateProgress);

    // Center-snap assist
    let snapTimer;
    track.addEventListener('scroll',()=>{
      clearTimeout(snapTimer);
      snapTimer=setTimeout(()=>{
        const center=track.scrollLeft+track.clientWidth/2;
        let closest, min=Infinity;
        track.querySelectorAll('.fs-card').forEach(card=>{
          const r=card.getBoundingClientRect();
          const cardCenter=r.left+track.scrollLeft+r.width/2;
          const d=Math.abs(cardCenter-center);
          if(d<min){min=d; closest=card;}
        });
        closest && closest.scrollIntoView({inline:'center',behavior:'smooth',block:'nearest'});
      },120);
    },{passive:true});

    // Modal close bindings
    const closeBtn=document.querySelector('.timeline-modal .modal-close');
    const overlay=document.querySelector('.timeline-modal .modal-overlay');
    closeBtn && closeBtn.addEventListener('click', closeTimelineModal);
    overlay && overlay.addEventListener('click', closeTimelineModal);
  }

  document.addEventListener('DOMContentLoaded', initializeFilmstrip);
})();