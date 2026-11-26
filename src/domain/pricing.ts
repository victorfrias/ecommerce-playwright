export const FREE_SHIPPING_CENTS = 7500
export const SHIPPING_CENTS = 800
export const MEMBER_DISCOUNT_RATE = 0.05

export function formatMoney(cents: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100)
}

export function shippingFor(subtotalCents: number) {
  if (subtotalCents <= 0) return 0
  if (subtotalCents >= FREE_SHIPPING_CENTS) return 0
  return SHIPPING_CENTS
}

export function formatShipping(subtotalCents: number) {
  const shipping = shippingFor(subtotalCents)
  if (subtotalCents > 0 && shipping === 0) return 'Free'
  return formatMoney(shipping)
}

export function memberDiscount(subtotalCents: number, isLoggedIn: boolean) {
  if (!isLoggedIn || subtotalCents <= 0) return 0
  return Math.round(subtotalCents * MEMBER_DISCOUNT_RATE)
}

export function orderTotal(subtotalCents: number, isLoggedIn: boolean) {
  const discount = memberDiscount(subtotalCents, isLoggedIn)
  const shipping = shippingFor(subtotalCents)
  return subtotalCents - discount + shipping
}
