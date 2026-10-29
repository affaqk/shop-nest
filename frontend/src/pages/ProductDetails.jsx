import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import {
  FiMinus,
  FiPlus,
  FiHeart,
  FiShoppingBag,
  FiTruck,
  FiRefreshCw,
  FiShield,
  FiChevronRight,
  FiShare2,
} from 'react-icons/fi'
import Rating from '../components/Rating'
import ProductCard from '../components/ProductCard'
import SectionHeading from '../components/SectionHeading'
import { Spinner } from '../components/Skeletons'
import { categories, gadgets } from '../data/mockData'
import axios from 'axios'

const API_URL = 'http://localhost:8000/api/product'

const ProductDetails = () => {
  const { id } = useParams()
  // `data.id` remembers which product the response belongs to, so a new id means we're loading
  const [data, setData] = useState({ id: null, product: null, related: [], error: '' })
  const [current, setCurrent] = useState({ image: 0, color: 0, size: null, quantity: 1 })
  const [activeTab, setActiveTab] = useState('description')
  const select = (changes) => setCurrent({ ...current, ...changes })

  useEffect(() => {
    let ignore = false

    const detailRequest = axios.get(`${API_URL}/product-detail/${id}`)
    // Related products are optional, so a failure here shouldn't break the page
    const allRequest = axios.get(`${API_URL}/get-all-products`).catch(() => ({ data: { products: [] } }))

    Promise.all([detailRequest, allRequest])
      .then(([detailRes, allRes]) => {
        if (ignore) return
        const product = detailRes.data.product
        const related = (allRes.data.products || [])
          .filter((p) => p.category === product.category && p._id !== product._id)
          .slice(0, 4)
        setData({ id, product, related, error: '' })
        setCurrent({ image: 0, color: 0, size: null, quantity: 1 })
      })
      .catch((error) => {
        console.log(error)
        if (ignore) return
        // Home page gadgets are local showcase data, not in the API
        const toApiShape = (g) => ({
          ...g,
          _id: String(g.id),
          title: g.name,
          description: `${g.name} — 100% genuine with official brand warranty, free delivery and 30-day easy returns.`,
        })
        const gadget = gadgets.find((g) => String(g.id) === id)
        if (gadget) {
          const related = gadgets
            .filter((g) => g.group === gadget.group && g.id !== gadget.id)
            .slice(0, 4)
            .map(toApiShape)
          setData({ id, product: toApiShape(gadget), related, error: '' })
          setCurrent({ image: 0, color: 0, size: null, quantity: 1 })
        } else {
          setData({ id, product: null, related: [], error: 'Product not found.' })
        }
      })

    return () => {
      ignore = true
    }
  }, [id])

  if (data.id !== id) return <Spinner />

  const { product, related } = data

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center">
        <p className="text-lg text-slate-600">{data.error}</p>
        <Link
          to="/shop"
          className="mt-6 inline-flex rounded-full bg-slate-900 px-7 py-3 text-sm font-semibold text-white transition hover:bg-blue-600"
        >
          Back to Shop
        </Link>
      </div>
    )
  }

  const images = product.images?.length ? product.images : [product.image]
  const colors = product.colors || []
  const price = Number(product.price) || 0
  const category = categories.find((c) => c.id === product.category?.toLowerCase()) || {
    id: product.category,
    name: product.category,
  }
  const discount = product.oldPrice ? Math.round((1 - price / product.oldPrice) * 100) : 0

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8 flex flex-wrap items-center gap-1.5 text-sm text-slate-500">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <FiChevronRight className="h-3.5 w-3.5" />
          <Link to="/shop" className="hover:text-blue-600">Shop</Link>
          <FiChevronRight className="h-3.5 w-3.5" />
          <Link to={`/shop?category=${category?.id}`} className="hover:text-blue-600">{category?.name}</Link>
          <FiChevronRight className="h-3.5 w-3.5" />
          <span className="line-clamp-1 text-slate-800">{product.title}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Gallery */}
          <div className="flex flex-col-reverse gap-4 sm:flex-row">
            {images.length > 1 && (
              <div className="flex gap-3 sm:flex-col">
                {images.map((src, i) => (
                  <button
                    key={src}
                    onClick={() => select({ image: i })}
                    className={`h-20 w-20 overflow-hidden rounded-xl ring-2 transition ${
                      current.image === i ? 'ring-blue-600' : 'ring-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={src} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
            <div className="relative flex-1 overflow-hidden rounded-3xl bg-slate-100">
              <img src={images[current.image]} alt={product.title} className="aspect-square w-full object-cover" />
              {discount > 0 && (
                <span className="absolute left-4 top-4 rounded-full bg-rose-600 px-3 py-1 text-xs font-semibold text-white">
                  -{discount}%
                </span>
              )}
            </div>
          </div>

          {/* Info */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">{category?.name}</p>
            <h1 className="mt-2 font-display text-3xl font-semibold text-slate-900 sm:text-4xl">{product.title}</h1>
            {product.rating != null && (
              <div className="mt-4 flex items-center gap-4">
                <Rating value={product.rating} size="h-4 w-4" />
                <span className="text-sm text-slate-500">
                  {product.rating} · {(product.reviews || 0).toLocaleString()} reviews
                </span>
              </div>
            )}

            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-3xl font-bold text-slate-900">${price.toFixed(2)}</span>
              {product.oldPrice && (
                <>
                  <span className="text-lg text-slate-400 line-through">${product.oldPrice.toFixed(2)}</span>
                  <span className="rounded-md bg-rose-50 px-2 py-0.5 text-sm font-semibold text-rose-600">
                    Save ${(product.oldPrice - price).toFixed(2)}
                  </span>
                </>
              )}
            </div>

            <p className="mt-6 leading-relaxed text-slate-600">{product.description}</p>

            {colors.length > 0 && (
              <div className="mt-8">
                <p className="mb-3 text-sm font-semibold text-slate-900">Color</p>
                <div className="flex gap-3">
                  {colors.map((color, i) => (
                    <button
                      key={color}
                      onClick={() => select({ color: i })}
                      aria-label={`Color ${i + 1}`}
                      style={{ backgroundColor: color }}
                      className={`h-9 w-9 rounded-full border border-slate-200 ring-2 ring-offset-2 transition ${
                        current.color === i ? 'ring-blue-600' : 'ring-transparent'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

            {product.sizes && (
              <div className="mt-6">
                <p className="mb-3 text-sm font-semibold text-slate-900">Size</p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => select({ size })}
                      className={`min-w-12 rounded-lg border px-4 py-2 text-sm font-medium transition ${
                        current.size === size
                          ? 'border-slate-900 bg-slate-900 text-white'
                          : 'border-slate-300 text-slate-700 hover:border-slate-900'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <div className="flex items-center rounded-full border border-slate-300">
                <button
                  onClick={() => select({ quantity: Math.max(1, current.quantity - 1) })}
                  className="p-3.5 text-slate-600 hover:text-slate-900"
                  aria-label="Decrease quantity"
                >
                  <FiMinus />
                </button>
                <span className="w-8 text-center font-semibold">{current.quantity}</span>
                <button
                  onClick={() => select({ quantity: Math.min(product.stock ?? Infinity, current.quantity + 1) })}
                  className="p-3.5 text-slate-600 hover:text-slate-900"
                  aria-label="Increase quantity"
                >
                  <FiPlus />
                </button>
              </div>
              {product.stock != null && (
                <p className={`text-sm font-medium ${product.stock < 15 ? 'text-amber-600' : 'text-emerald-600'}`}>
                  {product.stock < 15 ? `Only ${product.stock} left in stock` : 'In stock'}
                </p>
              )}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-slate-900 px-8 py-4 text-sm font-semibold text-white transition hover:bg-blue-600"
              >
                <FiShoppingBag /> Add to Cart
              </button>
              <button
                className="flex-1 rounded-full border-2 border-slate-900 px-8 py-4 text-sm font-semibold text-slate-900 transition hover:bg-slate-900 hover:text-white"
              >
                Buy Now
              </button>
              <button
                aria-label="Add to wishlist"
                className="flex h-14 w-14 items-center justify-center rounded-full border border-slate-300 text-slate-700 transition hover:border-slate-900"
              >
                <FiHeart className="h-5 w-5" />
              </button>
              <button
                aria-label="Share"
                className="flex h-14 w-14 items-center justify-center rounded-full border border-slate-300 text-slate-700 transition hover:border-slate-900"
              >
                <FiShare2 className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-8 grid gap-4 rounded-2xl bg-slate-100/70 p-5 sm:grid-cols-3">
              {[
                { icon: FiTruck, title: 'Free Delivery', text: 'Orders over $50' },
                { icon: FiRefreshCw, title: '30-Day Returns', text: 'Hassle-free' },
                { icon: FiShield, title: '2-Year Warranty', text: 'Full coverage' },
              ].map(({ icon: Icon, title, text }) => (
                <div key={title} className="flex items-center gap-3">
                  <Icon className="h-5 w-5 shrink-0 text-blue-600" />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{title}</p>
                    <p className="text-xs text-slate-500">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-16 rounded-3xl bg-white p-6 ring-1 ring-slate-100 sm:p-10">
          <div className="flex gap-8 border-b border-slate-200">
            {['description', 'specifications', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`-mb-px border-b-2 pb-4 text-sm font-semibold capitalize transition ${
                  activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                {tab === 'reviews' ? `Reviews (${product.reviews || 0})` : tab}
              </button>
            ))}
          </div>
          <div className="pt-8 text-slate-600">
            {activeTab === 'description' && (
              <div className="max-w-3xl space-y-4 leading-relaxed">
                <p>{product.description}</p>
                <p>
                  Every ShopNest product is quality-checked before it ships. We work only with trusted manufacturers
                  and stand behind everything we sell with our satisfaction guarantee.
                </p>
              </div>
            )}
            {activeTab === 'specifications' && (
              <dl className="grid max-w-2xl gap-x-8 sm:grid-cols-2">
                {[
                  ['Category', category?.name],
                  ['SKU', `SN-${product._id.slice(-6).toUpperCase()}`],
                  ['Availability', product.stock != null ? `${product.stock} in stock` : 'In stock'],
                  ['Colors', colors.length || 'One option'],
                  ['Warranty', '2 years'],
                  ['Shipping', 'Ships in 24 hours'],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between border-b border-slate-100 py-3 text-sm">
                    <dt className="text-slate-500">{label}</dt>
                    <dd className="font-medium text-slate-900">{value}</dd>
                  </div>
                ))}
              </dl>
            )}
            {activeTab === 'reviews' && (
              <div className="flex flex-col gap-8 sm:flex-row">
                <div className="rounded-2xl bg-slate-50 p-6 text-center sm:w-56">
                  <p className="font-display text-5xl font-semibold text-slate-900">{product.rating ?? 0}</p>
                  <div className="mt-2 flex justify-center">
                    <Rating value={product.rating ?? 0} size="h-4 w-4" />
                  </div>
                  <p className="mt-2 text-sm text-slate-500">Based on {(product.reviews || 0).toLocaleString()} reviews</p>
                </div>
                <p className="flex-1 self-center text-slate-500">
                  Customer reviews will appear here once connected to the reviews API.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16">
          <SectionHeading align="left" eyebrow="You may also like" title="Related Products" />
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}
    </>
  )
}

export default ProductDetails
