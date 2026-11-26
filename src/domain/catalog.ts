import type { Category, Product } from './types'

export const products: Product[] = [
  {
    slug: 'stoneware-pourer',
    name: 'Stoneware Pourer',
    category: 'ceramics',
    price: 4800,
    description: 'A wide-lipped pourer for oil or cream, finished in a satin glaze.',
    details: 'Thrown stoneware, about 12 cm tall. Dishwasher safe. Each piece varies slightly in speckle.',
    accent: '#77a4cf',
    ink: '#1d4f82',
    motif: 'vessel',
    featured: true,
  },
  {
    slug: 'speckled-bowl',
    name: 'Speckled Bowl',
    category: 'ceramics',
    price: 3600,
    description: 'An everyday bowl, deep enough for noodles.',
    details: 'Glossy interior, unglazed foot. Holds about 700 ml.',
    accent: '#bdd1e7',
    ink: '#3b638d',
    motif: 'vessel',
    featured: true,
  },
  {
    slug: 'tall-vase',
    name: 'Tall Vase',
    category: 'ceramics',
    price: 6400,
    description: 'A narrow neck for a few branches.',
    details: 'Reduction fired so the rim flashes iron. 28 cm tall.',
    accent: '#3d79a8',
    ink: '#102f53',
    motif: 'vessel',
    featured: false,
  },
  {
    slug: 'espresso-set',
    name: 'Espresso Cup Set',
    category: 'ceramics',
    price: 3200,
    description: 'Two cups and saucers with thick, comfortable walls.',
    details: 'Sold as a pair. 80 ml each. The saucers stack.',
    accent: '#1e3a5f',
    ink: '#091a2d',
    motif: 'vessel',
    featured: false,
  },
  {
    slug: 'linen-throw',
    name: 'Linen Throw',
    category: 'textiles',
    price: 8800,
    description: 'Stonewashed linen in oat, light enough for summer.',
    details: '140 × 200 cm. Washed once so it drapes. Gets softer from here.',
    accent: '#dceafa',
    ink: '#587da3',
    motif: 'fold',
    featured: true,
  },
  {
    slug: 'wool-cushion',
    name: 'Wool Cushion',
    category: 'textiles',
    price: 4200,
    description: 'A dense wool square in moss, cover and pad together.',
    details: '45 × 45 cm. Cover unzips. Spot clean.',
    accent: '#4f7598',
    ink: '#183b63',
    motif: 'fold',
    featured: false,
  },
  {
    slug: 'table-runner',
    name: 'Table Runner',
    category: 'textiles',
    price: 3800,
    description: 'A hand-hemmed runner in clay red.',
    details: '40 × 180 cm. Meant to sit under a bowl, not a full place setting.',
    accent: '#315f8c',
    ink: '#10233f',
    motif: 'fold',
    featured: false,
  },
  {
    slug: 'brass-task-lamp',
    name: 'Brass Task Lamp',
    category: 'lighting',
    price: 12000,
    description: 'An adjustable arm and a linen shade for a desk or bedside.',
    details: 'Warm 2700K bulb included. Arm reach 40 cm.',
    accent: '#91b4d5',
    ink: '#315f8c',
    motif: 'lamp',
    featured: true,
  },
  {
    slug: 'paper-lantern',
    name: 'Paper Lantern',
    category: 'lighting',
    price: 5400,
    description: 'Rice paper over a bamboo rib. Soft light, no glare.',
    details: '28 cm across. Cord is 2 m. Shade is replaceable.',
    accent: '#edf4fa',
    ink: '#668bb0',
    motif: 'lamp',
    featured: false,
  },
  {
    slug: 'arc-floor-lamp',
    name: 'Arc Floor Lamp',
    category: 'lighting',
    price: 21000,
    description: 'A long arm that reaches over a chair.',
    details: 'Marble base, blackened steel stem. Shade sold with the lamp.',
    accent: '#0f2a49',
    ink: '#071729',
    motif: 'lamp',
    featured: false,
  },
]

export const categoryFilters: { id: Category | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'ceramics', label: 'Ceramics' },
  { id: 'textiles', label: 'Textiles' },
  { id: 'lighting', label: 'Lighting' },
]

export const sortOptions = [
  { id: 'featured', label: 'Featured' },
  { id: 'price-asc', label: 'Price: low to high' },
  { id: 'price-desc', label: 'Price: high to low' },
] as const

export type SortId = (typeof sortOptions)[number]['id']

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug)
}

export function featuredProducts() {
  return products.filter((product) => product.featured)
}

export function listProducts(category: string, sort: string) {
  const known = categoryFilters.some((item) => item.id === category)
  const filtered =
    !known || category === 'all'
      ? [...products]
      : products.filter((product) => product.category === category)

  if (sort === 'price-asc') {
    filtered.sort((a, b) => a.price - b.price || a.name.localeCompare(b.name))
  } else if (sort === 'price-desc') {
    filtered.sort((a, b) => b.price - a.price || a.name.localeCompare(b.name))
  }

  return filtered
}
