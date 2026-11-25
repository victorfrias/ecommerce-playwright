import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useCart } from '../cart/CartContext'
import { QuantityControl } from '../components/QuantityControl'
import { ProductArt } from '../components/ProductArt'
import { getProduct } from '../domain/catalog'
import { formatMoney } from '../domain/pricing'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export function ProductPage() {
  const { slug = '' } = useParams()
  const product = getProduct(slug)
  useDocumentTitle(product?.name ?? 'Product not found')
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  if (!product) {
    return (
      <div className="empty-state">
        <h1>Product not found</h1>
        <p>That piece is not in the catalog.</p>
        <Link to="/shop" className="button">
          Back to shop
        </Link>
      </div>
    )
  }

  return (
    <article className="pdp">
      <ProductArt product={product} />
      <div className="pdp-copy">
        <p className="eyebrow">{product.category[0].toUpperCase() + product.category.slice(1)}</p>
        <h1>{product.name}</h1>
        <p className="price price-large">{formatMoney(product.price)}</p>
        <p className="lede">{product.description}</p>
        <p>{product.details}</p>
        <QuantityControl value={quantity} onChange={setQuantity} testId="pdp-quantity" />
        <button
          type="button"
          className="button"
          onClick={() => {
            addItem(product.slug, quantity)
            setAdded(true)
          }}
        >
          Add to cart
        </button>
        {added && (
          <p role="status" className="status">
            Added to cart. <Link to="/cart">View cart</Link>
          </p>
        )}
      </div>
    </article>
  )
}
