import { test as base } from '@playwright/test'
import { CartPage } from './pages/CartPage'
import { CheckoutPage } from './pages/CheckoutPage'
import { HomePage } from './pages/HomePage'
import { ProductPage } from './pages/ProductPage'
import { ShopPage } from './pages/ShopPage'

type Fixtures = {
  home: HomePage
  shop: ShopPage
  product: ProductPage
  cart: CartPage
  checkout: CheckoutPage
}

export const test = base.extend<Fixtures>({
  home: async ({ page }, use) => {
    await use(new HomePage(page))
  },
  shop: async ({ page }, use) => {
    await use(new ShopPage(page))
  },
  product: async ({ page }, use) => {
    await use(new ProductPage(page))
  },
  cart: async ({ page }, use) => {
    await use(new CartPage(page))
  },
  checkout: async ({ page }, use) => {
    await use(new CheckoutPage(page))
  },
})

export { expect } from '@playwright/test'
