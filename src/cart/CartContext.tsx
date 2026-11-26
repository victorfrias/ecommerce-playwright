import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useAuth } from '../auth/AuthContext'
import { getProduct } from '../domain/catalog'
import { digitsOnly } from '../domain/checkout'
import { memberDiscount, orderTotal, shippingFor } from '../domain/pricing'
import type { CartItem, CheckoutInput, Order } from '../domain/types'

const CART_KEY = 'halden-cart'
const ORDER_KEY = 'halden-order'
const MAX_QUANTITY = 9

type CartContextValue = {
  lines: {
    slug: string
    name: string
    unitPrice: number
    quantity: number
    lineTotal: number
  }[]
  itemCount: number
  subtotal: number
  discount: number
  shipping: number
  total: number
  lastOrder: Order | null
  addItem: (slug: string, quantity?: number) => void
  setQuantity: (slug: string, quantity: number) => void
  removeItem: (slug: string) => void
  placeOrder: (input: CheckoutInput) => Order | null
}

const CartContext = createContext<CartContextValue | null>(null)

function readCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as CartItem[]
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (item) =>
        typeof item.slug === 'string' &&
        typeof item.quantity === 'number' &&
        item.quantity > 0 &&
        getProduct(item.slug),
    )
  } catch {
    return []
  }
}

function readOrder(): Order | null {
  try {
    const raw = sessionStorage.getItem(ORDER_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Order
    if (!parsed || typeof parsed.id !== 'string') return null
    return {
      ...parsed,
      discount: typeof parsed.discount === 'number' ? parsed.discount : 0,
    }
  } catch {
    return null
  }
}

function clampQuantity(quantity: number) {
  return Math.min(MAX_QUANTITY, Math.max(1, Math.floor(quantity)))
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { user, isLoggedIn } = useAuth()
  const [items, setItems] = useState<CartItem[]>(readCart)
  const [lastOrder, setLastOrder] = useState<Order | null>(readOrder)

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items))
  }, [items])

  useEffect(() => {
    if (lastOrder) sessionStorage.setItem(ORDER_KEY, JSON.stringify(lastOrder))
  }, [lastOrder])

  const lines = useMemo(
    () =>
      items.flatMap((item) => {
        const product = getProduct(item.slug)
        if (!product) return []
        return [
          {
            slug: product.slug,
            name: product.name,
            unitPrice: product.price,
            quantity: item.quantity,
            lineTotal: product.price * item.quantity,
          },
        ]
      }),
    [items],
  )

  const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0)
  const subtotal = lines.reduce((sum, line) => sum + line.lineTotal, 0)
  const discount = memberDiscount(subtotal, isLoggedIn)
  const shipping = shippingFor(subtotal)
  const total = orderTotal(subtotal, isLoggedIn)

  function addItem(slug: string, quantity = 1) {
    if (!getProduct(slug) || quantity < 1) return
    setItems((current) => {
      const existing = current.find((item) => item.slug === slug)
      if (!existing) return [...current, { slug, quantity: clampQuantity(quantity) }]
      return current.map((item) =>
        item.slug === slug
          ? { ...item, quantity: Math.min(MAX_QUANTITY, item.quantity + quantity) }
          : item,
      )
    })
  }

  function setQuantity(slug: string, quantity: number) {
    setItems((current) =>
      current.map((item) =>
        item.slug === slug ? { ...item, quantity: clampQuantity(quantity) } : item,
      ),
    )
  }

  function removeItem(slug: string) {
    setItems((current) => current.filter((item) => item.slug !== slug))
  }

  function placeOrder(input: CheckoutInput) {
    if (lines.length === 0) return null
    const order: Order = {
      id: `HL-${Math.floor(1000 + Math.random() * 9000)}`,
      name: input.name.trim(),
      email: input.email.trim(),
      address: input.address.trim(),
      city: input.city.trim(),
      postalCode: input.postalCode.trim(),
      cardLast4: digitsOnly(input.cardNumber).slice(-4),
      lines,
      subtotal,
      discount,
      shipping,
      total,
      memberEmail: user?.email,
    }
    setLastOrder(order)
    setItems([])
    return order
  }

  const value = {
    lines,
    itemCount,
    subtotal,
    discount,
    shipping,
    total,
    lastOrder,
    addItem,
    setQuantity,
    removeItem,
    placeOrder,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const value = useContext(CartContext)
  if (!value) throw new Error('useCart must be used within CartProvider')
  return value
}
