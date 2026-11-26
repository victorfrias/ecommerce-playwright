import { Link } from 'react-router-dom'
import { useCart } from '../cart/CartContext'
import { formatMoney } from '../domain/pricing'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export function ConfirmationPage() {
  useDocumentTitle('Order confirmed')
  const { lastOrder } = useCart()

  if (!lastOrder) {
    return (
      <div className="empty-state">
        <h1>No order to show</h1>
        <p>Place an order and the receipt will stay in this tab.</p>
        <Link to="/shop" className="button">
          Browse the shop
        </Link>
      </div>
    )
  }

  return (
    <div className="confirmation">
      <p className="eyebrow">Thank you</p>
      <h1>Order confirmed</h1>
      <p>
        Order number <strong>{lastOrder.id}</strong>
      </p>
      <p>
        A receipt will be sent to <strong>{lastOrder.email}</strong>. Card ending {lastOrder.cardLast4}.
      </p>
      <ul className="confirm-lines" aria-label="Ordered items">
        {lastOrder.lines.map((line) => (
          <li key={line.slug}>
            <span>
              {line.name} × {line.quantity}
            </span>
            <span>{formatMoney(line.lineTotal)}</span>
          </li>
        ))}
      </ul>
      {lastOrder.discount > 0 && (
        <p>
          Member discount <strong>-{formatMoney(lastOrder.discount)}</strong>
        </p>
      )}
      <p className="confirm-total">
        Total <strong>{formatMoney(lastOrder.total)}</strong>
      </p>
      <p>
        Shipping to {lastOrder.address}, {lastOrder.city} {lastOrder.postalCode}.
      </p>
      <Link to="/shop" className="button">
        Back to shop
      </Link>
    </div>
  )
}
