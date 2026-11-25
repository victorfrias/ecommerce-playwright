import { expect, type Page } from '@playwright/test'

export class ShopPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto('/shop')
  }

  productLinks() {
    return this.page.getByRole('list', { name: 'Products' }).getByRole('link')
  }

  productLink(name: string) {
    return this.page.getByRole('list', { name: 'Products' }).getByRole('link', { name, exact: true })
  }

  async openProduct(name: string) {
    await this.productLink(name).click()
    await expect(this.page).toHaveURL(/\/product\//)
  }

  async filterBy(category: string) {
    await this.page.getByRole('group', { name: 'Category' }).getByRole('button', { name: category, exact: true }).click()
  }

  async sortBy(label: string) {
    await this.page.getByLabel('Sort').selectOption({ label })
  }
}
