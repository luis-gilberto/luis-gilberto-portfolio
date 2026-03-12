// Loader shim for local preview: ensure pages referencing "/hub-navigation.js" can load the actual Hub navigation script.
(function(){
  try {
    var s = document.createElement('script');
    s.src = '/TheHub/hub-navigation.js';
    s.defer = true;
    document.head.appendChild(s);
  } catch(e) {
    console.error('Failed to load Hub navigation script via shim', e);
  }
})();

