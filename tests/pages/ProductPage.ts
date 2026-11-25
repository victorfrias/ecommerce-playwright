import { expect, type Page } from '@playwright/test'

export class ProductPage {
  constructor(private readonly page: Page) {}

  async goto(slug: string) {
    await this.page.goto(`/product/${slug}`)
  }

  quantity() {
    return this.page.getByTestId('pdp-quantity')
  }

  async increase() {
    await this.page.getByRole('button', { name: 'Increase quantity', exact: true }).click()
  }

  async decrease() {
    await this.page.getByRole('button', { name: 'Decrease quantity', exact: true }).click()
  }

  async addToCart() {
    await this.page.getByRole('button', { name: 'Add to cart' }).click()
    await expect(this.page.getByRole('status')).toContainText('Added to cart')
  }

  async viewCart() {
    await this.page.getByRole('link', { name: 'View cart' }).click()
    await expect(this.page).toHaveURL(/\/cart$/)
  }
}
