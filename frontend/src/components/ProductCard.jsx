import { Link } from 'react-router'
import { FiHeart, FiShoppingBag, FiEye } from 'react-icons/fi'
import { FaHeart } from 'react-icons/fa6'
import Rating from './Rating'
import { useShop } from '../context/ShopContext'
import { categories } from '../data/mockData'

const badgeStyles = {
  'Best Seller': 'bg-amber-500',
  New: 'bg-emerald-600',
  Sale: 'bg-rose-600',
  Limited: 'bg-slate-900',
}

const ProductCard = ({ product }) => {
  const { addToCart, toggleWishlist, isInWishlist } = useShop()
  const wished = isInWishlist(product.id)
  const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0
  const categoryName = categories.find((c) => c.id === product.category)?.name

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-slate-100 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/60">
      <div className="relative aspect-square overflow-hidden bg-slate-100">
        <Link to={`/product/${product.id}`}>
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </Link>

        {product.badge && (
          <span
            className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white ${badgeStyles[product.badge]}`}
          >
            {product.badge === 'Sale' && discount ? `-${discount}%` : product.badge}
          </span>
        )}

        <div className="absolute right-3 top-3 flex flex-col gap-2">
          <button
            onClick={() => toggleWishlist(product)}
            aria-label="Toggle wishlist"
            className={`flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur transition hover:scale-110 ${
              wished ? 'text-rose-500' : 'text-slate-700'
            }`}
          >
            {wished ? <FaHeart className="h-4 w-4" /> : <FiHeart className="h-4 w-4" />}
          </button>
          <Link
            to={`/product/${product.id}`}
            aria-label="Quick view"
            className="flex h-9 w-9 translate-x-12 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-sm backdrop-blur transition duration-300 hover:scale-110 group-hover:translate-x-0"
          >
            <FiEye className="h-4 w-4" />
          </Link>
        </div>

        <button
          onClick={() => addToCart(product)}
          className="absolute inset-x-3 bottom-3 flex translate-y-16 items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 text-sm font-medium text-white transition duration-300 hover:bg-blue-600 group-hover:translate-y-0"
        >
          <FiShoppingBag className="h-4 w-4" /> Add to Cart
        </button>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-medium uppercase tracking-wider text-slate-400">{categoryName}</p>
        <Link
          to={`/product/${product.id}`}
          className="mt-1 line-clamp-2 text-sm font-semibold text-slate-800 transition-colors hover:text-blue-600 sm:text-base"
        >
          {product.name}
        </Link>
        <div className="mt-2">
          <Rating value={product.rating} reviews={product.reviews} />
        </div>
        <div className="mt-auto flex items-baseline gap-2 pt-3">
          <span className="text-lg font-bold text-slate-900">${product.price.toFixed(2)}</span>
          {product.oldPrice && (
            <span className="text-sm text-slate-400 line-through">${product.oldPrice.toFixed(2)}</span>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductCard
