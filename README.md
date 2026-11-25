# Halden

A small demo store and a Playwright suite, built as a QA portfolio project.

The shop is called **Halden**. It is a fake catalog of ceramics, textiles, and lamps. Checkout accepts any 16-digit card and does not charge anyone. The buying journey is:

**Home → product list → product page → cart → checkout → order confirmation**

## Store rules the tests lock in

- Shipping is **$8.00** when the subtotal is under **$75**, and **free** at $75 or more.
- A line can hold at most **9** of one product.
- The cart is kept in `localStorage`. The last receipt is kept in `sessionStorage` for the current tab.
- Card numbers are checked for 16 digits only. Spaces are fine. Nothing is sent to a payment provider.

## Run the shop

```bash
npm install
npm run dev
```

Open http://127.0.0.1:5173.

## Run the tests

Install the browser once:

```bash
npx playwright install chromium
```

The suite is split into three Playwright projects. A test belongs to a project through its tag (`@smoke`, `@regression`, `@checkout`), so a full run does not execute the same test three times.

| Group | Command | What it covers |
| --- | --- | --- |
| Smoke | `npm run test:smoke` | Home, the catalog, and one purchase of the Stoneware Pourer |
| Regression | `npm run test:regression` | Filters, sort, missing products, quantity limits, cart math |
| Checkout | `npm run test:checkout` | Empty cart, field validation, free shipping, receipt reload |
| All | `npm test` | Every group |

`npm run test:ui` opens Playwright UI mode. After a run, `npx playwright show-report` opens the HTML report.

GitHub Actions runs the full suite on push and pull request (`.github/workflows/playwright.yml`).

## How a change should land

1. Add or adjust a test that describes the new behavior.
2. Run the group that owns it. Smoke for the critical path, checkout for payment and shipping, regression for the rest.
3. Change the store until that test passes, then run `npm test`.

Page objects live in `tests/pages`. Shared setup is in `tests/fixtures.ts`. Prices and the catalog live in `src/domain`, and the UI reads those same modules.
