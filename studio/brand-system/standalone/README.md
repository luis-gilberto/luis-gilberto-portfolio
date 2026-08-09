# LG Studio — Standalone Set

Four fully self-contained HTML files. Each one carries its own copy of the
design tokens and every logo it uses, embedded as base64. No `tokens.css`,
no `assets/` folder, no build step.

Open any file directly, email it, or hand it to a client.

## Source of truth

**`tokens.css` in the parent folder is the source of truth.** The token
block inside these files is a generated copy.

Do not edit tokens here. Change `tokens.css`, then regenerate:

```
python3 build-standalone.py
```

Page-level CSS and JavaScript are authored inline in the linked originals,
so those edits are made in the parent files and picked up on regeneration.

## What is still external

The Google Fonts request for Fraunces, Inter, Big Shoulders Display and
JetBrains Mono. Offline, every font stack falls back to a system serif,
sans or mono, so the documents degrade gracefully rather than breaking.

## Embedded logos

Resampled to 800px wide and palette-reduced. The largest render anywhere in
the documents is 130px CSS, so 800px stays retina-safe at better than 3x.
Verified visually lossless against the originals: PSNR 53-72dB composited
over both Paper and Ink surfaces.

The master artwork in `../assets/` is untouched and byte-identical to the
originals. Use those files, never these embedded copies, for new artwork.

## Not embedded

`brand-board.png`, `landing-page-ref.png` and `partnership-lockups.png` are
reference imagery. No document references them, so they stay in `../assets/`.

## Filename note

The Brand Guide ships as `brand-guide.html`. It was renamed from a filename
containing spaces and an em dash, because that pattern was being gitignored
and would have failed to deploy. Keep filenames in this system free of
spaces and non-ASCII characters.
