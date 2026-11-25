import { expect, test } from '../fixtures'

const checkoutHints = [
  { label: 'Full name', placeholder: 'Your Full Name' },
  { label: 'Email', placeholder: 'Your Email' },
  { label: 'Street address', placeholder: 'Your Street Address' },
  { label: 'City', placeholder: 'Your City' },
  { label: 'Postal code', placeholder: 'Your Postal Code' },
  { label: 'Card number', placeholder: '0000 0000 0000 0000' },
  { label: 'Expiry', placeholder: 'MM/YY' },
] as const

test.describe('checkout form hints', { tag: '@regression' }, () => {
  test('checkout fields show the expected placeholders', async ({ product, checkout }) => {
    await product.goto('espresso-set')
    await product.addToCart()
    await checkout.goto()

    for (const { label, placeholder } of checkoutHints) {
      await expect(checkout.field(label)).toHaveAttribute('placeholder', placeholder)
    }
  })

  test('cvc has no placeholder hint', async ({ product, checkout }) => {
    await product.goto('espresso-set')
    await product.addToCart()
    await checkout.goto()

    await expect(checkout.field('CVC')).not.toHaveAttribute('placeholder')
  })
})
