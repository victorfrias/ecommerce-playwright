import { FREE_SHIPPING_CENTS, formatMoney, formatShipping } from '../domain/pricing'

type OrderSummaryProps = {
  subtotal: number
  discount: number
  shipping: number
  total: number
}

export function OrderSummary({ subtotal, discount, shipping, total }: OrderSummaryProps) {
  return (
    <section className="summary" aria-label="Order summary">
      <h2>Summary</h2>
      <label className="summary-row">
        <span>Subtotal</span>
        <output>{formatMoney(subtotal)}</output>
      </label>
      {discount > 0 && (
        <label className="summary-row">
          <span>Member discount</span>
          <output>−{formatMoney(discount)}</output>
        </label>
      )}
      <label className="summary-row">
        <span>Shipping</span>
        <output>{formatShipping(subtotal)}</output>
      </label>
      <label className="summary-row summary-total">
        <span>Total</span>
        <output>{formatMoney(total)}</output>
      </label>
      <p className="summary-note">
        {discount > 0
          ? 'Logged-in members save 5% on this order.'
          : shipping === 0
            ? 'This order ships free.'
            : `Add ${formatMoney(FREE_SHIPPING_CENTS - subtotal)} for free shipping.`}
      </p>
    </section>
  )
}
