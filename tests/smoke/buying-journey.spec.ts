import { products } from '../../src/domain/catalog'
import { expect, test } from '../fixtures'

test.describe('buying journey', { tag: '@smoke' }, () => {
  test('home opens the collection', async ({ page, home, shop }) => {
    await home.goto()

    await expect(page).toHaveTitle('Halden')
    await expect(page.getByRole('heading', { name: 'Small goods for a quieter home' })).toBeVisible()
    await expect(page.getByRole('list', { name: 'Featured products' }).getByRole('link')).toHaveCount(
      products.filter((product) => product.featured).length,
    )

    await home.shopTheCollection()
    await expect(page.getByRole('heading', { name: 'The collection' })).toBeVisible()
    await expect(shop.productLinks()).toHaveCount(products.length)
  })

  test('a guest can buy a stoneware pourer', async ({ page, home, shop, product, cart, checkout }) => {
    await home.goto()
    await home.shopTheCollection()
    await shop.openProduct('Stoneware Pourer')

    await expect(page.getByRole('heading', { level: 1, name: 'Stoneware Pourer' })).toBeVisible()
    await expect(page.getByText('$48.00')).toBeVisible()

    await product.addToCart()
    await product.viewCart()

    await expect(page.getByRole('link', { name: 'Cart, 1 item' })).toBeVisible()
    await expect(cart.summary('Shipping')).toHaveText('$8.00')
    await expect(cart.summary('Total')).toHaveText('$56.00')

    await cart.goToCheckout()
    await checkout.fillValid()
    await checkout.placeOrder()

    await expect(page).toHaveURL(/\/order-confirmation$/)
    await expect(page.getByRole('heading', { name: 'Order confirmed' })).toBeVisible()
    await expect(page.getByText(/Order number HL-\d{4}/)).toBeVisible()
    await expect(page.getByText('ada@example.com')).toBeVisible()
    await expect(page.getByText('Card ending 4242')).toBeVisible()
    await expect(page.getByText('Total $56.00')).toBeVisible()
  })
})
