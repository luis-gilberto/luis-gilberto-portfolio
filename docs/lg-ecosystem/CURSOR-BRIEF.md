# Cursor Brief · LG Ecosystem Coherence Layer v2.1

Implement the shared ecosystem strip and the two local headers across
`luis-gilberto.com`, `lgpractice.com` and `strategyiq.com`. Both properties
ship bilingual, English and Spanish.

Static HTML and CSS. No React, no build step, no framework. The reference
implementation is `lg-ecosystem.css`, which is production ready as written.

Full system rationale and specimens: `LG-Ecosystem-Brand-Coherence-v2.html`.

---

## Before you write code

Four things must be confirmed. Do not guess any of them.

1. **Token names.** Every colour and typeface in `lg-ecosystem.css` resolves
   against a canonical variable with a literal fallback marked `CONFIRM`.
   Open the live `tokens.css`, map each one to the real variable name, then
   delete the fallback so tokens remain the single source of truth.

   | Used here | Expected canonical | Fallback in file |
   |---|---|---|
   | `--color-ink` | ink surface scope | `#0E0C0A` |
   | `--color-paper` | paper surface scope | `#F5F0EB` |
   | `--color-accent` | primary accent | `#F96F6E` |
   | `--font-editorial` | display / editorial role | Fraunces |
   | `--font-structural` | structural / condensed role | Big Shoulders Display |
   | `--font-body` | body / UI role | Inter |
   | `--font-utility` | mono / label role | JetBrains Mono |

2. **Real mark files.** Neither mark existed in the source package. Both are
   placeholder slots. Get the actual SVGs before building the headers.

3. **StrategyIQ nav item.** Standing governance removed StrategyIQ from nav
   panels pending trademark. If that hold is live, keep the item out of the nav
   and reach StrategyIQ from the Practice page body. Everything else is unaffected.

4. **Which phase you are building.** `lgpractice.com` was acquired but is not
   live. Never point a strip node at a parked domain.

   | Phase | Ships on | LG Studio node points to |
   |---|---|---|
   | 0 · now | `luis-gilberto.com` | Current Studio path on `luis-gilberto.com` |
   | 1 | plus `lgpractice.com` | `lgpractice.com` |
   | 2 | plus `strategyiq.com` | `lgpractice.com` |

---

## Build order

### 1 · Ecosystem strip

Ship as inlined markup plus inlined critical CSS in **both** codebases. Do not
fetch it as a shared remote component: these are separate domains, and a fetch
produces a flash of unstyled chrome on every crossing. Keep one source file and
a copy step so the two stay identical.

```html
<nav class="lg-eco" aria-label="Ecosystem">
  <div class="lg-eco__shell">
    <div class="lg-eco__group">
      <a class="lg-eco__node" href="https://luis-gilberto.com">Luis Gilberto</a>
      <a class="lg-eco__node" href="https://lgpractice.com">LG Studio</a>
      <span class="lg-eco__divide" aria-hidden="true"></span>
      <a class="lg-eco__node lg-eco__node--dest" href="https://luis-gilberto.com/insights">Insights</a>
      <a class="lg-eco__node lg-eco__node--dest" href="https://luis-gilberto.com/hub">The Hub</a>
    </div>
    <div class="lg-eco__lang">
      <a href="/" aria-current="true" lang="en">EN</a>
      <span class="sep" aria-hidden="true">·</span>
      <a href="/es/" lang="es">ES</a>
    </div>
  </div>
</nav>
```

Insights and The Hub URLs are confirmed and safe to hard code.

**On `strategyiq.com`**, the strip stays at four nodes. StrategyIQ is a Tier 3
product of the practice, not a fifth identity. Mark `LG Studio` as current and
add the within label after it:

```html
<a class="lg-eco__node" href="https://lgpractice.com" aria-current="page">LG Studio</a>
<span class="lg-eco__within">StrategyIQ</span>
```

This reads as "you are inside LG Studio, in StrategyIQ." StrategyIQ keeps its
own header and its own product design system below the strip. Any future
product of the practice with its own domain uses this same treatment.

Add `aria-current="page"` to the node matching the current property. Resolve it
at build or template time from the hostname. The accent marker is drawn from
that attribute in CSS, so no JavaScript is required.

**Never** change strip height, node order, type, tracking or background between
the two properties. Identical is the entire point.

### 2 · Local headers

One per page. Never two branded headers on one page, in any configuration.

