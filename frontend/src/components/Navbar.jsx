import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router'
import {
  FiSearch,
  FiUser,
  FiHeart,
  FiShoppingCart,
  FiMenu,
  FiX,
  FiChevronDown,
  FiPackage,
  FiSettings,
  FiLogOut,
  FiPhone,
  FiMail,
} from 'react-icons/fi'
import { FaFacebookF, FaInstagram, FaXTwitter, FaYoutube, FaLinkedinIn } from 'react-icons/fa6'
import { useShop } from '../context/ShopContext'

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/shop' },
  { label: 'Electronics', to: '/shop?category=electronics' },
  { label: 'Fashion', to: '/shop?category=fashion' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

const socialLinks = [
  { icon: FaFacebookF, label: 'Facebook', href: '#' },
  { icon: FaInstagram, label: 'Instagram', href: '#' },
  { icon: FaXTwitter, label: 'X (Twitter)', href: '#' },
  { icon: FaYoutube, label: 'YouTube', href: '#' },
  { icon: FaLinkedinIn, label: 'LinkedIn', href: '#' },
]

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [query, setQuery] = useState('')
  const profileRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()
  const { cartCount, wishlist } = useShop()

  // Close menus when the route changes
  const [prevLocation, setPrevLocation] = useState(location)
  if (location !== prevLocation) {
    setPrevLocation(location)
    setMenuOpen(false)
    setProfileOpen(false)
  }

  // Close the profile dropdown when clicking outside of it
  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    const q = query.trim()
    navigate(q ? `/shop?search=${encodeURIComponent(q)}` : '/shop')
  }

  const isActive = (to) => {
    const [path, search] = to.split('?')
    if (search) return location.pathname === path && location.search === `?${search}`
    if (path === '/shop') return location.pathname === '/shop' && !location.search.includes('category=')
    return location.pathname === path
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 shadow-sm backdrop-blur">
      {/* Top bar */}
      <div className="bg-slate-900 text-xs text-slate-300">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2">
          <div className="hidden items-center gap-5 sm:flex">
            <span className="flex items-center gap-1.5">
              <FiPhone /> +1 (555) 123-4567
            </span>
            <span className="flex items-center gap-1.5">
              <FiMail /> support@shopnest.com
            </span>
          </div>
          <p className="sm:hidden">Free shipping on orders over $50</p>
          <p className="hidden lg:block">Free shipping on orders over $50 — Use code <span className="font-semibold text-white">WELCOME10</span></p>
          <div className="flex items-center gap-3">
            {socialLinks.map(({ icon: Icon, label, href }) => (
              <a key={label} href={href} aria-label={label} className="transition-colors hover:text-white">
                <Icon className="h-3.5 w-3.5" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-md p-2 text-slate-700 hover:bg-slate-100 lg:hidden"
          aria-label="Toggle menu"
        >
          {menuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
        </button>

        <Link to="/" className="shrink-0 font-display text-2xl font-bold tracking-tight text-slate-900">
          Shop<span className="text-blue-600">Nest</span>
        </Link>

        {/* Search (desktop) */}
        <form onSubmit={handleSearch} className="mx-4 hidden flex-1 md:flex">
          <div className="relative w-full">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for products, brands and more..."
              className="w-full rounded-full border border-slate-300 bg-slate-50 py-2.5 pl-5 pr-12 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
            <button
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-blue-600 p-2 text-white transition hover:bg-blue-700"
              aria-label="Search"
            >
              <FiSearch className="h-4 w-4" />
            </button>
          </div>
        </form>

        {/* Actions */}
        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <Link to="/wishlist" className="relative rounded-full p-2 text-slate-700 hover:bg-slate-100" aria-label="Wishlist">
            <FiHeart className="h-6 w-6" />
            {wishlist.length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                {wishlist.length}
              </span>
            )}
          </Link>
          <Link to="/cart" className="relative rounded-full p-2 text-slate-700 hover:bg-slate-100" aria-label="Cart">
            <FiShoppingCart className="h-6 w-6" />
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Profile dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 rounded-full p-1 pr-2 text-slate-700 hover:bg-slate-100"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                <FiUser className="h-5 w-5" />
              </span>
              <span className="hidden text-left leading-tight sm:block">
                <span className="block text-xs text-slate-500">Hello, Guest</span>
                <span className="block text-sm font-semibold">Account</span>
              </span>
              <FiChevronDown className={`hidden h-4 w-4 transition-transform sm:block ${profileOpen ? 'rotate-180' : ''}`} />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-slate-100 bg-white shadow-lg">
                <div className="border-b border-slate-100 p-4">
                  <p className="text-sm font-semibold text-slate-900">Welcome!</p>
                  <p className="text-xs text-slate-500">Sign in to manage your orders</p>
                  <div className="mt-3 flex gap-2">
                    <Link to="/login" className="flex-1 rounded-md bg-blue-600 py-1.5 text-center text-xs font-semibold text-white hover:bg-blue-700">
                      Sign In
                    </Link>
                    <Link to="/register" className="flex-1 rounded-md border border-slate-300 py-1.5 text-center text-xs font-semibold text-slate-700 hover:bg-slate-50">
                      Register
                    </Link>
                  </div>
                </div>
                <ul className="py-1 text-sm text-slate-700">
                  <li>
                    <Link to="/profile" className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50"><FiUser /> My Profile</Link>
                  </li>
                  <li>
                    <Link to="/profile?tab=orders" className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50"><FiPackage /> My Orders</Link>
                  </li>
                  <li>
                    <Link to="/profile?tab=settings" className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50"><FiSettings /> Settings</Link>
                  </li>
                  <li className="border-t border-slate-100">
                    <Link to="/login" className="flex items-center gap-3 px-4 py-2 text-rose-600 hover:bg-rose-50"><FiLogOut /> Logout</Link>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search (mobile) */}
      <form onSubmit={handleSearch} className="px-4 pb-3 md:hidden">
        <div className="relative">
          <FiSearch className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full rounded-full border border-slate-300 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </form>

      {/* Nav links (desktop) */}
      <nav className="hidden border-t border-slate-100 lg:block">
        <ul className="mx-auto flex max-w-7xl items-center gap-8 px-4 text-sm font-medium text-slate-700">
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link
                to={link.to}
                className={`block border-b-2 py-3 transition-colors hover:border-blue-600 hover:text-blue-600 ${
                  isActive(link.to) ? 'border-blue-600 text-blue-600' : 'border-transparent'
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="border-t border-slate-100 lg:hidden">
          <ul className="flex flex-col px-4 py-2 text-sm font-medium text-slate-700">
            {navLinks.map((link) => (
              <li key={link.label}>
                <NavLink
                  to={link.to}
                  className={`block rounded-md px-3 py-2.5 hover:bg-slate-100 hover:text-blue-600 ${
                    isActive(link.to) ? 'bg-blue-50 text-blue-600' : ''
                  }`}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}

export default Navbar
