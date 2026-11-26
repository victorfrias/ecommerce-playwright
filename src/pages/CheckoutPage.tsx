import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { useCart } from '../cart/CartContext'
import { OrderSummary } from '../components/OrderSummary'
import { emptyCheckout, validateCheckout } from '../domain/checkout'
import type { CheckoutErrors, CheckoutInput } from '../domain/types'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export function CheckoutPage() {
  useDocumentTitle('Checkout')
  const { user } = useAuth()
  const { lines, subtotal, discount, shipping, total, placeOrder } = useCart()
  const navigate = useNavigate()
  const [form, setForm] = useState<CheckoutInput>(() => ({
    ...emptyCheckout(),
    name: user?.name ?? '',
    email: user?.email ?? '',
  }))
  const [errors, setErrors] = useState<CheckoutErrors>({})

  useEffect(() => {
    if (!user) return
    setForm((current) => ({
      ...current,
      name: current.name || user.name,
      email: current.email || user.email,
    }))
  }, [user])

  if (lines.length === 0) {
    return (
      <div className="empty-state">
        <h1>Your cart is empty</h1>
        <p>Add something from the shop before checkout.</p>
        <Link to="/shop" className="button">
          Browse the shop
        </Link>
      </div>
    )
  }

  function update(field: keyof CheckoutInput, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validateCheckout(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return
    const order = placeOrder(form)
    if (!order) return
    navigate('/order-confirmation')
  }

  return (
    <div className="checkout">
      <header className="page-intro">
        <p className="eyebrow">Demo checkout</p>
        <h1>Checkout</h1>
        <p>Use any 16-digit card. Nothing is charged.</p>
      </header>
      <div className="split">
        <form noValidate onSubmit={onSubmit} className="checkout-form">
          <Field label="Full name" error={errors.name}>
            {(props) => (
              <input
                {...props}
                autoComplete="name"
                placeholder="Your Full Name"
                value={form.name}
                onChange={(event) => update('name', event.target.value)}
              />
            )}
          </Field>
          <Field label="Email" error={errors.email}>
            {(props) => (
              <input
                {...props}
                type="email"
                autoComplete="email"
                placeholder="Your Email"
                value={form.email}
                onChange={(event) => update('email', event.target.value)}
              />
            )}
          </Field>
          <Field label="Street address" error={errors.address}>
            {(props) => (
              <input
                {...props}
                autoComplete="street-address"
                placeholder="Your Street Address"
                value={form.address}
                onChange={(event) => update('address', event.target.value)}
              />
            )}
          </Field>
          <div className="field-row">
            <Field label="City" error={errors.city}>
              {(props) => (
                <input
                  {...props}
                  autoComplete="address-level2"
                  placeholder="Your City"
                  value={form.city}
                  onChange={(event) => update('city', event.target.value)}
                />
              )}
            </Field>
            <Field label="Postal code" error={errors.postalCode}>
              {(props) => (
                <input
                  {...props}
                  autoComplete="postal-code"
                  placeholder="Your Postal Code"
                  value={form.postalCode}
                  onChange={(event) => update('postalCode', event.target.value)}
                />
              )}
            </Field>
          </div>
          <Field label="Card number" error={errors.cardNumber}>
            {(props) => (
              <input
                {...props}
                inputMode="numeric"
                autoComplete="cc-number"
                placeholder="0000 0000 0000 0000"
                value={form.cardNumber}
                onChange={(event) => update('cardNumber', event.target.value)}
              />
            )}
          </Field>
          <div className="field-row">
            <Field label="Expiry" error={errors.expiry}>
              {(props) => (
                <input
                  {...props}
                  autoComplete="cc-exp"
                  placeholder="MM/YY"
                  value={form.expiry}
                  onChange={(event) => update('expiry', event.target.value)}
                />
              )}
            </Field>
            <Field label="CVC" error={errors.cvc}>
              {(props) => (
                <input
                  {...props}
                  inputMode="numeric"
                  autoComplete="cc-csc"
                  value={form.cvc}
                  onChange={(event) => update('cvc', event.target.value)}
                />
              )}
            </Field>
          </div>
          <button type="submit" className="button">
            Place order
          </button>
        </form>
        <OrderSummary subtotal={subtotal} discount={discount} shipping={shipping} total={total} />
      </div>
    </div>
  )
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: (props: { id: string; 'aria-invalid': boolean; 'aria-describedby'?: string }) => ReactNode
}) {
  const id = label.toLowerCase().replace(/[^a-z]+/g, '-')
  const errorId = `${id}-error`
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {children({
        id,
        'aria-invalid': Boolean(error),
        'aria-describedby': error ? errorId : undefined,
      })}
      {error && (
        <p id={errorId} role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
