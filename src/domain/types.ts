export type Category = 'ceramics' | 'textiles' | 'lighting'

export type Motif = 'vessel' | 'fold' | 'lamp'

export type Product = {
  slug: string
  name: string
  category: Category
  price: number
  description: string
  details: string
  accent: string
  ink: string
  motif: Motif
  featured: boolean
}

export type CartItem = {
  slug: string
  quantity: number
}

export type OrderLine = {
  slug: string
  name: string
  quantity: number
  unitPrice: number
  lineTotal: number
}

export type Order = {
  id: string
  name: string
  email: string
  address: string
  city: string
  postalCode: string
  cardLast4: string
  lines: OrderLine[]
  subtotal: number
  discount: number
  shipping: number
  total: number
  memberEmail?: string
}

export type CheckoutInput = {
  name: string
  email: string
  address: string
  city: string
  postalCode: string
  cardNumber: string
  expiry: string
  cvc: string
}

export type CheckoutField = keyof CheckoutInput

export type CheckoutErrors = Partial<Record<CheckoutField, string>>
