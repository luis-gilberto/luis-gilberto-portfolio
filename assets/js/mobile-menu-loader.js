(function(){
  function getCtx(){
    var p=(location.pathname||'').toLowerCase();
    var isInsights=p.indexOf('/insights')===0;
    var isInsightsIndex=isInsights&&(p===('/insights/')||p.endsWith('/insights/index.html')||p==='/insights');
    return {isInsights:isInsights,isInsightsIndex:isInsightsIndex};
  }
  var css=".mobile-menu-overlay{position:fixed;inset:0;background-color:var(--bg-primary);z-index:11000;transform:translateX(100%);transition:transform .4s cubic-bezier(0.16,1,0.3,1);display:flex;flex-direction:column}.mobile-menu-overlay.active{transform:translateX(0)}.mobile-drawer-header{display:flex;justify-content:space-between;align-items:center;padding:0 24px;height:80px;border-bottom:1px solid var(--border-medium)}.mobile-drawer-logo{height:32px;width:auto;object-fit:contain;filter:brightness(0) invert(1)}.mobile-controls{display:flex;align-items:center;gap:16px}.drawer-close-btn{width:40px;height:40px;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.05);border:1px solid rgba(0,0,0,.1);border-radius:50%;color:var(--text-primary);cursor:pointer;transition:all .2s ease}[data-theme=dark] .drawer-close-btn{background:rgba(255,255,255,.1);border-color:rgba(255,255,255,.2);color:#fff}.drawer-close-btn:hover{background:#F96F6E;color:#fff;border-color:#F96F6E;transform:rotate(90deg)}.mobile-drawer-content{padding:40px 32px;overflow-y:auto;display:flex;flex-direction:column;gap:32px}.mobile-group-label{font-family:Inter,sans-serif;font-size:.75rem;letter-spacing:.15em;text-transform:uppercase;color:var(--text-secondary);margin-bottom:16px;opacity:.7}.mobile-link{display:block;text-decoration:none;color:var(--text-primary);transition:color .2s}.mobile-link.main{font-family:var(--font-display);font-size:2.5rem;font-weight:700;line-height:1.1;margin-bottom:8px}.mobile-link.sub{font-family:Inter,sans-serif;font-size:1.1rem;font-weight:500;margin-bottom:12px;color:var(--text-secondary);padding-left:0;transition:all .2s}.mobile-link:hover{color:#F96F6E}.mobile-link.active-parent{color:#F96F6E}.mobile-link.sub.active{color:#F96F6E;font-weight:700;padding-left:12px;border-left:3px solid #F96F6E}.mobile-divider{height:1px;width:100%;background:var(--border-medium)}";
  var style=document.createElement('style');
  style.textContent=css;
  document.head.appendChild(style);
  var ctx=getCtx();
  var gPortfolio=ctx.isInsights?"":" active-parent";
  var gInsights=ctx.isInsights?" active-parent":"";
  var insightsBottom=ctx.isInsights?("<nav class=\"mobile-nav-group\"><div class=\"mobile-group-label\">Insights</div><a href=\"/insights/index.html\" class=\"mobile-link sub"+(ctx.isInsightsIndex?" active":"")+"\">Latest</a><a href=\"/insights/series/\" class=\"mobile-link sub\">Series</a><a href=\"/insights/topics/\" class=\"mobile-link sub\">Topics</a></nav>"):("<nav class=\"mobile-nav-group\"><div class=\"mobile-group-label\">Portfolio</div><a href=\"/timeline.html\" class=\"mobile-link sub\">Timeline</a><a href=\"/cv.html\" class=\"mobile-link sub\">Resume</a><a href=\"/myexperience.html\" class=\"mobile-link sub\">Experience</a><a href=\"/myexperience.html#featured-work-anchor\" class=\"mobile-link sub\">Featured Work</a></nav>");
  var logoSrc = ctx.isInsights ? "/assets/images/3D_icon_Transparent.png" : "/assets/images/Symbol_mobile.svg";
  var html="<div class=\"mobile-menu-overlay\" id=\"mobileOverlay\" aria-hidden=\"true\"><div class=\"mobile-drawer-header\"><div class=\"mobile-brand\"><img src=\""+logoSrc+"\" alt=\"Logo\" class=\"mobile-drawer-logo\"></div><div class=\"mobile-controls\"><button class=\"drawer-close-btn\" id=\"drawerCloseBtn\" aria-label=\"Close Menu\"><svg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><line x1=\"18\" y1=\"6\" x2=\"6\" y2=\"18\"></line><line x1=\"6\" y1=\"6\" x2=\"18\" y2=\"18\"></line></svg></button></div></div><div class=\"mobile-drawer-content\"><nav class=\"mobile-nav-group\"><div class=\"mobile-group-label\">Global</div><a href=\"/index.html\" class=\"mobile-link main"+gPortfolio+"\">Portfolio</a><a href=\"/insights/index.html\" class=\"mobile-link main"+gInsights+"\">Insights</a><a href=\"/TheHub/index.html\" class=\"mobile-link main\">The Hub</a><a href=\"/about.html\" class=\"mobile-link main\">About</a><a href=\"/contact.html\" class=\"mobile-link main\">Contact</a></nav><div class=\"mobile-divider\"></div>"+insightsBottom+"</div></div>";
  var wrapper=document.createElement('div');
  wrapper.innerHTML=html;
  var node=wrapper.firstElementChild;
  document.body.appendChild(node);
  var mobileOverlay=document.getElementById('mobileOverlay');
  var closeBtn=document.getElementById('drawerCloseBtn');
  function open(){ if(mobileOverlay){ mobileOverlay.classList.add('active'); mobileOverlay.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden'; }}
  function close(){ if(mobileOverlay){ mobileOverlay.classList.remove('active'); mobileOverlay.setAttribute('aria-hidden','true'); document.body.style.overflow=''; }}
  var candidates=[document.getElementById('mobileToggle'),document.querySelector('.lg-nav-toggle'),document.querySelector('.mobile-nav-toggle'),document.getElementById('mobile-menu-btn'),document.querySelector('.mobile-menu-btn')].filter(function(x){return !!x});
  candidates.forEach(function(el){ el.addEventListener('click', open); });
  if(closeBtn){ closeBtn.addEventListener('click', close); }
  document.addEventListener('keydown',function(e){ if(e.key==='Escape'){ close(); }});
  if(mobileOverlay){ mobileOverlay.addEventListener('click',function(e){ if(e.target===mobileOverlay){ close(); }}); }
  Array.prototype.forEach.call(document.querySelectorAll('#mobileOverlay a'),function(a){ a.addEventListener('click', close); });
})();