```html
<!-- luis-gilberto.com -->
<header class="lg-header lg-header--luis">
  <div class="lg-header__shell">
    <a class="lg-mark" href="/" aria-label="Luis Gilberto">
      <img src="/assets/luis-gilberto-mark.svg" alt="">
    </a>
    <nav class="lg-nav" aria-label="Main">
      <a href="/experience">Experience</a>
      <a href="/journey" aria-current="page">Journey</a>
      <a href="/work">Work</a>
      <a href="/insights">Insights</a>
      <a href="/about">About</a>
    </nav>
    <a class="lg-cta" href="/contact">Get in touch</a>
    <button class="lg-burger" aria-label="Menu" aria-expanded="false"></button>
  </div>
</header>
```

```html
<!-- lgpractice.com -->
<header class="lg-header lg-header--studio">
  <div class="lg-header__shell">
    <a class="lg-mark" href="/" aria-label="LG Studio">
      <img src="/assets/lg-studio-mark-reversed.svg" alt="">
    </a>
    <nav class="lg-nav" aria-label="Main">
      <a href="/practice" aria-current="page">Practice</a>
      <a href="/strategyiq">StrategyIQ</a>
      <a href="/work">Work</a>
      <a href="/insights">Insights</a>
      <a href="/about">About</a>
    </nav>
    <a class="lg-cta" href="/book">Book a conversation</a>
    <button class="lg-burger" aria-label="Menu" aria-expanded="false"></button>
  </div>
</header>
```

Studio requires a **reversed** mark asset, since it sits on ink.

Mark heights are `28px` Luis and `24px` Studio on desktop. That 4px difference
is optical compensation, not hierarchy. Once the real assets are in, view both
headers side by side and adjust until they read as equal weight, then record
the final numbers in the spec document.

### 3 · Bilingual

`/es/` subdirectory on both domains. English at the root, `x-default` there.

- The toggle links to the **equivalent page**, not the homepage. Every page
  declares its counterpart. Where a translation is missing, hide the toggle
  rather than dead-end the reader. This is the single detail that decides
  whether a bilingual site feels finished.
- Never auto-redirect on `Accept-Language`. Remember the choice and apply it to
  internal links only.
- Set `lang` on `<html>` and reciprocal `hreflang` on every page pair.
- `aria-current="true"` on the active locale.
- Write the Spanish nav as Spanish, not as translated English. "Get in touch"
  is better as "Conversemos" than "Ponte en contacto", and shorter.

### 4 · Mobile menu

Breakpoint `1080px`, raised from 900px. The Spanish Studio nav runs about eight
percent wider than the English, and measuring it exposed an overflow below
roughly 1024px that was present in **both** languages. Studio nav is now 14px
at a 26px gap.

The breakpoint is a single number. If the real condensed face measures narrower
than the fallback used here, lower that one value. Do not change the layout.

Nav and CTA hide, the menu button appears. The menu panel carries the local
nav, the CTA, and an ecosystem group holding Insights and The Hub. Both
identities and the language toggle stay in the strip at every size.

### 5 · Cross-domain wiring

Absolute URLs for every strip node. Add `rel="me"` on the two identity nodes.
At phase 1, 301 Studio content under `luis-gilberto.com` to the matching
`lgpractice.com` path, and set explicit canonicals on anything that exists on
both during transition.

---

## Acceptance checks

- [ ] Only one branded header renders on any page of either property.
- [ ] The strip is pixel identical across both domains: height, order, type, colour.
- [ ] Crossing domains moves only the accent marker and inverts the surface scope.
- [ ] No literal hex or font name remains in `lg-ecosystem.css`. All resolve to tokens.
- [ ] "Portfolio" appears nowhere in any lockup.
- [ ] `lgstudio.com` appears nowhere, and no strip node points at a parked domain.
- [ ] The word "Luis Gilberto" appears in a branded position at most once per Studio page, and never in the header.
- [ ] Insights and The Hub never render at identity strength.
- [ ] Keyboard focus is visible on every element in the strip and header.
- [ ] `prefers-reduced-motion` removes all chrome transitions.
- [ ] No horizontal overflow at 380px, 414px, 768px, 1024px, 1080px, 1440px, **in both languages**.
- [ ] The language toggle lands on the equivalent page, never the homepage, from ten sampled pages.
- [ ] `hreflang` is reciprocal on every page pair, and `lang` is correct on `<html>`.
- [ ] On `strategyiq.com` the strip shows four nodes, not five.
- [ ] The endorsement lockup appears in decks, proposals, credits and footers only. Never in site chrome.

---

## Out of scope

Do not redesign either mark. Do not introduce a monogram. Do not port anything
from the GenSpark package: its palette, typefaces and both marks were invented,
and its React and Babel scaffolding is presentation only.
