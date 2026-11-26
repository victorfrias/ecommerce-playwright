import type { Page } from '@playwright/test'
import { listProducts, products } from '../../src/domain/catalog'
import { expect, test } from '../fixtures'

async function displayedNames(page: Page) {
  return page.getByRole('list', { name: 'Products' }).getByRole('heading', { level: 2 }).allTextContents()
}

async function displayedPrices(page: Page) {
  const values = await page.getByRole('list', { name: 'Products' }).locator('.price').allTextContents()
  return values.map((value) => Math.round(Number(value.replace(/[^0-9.]/g, '')) * 100))
}

test.describe('catalog', { tag: '@regression' }, () => {
  test('category filter narrows the grid', async ({ page, shop }) => {
    await shop.goto()
    await shop.filterBy('Ceramics')
    await expect(page).toHaveURL(/category=ceramics/)
    await expect(shop.productLinks()).toHaveCount(products.filter((product) => product.category === 'ceramics').length)
    await expect(shop.productLink('Linen Throw')).toHaveCount(0)
    await expect(shop.productLink('Stoneware Pourer')).toBeVisible()
  })

  test('default Featured sorting shows the catalog source order', async ({ page, shop }) => {
    // 1. Start from a fresh browser state and navigate to /shop.
    await shop.goto()
    // Verify: Sort defaults to Featured, All is selected, and no sort parameter is present.
    await expect(page.getByLabel('Sort')).toHaveValue('featured')
    await expect(page.getByRole('button', { name: 'All', exact: true })).toHaveAttribute('aria-pressed', 'true')
    await expect(page).not.toHaveURL(/sort=/)
    await expect(shop.productLinks()).toHaveCount(products.length)
    // 2. Record the product names and verify the default source order.
    expect(await displayedNames(page)).toEqual(products.map((product) => product.name))
  })

  test('sort all products by ascending price', async ({ page, shop }) => {
    // 1. Select Price: low to high.
    await shop.goto()
    await shop.sortBy('Price: low to high')
    await expect(page).toHaveURL(/sort=price-asc/)
    await expect(page.getByLabel('Sort')).toHaveValue('price-asc')
    expect(await displayedNames(page)).toEqual(listProducts('all', 'price-asc').map((product) => product.name))
    // 2. Read the complete product order and verify prices, count, and uniqueness.
    await expect(shop.productLinks()).toHaveCount(10)
    const names = await displayedNames(page)
    expect(names[0]).toBe('Espresso Cup Set')
    expect(new Set(names).size).toBe(10)
    const prices = await displayedPrices(page)
    expect(prices).toEqual([...prices].sort((a, b) => a - b))
  })

  test('sort all products by descending price', async ({ page, shop }) => {
    // 1. Select Price: high to low.
    await shop.goto()
    await shop.sortBy('Price: high to low')
    await expect(page).toHaveURL(/sort=price-desc/)
    await expect(page.getByLabel('Sort')).toHaveValue('price-desc')
    expect(await displayedNames(page)).toEqual(listProducts('all', 'price-desc').map((product) => product.name))
    // 2. Read the complete product order and verify prices, count, and uniqueness.
    await expect(shop.productLinks()).toHaveCount(10)
    const names = await displayedNames(page)
    expect(names[0]).toBe('Arc Floor Lamp')
    expect(new Set(names).size).toBe(10)
    const prices = await displayedPrices(page)
    expect(prices).toEqual([...prices].sort((a, b) => b - a))
  })

  test('switch among sort options', async ({ page, shop }) => {
    // 1. Switch from ascending to descending to Featured.
    await shop.goto()
    await shop.sortBy('Price: low to high')
    await expect(page).toHaveURL(/sort=price-asc/)
    await shop.sortBy('Price: high to low')
    await expect(page).toHaveURL(/sort=price-desc/)
    await shop.sortBy('Featured')
    await expect(page).not.toHaveURL(/sort=/)
    await expect(page.getByLabel('Sort')).toHaveValue('featured')
    expect(await displayedNames(page)).toEqual(products.map((product) => product.name))
  })

  test('sort combined with category filtering', async ({ page, shop }) => {
    // 1. Select Ceramics, then ascending price.
    await shop.goto()
    await shop.filterBy('Ceramics')
    await shop.sortBy('Price: low to high')
    await expect(page).toHaveURL(/category=ceramics.*sort=price-asc|sort=price-asc.*category=ceramics/)
    await expect(shop.productLinks()).toHaveCount(products.filter((product) => product.category === 'ceramics').length)
    expect(await displayedNames(page)).toEqual(listProducts('ceramics', 'price-asc').map((product) => product.name))
    // 2. Switch to descending while Ceramics remains selected.
    await shop.sortBy('Price: high to low')
    await expect(page).toHaveURL(/category=ceramics.*sort=price-desc|sort=price-desc.*category=ceramics/)
    await expect(shop.productLink('Linen Throw')).toHaveCount(0)
    expect(await displayedNames(page)).toEqual(listProducts('ceramics', 'price-desc').map((product) => product.name))
    // 3. Switch the category to All while descending remains selected.
    await shop.filterBy('All')
    await expect(page).not.toHaveURL(/category=/)
    await expect(page).toHaveURL(/sort=price-desc/)
    await expect(page.getByLabel('Sort')).toHaveValue('price-desc')
    await expect(shop.productLinks()).toHaveCount(10)
  })

  test('deep links with valid sort parameters', async ({ page, shop }) => {
    // 1. Open /shop?sort=price-asc directly.
    await page.goto('/shop?sort=price-asc')
    await expect(page.getByLabel('Sort')).toHaveValue('price-asc')
    await expect(shop.productLink('Espresso Cup Set')).toBeVisible()
    expect(await displayedNames(page)).toEqual(listProducts('all', 'price-asc').map((product) => product.name))
    // 2. Open /shop?sort=price-desc directly.
    await page.goto('/shop?sort=price-desc')
    await expect(page.getByLabel('Sort')).toHaveValue('price-desc')
    await expect(shop.productLink('Arc Floor Lamp')).toBeVisible()
    expect(await displayedNames(page)).toEqual(listProducts('all', 'price-desc').map((product) => product.name))
    // 3. Open /shop?sort=featured directly.
    await page.goto('/shop?sort=featured')
    await expect(page.getByLabel('Sort')).toHaveValue('featured')
    await expect(page).toHaveURL(/sort=featured/)
    expect(await displayedNames(page)).toEqual(products.map((product) => product.name))
  })

  test('unknown sort parameter falls back to Featured', async ({ page, shop }) => {
    // 1. Open /shop?sort=unknown-sort directly.
    await page.goto('/shop?sort=unknown-sort')
    await expect(page.getByLabel('Sort')).toHaveValue('featured')
    await expect(shop.productLinks()).toHaveCount(10)
    expect(await displayedNames(page)).toEqual(products.map((product) => product.name))
    // 2. Replace the unknown state with ascending price.
    await shop.sortBy('Price: low to high')
    await expect(page).toHaveURL(/sort=price-asc/)
    await expect(
      page.getByRole('list', { name: 'Products' }).getByRole('heading', { level: 2 }),
    ).toHaveText(listProducts('all', 'price-asc').map((product) => product.name))
  })

  test('category and sort query state survives reload', async ({ page, shop }) => {
    // 1. Select Lighting and descending price, then reload.
    await shop.goto()
    await shop.filterBy('Lighting')
    await shop.sortBy('Price: high to low')
    await page.reload()
    await expect(page).toHaveURL(/category=lighting.*sort=price-desc|sort=price-desc.*category=lighting/)
    await expect(page.getByRole('button', { name: 'Lighting', exact: true })).toHaveAttribute('aria-pressed', 'true')
    await expect(page.getByLabel('Sort')).toHaveValue('price-desc')
    expect(await displayedNames(page)).toEqual(listProducts('lighting', 'price-desc').map((product) => product.name))
    // 2. Select Featured and All, then reload.
    await shop.sortBy('Featured')
    await shop.filterBy('All')
    await page.reload()
    await expect(page).not.toHaveURL(/category=|sort=/)
    await expect(page.getByRole('button', { name: 'All', exact: true })).toHaveAttribute('aria-pressed', 'true')
    await expect(page.getByLabel('Sort')).toHaveValue('featured')
    expect(await displayedNames(page)).toEqual(products.map((product) => product.name))
  })

  test('browser Back and Forward preserve sorting', async ({ page, shop }) => {
    // 1. Select ascending, then descending price.
    await shop.goto()
    await shop.sortBy('Price: low to high')
    await shop.sortBy('Price: high to low')
    // 2. Use browser Back.
    await page.goBack()
    await expect(page).toHaveURL(/sort=price-asc/)
    await expect(page.getByLabel('Sort')).toHaveValue('price-asc')
    expect(await displayedNames(page)).toEqual(listProducts('all', 'price-asc').map((product) => product.name))
    // 3. Use browser Forward.
    await page.goForward()
    await expect(page).toHaveURL(/sort=price-desc/)
    await expect(page.getByLabel('Sort')).toHaveValue('price-desc')
    expect(await displayedNames(page)).toEqual(listProducts('all', 'price-desc').map((product) => product.name))
  })

  test('sorting does not affect product navigation', async ({ page, shop }) => {
    // 1. Sort ascending and open Espresso Cup Set.
    await shop.goto()
    await shop.sortBy('Price: low to high')
    await shop.openProduct('Espresso Cup Set')
    await expect(page.getByRole('heading', { level: 1, name: 'Espresso Cup Set' })).toBeVisible()
    // 2. Navigate back to the shop.
    await page.goBack()
    await expect(page).toHaveURL(/sort=price-asc/)
    await expect(page.getByLabel('Sort')).toHaveValue('price-asc')
    expect(await displayedNames(page)).toEqual(listProducts('all', 'price-asc').map((product) => product.name))
  })

  test('an unknown product shows a not-found page', async ({ page, product }) => {
    await product.goto('missing-bowl')
    await expect(page.getByRole('heading', { name: 'Product not found' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Back to shop' })).toBeVisible()
  })

  test('product quantity stays between 1 and 9', async ({ page, product }) => {
    await product.goto('stoneware-pourer')
    await expect(product.quantity()).toHaveText('1')
    await expect(page.getByRole('button', { name: 'Decrease quantity', exact: true })).toBeDisabled()
    for (let count = 1; count < 9; count += 1) await product.increase()
    await expect(product.quantity()).toHaveText('9')
    await expect(page.getByRole('button', { name: 'Increase quantity', exact: true })).toBeDisabled()
    await product.decrease()
    await expect(product.quantity()).toHaveText('8')
  })
})
