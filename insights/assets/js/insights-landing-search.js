/**
 * insights-landing-search.js  v2
 * Autocomplete dropdown search for the Insights landing page.
 *
 * - Floating dropdown with clickable results (like Google suggest)
 * - Searches: title, category, excerpt
 * - Keyboard navigable (↑ ↓ Enter Escape)
 * - X button properly centered
 * - Does NOT filter or hide the page cards. purely additive
 */

(function () {
  "use strict";

  const DEBOUNCE_MS   = 140;
  const MAX_RESULTS   = 6;
  let debounceTimer;
  let activeIndex     = -1;
  let currentResults  = [];

  // ── Styles ────────────────────────────────────────────────────────────────
  const style = document.createElement("style");
  style.textContent = `
    /* Fix search-wrap to be the positioning parent */
    .search-wrap {
      position: relative !important;
    }

    /* Center the X button properly */
    .search-clear-btn {
      position: absolute;
      right: 12px;
      top: 0;
      bottom: 0;
      margin: auto 0;
      height: 20px;
      width: 20px;
      background: none;
      border: none;
      cursor: pointer;
      font-size: 12px;
      color: var(--ink-soft, #999);
      padding: 0;
      line-height: 1;
      display: none;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: color 0.2s, background 0.2s;
      z-index: 2;
    }
    .search-clear-btn:hover {
      color: var(--coral, #F96F6E);
      background: rgba(249,111,110,0.08);
    }
    .search-clear-btn.visible {
      display: flex;
    }

    /* Pad input so text doesn't go under the X */
    .search-input {
      padding-right: 36px !important;
    }

    /* ── Dropdown ── */
    .ins-dropdown {
      position: absolute;
      top: calc(100% + 6px);
      left: 0;
      right: 0;
      background: var(--card-bg, #fff);
      border: 1px solid var(--rule, #e5e5e5);
      border-radius: 10px;
      box-shadow: 0 12px 40px rgba(0,0,0,0.12);
      z-index: 9999;
      overflow: hidden;
      opacity: 0;
      transform: translateY(-4px);
      pointer-events: none;
      transition: opacity 0.18s ease, transform 0.18s ease;
    }
    .ins-dropdown.open {
      opacity: 1;
      transform: translateY(0);
      pointer-events: auto;
    }

    .ins-dropdown-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 11px 16px;
      cursor: pointer;
      text-decoration: none;
      color: inherit;
      border-bottom: 1px solid var(--rule, #efefef);
      transition: background 0.15s;
    }
    .ins-dropdown-item:last-child {
      border-bottom: none;
    }
    .ins-dropdown-item:hover,
    .ins-dropdown-item.active {
      background: rgba(249,111,110,0.05);
    }

    .ins-dropdown-thumb {
      width: 44px;
      height: 32px;
      border-radius: 5px;
      object-fit: cover;
      flex-shrink: 0;
      background: var(--rule, #eee);
    }
    .ins-dropdown-thumb-placeholder {
      width: 44px;
      height: 32px;
      border-radius: 5px;
      flex-shrink: 0;
      background: rgba(249,111,110,0.08);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .ins-dropdown-thumb-placeholder svg {
      width: 14px;
      height: 14px;
      color: var(--coral, #F96F6E);
      opacity: 0.5;
    }

    .ins-dropdown-text {
      flex: 1;
      min-width: 0;
    }
    .ins-dropdown-cat {
      font-family: 'Inter', sans-serif;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: var(--coral, #F96F6E);
      margin-bottom: 2px;
    }
    .ins-dropdown-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: 15px;
      font-weight: 600;
      color: var(--ink, #1a1a1a);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 1.3;
    }
    .ins-dropdown-excerpt {
      font-family: 'Inter', sans-serif;
      font-size: 11px;
      color: var(--ink-soft, #999);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-top: 1px;
    }

    /* highlight matched text */
    .ins-hl {
      background: rgba(249,111,110,0.15);
      color: var(--coral, #F96F6E);
      border-radius: 2px;
      padding: 0 1px;
    }

    .ins-dropdown-empty {
      padding: 14px 16px;
      font-family: 'Inter', sans-serif;
      font-size: 12px;
      color: var(--ink-soft, #aaa);
      text-align: center;
    }

    .ins-dropdown-arrow {
      flex-shrink: 0;
      color: var(--ink-soft, #ccc);
      transition: color 0.15s;
    }
    .ins-dropdown-item:hover .ins-dropdown-arrow,
    .ins-dropdown-item.active .ins-dropdown-arrow {
      color: var(--coral, #F96F6E);
    }

    /* Issue label transition */
    .issue-label { transition: color 0.2s; }
    .issue-label.filtered { color: var(--coral, #F96F6E); }
  `;
  document.head.appendChild(style);

  // ── Init ──────────────────────────────────────────────────────────────────
  function init() {
    const input      = document.querySelector(".search-input");
    const searchWrap = document.querySelector(".search-wrap");
    const issueLabel = document.querySelector(".issue-label");

    if (!input || !searchWrap) return;

    // ── Build article index from DOM cards ──────────────────────────────
    const cards = Array.from(document.querySelectorAll(".story-card"));
    const totalCount = cards.length;

    const articleIndex = cards.map(card => ({
      title:    card.querySelector(".story-title")?.textContent?.trim()    || "",
      cat:      card.querySelector(".story-cat")?.textContent?.trim()      || "",
      excerpt:  card.querySelector(".story-excerpt")?.textContent?.trim()  || "",
      keywords: card.getAttribute("data-search")?.trim()                    || "",
      url:      card.getAttribute("href") || "#",
      img:      card.querySelector("img")?.getAttribute("src")            || null,
    }));

    // ── Add clear button ─────────────────────────────────────────────────
    const clearBtn = document.createElement("button");
    clearBtn.className = "search-clear-btn";
    clearBtn.setAttribute("aria-label", "Clear search");
    clearBtn.setAttribute("type", "button");
    clearBtn.innerHTML = "✕";
    searchWrap.appendChild(clearBtn);

    // ── Create dropdown ──────────────────────────────────────────────────
    const dropdown = document.createElement("div");
    dropdown.className = "ins-dropdown";
    dropdown.setAttribute("role", "listbox");
    dropdown.setAttribute("aria-label", "Search suggestions");
    searchWrap.appendChild(dropdown);

    // ── Helpers ──────────────────────────────────────────────────────────
    function normalize(s) {
      return (s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    function escHtml(s) {
      return String(s)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    }

    function highlight(text, query) {
      if (!text || !query) return escHtml(text || "");
      const esc = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      return escHtml(text).replace(
        new RegExp(`(${esc})`, "gi"),
        `<span class="ins-hl">$1</span>`
      );
    }

    function openDropdown()  { dropdown.classList.add("open"); }
    function closeDropdown() {
      dropdown.classList.remove("open");
      activeIndex = -1;
    }

    function setActive(idx) {
      const items = dropdown.querySelectorAll(".ins-dropdown-item");
      items.forEach((item, i) => item.classList.toggle("active", i === idx));
      activeIndex = idx;
    }

    // ── Search ───────────────────────────────────────────────────────────
    function runSearch(raw) {
      const query = raw.trim();
      clearBtn.classList.toggle("visible", query.length > 0);
      activeIndex = -1;

      if (!query) {
        dropdown.innerHTML = "";
        closeDropdown();
        if (issueLabel) {
          issueLabel.textContent = `${totalCount} stories published`;
          issueLabel.classList.remove("filtered");
        }
        return;
      }

      const terms = normalize(query).split(/\s+/).filter(Boolean);

      const scored = articleIndex
        .map(a => {
          let score = 0;
          const fields = {
            title:    { w: 10, v: normalize(a.title)    },
            cat:      { w:  6, v: normalize(a.cat)      },
            excerpt:  { w:  3, v: normalize(a.excerpt)  },
            keywords: { w:  5, v: normalize(a.keywords) },
          };
          terms.forEach(term => {
            Object.values(fields).forEach(({ w, v }) => {
              if (v.includes(term)) score += w;
            });
          });
          return { ...a, score };
        })
        .filter(a => a.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, MAX_RESULTS);

      currentResults = scored;

      if (issueLabel) {
        issueLabel.textContent = scored.length
          ? `${scored.length} result${scored.length !== 1 ? "s" : ""}`
          : "No results";
        issueLabel.classList.add("filtered");
      }

      if (!scored.length) {
        dropdown.innerHTML = `<div class="ins-dropdown-empty">No stories match "<strong>${escHtml(query)}</strong>". try a different keyword</div>`;
        openDropdown();
        return;
      }

      dropdown.innerHTML = scored.map((a, i) => `
        <a 
          href="${escHtml(a.url)}" 
          class="ins-dropdown-item" 
          role="option" 
          data-index="${i}" 
          tabindex="-1" 
        > 
          ${a.img 
            ? `<img class="ins-dropdown-thumb" src="${escHtml(a.img)}" alt="" loading="lazy">` 
            : `<div class="ins-dropdown-thumb-placeholder"> 
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>></svg> 
              </div>` 
          } 
          <div class="ins-dropdown-text"> 
            <div class="ins-dropdown-cat">${escHtml(a.cat)}</div> 
            <div class="ins-dropdown-title">${highlight(a.title, query)}</div> 
            <div class="ins-dropdown-excerpt">${highlight(a.excerpt, query)}</div> 
          </div> 
          <svg class="ins-dropdown-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"> 
            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/> 
          </svg> 
        </a> 
      `).join("");

      openDropdown();
    }

    // ── Events ───────────────────────────────────────────────────────────
    input.addEventListener("input", () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => runSearch(input.value), DEBOUNCE_MS);
    });

    input.addEventListener("focus", () => {
      if (input.value.trim()) openDropdown();
    });

    input.addEventListener("keydown", (e) => {
      const items = dropdown.querySelectorAll(".ins-dropdown-item");
      if (!dropdown.classList.contains("open")) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive(Math.min(activeIndex + 1, items.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive(Math.max(activeIndex - 1, -1));
      } else if (e.key === "Enter") {
        if (activeIndex >= 0 && items[activeIndex]) {
          e.preventDefault();
          items[activeIndex].click();
        }
      } else if (e.key === "Escape") {
        input.value = "";
        runSearch("");
        input.blur();
      }
    });

    clearBtn.addEventListener("click", () => {
      input.value = "";
      runSearch("");
      input.focus();
    });

    document.addEventListener("click", (e) => {
      if (!searchWrap.contains(e.target)) closeDropdown();
    });

    dropdown.addEventListener("mousedown", (e) => e.preventDefault());
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();
