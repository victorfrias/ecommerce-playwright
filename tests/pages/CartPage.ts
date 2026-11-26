import { expect, type Page } from '@playwright/test'

export class CartPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto('/cart')
  }

  quantity(slug: string) {
    return this.page.getByTestId(`qty-${slug}`)
  }

  summary(name: 'Subtotal' | 'Member discount' | 'Shipping' | 'Total') {
    return this.page.getByRole('region', { name: 'Order summary' }).getByRole('status', { name, exact: true })
  }

  async increase(name: string) {
    await this.page.getByRole('button', { name: `Increase quantity of ${name}` }).click()
  }

  async decrease(name: string) {
    await this.page.getByRole('button', { name: `Decrease quantity of ${name}` }).click()
  }

  async remove(name: string) {
    await this.page.getByRole('button', { name: `Remove ${name}` }).click()
  }

  async goToCheckout() {
    await this.page.getByRole('link', { name: 'Checkout' }).click()
    await expect(this.page).toHaveURL(/\/checkout$/)
  }
}
