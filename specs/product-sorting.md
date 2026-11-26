# Product Sorting Test Plan

## Application Overview

Validates sorting behavior on the shop/catalog page, including all sort options, URL synchronization, category interaction, direct links, invalid values, and deterministic ordering.

## Test Scenarios

### 1. Product sorting

**Seed:** `tests/seed.spec.ts`

#### 1.1. Default Featured sorting

**File:** `tests/regression/catalog.spec.ts`

**Steps:**
  1. Start from a fresh browser state and navigate to /shop.
    - expect: The Sort control is labeled Sort and defaults to Featured.
    - expect: The category filter defaults to All.
    - expect: The full unfiltered product catalog is displayed.
    - expect: The URL does not contain a sort query parameter.
  2. Record the product names and their visible order.
    - expect: No price reordering is applied.
    - expect: The displayed order remains the catalog's default source order.

#### 1.2. Sort all products by ascending price

**File:** `tests/regression/catalog.spec.ts`

**Steps:**
  1. Start at /shop and select Price: low to high from the Sort dropdown.
    - expect: The URL contains sort=price-asc.
    - expect: The first product is Espresso Cup Set.
    - expect: Product prices are in nondecreasing numerical order from first to last.
    - expect: Espresso Cup Set ($32.00) appears before higher-priced products.
  2. Read the complete product order.
    - expect: All 10 catalog products remain visible.
    - expect: Each adjacent pair satisfies left price <= right price.
    - expect: No product is duplicated or omitted.
    - expect: The Sort dropdown remains on Price: low to high.

#### 1.3. Sort all products by descending price

**File:** `tests/regression/catalog.spec.ts`

**Steps:**
  1. Start at /shop and select Price: high to low.
    - expect: The URL contains sort=price-desc.
    - expect: The first product is Arc Floor Lamp.
    - expect: Product prices are in nonincreasing numerical order from first to last.
    - expect: Arc Floor Lamp ($210.00) appears before lower-priced products.
  2. Read the complete product order.
    - expect: All 10 catalog products remain visible.
    - expect: Each adjacent pair satisfies left price >= right price.
    - expect: No product is duplicated or omitted.
    - expect: The Sort dropdown remains on Price: high to low.

#### 1.4. Switch among sort options

**File:** `tests/regression/catalog.spec.ts`

**Steps:**
  1. Select ascending price, then descending price, then Featured.
    - expect: After ascending selection, the URL contains sort=price-asc.
    - expect: After descending selection, the URL changes to sort=price-desc.
    - expect: After selecting Featured, the sort query parameter is removed.
    - expect: The ascending, descending, and Featured orders are each visibly different or reset appropriately.
    - expect: The dropdown always reflects the active sort.

#### 1.5. Sort combined with category filtering

**File:** `tests/regression/catalog.spec.ts`

**Steps:**
  1. Navigate to /shop, select Ceramics, then sort ascending.
    - expect: The URL contains both category=ceramics and sort=price-asc.
    - expect: Only ceramic products are shown.
    - expect: Visible ceramic prices are in ascending order.
    - expect: The result count matches the ceramic product count.
  2. Switch to high-to-low while Ceramics remains selected.
    - expect: The URL preserves category=ceramics and changes to sort=price-desc.
    - expect: Only ceramic products remain visible.
    - expect: Visible ceramic prices are in descending order.
    - expect: Linen Throw and other nonceramic products remain absent.
  3. Switch the category to All while high-to-low remains selected.
    - expect: The category parameter is removed.
    - expect: All 10 products are visible again.
    - expect: The high-to-low price order is preserved.
    - expect: The Sort dropdown remains on Price: high to low.

#### 1.6. Deep link with valid sort parameter

**File:** `tests/regression/catalog.spec.ts`

**Steps:**
  1. Navigate directly to /shop?sort=price-asc.
    - expect: The page loads without errors.
    - expect: The Sort control displays Price: low to high.
    - expect: Espresso Cup Set is the first product.
    - expect: Prices are in ascending order.
    - expect: The URL remains sort=price-asc.
  2. Navigate directly to /shop?sort=price-desc.
    - expect: The Sort control displays Price: high to low.
    - expect: Arc Floor Lamp is the first product.
    - expect: Prices are in descending order.
    - expect: The URL remains sort=price-desc.
  3. Navigate directly to /shop?sort=featured.
    - expect: The Sort control displays Featured.
    - expect: The sort query parameter is removed from the URL.
    - expect: The default catalog order is restored.

#### 1.7. Unknown sort parameter fallback

**File:** `tests/regression/catalog.spec.ts`

**Steps:**
  1. Navigate directly to /shop?sort=unknown-sort.
    - expect: The page remains usable and displays the full catalog.
    - expect: The Sort control falls back to Featured.
    - expect: No application error or blank product grid is shown.
    - expect: The first product follows the default catalog order.
  2. Change the dropdown to Price: low to high.
    - expect: Unknown sort state is replaced with sort=price-asc.
    - expect: The grid reorders correctly.

#### 1.8. Category and sort query state on reload

**File:** `tests/regression/catalog.spec.ts`

**Steps:**
  1. Navigate to /shop, select Lighting, then select Price: high to low, and reload the page.
    - expect: Both category=lighting and sort=price-desc remain in the URL.
    - expect: The Lighting filter remains selected.
    - expect: Only lighting products are visible.
    - expect: Lighting prices are in descending order.
    - expect: The Sort dropdown remains on Price: high to low.
  2. Reload again after selecting Featured and All.
    - expect: Both the category and sort query parameters are removed.
    - expect: All products are restored in default Featured order.
    - expect: All and Featured defaults are selected in the UI.

#### 1.9. Browser navigation preserves sorting

**File:** `tests/regression/catalog.spec.ts`

**Steps:**
  1. From /shop, select ascending price, then descending price.
    - expect: Each selection updates the URL and grid correctly.
  2. Use the browser Back button once.
    - expect: The page returns to the ascending sort state.
    - expect: sort=price-asc is present in the URL.
    - expect: Ascending order is visible.
    - expect: The Sort dropdown displays Price: low to high.
  3. Use the browser Forward button.
    - expect: The page returns to the descending sort state.
    - expect: sort=price-desc is present in the URL.
    - expect: Descending order is visible.
    - expect: The Sort dropdown displays Price: high to low.

#### 1.10. Sorting does not affect product navigation

**File:** `tests/regression/catalog.spec.ts`

**Steps:**
  1. At /shop, sort ascending and open a product from the grid, for example Espresso Cup Set.
    - expect: The selected product page opens successfully.
    - expect: The product name and price match the selected card.
  2. Navigate back to the shop.
    - expect: The ascending sort selection is preserved.
    - expect: The grid remains in ascending price order.
    - expect: The URL still contains sort=price-asc.

#### 1.11. Sorting is deterministic for equal prices

**File:** `tests/regression/catalog.spec.ts`

**Steps:**
  1. Compare the catalog for equal-price products, or inspect ascending and descending ordering after a data fixture update introduces equal prices.
    - expect: No equal-price item pair should violate the name-based tie-breaker.
    - expect: In ascending order, equal-price products are ordered alphabetically by name.
    - expect: In descending order, equal-price products are also ordered alphabetically by name.
    - expect: Sorting behavior remains stable across repeated reloads.
