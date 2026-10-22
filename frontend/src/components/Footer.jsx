import { useState } from 'react'
import { Link } from 'react-router'
import { subscribeNewsletter } from '../services/api'
import { FiMapPin, FiPhone, FiMail, FiSend, FiTruck, FiShield, FiRefreshCw, FiHeadphones } from 'react-icons/fi'
import { FaFacebookF, FaInstagram, FaXTwitter, FaYoutube, FaLinkedinIn } from 'react-icons/fa6'

const features = [
  { icon: FiTruck, title: 'Free Shipping', text: 'On orders over $50' },
  { icon: FiRefreshCw, title: 'Easy Returns', text: '30-day return policy' },
  { icon: FiShield, title: 'Secure Payment', text: '100% protected checkout' },
  { icon: FiHeadphones, title: '24/7 Support', text: 'We are here to help' },
]

const linkGroups = [
  {
    title: 'Shop',
    links: [
      { label: 'All Products', to: '/shop' },
      { label: 'New Arrivals', to: '/shop?sort=newest' },
      { label: 'Best Rated', to: '/shop?sort=rating' },
      { label: 'Electronics', to: '/shop?category=electronics' },
    ],
  },
  {
    title: 'Customer Service',
    links: [
      { label: 'Contact Us', to: '/contact' },
      { label: 'Track Order', to: '/profile?tab=orders' },
      { label: 'Your Cart', to: '/cart' },
      { label: 'Wishlist', to: '/wishlist' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', to: '/about' },
      { label: 'My Account', to: '/profile' },
      { label: 'Sign In', to: '/login' },
      { label: 'Create Account', to: '/register' },
    ],
  },
]

const socialLinks = [
  { icon: FaFacebookF, label: 'Facebook', href: '#' },
  { icon: FaInstagram, label: 'Instagram', href: '#' },
  { icon: FaXTwitter, label: 'X (Twitter)', href: '#' },
  { icon: FaYoutube, label: 'YouTube', href: '#' },
  { icon: FaLinkedinIn, label: 'LinkedIn', href: '#' },
]

const Footer = () => {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = async (e) => {
    e.preventDefault()
    await subscribeNewsletter(email)
    setSubscribed(true)
    setEmail('')
  }

  return (
    <footer className="bg-slate-900 text-slate-400">
      {/* Features strip */}
      <div className="border-b border-slate-800">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-8 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-600/10 text-blue-500">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-white">{title}</p>
                <p className="text-xs">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main footer */}
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-6">
        <div className="lg:col-span-2">
          <Link to="/" className="font-display text-2xl font-bold tracking-tight text-white">
            Shop<span className="text-blue-500">Nest</span>
          </Link>
          <p className="mt-4 text-sm leading-relaxed">
            Your one-stop shop for quality products at great prices. Fast delivery, easy returns and friendly support.
          </p>
          <ul className="mt-5 space-y-2 text-sm">
            <li className="flex items-center gap-2"><FiMapPin className="text-blue-500" /> 123 Market Street, New York, NY</li>
            <li className="flex items-center gap-2"><FiPhone className="text-blue-500" /> +1 (555) 123-4567</li>
            <li className="flex items-center gap-2"><FiMail className="text-blue-500" /> support@shopnest.com</li>
          </ul>
        </div>

        {linkGroups.map(({ title, links }) => (
          <div key={title}>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">{title}</h3>
            <ul className="space-y-2.5 text-sm">
              {links.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="transition-colors hover:text-white">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">Newsletter</h3>
          <p className="mb-4 text-sm">Get exclusive offers and updates.</p>
          <form onSubmit={handleSubscribe} className="flex">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              className="w-full min-w-0 rounded-l-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-500 focus:border-blue-500"
            />
            <button
              type="submit"
              className="rounded-r-md bg-blue-600 px-3 text-white transition hover:bg-blue-700"
              aria-label="Subscribe"
            >
              <FiSend />
            </button>
          </form>
          {subscribed && <p className="mt-2 text-xs text-emerald-400">Thanks for subscribing!</p>}
          <div className="mt-5 flex gap-2">
            {socialLinks.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 transition-colors hover:bg-blue-600 hover:text-white"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-xs sm:flex-row">
          <p>&copy; {new Date().getFullYear()} ShopNest. All rights reserved.</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-white">Terms</a>
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
