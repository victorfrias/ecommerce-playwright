import { expect, test } from '../fixtures'

test.describe('cart', { tag: '@regression' }, () => {
  test('adding the same product accumulates and then stops at 9', async ({ page, product, cart }) => {
    await product.goto('wool-cushion')
    await product.increase()
    await product.addToCart()
    await product.viewCart()
    await expect(cart.quantity('wool-cushion')).toHaveText('2')

    await product.goto('wool-cushion')
    await product.addToCart()
    await cart.goto()
    await expect(cart.quantity('wool-cushion')).toHaveText('3')
    await expect(page.getByRole('link', { name: 'Cart, 3 items' })).toBeVisible()

    await product.goto('wool-cushion')
    for (let count = 1; count < 9; count += 1) await product.increase()
    await product.addToCart()
    await cart.goto()
    await expect(cart.quantity('wool-cushion')).toHaveText('9')
  })

  test('quantity changes recalculate shipping', async ({ page, product, cart }) => {
    await product.goto('stoneware-pourer')
    await product.addToCart()
    await product.viewCart()

    await expect(cart.summary('Subtotal')).toHaveText('$48.00')
    await expect(cart.summary('Shipping')).toHaveText('$8.00')
    await expect(cart.summary('Total')).toHaveText('$56.00')

    await cart.increase('Stoneware Pourer')
    await expect(cart.quantity('stoneware-pourer')).toHaveText('2')
    await expect(cart.summary('Subtotal')).toHaveText('$96.00')
    await expect(cart.summary('Shipping')).toHaveText('Free')
    await expect(cart.summary('Total')).toHaveText('$96.00')

    await cart.decrease('Stoneware Pourer')
    await expect(cart.summary('Shipping')).toHaveText('$8.00')
    await expect(cart.summary('Total')).toHaveText('$56.00')
    await expect(page.getByRole('link', { name: 'Cart, 1 item' })).toBeVisible()
  })

  test('removing the last item empties the cart', async ({ page, product, cart }) => {
    await product.goto('paper-lantern')
    await product.addToCart()
    await product.viewCart()
    await cart.remove('Paper Lantern')

    await expect(page.getByText('Your cart is empty.')).toBeVisible()
    await expect(page.getByRole('link', { name: 'Cart', exact: true })).toBeVisible()
    await page.goto('/checkout')
    await expect(page.getByRole('heading', { name: 'Your cart is empty' })).toBeVisible()
  })
})
