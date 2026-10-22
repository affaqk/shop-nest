import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { FiUser, FiPackage, FiHeart, FiMapPin, FiSettings, FiLogOut, FiEdit2, FiShoppingBag, FiDollarSign } from 'react-icons/fi'
import { Spinner } from '../components/Skeletons'
import { useShop } from '../context/ShopContext'
import { getOrders, getProfile } from '../services/api'

const tabs = [
  { id: 'overview', label: 'Overview', icon: FiUser },
  { id: 'orders', label: 'My Orders', icon: FiPackage },
  { id: 'addresses', label: 'Addresses', icon: FiMapPin },
  { id: 'settings', label: 'Settings', icon: FiSettings },
]

const statusStyles = {
  Delivered: 'bg-emerald-50 text-emerald-700',
  Shipped: 'bg-blue-50 text-blue-700',
  Processing: 'bg-amber-50 text-amber-700',
  Cancelled: 'bg-rose-50 text-rose-700',
}

const inputClass =
  'w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100'

const OrdersTable = ({ orders }) => (
  <div className="overflow-x-auto">
    <table className="w-full min-w-[36rem] text-left text-sm">
      <thead className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500">
        <tr>
          <th className="pb-3 font-semibold">Order</th>
          <th className="pb-3 font-semibold">Date</th>
          <th className="pb-3 font-semibold">Items</th>
          <th className="pb-3 font-semibold">Total</th>
          <th className="pb-3 font-semibold">Status</th>
          <th className="pb-3" />
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {orders.map((order) => (
          <tr key={order.id}>
            <td className="py-4 font-semibold text-slate-900">{order.id}</td>
            <td className="py-4 text-slate-500">
              {new Date(order.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </td>
            <td className="py-4 text-slate-500">{order.items}</td>
            <td className="py-4 font-semibold text-slate-900">${order.total.toFixed(2)}</td>
            <td className="py-4">
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[order.status]}`}>{order.status}</span>
            </td>
            <td className="py-4 text-right">
              <button className="text-sm font-semibold text-blue-600 hover:underline">View</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)

const Profile = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = searchParams.get('tab') || 'overview'
  const { wishlist, cartCount } = useShop()
  const [data, setData] = useState(null)

  useEffect(() => {
    Promise.all([getProfile(), getOrders()]).then(([user, orders]) => setData({ user, orders }))
  }, [])

  if (!data) return <Spinner />

  const { user, orders } = data
  const totalSpent = orders.filter((o) => o.status !== 'Cancelled').reduce((sum, o) => sum + o.total, 0)

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="grid gap-8 lg:grid-cols-[17rem_1fr]">
        {/* Sidebar */}
        <aside className="space-y-6">
          <div className="rounded-3xl bg-white p-6 text-center ring-1 ring-slate-100">
            <img src={user.avatar} alt={user.name} className="mx-auto h-24 w-24 rounded-full object-cover ring-4 ring-blue-50" />
            <h2 className="mt-4 font-display text-xl font-semibold text-slate-900">{user.name}</h2>
            <p className="text-sm text-slate-500">{user.email}</p>
            <p className="mt-3 inline-block rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
              Gold Member
            </p>
          </div>
          <nav className="overflow-hidden rounded-3xl bg-white p-2 ring-1 ring-slate-100">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setSearchParams(id === 'overview' ? {} : { tab: id })}
                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  activeTab === id ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className="h-4 w-4" /> {label}
              </button>
            ))}
            <Link to="/wishlist" className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-100">
              <FiHeart className="h-4 w-4" /> Wishlist
            </Link>
            <Link
              to="/login"
              onClick={() => localStorage.removeItem('token')}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-rose-600 hover:bg-rose-50"
            >
              <FiLogOut className="h-4 w-4" /> Logout
            </Link>
          </nav>
        </aside>

        {/* Content */}
        <div className="space-y-8">
          {activeTab === 'overview' && (
            <>
              <div className="rounded-3xl bg-gradient-to-br from-slate-900 to-blue-900 p-8 text-white">
                <p className="text-sm text-blue-200">Welcome back,</p>
                <h1 className="mt-1 font-display text-3xl font-semibold">{user.name.split(' ')[0]} 👋</h1>
                <p className="mt-2 text-sm text-white/70">Member since {user.memberSince}</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  { icon: FiPackage, label: 'Total Orders', value: orders.length, color: 'bg-blue-50 text-blue-600' },
                  { icon: FiDollarSign, label: 'Total Spent', value: `$${totalSpent.toFixed(2)}`, color: 'bg-emerald-50 text-emerald-600' },
                  { icon: FiHeart, label: 'Wishlist', value: wishlist.length, color: 'bg-rose-50 text-rose-600' },
                  { icon: FiShoppingBag, label: 'In Cart', value: cartCount, color: 'bg-amber-50 text-amber-600' },
                ].map(({ icon: Icon, label, value, color }) => (
                  <div key={label} className="rounded-3xl bg-white p-6 ring-1 ring-slate-100">
                    <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${color}`}>
                      <Icon className="h-5 w-5" />
                    </span>
                    <p className="mt-4 text-2xl font-bold text-slate-900">{value}</p>
                    <p className="text-sm text-slate-500">{label}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-3xl bg-white p-6 ring-1 ring-slate-100 sm:p-8">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="font-display text-2xl font-semibold text-slate-900">Recent Orders</h2>
                  <button onClick={() => setSearchParams({ tab: 'orders' })} className="text-sm font-semibold text-blue-600 hover:underline">
                    View all
                  </button>
                </div>
                <OrdersTable orders={orders.slice(0, 3)} />
              </div>
            </>
          )}

          {activeTab === 'orders' && (
            <div className="rounded-3xl bg-white p-6 ring-1 ring-slate-100 sm:p-8">
              <h1 className="mb-6 font-display text-3xl font-semibold text-slate-900">My Orders</h1>
              <OrdersTable orders={orders} />
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="rounded-3xl bg-white p-6 ring-1 ring-slate-100 sm:p-8">
              <div className="mb-6 flex items-center justify-between">
                <h1 className="font-display text-3xl font-semibold text-slate-900">Addresses</h1>
                <button className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-600">
                  + Add New
                </button>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="relative rounded-2xl border-2 border-blue-600 p-6">
                  <span className="absolute right-4 top-4 rounded-full bg-blue-600 px-2.5 py-0.5 text-xs font-semibold text-white">
                    Default
                  </span>
                  <p className="font-semibold text-slate-900">Home</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">
                    {user.name}
                    <br />
                    {user.address}
                    <br />
                    {user.phone}
                  </p>
                  <button className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:underline">
                    <FiEdit2 className="h-3.5 w-3.5" /> Edit
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <form onSubmit={(e) => e.preventDefault()} className="rounded-3xl bg-white p-6 ring-1 ring-slate-100 sm:p-8">
              <h1 className="mb-6 font-display text-3xl font-semibold text-slate-900">Account Settings</h1>
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-slate-700">Full Name</span>
                  <input defaultValue={user.name} className={inputClass} />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-slate-700">Email</span>
                  <input type="email" defaultValue={user.email} className={inputClass} />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-slate-700">Phone</span>
                  <input defaultValue={user.phone} className={inputClass} />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-slate-700">New Password</span>
                  <input type="password" placeholder="Leave blank to keep current" className={inputClass} />
                </label>
              </div>
              <div className="mt-8 space-y-3 border-t border-slate-100 pt-6">
                <p className="text-sm font-semibold text-slate-900">Notifications</p>
                {['Order updates via email', 'Exclusive offers and promotions', 'Product recommendations'].map((label, i) => (
                  <label key={label} className="flex items-center gap-3 text-sm text-slate-600">
                    <input type="checkbox" defaultChecked={i < 2} className="h-4 w-4 accent-blue-600" /> {label}
                  </label>
                ))}
              </div>
              <button className="mt-8 rounded-full bg-slate-900 px-8 py-3.5 text-sm font-semibold text-white hover:bg-blue-600">
                Save Changes
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile
