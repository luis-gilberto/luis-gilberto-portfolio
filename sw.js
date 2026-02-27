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
      // Use dynamic origin to support both localhost and production
      const targetUrl = new URL('/about.html', url.origin).href;
      event.respondWith(Response.redirect(targetUrl, 301));
      return;
    }
  } catch (e) {}
});
