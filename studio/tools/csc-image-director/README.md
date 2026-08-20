# CSC Image Director

Local editorial production tool for `/studio/case-studies/criar-sin-culpas/`.

**Not public.** Do not link from Studio nav.

## Start

From repo root:

```bash
python studio/tools/csc-image-director/dev-server.py
```

Open:

- Director: http://localhost:4173/studio/tools/csc-image-director/
- Case study: http://localhost:4173/studio/case-studies/criar-sin-culpas/

Use this server (not plain `http.server`) so **Save** and **Apply Approved Crops** can write files.

## Files

| File | Role |
|---|---|
| `studio/case-studies/criar-sin-culpas/csc-case-study-image-manifest.json` | Source of truth for instances + crops |
| `studio/case-studies/criar-sin-culpas/csc-crops.css` | Base crop CSS variables |
| `studio/case-studies/criar-sin-culpas/csc-crops-applied.css` | Approved crop values (written by Apply) |
| `studio/case-studies/criar-sin-culpas/csc-image-inventory.md` | Human-readable inventory |

## Workflow

1. Edit crops in the director (per instance × desktop/tablet/mobile).
2. **Save** writes the manifest (also mirrored in localStorage).
3. **Approve** marks an instance.
4. **Apply Approved Crops** writes `csc-crops-applied.css` — only approved instances.
5. **View in Context** opens the live case-study section.

Source image files are never cropped or overwritten.
