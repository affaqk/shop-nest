import { useState } from 'react'
import { Link, Navigate } from 'react-router'
import { FiCreditCard, FiLock, FiCheckCircle, FiTruck, FiDollarSign } from 'react-icons/fi'
import { FaPaypal } from 'react-icons/fa6'
import PageHeader from '../components/PageHeader'
import OrderSummary from '../components/OrderSummary'
import { useShop } from '../context/ShopContext'
import { placeOrder } from '../services/api'

const inputClass =
  'w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100'

const Field = ({ label, className = '', ...props }) => (
  <label className={`block ${className}`}>
    <span className="mb-1.5 block text-sm font-medium text-slate-700">{label}</span>
    <input className={inputClass} {...props} />
  </label>
)

const paymentMethods = [
  { id: 'card', label: 'Credit / Debit Card', icon: FiCreditCard },
  { id: 'paypal', label: 'PayPal', icon: FaPaypal },
  { id: 'cod', label: 'Cash on Delivery', icon: FiDollarSign },
]

const Checkout = () => {
  const { cart, total, clearCart } = useShop()
  const [payment, setPayment] = useState('card')
  const [submitting, setSubmitting] = useState(false)
  const [order, setOrder] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    const form = Object.fromEntries(new FormData(e.target))
    const result = await placeOrder({ ...form, payment, items: cart, total })
    setOrder(result)
    clearCart()
    setSubmitting(false)
  }

  if (order) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <span className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <FiCheckCircle className="h-12 w-12" />
        </span>
        <h1 className="mt-6 font-display text-4xl font-semibold text-slate-900">Thank you for your order!</h1>
        <p className="mt-3 text-slate-500">
          Your order <span className="font-semibold text-slate-900">{order.id}</span> has been placed. A confirmation
          email is on its way.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link to="/profile?tab=orders" className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-800 hover:border-slate-900">
            View Orders
          </Link>
          <Link to="/shop" className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-600">
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  if (cart.length === 0) return <Navigate to="/cart" replace />

  return (
    <>
      <PageHeader title="Checkout" crumbs={[{ label: 'Cart', to: '/cart' }, { label: 'Checkout' }]} />
      <form onSubmit={handleSubmit} className="mx-auto grid max-w-7xl gap-8 px-4 py-12 lg:grid-cols-[1fr_24rem]">
        <div className="space-y-8">
          <section className="rounded-3xl bg-white p-6 ring-1 ring-slate-100 sm:p-8">
            <h2 className="flex items-center gap-3 font-display text-2xl font-semibold text-slate-900">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 font-sans text-sm text-white">1</span>
              Contact Information
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field label="Email" name="email" type="email" required placeholder="you@example.com" />
              <Field label="Phone" name="phone" type="tel" required placeholder="+1 (555) 000-0000" />
            </div>
          </section>

          <section className="rounded-3xl bg-white p-6 ring-1 ring-slate-100 sm:p-8">
            <h2 className="flex items-center gap-3 font-display text-2xl font-semibold text-slate-900">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 font-sans text-sm text-white">2</span>
              Shipping Address
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field label="First Name" name="firstName" required />
              <Field label="Last Name" name="lastName" required />
              <Field label="Street Address" name="address" required className="sm:col-span-2" />
              <Field label="City" name="city" required />
              <Field label="State / Province" name="state" required />
              <Field label="ZIP / Postal Code" name="zip" required />
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-700">Country</span>
                <select name="country" className={inputClass} defaultValue="US">
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="GB">United Kingdom</option>
                  <option value="PK">Pakistan</option>
                  <option value="AE">United Arab Emirates</option>
                </select>
              </label>
            </div>
          </section>

          <section className="rounded-3xl bg-white p-6 ring-1 ring-slate-100 sm:p-8">
            <h2 className="flex items-center gap-3 font-display text-2xl font-semibold text-slate-900">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 font-sans text-sm text-white">3</span>
              Payment Method
            </h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {paymentMethods.map(({ id, label, icon: Icon }) => (
                <button
                  type="button"
                  key={id}
                  onClick={() => setPayment(id)}
                  className={`flex flex-col items-center gap-2 rounded-2xl border-2 p-4 text-sm font-medium transition ${
                    payment === id ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <Icon className="h-6 w-6" />
                  {label}
                </button>
              ))}
            </div>

            {payment === 'card' && (
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Field label="Name on Card" name="cardName" required className="sm:col-span-2" />
                <Field label="Card Number" name="cardNumber" required inputMode="numeric" placeholder="1234 5678 9012 3456" className="sm:col-span-2" />
                <Field label="Expiry Date" name="expiry" required placeholder="MM / YY" />
                <Field label="CVC" name="cvc" required inputMode="numeric" placeholder="123" />
              </div>
            )}
            {payment === 'paypal' && (
              <p className="mt-6 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
                You will be redirected to PayPal to complete your payment securely.
              </p>
            )}
            {payment === 'cod' && (
              <p className="mt-6 flex items-center gap-2 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
                <FiTruck className="text-blue-600" /> Pay with cash when your order is delivered.
              </p>
            )}
          </section>
        </div>

        <div className="space-y-6 lg:sticky lg:top-44 lg:self-start">
          <OrderSummary>
            <ul className="mt-6 max-h-64 space-y-4 overflow-y-auto border-t border-slate-200 pt-6">
              {cart.map((item) => (
                <li key={item.id} className="flex items-center gap-3">
                  <div className="relative">
                    <img src={item.image} alt={item.name} className="h-14 w-14 rounded-lg object-cover" />
                    <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-white">
                      {item.quantity}
                    </span>
                  </div>
                  <p className="line-clamp-2 flex-1 text-sm font-medium text-slate-800">{item.name}</p>
                  <p className="text-sm font-semibold text-slate-900">${(item.price * item.quantity).toFixed(2)}</p>
                </li>
              ))}
            </ul>
            <button
              type="submit"
              disabled={submitting}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 py-4 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:cursor-wait disabled:opacity-70"
            >
              <FiLock /> {submitting ? 'Placing Order…' : `Place Order · $${total.toFixed(2)}`}
            </button>
            <p className="mt-4 text-center text-xs text-slate-400">
              By placing your order you agree to our Terms &amp; Privacy Policy.
            </p>
          </OrderSummary>
        </div>
      </form>
    </>
  )
}

export default Checkout
