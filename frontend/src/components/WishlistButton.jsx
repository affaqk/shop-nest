import { useLocation, useNavigate } from 'react-router'
import { FiHeart } from 'react-icons/fi'
import { useAuth } from '../context/auth'
import { useWishlist } from '../context/wishlist'
import { isStoreProduct } from '../context/cart'

const WishlistButton = ({ product, className = '', iconClassName = 'h-4 w-4' }) => {
  const { user } = useAuth()
  const { has, toggle } = useWishlist()
  const navigate = useNavigate()
  const location = useLocation()

  // Showcase gadgets aren't real products, so they can't be saved
  if (!isStoreProduct(product)) return null

  const saved = has(product._id)

  const handleClick = () => {
    // Guests log in first, then come back to this page
    if (!user) return navigate('/login', { state: { from: location.pathname } })
    toggle(product)
  }

  return (
    <button
      onClick={handleClick}
      aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}
      aria-pressed={saved}
      className={`${className} ${saved ? 'text-rose-500' : ''}`}
    >
      <FiHeart className={`${iconClassName} ${saved ? 'fill-current' : ''}`} />
    </button>
  )
}

export default WishlistButton
