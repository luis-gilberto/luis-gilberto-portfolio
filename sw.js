self.addEventListener('fetch', event => {
  try {
    const url = new URL(event.request.url);
    const isAboutAlt = (
      url.pathname === '/about' ||
      url.pathname === '/about/' ||
      url.pathname.endsWith('/about-me') ||
      url.pathname.endsWith('/about-us') ||
      /\/about(\.|\/|$)/i.test(url.pathname) && url.pathname !== '/about.html'
    );
    if (isAboutAlt) {
      event.respondWith(Response.redirect('http://127.0.0.1:5500/about.html', 301));
      return;
    }
  } catch (e) {}
});
