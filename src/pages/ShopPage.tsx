import { useSearchParams } from 'react-router-dom'
import { categoryFilters, listProducts, sortOptions, type SortId } from '../domain/catalog'
import { ProductCard } from '../components/ProductCard'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export function ShopPage() {
  useDocumentTitle('Shop')
  const [params, setParams] = useSearchParams()
  const category = params.get('category') ?? 'all'
  const sort = params.get('sort') ?? 'featured'
  const visible = listProducts(category, sort)

  function update(key: 'category' | 'sort', value: string, fallback: string) {
    const next = new URLSearchParams(params)
    if (value === fallback) next.delete(key)
    else next.set(key, value)
    setParams(next)
  }

  return (
    <div className="shop">
      <header className="page-intro">
        <p className="eyebrow">Catalog</p>
        <h1>The collection</h1>
      </header>

      <div className="toolbar">
        <div className="filters" role="group" aria-label="Category">
          {categoryFilters.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={(category || 'all') === item.id}
              onClick={() => update('category', item.id, 'all')}
            >
              {item.label}
            </button>
          ))}
        </div>
        <label className="sort">
          Sort
          <select
            value={sortOptions.some((option) => option.id === sort) ? sort : 'featured'}
            onChange={(event) => update('sort', event.target.value as SortId, 'featured')}
          >
            {sortOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="result-count">
        {visible.length} {visible.length === 1 ? 'product' : 'products'}
      </p>

      <ul className="product-grid" aria-label="Products">
        {visible.map((product) => (
          <li key={product.slug}>
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
    </div>
  )
}
