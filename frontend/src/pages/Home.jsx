import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { FiArrowRight, FiTruck, FiShield, FiRefreshCw, FiStar } from 'react-icons/fi'
import { FaQuoteLeft } from 'react-icons/fa6'
import ProductCard from '../components/ProductCard'
import SectionHeading from '../components/SectionHeading'
import Rating from '../components/Rating'
import { ProductGridSkeleton } from '../components/Skeletons'
import { getCategories, getFeaturedProducts, getTestimonials } from '../services/api'

const tabs = [
  { id: 'all', label: 'All' },
  { id: 'Best Seller', label: 'Best Sellers' },
  { id: 'New', label: 'New Arrivals' },
  { id: 'Sale', label: 'On Sale' },
]

const brands = ['AURORA', 'NORDIC', 'LUMEN', 'VERTEX', 'OAKLEY & CO', 'MONARCH']

const Home = () => {
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    Promise.all([getCategories(), getFeaturedProducts(), getTestimonials()]).then(([cats, prods, tests]) => {
      setCategories(cats)
      setProducts(prods)
      setTestimonials(tests)
      setLoading(false)
    })
  }, [])

  const visibleProducts = activeTab === 'all' ? products : products.filter((p) => p.badge === activeTab)

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blue-200/40 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-amber-100/60 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
              <FiStar className="h-3.5 w-3.5" /> New Season Collection 2026
            </span>
            <h1 className="mt-6 font-display text-5xl font-semibold leading-tight text-slate-900 sm:text-6xl">
              Discover Products <br />
              <span className="italic text-blue-600">Crafted</span> for You
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-slate-600">
              Thoughtfully curated essentials in fashion, tech and home. Premium quality, honest prices and delivery
              you can count on.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:bg-blue-600"
              >
                Shop Now <FiArrowRight />
              </Link>
              <Link
                to="/shop?sort=newest"
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-7 py-3.5 text-sm font-semibold text-slate-800 transition hover:border-slate-900"
              >
                New Arrivals
              </Link>
            </div>

            <div className="mt-12 flex gap-10">
              {[
                ['50K+', 'Happy Customers'],
                ['1.2K+', 'Premium Products'],
                ['4.9', 'Average Rating'],
              ].map(([value, label]) => (
                <div key={label}>
                  <p className="font-display text-3xl font-semibold text-slate-900">{value}</p>
                  <p className="text-sm text-slate-500">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://picsum.photos/seed/hero1/500/650"
                alt=""
                className="h-[26rem] w-full rounded-3xl object-cover shadow-2xl"
              />
              <div className="mt-12 space-y-4">
                <img
                  src="https://picsum.photos/seed/hero2/500/400"
                  alt=""
                  className="h-52 w-full rounded-3xl object-cover shadow-xl"
                />
                <img
                  src="https://picsum.photos/seed/hero3/500/400"
                  alt=""
                  className="h-52 w-full rounded-3xl object-cover shadow-xl"
                />
              </div>
            </div>
            <div className="absolute -left-8 bottom-10 flex items-center gap-3 rounded-2xl bg-white p-4 shadow-xl">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <FiTruck className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-900">Free Delivery</p>
                <p className="text-xs text-slate-500">On orders over $50</p>
              </div>
            </div>
            <div className="absolute -right-4 top-8 rounded-2xl bg-white px-4 py-3 shadow-xl">
              <p className="text-xs text-slate-500">Up to</p>
              <p className="font-display text-2xl font-bold text-rose-600">40% OFF</p>
            </div>
          </div>
        </div>
      </section>

      {/* Brands strip */}
      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-12 gap-y-4 px-4 py-8 sm:justify-between">
          {brands.map((brand) => (
            <span key={brand} className="font-display text-lg font-semibold tracking-[0.25em] text-slate-300">
              {brand}
            </span>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <SectionHeading
          eyebrow="Categories"
          title="Shop by Category"
          subtitle="Explore our carefully curated collections"
        />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {(loading ? Array.from({ length: 6 }, (_, i) => ({ id: i })) : categories).map((cat) =>
            loading ? (
              <div key={cat.id} className="aspect-[4/5] animate-pulse rounded-2xl bg-slate-200" />
            ) : (
              <Link
                key={cat.id}
                to={`/shop?category=${cat.id}`}
                className="group relative aspect-[4/5] overflow-hidden rounded-2xl"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                  <p className="font-semibold">{cat.name}</p>
                  <p className="text-xs text-white/70">{cat.count} products</p>
                </div>
              </Link>
            ),
          )}
        </div>
      </section>

      {/* Featured products */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHeading
            align="left"
            eyebrow="Our Products"
            title="Featured Collection"
            action={
              <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      activeTab === tab.id
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            }
          />
          {loading ? (
            <ProductGridSkeleton count={8} />
          ) : visibleProducts.length ? (
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {visibleProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="py-12 text-center text-slate-500">No products in this collection yet.</p>
          )}
          <div className="mt-12 text-center">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-7 py-3 text-sm font-semibold text-slate-800 transition hover:border-slate-900 hover:bg-slate-900 hover:text-white"
            >
              View All Products <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Promo banners */}
      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-20 md:grid-cols-2">
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-10 text-white">
          <img
            src="https://picsum.photos/seed/promo1/800/500"
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-30"
          />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">Limited Offer</p>
            <h3 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
              Summer Sale <br /> Up to 40% Off
            </h3>
            <p className="mt-3 max-w-xs text-sm text-white/70">Refresh your wardrobe with our season favourites.</p>
            <Link
              to="/shop?category=fashion"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-amber-300"
            >
              Shop Fashion <FiArrowRight />
            </Link>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-3xl bg-blue-600 p-10 text-white">
          <img
            src="https://picsum.photos/seed/promo2/800/500"
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-20 mix-blend-overlay"
          />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-200">New Tech</p>
            <h3 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
              Smart Gadgets <br /> for Modern Living
            </h3>
            <p className="mt-3 max-w-xs text-sm text-white/80">The latest electronics with free 2-year warranty.</p>
            <Link
              to="/shop?category=electronics"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
            >
              Explore Electronics <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="bg-white py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 lg:grid-cols-2">
          <img
            src="https://picsum.photos/seed/whyus/800/600"
            alt=""
            loading="lazy"
            className="h-full max-h-[28rem] w-full rounded-3xl object-cover"
          />
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">Why ShopNest</p>
            <h2 className="font-display text-3xl font-semibold text-slate-900 sm:text-4xl">
              Shopping made simple, secure and delightful
            </h2>
            <p className="mt-4 text-slate-500">
              We partner directly with trusted makers so you get authentic products, fair prices and a shopping
              experience you will love coming back to.
            </p>
            <div className="mt-8 space-y-6">
              {[
                { icon: FiTruck, title: 'Fast & Free Shipping', text: 'Free delivery on orders over $50, shipped within 24 hours.' },
                { icon: FiShield, title: 'Secure Checkout', text: 'Bank-level encryption keeps your payment details safe.' },
                { icon: FiRefreshCw, title: 'Hassle-free Returns', text: 'Changed your mind? Return within 30 days, no questions asked.' },
              ].map(({ icon: Icon, title, text }) => (
                <div key={title} className="flex gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-semibold text-slate-900">{title}</p>
                    <p className="mt-1 text-sm text-slate-500">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <SectionHeading eyebrow="Testimonials" title="Loved by Our Customers" />
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.id} className="relative rounded-3xl bg-white p-8 ring-1 ring-slate-100">
              <FaQuoteLeft className="h-8 w-8 text-blue-100" />
              <blockquote className="mt-4 leading-relaxed text-slate-600">“{t.text}”</blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <img src={t.avatar} alt={t.name} className="h-12 w-12 rounded-full object-cover" />
                <div>
                  <p className="font-semibold text-slate-900">{t.name}</p>
                  <Rating value={t.rating} />
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
    </>
  )
}

export default Home
