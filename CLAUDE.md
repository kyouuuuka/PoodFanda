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
  App.jsx       # entire app: data, state, all screens and components
  main.jsx      # React root mount
  App.css       # minimal global overrides
  index.css     # base resets
public/
  favicon.svg
  icons.svg
```

All UI, state, and data lives in `src/App.jsx`. No separate component files yet.

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

`RAW` array in `App.jsx` holds all restaurant and menu data. Transformed into `RESTAURANTS` (with gradient computed) and a flat `ITEMS` lookup on module load. No network calls — everything is static.

## Styling conventions

- All styles are inline (`style={{ ... }}`), no CSS classes except for hover/active/animation targets
- CSS class names (`.rest-card`, `.btn-brand`, etc.) are declared in a `<style>` tag injected by `App` — used only for pseudo-state and keyframe animations
- Brand color: `#d70f64` (stored as `const B`)

## Positioning elements

Whenever you position or move a UI element (anything touching `left`/`right`/`top`/`bottom`/`margin`/`transform`/`gap`/`padding` for placement), after the change always report:

1. **Where** — a clickable `file:line` link to the exact style that controls the position, e.g. [App.jsx:440](src/App.jsx#L440).
2. **How to adjust manually** — name the property and value to change, and which direction each way moves it (e.g. "`left: 240` — smaller = more left, bigger = more right").

Prefer plain px values over `50%` + `translate(-50%)` centering tricks when an element may need manual tweaking, so the value is easy to find and drag.
