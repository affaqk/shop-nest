import { Link } from 'react-router'
import { FiMinus, FiPlus, FiTrash2, FiLock, FiTag } from 'react-icons/fi'
import PageHeader from '../components/PageHeader'
import OrderSummary from '../components/OrderSummary'
import { cartItems } from '../data/mockData'

const Cart = () => {
  return (
    <>
      <PageHeader title="Shopping Cart" crumbs={[{ label: 'Cart' }]} />
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 lg:grid-cols-[1fr_24rem]">
        <div>
          {/* Free shipping progress */}
          <div className="mb-6 rounded-2xl bg-white p-5 ring-1 ring-slate-100">
            <p className="text-sm text-slate-600">
              <span className="font-semibold text-emerald-600">🎉 You&apos;ve unlocked free shipping!</span>
            </p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full w-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-500" />
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
              {cartItems.map((item) => (
                <li key={item.id} className="grid grid-cols-[1fr_auto] items-center gap-4 p-6 sm:grid-cols-[1fr_8rem_8rem_3rem]">
                  <div className="flex items-center gap-4">
                    <Link to={`/product/${item.id}`} className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    </Link>
                    <div>
                      <Link to={`/product/${item.id}`} className="font-semibold text-slate-900 hover:text-blue-600">
                        {item.name}
                      </Link>
                      <p className="mt-1 text-sm text-slate-500">${item.price.toFixed(2)} each</p>
                    </div>
                  </div>
                  <div className="col-start-1 flex items-center justify-self-start rounded-full border border-slate-300 sm:col-start-auto sm:justify-self-center">
                    <button className="p-2.5 text-slate-600 hover:text-slate-900" aria-label="Decrease">
                      <FiMinus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                    <button className="p-2.5 text-slate-600 hover:text-slate-900" aria-label="Increase">
                      <FiPlus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <p className="row-start-2 text-right font-bold text-slate-900 sm:row-start-auto">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                  <button
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
            <button className="text-sm font-medium text-slate-500 hover:text-rose-600">
              Clear Cart
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <OrderSummary>
            <form className="mt-6">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <FiTag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    placeholder="Coupon code"
                    className="w-full rounded-full border border-slate-300 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-500"
                  />
                </div>
                <button className="rounded-full bg-slate-100 px-5 text-sm font-semibold text-slate-800 hover:bg-slate-200">Apply</button>
              </div>
              <p className="mt-2 text-xs text-emerald-600">Coupon applied! You saved 10%.</p>
            </form>
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
