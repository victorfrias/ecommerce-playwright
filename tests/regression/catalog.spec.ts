import { products } from '../../src/domain/catalog'
import { expect, test } from '../fixtures'

test.describe('catalog', { tag: '@regression' }, () => {
  test('category filter narrows the grid', async ({ page, shop }) => {
    await shop.goto()
    await shop.filterBy('Ceramics')

    await expect(page).toHaveURL(/category=ceramics/)
    await expect(shop.productLinks()).toHaveCount(
      products.filter((product) => product.category === 'ceramics').length,
    )
    await expect(shop.productLink('Linen Throw')).toHaveCount(0)
    await expect(shop.productLink('Stoneware Pourer')).toBeVisible()
  })

  test('sort orders the grid by price', async ({ page, shop }) => {
    await shop.goto()

    await shop.sortBy('Price: low to high')
    await expect(page).toHaveURL(/sort=price-asc/)
    await expect(page.getByRole('heading', { level: 2 }).first()).toHaveText('Espresso Cup Set')

    await shop.sortBy('Price: high to low')
    await expect(page.getByRole('heading', { level: 2 }).first()).toHaveText('Arc Floor Lamp')
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
