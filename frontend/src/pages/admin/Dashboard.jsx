import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { FiBox, FiUsers, FiShoppingBag, FiDollarSign, FiArrowRight } from 'react-icons/fi'
import { getAllProducts, getAllUsers, getAllOrders, getErrorMessage } from '../../api'
import { useAuth } from '../../context/auth'
import Avatar from '../../components/Avatar'
import OrderStatus from '../../components/OrderStatus'
import { formatDate } from '../../components/admin/styles'
import { orderNumber } from '../../orders'

const byNewest = (a, b) => new Date(b.createdAt) - new Date(a.createdAt)

const Dashboard = () => {
  const { user } = useAuth()
  const [products, setProducts] = useState([])
  const [users, setUsers] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([getAllProducts(), getAllUsers(), getAllOrders()])
      .then(([productList, userList, orderList]) => {
        setProducts(productList)
        setUsers(userList)
        setOrders(orderList)
      })
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [])

  // Product count per category, largest first
  const categoryCounts = Object.entries(
    products.reduce((acc, p) => ({ ...acc, [p.category]: (acc[p.category] || 0) + 1 }), {})
  ).sort((a, b) => b[1] - a[1])
  const maxCount = categoryCounts[0]?.[1] || 1

  const revenue = orders.filter((o) => o.status !== 'Cancelled').reduce((sum, o) => sum + o.totalPrice, 0)

  const stats = [
    { icon: FiDollarSign, label: 'Revenue', value: `$${revenue.toFixed(2)}`, color: 'bg-rose-50 text-rose-600' },
    { icon: FiShoppingBag, label: 'Total Orders', value: orders.length, color: 'bg-amber-50 text-amber-600' },
    { icon: FiBox, label: 'Total Products', value: products.length, color: 'bg-blue-50 text-blue-600' },
    { icon: FiUsers, label: 'Total Users', value: users.length, color: 'bg-emerald-50 text-emerald-600' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">Welcome back, {user?.name}. Here&apos;s what&apos;s happening in your store.</p>
      </div>

      {error && <p className="rounded-2xl bg-rose-50 p-4 text-sm text-rose-700">{error}</p>}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="rounded-3xl bg-white p-6 ring-1 ring-slate-100">
            <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${color}`}>
              <Icon className="h-5 w-5" />
            </span>
            <p className="mt-4 text-2xl font-bold text-slate-900">{loading ? '—' : value}</p>
            <p className="text-sm text-slate-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Recent orders (the API already returns newest first) */}
      <section className="rounded-3xl bg-white p-6 ring-1 ring-slate-100">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-slate-900">Recent Orders</h2>
          <Link to="/admin/orders" className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:underline">
            View all <FiArrowRight />
          </Link>
        </div>
        {orders.length ? (
          <ul className="divide-y divide-slate-100">
            {orders.slice(0, 5).map((o) => (
              <li key={o._id} className="flex flex-wrap items-center gap-x-4 gap-y-1 py-3 text-sm">
                <span className="w-24 font-semibold text-slate-900">{orderNumber(o)}</span>
                <span className="min-w-0 flex-1 truncate text-slate-600">{o.user?.name || `${o.shippingAddress.firstName} ${o.shippingAddress.lastName}`}</span>
                <span className="text-xs text-slate-400">{formatDate(o.createdAt)}</span>
                <span className="w-20 text-right font-semibold text-slate-900">${o.totalPrice.toFixed(2)}</span>
                <OrderStatus status={o.status} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-500">{loading ? 'Loading...' : 'No orders yet.'}</p>
        )}
      </section>

      <div className="grid gap-8 xl:grid-cols-2">
        {/* Products by category */}
        <section className="rounded-3xl bg-white p-6 ring-1 ring-slate-100">
          <h2 className="mb-6 font-display text-xl font-semibold text-slate-900">Products by Category</h2>
          {categoryCounts.length ? (
            <ul className="space-y-4">
              {categoryCounts.map(([category, count]) => (
                <li key={category}>
                  <div className="mb-1.5 flex justify-between text-sm">
                    <span className="font-medium capitalize text-slate-700">{category}</span>
                    <span className="text-slate-500">{count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100">
                    <div className="h-2 rounded-full bg-blue-600" style={{ width: `${(count / maxCount) * 100}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500">{loading ? 'Loading...' : 'No products yet.'}</p>
          )}
        </section>

        {/* Recent users */}
        <section className="rounded-3xl bg-white p-6 ring-1 ring-slate-100">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold text-slate-900">Recent Users</h2>
            <Link to="/admin/users" className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:underline">
              View all <FiArrowRight />
            </Link>
          </div>
          <ul className="divide-y divide-slate-100">
            {[...users].sort(byNewest).slice(0, 5).map((u) => (
              <li key={u._id} className="flex items-center gap-3 py-3">
                <Avatar user={u} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900">{u.name}</p>
                  <p className="truncate text-xs text-slate-500">{u.email}</p>
                </div>
                <span className="text-xs text-slate-400">{formatDate(u.createdAt)}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Recent products */}
      <section className="rounded-3xl bg-white p-6 ring-1 ring-slate-100">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-slate-900">Latest Products</h2>
          <Link to="/admin/products" className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:underline">
            Manage <FiArrowRight />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...products].sort(byNewest).slice(0, 4).map((p) => (
            <Link key={p._id} to={`/product/${p._id}`} className="group overflow-hidden rounded-2xl ring-1 ring-slate-100">
              <img src={p.image} alt={p.title} className="aspect-square w-full object-cover transition group-hover:scale-105" />
              <div className="p-3">
                <p className="truncate text-sm font-semibold text-slate-900">{p.title}</p>
                <p className="text-sm text-slate-500">${Number(p.price).toFixed(2)}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Dashboard
