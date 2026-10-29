import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { FiArrowRight, FiTruck, FiShield, FiRefreshCw, FiStar, FiZap, FiShoppingBag } from 'react-icons/fi'
import { FaQuoteLeft } from 'react-icons/fa6'
import ProductCard from '../components/ProductCard'
import SectionHeading from '../components/SectionHeading'
import Rating from '../components/Rating'
import { ProductGridSkeleton } from '../components/Skeletons'
import { categories, testimonials, techCategories, gadgets, heroImages } from '../data/mockData'
import axios from 'axios'

const brands = ['APPLE', 'SAMSUNG', 'SONY', 'BOSE', 'JBL', 'XIAOMI']

const gadgetTabs = [
  { id: 'all', label: 'All' },
  { id: 'mobiles', label: 'Mobiles' },
  { id: 'audio', label: 'Audio' },
  { id: 'wearables', label: 'Wearables' },
  { id: 'computing', label: 'Computing' },
]

const dealProduct = gadgets[0]

// Time left until midnight, used for the deal-of-the-day countdown
const getTimeLeft = () => {
  const now = new Date()
  const midnight = new Date(now)
  midnight.setHours(24, 0, 0, 0)
  const diff = Math.max(0, midnight - now)
  return {
    Hours: Math.floor(diff / 3600000),
    Minutes: Math.floor((diff / 60000) % 60),
    Seconds: Math.floor((diff / 1000) % 60),
  }
}

const Home = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [gadgetTab, setGadgetTab] = useState('all')
  const [timeLeft, setTimeLeft] = useState(getTimeLeft)

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getTimeLeft()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    axios
      .get('http://localhost:8000/api/product/get-all-products')
      .then((response) => setProducts(response.data.products || []))
      .catch((error) => {
        console.log(error)
        setError('Could not load products. Please try again later.')
      })
      .finally(() => setLoading(false))
  }, [])

  // Tabs are built from the categories that actually exist in the API data
  const tabs = [
    { id: 'all', label: 'All' },
    ...[...new Set(products.map((p) => p.category))].map((cat) => ({
      id: cat,
      label: categories.find((c) => c.id === cat.toLowerCase())?.name || cat,
    })),
  ]

  const visibleGadgets = gadgetTab === 'all' ? gadgets.slice(0, 8) : gadgets.filter((g) => g.group === gadgetTab)

  const visibleProducts = (activeTab === 'all' ? products : products.filter((p) => p.category === activeTab)).slice(0, 8)

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-blue-200/40 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-amber-100/60 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
              <FiStar className="h-3.5 w-3.5" /> Latest Tech 2026
            </span>
            <h1 className="mt-6 font-display text-5xl font-semibold leading-tight text-slate-900 sm:text-6xl">
              Everyday Tech, <br />
              <span className="italic text-blue-600">Upgraded</span> for You
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-slate-600">
              Shop the latest mobiles, AirPods, headphones and smartwatches from top brands. Genuine products,
              official warranty and fast delivery.
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
                ['1.2K+', 'Genuine Gadgets'],
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
                src={heroImages.main}
                alt="Wireless headphones"
                className="h-[26rem] w-full rounded-3xl object-cover shadow-2xl"
              />
              <div className="mt-12 space-y-4">
                <img
                  src={heroImages.earbuds}
                  alt="AirPods Pro"
                  className="h-52 w-full rounded-3xl object-cover shadow-xl"
                />
                <img
                  src={heroImages.phone}
                  alt="Smartphone"
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
          subtitle="Everything you use every day, from phones to earbuds"
        />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {techCategories.map((cat) => (
              <Link
                key={cat.id}
                to="/shop?category=electronics"
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
          ))}
        </div>
      </section>

      {/* Trending gadgets */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHeading
            align="left"
            eyebrow="Trending Now"
            title="Best-Selling Gadgets"
            action={
              <div className="flex flex-wrap gap-2">
                {gadgetTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setGadgetTab(tab.id)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      gadgetTab === tab.id
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
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {visibleGadgets.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Deal of the day */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="grid items-center gap-10 overflow-hidden rounded-3xl bg-slate-900 p-8 text-white sm:p-12 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-amber-400/15 px-3 py-1 text-xs font-semibold text-amber-300">
              <FiZap className="h-3.5 w-3.5" /> Deal of the Day
            </span>
            <h2 className="mt-5 font-display text-3xl font-semibold sm:text-4xl">{dealProduct.name}</h2>
            <p className="mt-4 max-w-md text-white/70">
              Active noise cancellation, adaptive transparency and up to 30 hours of listening with the charging case.
            </p>
            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-4xl font-bold">${dealProduct.price.toFixed(2)}</span>
              <span className="text-lg text-white/50 line-through">${dealProduct.oldPrice.toFixed(2)}</span>
              <span className="rounded-full bg-rose-600 px-2.5 py-1 text-xs font-semibold">
                -{Math.round((1 - dealProduct.price / dealProduct.oldPrice) * 100)}%
              </span>
            </div>
            <div className="mt-8 flex gap-3">
              {Object.entries(timeLeft).map(([label, value]) => (
                <div key={label} className="w-20 rounded-2xl bg-white/10 py-3 text-center">
                  <p className="font-display text-3xl font-semibold tabular-nums">{String(value).padStart(2, '0')}</p>
                  <p className="text-xs text-white/60">{label}</p>
                </div>
              ))}
            </div>
            <Link
              to="/shop?category=electronics"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-slate-900 transition hover:bg-amber-300"
            >
              <FiShoppingBag /> Grab the Deal
            </Link>
          </div>
          <div className="relative">
            <div className="absolute inset-10 rounded-full bg-blue-500/30 blur-3xl" />
            <img
              src={dealProduct.image}
              alt={dealProduct.name}
              loading="lazy"
              className="relative mx-auto aspect-square w-full max-w-md rounded-3xl object-cover shadow-2xl"
            />
          </div>
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
          ) : error ? (
            <p className="py-12 text-center text-rose-500">{error}</p>
          ) : visibleProducts.length ? (
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {visibleProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
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
            src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80"
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-30"
          />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">Limited Offer</p>
            <h3 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
              Smartwatch Sale <br /> Up to 40% Off
            </h3>
            <p className="mt-3 max-w-xs text-sm text-white/70">Track fitness, calls and notifications from your wrist.</p>
            <Link
              to="/shop?category=electronics"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-amber-300"
            >
              Shop Watches <FiArrowRight />
            </Link>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-3xl bg-blue-600 p-10 text-white">
          <img
            src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80"
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-20 mix-blend-overlay"
          />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-200">New Tech</p>
            <h3 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
              New Mobiles <br /> Now in Stock
            </h3>
            <p className="mt-3 max-w-xs text-sm text-white/80">Latest flagship phones with free 2-year warranty.</p>
            <Link
              to="/shop?category=electronics"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
            >
              Explore Mobiles <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="bg-white py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 lg:grid-cols-2">
          <img
            src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80"
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
