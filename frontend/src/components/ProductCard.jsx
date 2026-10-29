import { Link } from 'react-router'
import { FiHeart, FiShoppingBag, FiEye } from 'react-icons/fi'
import Rating from './Rating'
import { categories } from '../data/mockData'

const badgeStyles = {
  'Best Seller': 'bg-amber-500',
  New: 'bg-emerald-600',
  Sale: 'bg-rose-600',
  Limited: 'bg-slate-900',
}

const ProductCard = ({ product }) => {
  // Supports both API products ({ _id, title, image }) and mock products ({ id, name, images })
  const id = product._id || product.id
  const name = product.title || product.name
  const image = product.image || product.images?.[0]
  const price = Number(product.price) || 0
  const discount = product.oldPrice ? Math.round((1 - price / product.oldPrice) * 100) : 0
  const categoryName =
    categories.find((c) => c.id === product.category?.toLowerCase())?.name || product.category

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-slate-100 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/60">
      <div className="relative aspect-square overflow-hidden bg-slate-100">
        <Link to={`/product/${id}`}>
          <img
            src={image}
            alt={name}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.onerror = null
              e.currentTarget.src = `https://picsum.photos/seed/${id}/600/600`
            }}
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
            aria-label="Add to wishlist"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-sm backdrop-blur transition hover:scale-110 hover:text-rose-500"
          >
            <FiHeart className="h-4 w-4" />
          </button>
          <Link
            to={`/product/${id}`}
            aria-label="Quick view"
            className="flex h-9 w-9 translate-x-12 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-sm backdrop-blur transition duration-300 hover:scale-110 group-hover:translate-x-0"
          >
            <FiEye className="h-4 w-4" />
          </Link>
        </div>

        <button
          className="absolute inset-x-3 bottom-3 flex translate-y-16 items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 text-sm font-medium text-white transition duration-300 hover:bg-blue-600 group-hover:translate-y-0"
        >
          <FiShoppingBag className="h-4 w-4" /> Add to Cart
        </button>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-medium uppercase tracking-wider text-slate-400">{categoryName}</p>
        <Link
          to={`/product/${id}`}
          className="mt-1 line-clamp-2 text-sm font-semibold text-slate-800 transition-colors hover:text-blue-600 sm:text-base"
        >
          {name}
        </Link>
        {product.rating != null && (
          <div className="mt-2">
            <Rating value={product.rating} reviews={product.reviews} />
          </div>
        )}
        <div className="mt-auto flex items-baseline gap-2 pt-3">
          <span className="text-lg font-bold text-slate-900">${price.toFixed(2)}</span>
          {product.oldPrice && (
            <span className="text-sm text-slate-400 line-through">${product.oldPrice.toFixed(2)}</span>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductCard
