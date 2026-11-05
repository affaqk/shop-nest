import { Link } from 'react-router'
import { FiMinus, FiPlus, FiTrash2, FiLock, FiShoppingBag } from 'react-icons/fi'
import PageHeader from '../components/PageHeader'
import OrderSummary from '../components/OrderSummary'
import { useCart, FREE_SHIPPING_MIN } from '../context/cart'

const Cart = () => {
  const { items, totals, updateQuantity, removeItem, clearCart } = useCart()
  const remaining = FREE_SHIPPING_MIN - totals.itemsPrice
  const progress = Math.min(100, (totals.itemsPrice / FREE_SHIPPING_MIN) * 100)

  if (!items.length) {
    return (
      <>
        <PageHeader title="Shopping Cart" crumbs={[{ label: 'Cart' }]} />
        <div className="mx-auto max-w-xl px-4 py-24 text-center">
          <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <FiShoppingBag className="h-9 w-9" />
          </span>
          <h2 className="mt-6 font-display text-3xl font-semibold text-slate-900">Your cart is empty</h2>
          <p className="mt-2 text-slate-500">Looks like you haven&apos;t added anything yet.</p>
          <Link to="/shop" className="mt-8 inline-block rounded-full bg-slate-900 px-8 py-3.5 text-sm font-semibold text-white hover:bg-blue-600">
            Start Shopping
          </Link>
        </div>
      </>
    )
  }

  return (
    <>
      <PageHeader title="Shopping Cart" crumbs={[{ label: 'Cart' }]} />
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 lg:grid-cols-[1fr_24rem]">
        <div>
          {/* Free shipping progress */}
          <div className="mb-6 rounded-2xl bg-white p-5 ring-1 ring-slate-100">
            <p className="text-sm text-slate-600">
              {remaining > 0 ? (
                <>Add <span className="font-semibold text-slate-900">${remaining.toFixed(2)}</span> more for free shipping</>
              ) : (
                <span className="font-semibold text-emerald-600">🎉 You&apos;ve unlocked free shipping!</span>
              )}
            </p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-500" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl bg-white ring-1 ring-slate-100">
            <div className="hidden grid-cols-[1fr_8rem_8rem_3rem] gap-4 border-b border-slate-100 px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 sm:grid">
              <span>Product</span>
              <span className="text-center">Quantity</span>
              <span className="text-right">Total</span>
              <span />
            </div>
            <ul className="divide-y divide-slate-100">
              {items.map((item) => (
                <li key={item._id} className="grid grid-cols-[1fr_auto] items-center gap-4 p-6 sm:grid-cols-[1fr_8rem_8rem_3rem]">
                  <div className="flex items-center gap-4">
                    <Link to={`/product/${item._id}`} className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                      <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                    </Link>
                    <div>
                      <Link to={`/product/${item._id}`} className="font-semibold text-slate-900 hover:text-blue-600">
                        {item.title}
                      </Link>
                      <p className="mt-1 text-sm text-slate-500">${item.price.toFixed(2)} each</p>
                    </div>
                  </div>
                  <div className="col-start-1 flex items-center justify-self-start rounded-full border border-slate-300 sm:col-start-auto sm:justify-self-center">
                    <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="p-2.5 text-slate-600 hover:text-slate-900" aria-label="Decrease">
                      <FiMinus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="p-2.5 text-slate-600 hover:text-slate-900" aria-label="Increase">
                      <FiPlus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <p className="row-start-2 text-right font-bold text-slate-900 sm:row-start-auto">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                  <button
                    onClick={() => removeItem(item._id)}
                    className="col-start-2 row-start-1 justify-self-end rounded-full p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 sm:col-start-auto sm:row-start-auto"
                    aria-label="Remove item"
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 flex flex-wrap justify-between gap-4">
            <Link to="/shop" className="text-sm font-semibold text-blue-600 hover:underline">
              ← Continue Shopping
            </Link>
            <button onClick={clearCart} className="text-sm font-medium text-slate-500 hover:text-rose-600">
              Clear Cart
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <OrderSummary totals={totals}>
            <Link
              to="/checkout"
              className="mt-6 flex items-center justify-center gap-2 rounded-full bg-slate-900 py-4 text-sm font-semibold text-white transition hover:bg-blue-600"
            >
              <FiLock /> Proceed to Checkout
            </Link>
            <p className="mt-4 text-center text-xs text-slate-400">Secure checkout · SSL encrypted</p>
          </OrderSummary>
        </div>
      </div>
    </>
  )
}

export default Cart
