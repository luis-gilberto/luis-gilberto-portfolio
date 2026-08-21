# Behind the screen — image production specs

Production guidance for imagery in the **Criar Sin Culpas** case study section `#operations` (eyebrow: *Behind the screen*).

## How the section uses images

Desktop is a **2-column mosaic** inside an ~**1180px** shell:

| Slot | Role | Approx. desktop media width | Image height cap |
|------|------|-----------------------------|------------------|
| **Rhythm** | Tall hero (left, 2 rows) | ~600–680px | up to ~**26rem / 416px** |
| **Governance / Workspace / Protected** | Smaller right tiles | ~430–500px | up to ~**22rem / 352px** |
| **Production** | Mid left tile | ~600–680px | up to ~**22rem / 352px** |
| **Measurement** | Full-width footer | ~1100–1180px | up to ~**16rem / 256px** |

At **≤1100px** everything **stacks full-width**. At **≤820px** it’s a single mobile column.

Images are shown with **`object-fit: contain`** (current crops are `contain` @ zoom 1). They shrink to fit; they are **not** art-directed with separate desktop/tablet/mobile crops (unlike the parent photo in Designing for the moment).

**Implication:** one strong master per tile is enough for all breakpoints, as long as the ratio and composition are right.

---

## Shared export rules

- **Format:** PNG (UI / diagrams), or high-quality WebP/PNG via Cloudinary
- **Color:** designed for **dark ink** tiles (a calm matte around the artifact is fine)
- **Retina:** export ~**2×** the largest on-screen size
- **Safe zone:** keep the important idea in the **center ~75–80%** — edges get less attention and can feel cropped by padding
- **Density:** one idea per tile; type should still read when the image is only ~**250–400px tall**

---

## Best master specs by tile

### 1. Hero — Rhythm

- **Ratio:** **16:9** (best match to current `1672×941`)
- **Master:** **2400 × 1350**
- **Alt:** 3:2 at **2400 × 1600** if the board needs more vertical room

### 2. Standard tiles — Governance, Production, Protected

- **Ratio:** **3:2** (fills the shorter tile better than ultra-wide)
- **Master:** **2000 × 1333**
- Avoid ultra-wide (21:9) — it will look small and floaty under `contain`

### 3. Workspace

Narrower right column.

- **Ratio:** **4:3** or near-square (**5:4 / 1:1**)
- **Master:** **1600 × 1200** or **1400 × 1400**
- Near-square is already the right instinct for this slot

### 4. Wide — Measurement

- **Ratio:** **2:1** or **16:9**
- **Master:** **2400 × 1200** (2:1) or **2400 × 1350** (16:9)
- Keep the composition **horizontally sparse** — this tile is wide but **short**, so dense dashboards get busy fast

---

## Filling the space without looking busy

Because the layout uses **`contain` + max-height**, “filling nicely” comes from **ratio + composition**, not from making the file huge.

### Do

- Match the ratios above so the image uses most of the media frame
- Use a calm matte / board edge so the UI doesn’t touch the frame
- Design as if the whole piece will be viewed at **postcard size**, not full-screen Figma

### Don’t

- Pack tiny multi-panel systems that only work at 100% zoom
- Export one giant square for every slot (hero/wide will letterbox)
- Rely on CSS zoom/crop to “fix” density later — with `contain`, zoom just makes letterboxing worse or clips awkwardly

---

## Do you need separate desktop / tablet / mobile files?

**Usually no** for this section.

Make **one master per slot** at the specs above. The grid already adapts.

Make **true art-direction** (`<picture>` + 2–3 editions) only if:

- critical labels disappear when the tile goes full-width on mobile, or
- these tiles are later switched from `contain` to `cover`

If you do that later, use the project breakpoints:

- **Desktop:** >1100
- **Tablet:** ≤1100
- **Mobile:** ≤820

---

## Practical production checklist (6 files)

1. **Rhythm** — 2400×1350 (16:9)
2. **Governance** — 2000×1333 (3:2)
3. **Workspace** — 1600×1200 (4:3)
4. **Production** — 2000×1333 (3:2)
5. **Protected access** — 2000×1333 (3:2)
6. **Measurement** — 2400×1200 (2:1)

That set will sit cleanly in the current mosaic, stay readable when stacked, and avoid the “busy collage of unreadably small systems” look.

---

## Current HTML image instances (for replacement)

| Slot | `data-csc-img` | Notes |
|------|----------------|-------|
| Rhythm | `operations__ops-tile__41` | Hero |
| Measurement | `operations__ops-tile__42` | Wide |
| Production | `operations__ops-tile__43` | Standard |
| Governance | `operations__ops-tile__44` | Standard |
| Protected access | `operations__ops-tile__45` | Standard |
| Workspace | `operations__ops-tile__46` | Near-square preferred |
