import { Link } from 'react-router-dom'
import { formatMoney } from '../domain/pricing'
import type { Product } from '../domain/types'
import { ProductArt } from './ProductArt'

const categoryLabel = {
  ceramics: 'Ceramics',
  textiles: 'Textiles',
  lighting: 'Lighting',
} as const

export function ProductCard({ product, heading = 'h2' }: { product: Product; heading?: 'h2' | 'h3' }) {
  const Title = heading
  return (
    <article className="product-card">
      <Link to={`/product/${product.slug}`} aria-label={product.name}>
        <ProductArt product={product} />
        <p className="eyebrow" aria-hidden="true">
          {categoryLabel[product.category]}
        </p>
        <Title>{product.name}</Title>
      </Link>
      <p className="price">{formatMoney(product.price)}</p>
    </article>
  )
}
