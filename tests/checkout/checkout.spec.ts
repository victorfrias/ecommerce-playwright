import { expect, test } from '../fixtures'

test.describe('checkout', { tag: '@checkout' }, () => {
  test('an empty cart cannot place an order', async ({ page, checkout }) => {
    await checkout.goto()

    await expect(page.getByRole('heading', { name: 'Your cart is empty' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Place order' })).toHaveCount(0)
  })

  test('a blank form lists every required field', async ({ page, product, checkout }) => {
    await product.goto('espresso-set')
    await product.addToCart()
    await checkout.goto()
    await checkout.placeOrder()

    await expect(page).toHaveURL(/\/checkout$/)
    await expect(page.getByRole('alert')).toHaveText([
      'Enter your full name',
      'Enter a valid email',
      'Enter your street address',
      'Enter your city',
      'Enter a postal code',
      'Enter a 16-digit card number',
      'Use MM/YY',
      'Enter a 3-digit CVC',
    ])
  })

  test('a bad email stays on checkout', async ({ page, product, checkout }) => {
    await product.goto('espresso-set')
    await product.addToCart()
    await checkout.goto()
    await checkout.fillValid({ email: 'ada' })
    await checkout.placeOrder()

    await expect(page).toHaveURL(/\/checkout$/)
    await expect(page.getByRole('alert')).toHaveText('Enter a valid email')
  })

  test('an order of $75 or more ships free and stays on reload', async ({ page, shop, product, cart, checkout }) => {
    await shop.goto()
    await shop.openProduct('Speckled Bowl')
    await product.addToCart()
    await shop.goto()
    await shop.openProduct('Wool Cushion')
    await product.addToCart()
    await cart.goto()

    await expect(cart.summary('Subtotal')).toHaveText('$78.00')
    await expect(cart.summary('Shipping')).toHaveText('Free')
    await expect(cart.summary('Total')).toHaveText('$78.00')

    await cart.goToCheckout()
    await expect(checkout.summary('Shipping')).toHaveText('Free')
    await checkout.fillValid()
    await checkout.placeOrder()

    await expect(page.getByRole('heading', { name: 'Order confirmed' })).toBeVisible()
    await expect(page.getByText('Speckled Bowl × 1')).toBeVisible()
    await expect(page.getByText('Wool Cushion × 1')).toBeVisible()
    await expect(page.getByText('Total $78.00')).toBeVisible()

    await page.reload()
    await expect(page.getByRole('heading', { name: 'Order confirmed' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Cart', exact: true })).toBeVisible()
  })
})
