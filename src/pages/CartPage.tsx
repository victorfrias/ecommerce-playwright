import { Link } from 'react-router-dom'
import { useCart } from '../cart/CartContext'
import { OrderSummary } from '../components/OrderSummary'
import { ProductArt } from '../components/ProductArt'
import { QuantityControl } from '../components/QuantityControl'
import { getProduct } from '../domain/catalog'
import { formatMoney } from '../domain/pricing'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export function CartPage() {
  useDocumentTitle('Cart')
  const { lines, subtotal, discount, shipping, total, setQuantity, removeItem } = useCart()

  return (
    <div className="cart-page">
      <header className="page-intro">
        <p className="eyebrow">Bag</p>
        <h1>Your cart</h1>
      </header>

      {lines.length === 0 ? (
        <div className="empty-state">
          <p>Your cart is empty.</p>
          <Link to="/shop" className="button">
            Browse the shop
          </Link>
        </div>
      ) : (
        <div className="split">
          <ul className="cart-list" aria-label="Cart items">
            {lines.map((line) => {
              const product = getProduct(line.slug)
              return (
                <li key={line.slug}>
                  {product && <ProductArt product={product} />}
                  <div>
                    <h2>{line.name}</h2>
                    <p className="price">{formatMoney(line.unitPrice)}</p>
                    <QuantityControl
                      value={line.quantity}
                      productName={line.name}
                      testId={`qty-${line.slug}`}
                      onChange={(quantity) => setQuantity(line.slug, quantity)}
                    />
                    <button type="button" className="text-button" onClick={() => removeItem(line.slug)}>
                      Remove {line.name}
                    </button>
                  </div>
                  <p className="line-total">{formatMoney(line.lineTotal)}</p>
                </li>
              )
            })}
          </ul>
          <div className="summary-column">
            <OrderSummary subtotal={subtotal} discount={discount} shipping={shipping} total={total} />
            <Link to="/checkout" className="button">
              Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
