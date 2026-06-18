# Image assets

Drop image files here with these EXACT names. Until a file exists, the app shows a
colored-gradient + emoji fallback automatically — so nothing breaks while you upload.

Served at `/assets/...` (this `public/` folder maps to the site root).

## Top-level

| File | Used for | Suggested size |
|------|----------|----------------|
| `logo.png`   | header panda logo       | 64×64 (square) |
| `mascot.png` | greeting hero image (silver cloche + sparkles), bottom-right of the pink banner | ~460×400 (transparent PNG) |
| `qr.png`     | (optional) not shown in current logged-in layout | 240×240 |

## deals/  ("Your daily deals" cards)

Food cut-outs on the right of each pink card (~260×240):

`deal1.png`  `deal2.png`  `deal3.png`

## brands/  ("Top brands" logos — square ~128×128)

Restaurant-id based. Drop the ones you have:

`jb.png`  `chowking.png`  `potato.png`  `kfc.png`  `bonchon.png`  `greenwich.png`  `mcdo.png`  `shakeys.png`

## restaurants/  ("All restaurants" grid hero photos — landscape ~600×340, .jpg)

One per restaurant id. All 12:

`jb.jpg`  `mcdo.jpg`  `chowking.jpg`  `inasal.jpg`  `greenwich.jpg`  `kfc.jpg`
`maxs.jpg`  `goldi.jpg`  `shakeys.jpg`  `armynavy.jpg`  `bonchon.jpg`  `potato.jpg`

---
Restaurant ids are defined in `src/App.jsx` (the `RAW` array `id:` field). If you add a
new restaurant, name its photo `<that-id>.jpg`.
