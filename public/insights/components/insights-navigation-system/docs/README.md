# Implementation Guide
1. Add font link for Inter and Playfair Display in `<head>`.
2. Add `<link rel="stylesheet" href="/insights/assets/css/insights-navigation.css">` in `<head>`.
3. Insert drawer markup with IDs: `drawerOverlay`, `insightsDrawer`, `drawerClose`, `nav-latest-content`, `nav-series-content`, `nav-topics-content`.
4. Add `<script src="/insights/assets/js/insights-navigation.js"></script>` before `</body>`.
5. Ensure `/insights/data/articles-metadata.json` exists and is up to date.
