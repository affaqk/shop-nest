import { createContext, useContext } from 'react'

export const CartContext = createContext(null)

export const useCart = () => useContext(CartContext)

// Keep these in sync with backend/controllers/orderController.js (the server recalculates the real total)
export const TAX_RATE = 0.08
export const FREE_SHIPPING_MIN = 100
export const SHIPPING_FEE = 9.99

const round = (value) => Math.round(value * 100) / 100

export const getTotals = (items) => {
  const itemsPrice = round(items.reduce((sum, item) => sum + item.price * item.quantity, 0))
  const shippingPrice = !items.length || itemsPrice >= FREE_SHIPPING_MIN ? 0 : SHIPPING_FEE
  const taxPrice = round(itemsPrice * TAX_RATE)
  return { itemsPrice, shippingPrice, taxPrice, totalPrice: round(itemsPrice + shippingPrice + taxPrice) }
}

// Only products from the API can be ordered; home page showcase gadgets are local data
export const isStoreProduct = (product) => /^[0-9a-f]{24}$/i.test(product?._id || '')
