# PoodFanda

Filipino food delivery app. React 19 + Vite 8. Single-page, no router — screen state managed via `useReducer` in `App.jsx`.

## Stack

- **React 19** with JSX (`.jsx` files)
- **Vite 8** for dev server and build
- **ESLint 10** with `eslint-plugin-react-hooks` and `eslint-plugin-react-refresh`
- No TypeScript, no CSS modules — inline styles throughout, global CSS only in `src/index.css` and `src/App.css`

## Project structure

```
src/
  App.jsx       # state, all screens and components (UI/logic)
  data.js       # RAW restaurant/menu data + RESTAURANTS/ITEMS derivation
  main.jsx      # React root mount
  App.css       # minimal global overrides
  index.css     # base resets
public/
  favicon.svg
  icons.svg
```

All UI, state, and logic live in `src/App.jsx`; all restaurant/menu data lives in `src/data.js`. No separate component files yet.

## Commands

```bash
npm run dev      # Vite dev server
npm run build    # production build → dist/
npm run lint     # ESLint check
npm run preview  # serve dist/ locally
```

## After every code change

Run lint then build. Both must pass before considering a change done:

```bash
npm run lint && npm run build
```

If lint fails, fix errors before proceeding. Warnings are acceptable but errors are not.

## State

Single `useReducer` in `App`. State shape:

| Key | Purpose |
|-----|---------|
| `screen` | `'home' \| 'restaurant' \| 'checkout' \| 'confirmation'` |
| `activeRid` | restaurant ID currently open |
| `cart` | `{ [itemId]: quantity }` |
| `cartRid` | which restaurant the cart belongs to |
| `cartOpen` | cart drawer visibility |
| `q` | global search query |
| `chip` | active cuisine filter chip |
| `menuCat` | active category inside a restaurant menu |
| `menuQ` | per-restaurant menu search |
| `payment` | `'gcash' \| 'cod' \| 'card'` |
| `toast` | current toast message or null |
| `pulse` | counter to re-trigger toast animation |
| `pending` | item ID waiting for cross-restaurant cart confirm |
| `lastOrder` | snapshot of last placed order for confirmation screen |

## Data

`RAW` array in `src/data.js` holds all restaurant and menu data. Transformed into `RESTAURANTS` (with gradient computed) and a flat `ITEMS` lookup on module load, both exported and imported by `App.jsx`. No network calls — everything is static.

## Customize-before-add modal

Some restaurants (currently **McDonald's** `mcdo`, **Jollibee** `jb`, **Mang Inasal** `inasal`, and **Chowking** `chowking`) open a customization modal (`CustomizeModal` in `App.jsx`) before adding an item to the cart. A restaurant can opt into only some sections — e.g. Mang Inasal has empty `drinks`/`fries`, so it shows only frequently-bought-together + special instructions. Sections with no options are hidden and don't block the Add button. Clicking a menu "+" button routes through `onAdd(m)`: if `customConfig(m.rid, m.name)` is truthy it opens the modal, otherwise it adds directly.

Config lives in the `CUSTOMIZE` table in `src/data.js`, one entry per restaurant id. Exported helpers driving the modal:

- `customConfig(rid, name)` — returns `null` for unsupported restaurants and for any item whose name contains **"Solo"** (solo items add directly, no modal). Otherwise returns `{ size, hasFries, hasDrink, hasNugget, sauces }`.
- `customFries(rid, size)` — fries upsize options.
- `customDrinks(rid, size, text)` — drink options (`text` is name + desc).
- `customFbt(rid)` — frequently-bought-together add-ons.

### Rules

- **Non-solo only.** Items with "Solo" in the name skip the modal entirely.
- **Fries** (shown when name contains "Fries") — **required**, single-select. Upsize only: the meal's included size and bigger, never smaller. Included size is **Free** (re-based to 0); larger sizes cost the difference. McDo also always offers McShaker Medium Cheese/BBQ.
- **Drink** (shown when name matches `meal|drink|float|combo`) — **required**, single-select. Same size-and-up rule, cheapest shown option re-based to **Free**. If the item name/description names a specific drink (via `drinkFamilies`, e.g. "A&W Root Beer McFloat"), the list is narrowed to that family.
- **Choice groups** (config `choices: [{ title, match, opts, count }]`, e.g. Chowking "Choice A" shown only for non-ala-carte Chao Fan) — each is a **required** single-select with its own title and static prices (not re-based to free). `match(name, desc)` decides whether it applies. Optional `count(name, desc)` repeats the card N times (titled `Title N/total`, each its own pick) — Chowking reads the description's ulam pieces (≈ 4pc = 1 ulam) so platters ("12pcs of Siomai") ask for one ulam per serving.
- **Nugget Sauce** (McDo only, name contains "Nugget") — **required**. The card is **repeated once per included sauce** (`sauceCount`: 20-pc → 4, 10-pc → 2, else 1), each titled `Nugget Sauce N/total`, each its own single pick (duplicates allowed across cards).
- **Frequently bought together** — **optional**, multi-select checkboxes. Shows first 3, then a "View N more" toggle.
- **Special instructions** — free-text box at the bottom.
- **Add to cart** stays disabled until every required section is satisfied. Quantity stepper applies to the main meal; each checked add-on is one line.

### Cart integration

Customized meals and add-ons are written into the shared `ITEMS` lookup as **synthetic items** via `registerCustomItem(id, item)`, so `cart` stays `{ [itemId]: quantity }` and all totals/cart/checkout rendering work unchanged. The meal's synthetic price = base + fries + drink + sauces; its chosen options + note are stored in `desc`. Add-ons get ids like `${rid}_fbt_<slug>`. The modal dispatches `ADD_CUSTOM` (merges lines; starts a fresh cart if the cart belongs to another restaurant).

When adding a restaurant to the `CUSTOMIZE` table, give it `sizeOf`, `drinks`, `drinkFamilies` (or `null`), `fbt`, `nugget`, a `fries(size)` function, and optionally `choices` (array of `{ title, match, opts }` for restaurant-specific required picks). Long lists (drinks, FBT) collapse behind the shared `ViewMoreBtn`. Reuse `ChoiceBlock` (single-select, optional `limit` for "view more") for required choices.

## Styling conventions

- All styles are inline (`style={{ ... }}`), no CSS classes except for hover/active/animation targets
- CSS class names (`.rest-card`, `.btn-brand`, etc.) are declared in a `<style>` tag injected by `App` — used only for pseudo-state and keyframe animations
- Brand color: `#d70f64` (stored as `const B`)

## Positioning elements

Whenever you position or move a UI element (anything touching `left`/`right`/`top`/`bottom`/`margin`/`transform`/`gap`/`padding` for placement), after the change always report:

1. **Where** — a clickable `file:line` link to the exact style that controls the position, e.g. [App.jsx:440](src/App.jsx#L440).
2. **How to adjust manually** — name the property and value to change, and which direction each way moves it (e.g. "`left: 240` — smaller = more left, bigger = more right").

Prefer plain px values over `50%` + `translate(-50%)` centering tricks when an element may need manual tweaking, so the value is easy to find and drag.
