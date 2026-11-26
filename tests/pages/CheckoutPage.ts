import type { Page } from '@playwright/test'

export const validCustomer = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  address: '12 Analytical Engine Way',
  city: 'London',
  postalCode: 'W1A 1AA',
  cardNumber: '4242 4242 4242 4242',
  expiry: '12/30',
  cvc: '123',
}

export class CheckoutPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto('/checkout')
  }

  summary(name: 'Subtotal' | 'Member discount' | 'Shipping' | 'Total') {
    return this.page.getByRole('region', { name: 'Order summary' }).getByRole('status', { name, exact: true })
  }

  field(label: string) {
    return this.page.getByLabel(label, { exact: true })
  }

  async fillValid(overrides: Partial<typeof validCustomer> = {}) {
    const customer = { ...validCustomer, ...overrides }
    await this.page.getByLabel('Full name').fill(customer.name)
    await this.page.getByLabel('Email').fill(customer.email)
    await this.page.getByLabel('Street address').fill(customer.address)
    await this.page.getByLabel('City').fill(customer.city)
    await this.page.getByLabel('Postal code').fill(customer.postalCode)
    await this.page.getByLabel('Card number').fill(customer.cardNumber)
    await this.page.getByLabel('Expiry').fill(customer.expiry)
    await this.page.getByLabel('CVC').fill(customer.cvc)
  }

  async placeOrder() {
    await this.page.getByRole('button', { name: 'Place order' }).click()
  }
}
