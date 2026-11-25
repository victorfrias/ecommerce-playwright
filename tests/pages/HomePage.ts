import { expect, type Page } from '@playwright/test'

export class HomePage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto('/')
  }

  async shopTheCollection() {
    await this.page.getByRole('link', { name: 'Shop the collection' }).click()
    await expect(this.page).toHaveURL(/\/shop$/)
  }
}
