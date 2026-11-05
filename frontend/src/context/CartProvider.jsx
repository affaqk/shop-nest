import { useEffect, useState } from 'react'
import { CartContext, getTotals } from './cart'

const STORAGE_KEY = 'cart'

const readStoredCart = () => {
  try {
    const items = JSON.parse(localStorage.getItem(STORAGE_KEY))
    return Array.isArray(items) ? items : []
  } catch {
    return []
  }
}

const CartProvider = ({ children }) => {
  const [items, setItems] = useState(readStoredCart)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // Storage can be full or blocked; the cart still works for this visit
    }
  }, [items])

  // Each item is { _id, title, image, price, quantity }
  const addItem = (product, quantity = 1) => {
    setItems((current) => {
      const existing = current.find((item) => item._id === product._id)
      if (existing) {
        return current.map((item) => (item._id === product._id ? { ...item, quantity: item.quantity + quantity } : item))
      }
      const { _id, title, image, price } = product
      return [...current, { _id, title, image, price: Number(price), quantity }]
    })
  }

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return removeItem(id)
    setItems((current) => current.map((item) => (item._id === id ? { ...item, quantity } : item)))
  }

  const removeItem = (id) => setItems((current) => current.filter((item) => item._id !== id))

  const clearCart = () => setItems([])

  const value = {
    items,
    count: items.reduce((sum, item) => sum + item.quantity, 0),
    totals: getTotals(items),
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export default CartProvider
