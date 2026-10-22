import { createContext, useContext, useEffect, useState } from 'react'

const ShopContext = createContext(null)

const load = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? []
  } catch {
    return []
  }
}

export const ShopProvider = ({ children }) => {
  const [cart, setCart] = useState(() => load('cart'))
  const [wishlist, setWishlist] = useState(() => load('wishlist'))
  const [coupon, setCoupon] = useState(null)

  useEffect(() => localStorage.setItem('cart', JSON.stringify(cart)), [cart])
  useEffect(() => localStorage.setItem('wishlist', JSON.stringify(wishlist)), [wishlist])

  const addToCart = (product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        return prev.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item))
      }
      return [...prev, { id: product.id, name: product.name, price: product.price, image: product.images[0], quantity }]
    })
  }

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return removeFromCart(id)
    setCart((prev) => prev.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  const removeFromCart = (id) => setCart((prev) => prev.filter((item) => item.id !== id))

  const clearCart = () => {
    setCart([])
    setCoupon(null)
  }

  // Coupon validation is local for now; move it to the API when available
  const applyCoupon = (code) => {
    const valid = code.trim().toUpperCase() === 'WELCOME10'
    setCoupon(valid ? { code: 'WELCOME10', percent: 10 } : null)
    return valid
  }

  const toggleWishlist = (product) => {
    setWishlist((prev) =>
      prev.some((p) => p.id === product.id) ? prev.filter((p) => p.id !== product.id) : [...prev, product],
    )
  }

  const isInWishlist = (id) => wishlist.some((p) => p.id === id)

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal === 0 || subtotal >= 50 ? 0 : 7.99
  const discount = coupon ? (subtotal * coupon.percent) / 100 : 0
  const tax = (subtotal - discount) * 0.08
  const total = subtotal - discount + shipping + tax

  return (
    <ShopContext.Provider
      value={{
        cart,
        wishlist,
        cartCount,
        subtotal,
        shipping,
        tax,
        total,
        coupon,
        discount,
        applyCoupon,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        toggleWishlist,
        isInWishlist,
      }}
    >
      {children}
    </ShopContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useShop = () => useContext(ShopContext)
