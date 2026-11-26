import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { useCart } from '../cart/CartContext'

export function Header() {
  const { itemCount } = useCart()
  const { user, isLoggedIn } = useAuth()
  const cartLabel =
    itemCount === 0 ? 'Cart' : `Cart, ${itemCount} ${itemCount === 1 ? 'item' : 'items'}`
  const accountLabel = isLoggedIn ? `User Area, signed in as ${user?.name}` : 'User Area'

  return (
    <header className="site-header">
      <Link to="/" className="logo">
        Halden
      </Link>
      <nav aria-label="Primary">
        <Link to="/account" aria-label={accountLabel}>
          {isLoggedIn ? `Welcome ${user?.name}` : 'User Area'}
        </Link>
        <Link to="/shop">Shop</Link>
        <Link to="/cart" aria-label={cartLabel} className="cart-link">
          <span aria-hidden="true">Cart</span>
          {itemCount > 0 && <span className="cart-count">{itemCount}</span>}
        </Link>
      </nav>
    </header>
  )
}
