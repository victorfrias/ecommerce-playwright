// spec: specs/user-area.md
// seed: tests/seed.spec.ts

import { expect, test } from '../fixtures'

const TEST_EMAIL = 'test@user.com'
const TEST_PASSWORD = '123456'

async function login(page: import('@playwright/test').Page) {
  await page.goto('/account')
  await page.getByLabel('Email', { exact: true }).fill(TEST_EMAIL)
  await page.getByLabel('Password', { exact: true }).fill(TEST_PASSWORD)
  await page.getByRole('button', { name: 'Log in', exact: true }).click()
  await expect(page).toHaveURL(/\/shop$/)
}

async function addProduct(page: import('@playwright/test').Page, slug: string) {
  await page.goto(`/product/${slug}`)
  await page.getByRole('button', { name: 'Add to cart' }).click()
  await page.getByRole('link', { name: 'View cart' }).click()
}

 test.describe('User Area authentication', { tag: '@regression' }, () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => {
      localStorage.removeItem('halden-user')
      localStorage.removeItem('halden-cart')
    })
  })

  test('Guest opens User Area and sees login form', async ({ page }) => {
    // 1. Navigate to the guest User Area and inspect the login form and header.
    await page.goto('/account')

    await expect(page).toHaveTitle('User Area')
    await expect(page.getByRole('heading', { level: 1, name: 'Log in' })).toBeVisible()
    await expect(page.getByRole('tab', { name: 'Log in' })).toHaveAttribute('aria-selected', 'true')
    await expect(page.getByRole('tab', { name: 'Create account' })).toBeVisible()
    await expect(page.getByLabel('Email', { exact: true })).toBeVisible()
    await expect(page.getByLabel('Password', { exact: true })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Log in', exact: true })).toBeVisible()
    await expect(page.getByText('Members get a 5% discount on every order. Visitors pay full price.')).toBeVisible()
    await expect(page.getByRole('link', { name: 'User Area', exact: true })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Sign out' })).toHaveCount(0)
  })

  test('Successful login with Test User credentials', async ({ page }) => {
    // 1. Navigate as a guest and verify the default login tab.
    await page.goto('/account')
    await expect(page.getByRole('tab', { name: 'Log in' })).toHaveAttribute('aria-selected', 'true')

    // 2. Enter Test User credentials and submit.
    await page.getByLabel('Email', { exact: true }).fill(TEST_EMAIL)
    await page.getByLabel('Password', { exact: true }).fill(TEST_PASSWORD)
    await page.getByRole('button', { name: 'Log in', exact: true }).click()

    await expect(page).toHaveURL(/\/shop$/)
    await expect(page.getByText('Welcome Test User', { exact: true })).toBeVisible()
    await expect(page.getByRole('link', { name: 'User Area, signed in as Test User' })).toBeVisible()
    await expect.poll(() => page.evaluate(() => localStorage.getItem('halden-user'))).toContain('Test User')

    // 3. Open the signed-in User Area.
    await page.getByRole('link', { name: 'User Area, signed in as Test User' }).click()
    await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible()
    await expect(page.getByText(/Signed in as Test User \(test@user\.com\).*Members save 5%/)).toBeVisible()
    await expect(page.getByRole('button', { name: 'Sign out' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Continue shopping' })).toBeVisible()
  })

  test('Wrong password login failure', async ({ page }) => {
    // 1. Submit Test User email with an incorrect password.
    await page.goto('/account')
    await page.getByLabel('Email', { exact: true }).fill(TEST_EMAIL)
    await page.getByLabel('Password', { exact: true }).fill('wrong-password')
    await page.getByRole('button', { name: 'Log in', exact: true }).click()

    await expect(page).toHaveURL(/\/account$/)
    await expect(page.getByRole('alert')).toHaveText('Email or password is incorrect')
    await expect(page.getByRole('link', { name: 'User Area', exact: true })).toBeVisible()
    await expect.poll(() => page.evaluate(() => localStorage.getItem('halden-user'))).toBeNull()
    await expect(page.getByLabel('Password', { exact: true })).toHaveAttribute('type', 'password')
  })

  test('Unknown email login failure', async ({ page }) => {
    // 1. Submit an unknown email and password.
    await page.goto('/account')
    await page.getByLabel('Email', { exact: true }).fill('nobody@example.com')
    await page.getByLabel('Password', { exact: true }).fill(TEST_PASSWORD)
    await page.getByRole('button', { name: 'Log in', exact: true }).click()

    await expect(page).toHaveURL(/\/account$/)
    await expect(page.getByRole('alert')).toHaveText('Email or password is incorrect')
    await expect(page.getByText('Welcome Test User', { exact: true })).toHaveCount(0)
  })

  test('Login email validation', async ({ page }) => {
    // 1. Submit with an empty email and a password.
    await page.goto('/account')
    await page.getByLabel('Password', { exact: true }).fill(TEST_PASSWORD)
    await page.getByRole('button', { name: 'Log in', exact: true }).click()
    await expect(page.getByRole('alert')).toHaveText('Enter a valid email')

    // 2. Repeat with an invalid email.
    await page.getByLabel('Email', { exact: true }).fill('test-user')
    await page.getByRole('button', { name: 'Log in', exact: true }).click()
    await expect(page.getByRole('alert')).toHaveText('Enter a valid email')
    await expect(page.getByRole('link', { name: 'User Area', exact: true })).toBeVisible()
  })

  test('Login password validation', async ({ page }) => {
    // 1. Submit with email and an empty password.
    await page.goto('/account')
    await page.getByLabel('Email', { exact: true }).fill(TEST_EMAIL)
    await page.getByRole('button', { name: 'Log in', exact: true }).click()

    await expect(page).toHaveURL(/\/account$/)
    await expect(page.getByRole('alert')).toHaveText('Enter your password')
    await expect(page.getByRole('link', { name: 'User Area', exact: true })).toBeVisible()
  })

  test('Switch between Log in and Create account tabs', async ({ page }) => {
    // 1. Switch between account modes and verify tab and field state.
    await page.goto('/account')
    await page.getByRole('tab', { name: 'Create account' }).click()
    await expect(page.getByRole('tab', { name: 'Create account' })).toHaveAttribute('aria-selected', 'true')
    await expect(page.getByRole('tab', { name: 'Log in' })).toHaveAttribute('aria-selected', 'false')
    await expect(page.getByRole('heading', { name: 'Create account' })).toBeVisible()
    await expect(page.getByLabel('Name', { exact: true })).toBeVisible()
    await expect(page.getByLabel('Email', { exact: true })).toBeVisible()
    await expect(page.getByLabel('Password', { exact: true })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Create account', exact: true })).toBeVisible()

    // 2. Clear errors and switch back to Log in.
    await page.getByRole('button', { name: 'Create account', exact: true }).click()
    await expect(page.getByRole('alert')).toHaveText('Enter your full name')
    await page.getByRole('tab', { name: 'Log in' }).click()
    await expect(page.getByRole('alert')).toHaveCount(0)
    await expect(page.getByLabel('Name', { exact: true })).toHaveCount(0)
  })

  test('Create account validation', async ({ page }) => {
    // 1. Submit empty Name, invalid Email, and a short password.
    await page.goto('/account')
    await page.getByRole('tab', { name: 'Create account' }).click()
    await page.getByLabel('Email', { exact: true }).fill('bad-email')
    await page.getByLabel('Password', { exact: true }).fill('123')
    await page.getByRole('button', { name: 'Create account', exact: true }).click()
    await expect(page.getByRole('alert')).toHaveText('Enter your full name')

    // 2. Enter a Name and submit invalid email with a valid password.
    await page.getByLabel('Name', { exact: true }).fill('Ada Lovelace')
    await page.getByLabel('Password', { exact: true }).fill('123456')
    await page.getByRole('button', { name: 'Create account', exact: true }).click()
    await expect(page.getByRole('alert')).toHaveText('Enter a valid email')

    // 3. Enter valid Name and Email but a short password.
    await page.getByLabel('Email', { exact: true }).fill('ada@example.com')
    await page.getByLabel('Password', { exact: true }).fill('123')
    await page.getByRole('button', { name: 'Create account', exact: true }).click()
    await expect(page.getByRole('alert')).toHaveText('Password must be at least 6 characters')
  })

  test('Create account rejects duplicate email', async ({ page }) => {
    // 1. Attempt to register the existing Test User email.
    await page.goto('/account')
    await page.getByRole('tab', { name: 'Create account' }).click()
    await page.getByLabel('Name', { exact: true }).fill('Test User')
    await page.getByLabel('Email', { exact: true }).fill(TEST_EMAIL)
    await page.getByLabel('Password', { exact: true }).fill(TEST_PASSWORD)
    await page.getByRole('button', { name: 'Create account', exact: true }).click()

    await expect(page.getByRole('alert')).toHaveText('An account with this email already exists')
    await expect(page.getByRole('heading', { name: 'Create account' })).toBeVisible()
    await expect(page.getByText('Welcome Test User', { exact: true })).toHaveCount(0)
  })

  test('Sign out from signed-in User Area', async ({ page }) => {
    // 1. Log in and open the account page.
    await login(page)
    await page.goto('/account')
    await expect(page.getByText(/Signed in as Test User \(test@user\.com\)/)).toBeVisible()

    // 2. Sign out and verify guest state.
    await page.getByRole('button', { name: 'Sign out' }).click()
    await expect(page.getByRole('heading', { name: 'Log in' })).toBeVisible()
    await expect(page.getByRole('tab', { name: 'Create account' })).toBeVisible()
    await expect(page.getByRole('tab', { name: 'Log in' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'User Area', exact: true })).toBeVisible()
    await expect.poll(() => page.evaluate(() => localStorage.getItem('halden-user'))).toBeNull()
    await expect(page.getByRole('button', { name: 'Sign out' })).toHaveCount(0)
  })

  test('Successful login persists after reload', async ({ page }) => {
    // 1. Log in and reload, then verify account and shop/cart navigation retain state.
    await login(page)
    await page.reload()
    await expect(page.getByText('Welcome Test User', { exact: true })).toBeVisible()

    await page.goto('/account')
    await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible()
    await page.goto('/shop')
    await expect(page.getByText('Welcome Test User', { exact: true })).toBeVisible()
    await page.goto('/cart')
    await expect(page.getByText('Welcome Test User', { exact: true })).toBeVisible()
  })

  test('Member discount applies in cart and checkout', async ({ page, cart, checkout }) => {
    // 1. Add Stoneware Pourer while logged out and verify full-price totals.
    await addProduct(page, 'stoneware-pourer')
    await expect(page).toHaveURL(/\/cart$/)
    await expect(cart.summary('Subtotal')).toHaveText('$48.00')
    await expect(cart.summary('Member discount')).toHaveCount(0)
    await expect(cart.summary('Shipping')).toHaveText('$8.00')
    await expect(cart.summary('Total')).toHaveText('$56.00')

    // 2. Log in and verify the 5% discount.
    await login(page)
    await page.goto('/cart')
    await expect(cart.summary('Subtotal')).toHaveText('$48.00')
    await expect(cart.summary('Member discount')).toHaveText('-$2.40')
    await expect(cart.summary('Shipping')).toHaveText('$8.00')
    await expect(cart.summary('Total')).toHaveText('$53.60')
    await expect(page.getByText('Logged-in members save 5% on this order.')).toBeVisible()

    // 3. Open checkout and verify member details and summary.
    await cart.goToCheckout()
    await expect(checkout.field('Full name')).toHaveValue('Test User')
    await expect(checkout.field('Email')).toHaveValue(TEST_EMAIL)
    await expect(checkout.summary('Member discount')).toHaveText('-$2.40')
    await expect(checkout.summary('Total')).toHaveText('$53.60')
    await expect(page.getByText('Welcome Test User', { exact: true })).toBeVisible()
  })

  test('Five percent discount updates with cart contents', async ({ page, cart }) => {
    // 1. Log in and add Wool Cushion.
    await login(page)
    await addProduct(page, 'wool-cushion')
    await expect(cart.summary('Subtotal')).toHaveText('$42.00')
    await expect(cart.summary('Member discount')).toHaveText('-$2.10')
    await expect(cart.summary('Shipping')).toHaveText('$8.00')
    await expect(cart.summary('Total')).toHaveText('$47.90')

    // 2. Increase the quantity to 2.
    await cart.increase('Wool Cushion')
    await expect(cart.summary('Subtotal')).toHaveText('$84.00')
    await expect(cart.summary('Member discount')).toHaveText('-$4.20')
    await expect(cart.summary('Shipping')).toHaveText('Free')
    await expect(cart.summary('Total')).toHaveText('$79.80')

    // 3. Sign out and verify the discount is removed without changing the cart.
    await page.goto('/account')
    await page.getByRole('button', { name: 'Sign out' }).click()
    await page.goto('/cart')
    await expect(cart.summary('Member discount')).toHaveCount(0)
    await expect(cart.summary('Shipping')).toHaveText('Free')
    await expect(cart.summary('Total')).toHaveText('$84.00')
    await expect(page.getByRole('link', { name: 'User Area', exact: true })).toBeVisible()
  })

  test('Member details prefill checkout', async ({ page, checkout }) => {
    // 1. Log in, add a product, and open checkout.
    await login(page)
    await addProduct(page, 'stoneware-pourer')
    await page.goto('/checkout')

    await expect(checkout.field('Full name')).toHaveValue('Test User')
    await expect(checkout.field('Email')).toHaveValue(TEST_EMAIL)
    await checkout.field('Full name').fill('Edited Name')
    await checkout.field('Email').fill('edited@example.com')
    await expect(checkout.field('Full name')).toHaveValue('Edited Name')
    await expect(checkout.field('Email')).toHaveValue('edited@example.com')

    // 2. Complete checkout without reentering account identity.
    await checkout.fillValid({ name: 'Test User', email: TEST_EMAIL, address: '12 Test Street', city: 'Testville', postalCode: '12345', cardNumber: '4242 4242 4242 4242', expiry: '12/30', cvc: '123' })
    await checkout.placeOrder()
    await expect(page).toHaveURL(/\/order-confirmation$/)
  })

  test('Continue shopping and account navigation', async ({ page }) => {
    // 1. Log in, open account, and continue shopping.
    await login(page)
    await page.goto('/account')
    await page.getByRole('link', { name: 'Continue shopping' }).click()
    await expect(page).toHaveURL(/\/shop$/)
    await expect(page.getByText('Welcome Test User', { exact: true })).toBeVisible()

    // 2. Revisit account directly and use browser navigation.
    await page.goto('/account')
    await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible()
    await expect(page.getByRole('tab', { name: 'Log in' })).toHaveCount(0)
    await page.goBack()
    await page.goForward()
    await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible()
  })

  test('Direct account access while logged in', async ({ page }) => {
    // 1. Log in, then visit /account directly.
    await login(page)
    await page.goto('/account')

    await expect(page.getByRole('tab', { name: 'Log in' })).toHaveCount(0)
    await expect(page.getByRole('tab', { name: 'Create account' })).toHaveCount(0)
    await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible()
    await expect(page.getByText(/Test User \(test@user\.com\)/)).toBeVisible()
    await expect(page.getByRole('button', { name: 'Sign out' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Continue shopping' })).toBeVisible()
  })

  test('Malformed stored session fallback', async ({ page }) => {
    // 1. Set malformed session variants and reload the account page.
    await page.goto('/account')

    for (const raw of ['{bad json', '{}', '{"name":"Test User"}']) {
      await page.addInitScript((value) => {
        localStorage.setItem('halden-user', value)
      }, raw)
      await page.reload()

      await expect(page.getByRole('heading', { name: 'Log in' })).toBeVisible()
      await expect(page.getByRole('tab', { name: 'Log in' })).toBeVisible()
      await expect(page.getByRole('tab', { name: 'Create account' })).toBeVisible()
      await expect(page.getByRole('link', { name: 'User Area', exact: true })).toBeVisible()
    }
  })
})
