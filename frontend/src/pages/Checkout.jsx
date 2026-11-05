import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router'
import { FiCreditCard, FiLock, FiTruck, FiDollarSign, FiPlus } from 'react-icons/fi'
import { FaPaypal } from 'react-icons/fa6'
import PageHeader from '../components/PageHeader'
import OrderSummary from '../components/OrderSummary'
import { useCart } from '../context/cart'
import { useAuth } from '../context/auth'
import { createOrder, getAddresses, addAddress, getErrorMessage } from '../api'
import { COUNTRIES, MAX_ADDRESSES, countryName, emptyAddress } from '../addresses'

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

const addressFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zip', 'country']

const Checkout = () => {
  const [payment, setPayment] = useState('card')
  const [placing, setPlacing] = useState(false)
  const [error, setError] = useState('')
  const { items, totals, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [saved, setSaved] = useState([])
  // Saved address id, or 'new'; until the customer picks, the default address is used
  const [picked, setPicked] = useState(null)
  const [saveNew, setSaveNew] = useState(true)

  useEffect(() => {
    getAddresses()
      .then(setSaved)
      .catch(() => {}) // Saved addresses are optional; the form still works without them
  }, [])

  if (!items.length) return <Navigate to="/cart" replace />

  const chosenId = picked || saved.find((a) => a.isDefault)?._id || 'new'
  const chosen = saved.find((a) => a._id === chosenId)
  // Prefill for the fields below; the `key` on them re-renders the inputs when the choice changes
  const prefill = chosen || emptyAddress(user)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    // Card details are only used by the payment form; they are never sent to our server
    const shippingAddress = Object.fromEntries(addressFields.map((field) => [field, form.get(field)]))
    setPlacing(true)
    setError('')
    try {
      const order = await createOrder({
        items: items.map((item) => ({ product: item._id, quantity: item.quantity })),
        shippingAddress,
        paymentMethod: payment,
      })
      if (!chosen && saveNew && saved.length < MAX_ADDRESSES) {
        // The order is already placed, so a failed save shouldn't show an error (the server ignores `email`)
        addAddress({ ...shippingAddress, label: saved.length ? `Address ${saved.length + 1}` : 'Home' }).catch(() => {})
      }
      navigate('/profile?tab=orders', { replace: true, state: { placedOrder: order._id } })
      clearCart()
    } catch (err) {
      setError(getErrorMessage(err))
      setPlacing(false)
    }
  }

  return (
    <>
      <PageHeader title="Checkout" crumbs={[{ label: 'Cart', to: '/cart' }, { label: 'Checkout' }]} />
      <form onSubmit={handleSubmit} className="mx-auto grid max-w-7xl gap-8 px-4 py-12 lg:grid-cols-[1fr_24rem]">
        <div className="space-y-8">
          {error && <p className="rounded-2xl bg-rose-50 p-4 text-sm text-rose-700">{error}</p>}
          <section className="rounded-3xl bg-white p-6 ring-1 ring-slate-100 sm:p-8">
            <h2 className="flex items-center gap-3 font-display text-2xl font-semibold text-slate-900">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 font-sans text-sm text-white">1</span>
              Contact Information
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field label="Email" name="email" type="email" required defaultValue={user?.email} placeholder="you@example.com" />
              <Field key={chosenId} label="Phone" name="phone" type="tel" required defaultValue={prefill.phone} placeholder="+1 (555) 000-0000" />
            </div>
          </section>

          <section className="rounded-3xl bg-white p-6 ring-1 ring-slate-100 sm:p-8">
            <h2 className="flex items-center gap-3 font-display text-2xl font-semibold text-slate-900">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 font-sans text-sm text-white">2</span>
              Shipping Address
            </h2>
            {saved.length > 0 && (
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {saved.map((a) => (
                  <button
                    type="button"
                    key={a._id}
                    onClick={() => setPicked(a._id)}
                    className={`rounded-2xl border-2 p-4 text-left text-sm transition ${
                      chosenId === a._id ? 'border-blue-600 bg-blue-50' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className="font-semibold text-slate-900">
                      {a.label || 'Address'} {a.isDefault && <span className="text-xs font-normal text-slate-500">(default)</span>}
                    </span>
                    <span className="mt-1 block text-slate-500">
                      {a.firstName} {a.lastName}, {a.address}, {a.city}, {countryName(a.country)}
                    </span>
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setPicked('new')}
                  className={`flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-4 text-sm font-semibold transition ${
                    chosenId === 'new' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-300 text-slate-600 hover:border-slate-400'
                  }`}
                >
                  <FiPlus /> Use a new address
                </button>
              </div>
            )}
            <div key={chosenId} className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field label="First Name" name="firstName" required defaultValue={prefill.firstName} />
              <Field label="Last Name" name="lastName" required defaultValue={prefill.lastName} />
              <Field label="Street Address" name="address" required defaultValue={prefill.address} className="sm:col-span-2" />
              <Field label="City" name="city" required defaultValue={prefill.city} />
              <Field label="State / Province" name="state" required defaultValue={prefill.state} />
              <Field label="ZIP / Postal Code" name="zip" required defaultValue={prefill.zip} />
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-700">Country</span>
                <select name="country" className={inputClass} defaultValue={prefill.country}>
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>{c.name}</option>
                  ))}
                </select>
              </label>
            </div>
            {!chosen && saved.length < MAX_ADDRESSES && (
              <label className="mt-4 flex items-center gap-2 text-sm text-slate-700">
                <input type="checkbox" checked={saveNew} onChange={(e) => setSaveNew(e.target.checked)} className="h-4 w-4 accent-blue-600" />
                Save this address to my account
              </label>
            )}
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
          <OrderSummary totals={totals}>
            <ul className="mt-6 max-h-64 space-y-4 overflow-y-auto border-t border-slate-200 pt-6">
              {items.map((item) => (
                <li key={item._id} className="flex items-center gap-3">
                  <div className="relative">
                    <img src={item.image} alt={item.title} className="h-14 w-14 rounded-lg object-cover" />
                    <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-white">
                      {item.quantity}
                    </span>
                  </div>
                  <p className="line-clamp-2 flex-1 text-sm font-medium text-slate-800">{item.title}</p>
                  <p className="text-sm font-semibold text-slate-900">${(item.price * item.quantity).toFixed(2)}</p>
                </li>
              ))}
            </ul>
            <button
              type="submit"
              disabled={placing}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 py-4 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:opacity-60"
            >
              <FiLock /> {placing ? 'Placing Order...' : `Place Order · $${totals.totalPrice.toFixed(2)}`}
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
