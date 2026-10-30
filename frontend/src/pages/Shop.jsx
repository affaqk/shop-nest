import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'
import { FiFilter, FiX, FiSearch } from 'react-icons/fi'
import PageHeader from '../components/PageHeader'
import ProductCard from '../components/ProductCard'
import { ProductGridSkeleton } from '../components/Skeletons'
import { getAllProducts, getErrorMessage } from '../api'

const sortOptions = [
  { value: '', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
]

const MAX_PRICE = 300

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [allProducts, setAllProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getAllProducts()
      .then(setAllProducts)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [])

  const category = searchParams.get('category') || ''
  const search = searchParams.get('search') || ''
  const sort = searchParams.get('sort') || ''
  const maxPrice = Number(searchParams.get('maxPrice')) || MAX_PRICE

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams)
    if (value === '' || value == null) next.delete(key)
    else next.set(key, value)
    setSearchParams(next)
  }

  const clearFilters = () => setSearchParams({})

  // Categories come from the products themselves
  const categories = [...new Set(allProducts.map((p) => p.category))].sort().map((cat) => ({
    id: cat,
    name: cat.charAt(0).toUpperCase() + cat.slice(1),
    count: allProducts.filter((p) => p.category === cat).length,
  }))

  const sorters = {
    newest: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    'price-asc': (a, b) => a.price - b.price,
    'price-desc': (a, b) => b.price - a.price,
    rating: (a, b) => (b.rating || 0) - (a.rating || 0),
  }

  const products = allProducts.filter(
    (p) =>
      (!category || p.category === category) &&
      (!search || p.title.toLowerCase().includes(search.toLowerCase())) &&
      (maxPrice >= MAX_PRICE || p.price <= maxPrice)
  )
  if (sorters[sort]) products.sort(sorters[sort])

  const activeCategory = categories.find((c) => c.id === category)
  const hasFilters = category || search || maxPrice < MAX_PRICE

  const filters = (
    <div className="space-y-8">
      <div>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-900">Categories</h3>
        <ul className="space-y-1">
          <li>
            <button
              onClick={() => updateParam('category', '')}
              className={`w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                !category ? 'bg-blue-50 font-semibold text-blue-700' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              All Products
            </button>
          </li>
          {categories.map((cat) => (
            <li key={cat.id}>
              <button
                onClick={() => updateParam('category', cat.id)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition ${
                  category === cat.id ? 'bg-blue-50 font-semibold text-blue-700' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {cat.name}
                <span className="text-xs text-slate-400">{cat.count}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-900">Max Price</h3>
        <input
          type="range"
          min="10"
          max={MAX_PRICE}
          step="10"
          value={maxPrice}
          onChange={(e) => updateParam('maxPrice', Number(e.target.value) === MAX_PRICE ? '' : e.target.value)}
          className="w-full accent-blue-600"
        />
        <div className="mt-2 flex justify-between text-sm text-slate-500">
          <span>$0</span>
          <span className="font-semibold text-slate-900">${maxPrice}{maxPrice === MAX_PRICE && '+'}</span>
        </div>
      </div>

      <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-blue-900 p-6 text-white">
        <p className="text-xs font-semibold uppercase tracking-wider text-blue-200">Special Offer</p>
        <p className="mt-2 font-display text-2xl font-semibold">10% off your first order</p>
        <p className="mt-2 text-sm text-white/70">
          Use code <span className="font-semibold text-white">WELCOME10</span> at checkout.
        </p>
      </div>
    </div>
  )

  return (
    <>
      <PageHeader
        title={activeCategory ? activeCategory.name : 'Shop All'}
        subtitle="Browse our full range of premium products, handpicked for quality and style."
        crumbs={activeCategory ? [{ label: 'Shop', to: '/shop' }, { label: activeCategory.name }] : [{ label: 'Shop' }]}
      />

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 lg:grid-cols-[16rem_1fr]">
        {/* Sidebar (desktop) */}
        <aside className="hidden lg:block">{filters}</aside>

        {/* Sidebar (mobile drawer) */}
        {filtersOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-slate-900/50" onClick={() => setFiltersOpen(false)} />
            <div className="absolute inset-y-0 left-0 w-80 max-w-[85%] overflow-y-auto bg-white p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="font-display text-xl font-semibold">Filters</h2>
                <button onClick={() => setFiltersOpen(false)} aria-label="Close filters" className="rounded-full p-2 hover:bg-slate-100">
                  <FiX className="h-5 w-5" />
                </button>
              </div>
              {filters}
            </div>
          </div>
        )}

        <div>
          {/* Toolbar */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-4 ring-1 ring-slate-100">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setFiltersOpen(true)}
                className="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium lg:hidden"
              >
                <FiFilter /> Filters
              </button>
              <p className="text-sm text-slate-500">
                Showing <span className="font-semibold text-slate-900">{products.length}</span> products
              </p>
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-sm text-slate-500">Sort by:</label>
              <select
                id="sort"
                value={sort}
                onChange={(e) => updateParam('sort', e.target.value)}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
              >
                {sortOptions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Active filters */}
          {hasFilters && (
            <div className="mb-6 flex flex-wrap items-center gap-2">
              {search && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-3 py-1.5 text-xs font-medium text-white">
                  <FiSearch /> “{search}”
                  <button onClick={() => updateParam('search', '')} aria-label="Remove search"><FiX /></button>
                </span>
              )}
              {activeCategory && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-3 py-1.5 text-xs font-medium text-white">
                  {activeCategory.name}
                  <button onClick={() => updateParam('category', '')} aria-label="Remove category"><FiX /></button>
                </span>
              )}
              {maxPrice < MAX_PRICE && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-3 py-1.5 text-xs font-medium text-white">
                  Under ${maxPrice}
                  <button onClick={() => updateParam('maxPrice', '')} aria-label="Remove price filter"><FiX /></button>
                </span>
              )}
              <button onClick={clearFilters} className="text-xs font-medium text-blue-600 hover:underline">
                Clear all
              </button>
            </div>
          )}

          {error && <p className="mb-6 rounded-2xl bg-rose-50 p-4 text-sm text-rose-700">{error}</p>}

          {loading ? (
            <ProductGridSkeleton />
          ) : products.length ? (
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl bg-white px-6 py-20 text-center ring-1 ring-slate-100">
              <FiSearch className="mx-auto h-12 w-12 text-slate-300" />
              <h3 className="mt-4 font-display text-2xl font-semibold text-slate-900">No products found</h3>
              <p className="mt-2 text-slate-500">Try adjusting your filters or search terms.</p>
              <button
                onClick={clearFilters}
                className="mt-6 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-600"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Shop
