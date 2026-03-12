# System Architecture
Data source: `/insights/data/articles-metadata.json`.
Renderer: vanilla JS builds Latest, Series, and Topics sections and injects into the drawer.
Drawer controller: open/close via `#mobileToggle`, overlay click, close button, and `Escape`.
Responsive: active up to 1024px; drawer hidden on desktop.
