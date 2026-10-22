import { Link } from 'react-router'
import { FiHeart, FiArrowRight } from 'react-icons/fi'
import PageHeader from '../components/PageHeader'
import ProductCard from '../components/ProductCard'
import { useShop } from '../context/ShopContext'

const Wishlist = () => {
  const { wishlist } = useShop()

  return (
    <>
      <PageHeader
        title="My Wishlist"
        subtitle={wishlist.length ? `You have ${wishlist.length} saved item${wishlist.length > 1 ? 's' : ''}.` : undefined}
        crumbs={[{ label: 'Wishlist' }]}
      />
      <div className="mx-auto max-w-7xl px-4 py-12">
        {wishlist.length ? (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {wishlist.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="mx-auto max-w-lg py-12 text-center">
            <span className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-rose-50 text-rose-500">
              <FiHeart className="h-10 w-10" />
            </span>
            <h2 className="mt-6 font-display text-3xl font-semibold text-slate-900">Your wishlist is empty</h2>
            <p className="mt-3 text-slate-500">Tap the heart on any product to save it here for later.</p>
            <Link
              to="/shop"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-slate-900 px-7 py-3.5 text-sm font-semibold text-white hover:bg-blue-600"
            >
              Explore Products <FiArrowRight />
            </Link>
          </div>
        )}
      </div>
    </>
  )
}

export default Wishlist
