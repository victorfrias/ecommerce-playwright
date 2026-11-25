export const FREE_SHIPPING_CENTS = 7500
export const SHIPPING_CENTS = 800

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
