import { Link } from 'react-router-dom'
import { useCart } from '../cart/CartContext'

export function Header() {
  const { itemCount } = useCart()
  const cartLabel =
    itemCount === 0 ? 'Cart' : `Cart, ${itemCount} ${itemCount === 1 ? 'item' : 'items'}`

  return (
    <header className="site-header">
      <Link to="/" className="logo">
        Halden
      </Link>
      <nav aria-label="Primary">
        <Link to="/shop">Shop</Link>
        <Link to="/cart" aria-label={cartLabel} className="cart-link">
          <span aria-hidden="true">Cart</span>
          {itemCount > 0 && <span className="cart-count">{itemCount}</span>}
        </Link>
      </nav>
    </header>
  )
}
