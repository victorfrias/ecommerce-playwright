import type { Product } from '../domain/types'

export function ProductArt({ product }: { product: Product }) {
  return (
    <svg className="product-art" viewBox="0 0 320 400" aria-hidden="true">
      <rect width="320" height="400" fill={product.accent} />
      {product.motif === 'vessel' && <Vessel ink={product.ink} />}
      {product.motif === 'fold' && <Fold ink={product.ink} />}
      {product.motif === 'lamp' && <Lamp ink={product.ink} />}
    </svg>
  )
}

function Vessel({ ink }: { ink: string }) {
  return (
    <g fill="none" stroke={ink} strokeWidth="8">
      <ellipse cx="160" cy="92" rx="54" ry="16" />
      <path d="M106 92 c0 150 18 210 54 210 s54-60 54-210" />
      <path d="M124 250 h72" strokeWidth="6" />
    </g>
  )
}

function Fold({ ink }: { ink: string }) {
  return (
    <g fill={ink} opacity="0.9">
      <rect x="68" y="78" width="150" height="210" rx="6" />
      <rect x="108" y="108" width="150" height="210" rx="6" fill="#f6f1e7" stroke={ink} strokeWidth="6" />
    </g>
  )
}

function Lamp({ ink }: { ink: string }) {
  return (
    <g fill={ink}>
      <path d="M96 150 h128 l-22 78 h-84 z" />
      <rect x="152" y="228" width="16" height="92" />
      <rect x="116" y="318" width="88" height="12" rx="2" />
    </g>
  )
}
