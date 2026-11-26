import { Link } from 'react-router-dom'
import { featuredProducts } from '../domain/catalog'
import { ProductCard } from '../components/ProductCard'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export function HomePage() {
  useDocumentTitle('Halden')
  const featured = featuredProducts()

  return (
    <div className="home">
      <section className="hero">
        <p className="eyebrow">House goods, small batch</p>
        <h1>Small goods for a quieter home</h1>
        <p className="lede">
          Ceramics, textiles, and lamps from independent makers. A short catalog, made to be used every day.
        </p>
        <div className="hero-actions">
          <Link to="/shop" className="button">
            Shop the collection
          </Link>
          <Link to="/account" className="button button-secondary">
            User Area
          </Link>
        </div>
      </section>

      <section className="featured" aria-labelledby="featured-heading">
        <div className="section-head">
          <h2 id="featured-heading">Featured</h2>
          <Link to="/shop">View all</Link>
        </div>
        <ul className="product-grid" aria-label="Featured products">
          {featured.map((product) => (
            <li key={product.slug}>
              <ProductCard product={product} heading="h3" />
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
