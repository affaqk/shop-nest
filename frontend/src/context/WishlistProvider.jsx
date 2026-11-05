import { useEffect, useState } from 'react'
import { WishlistContext } from './wishlist'
import { useAuth } from './auth'
import * as api from '../api'

// The wishlist is saved on the user's account, so it needs a logged-in user
const WishlistProvider = ({ children }) => {
  const { user } = useAuth()
  const userId = user?._id
  // `userId` remembers whose wishlist this is, so logging out (or switching accounts) hides it at once
  const [data, setData] = useState({ userId: null, items: [] })
  const loaded = Boolean(userId) && data.userId === userId
  const items = loaded ? data.items : []

  useEffect(() => {
    if (!userId) return
    let ignore = false
    api
      .getWishlist()
      .then((list) => !ignore && setData({ userId, items: list }))
      .catch(() => !ignore && setData({ userId, items: [] }))
    return () => {
      ignore = true
    }
  }, [userId])

  const has = (productId) => items.some((p) => p._id === productId)

  // Updates the UI right away, then replaces it with the server's list (or rolls back on failure)
  const toggle = async (product) => {
    const previous = items
    const removing = has(product._id)
    setData({ userId, items: removing ? items.filter((p) => p._id !== product._id) : [...items, product] })
    try {
      const list = removing ? await api.removeFromWishlist(product._id) : await api.addToWishlist(product._id)
      setData({ userId, items: list })
    } catch {
      setData({ userId, items: previous })
    }
  }

  const value = { items, count: items.length, loading: Boolean(userId) && !loaded, has, toggle }

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

export default WishlistProvider
