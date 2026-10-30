import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { FiUser, FiPackage, FiHeart, FiMapPin, FiSettings, FiLogOut, FiEdit2, FiShoppingBag, FiDollarSign, FiGrid } from 'react-icons/fi'
// Orders and addresses have no backend API yet, so they still come from mock data
import { orders, user as mockUser } from '../data/mockData'
import { useAuth } from '../context/auth'
import { getUserProfile, updateUser, deleteUser, getErrorMessage } from '../api'
import Avatar from '../components/Avatar'

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

const SettingsForm = ({ user, onSaved, onDelete }) => {
  const [form, setForm] = useState({ name: user.name, email: user.email, profile: user.profile })
  const [status, setStatus] = useState({ type: '', message: '' })
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const getValue = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setStatus({ type: '', message: '' })
    try {
      const updated = await updateUser(user._id, form)
      onSaved(updated)
      setStatus({ type: 'success', message: 'Profile updated successfully' })
    } catch (err) {
      setStatus({ type: 'error', message: getErrorMessage(err) })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    try {
      await deleteUser(user._id)
      onDelete()
    } catch (err) {
      setStatus({ type: 'error', message: getErrorMessage(err) })
    }
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="rounded-3xl bg-white p-6 ring-1 ring-slate-100 sm:p-8">
        <h1 className="mb-6 font-display text-3xl font-semibold text-slate-900">Account Settings</h1>
        {status.message && (
          <p className={`mb-6 rounded-xl p-3 text-sm ${status.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
            {status.message}
          </p>
        )}
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">Full Name</span>
            <input name="name" required value={form.name} onChange={getValue} className={inputClass} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">Email</span>
            <input name="email" type="email" required value={form.email} onChange={getValue} className={inputClass} />
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">Profile Image URL</span>
            <input name="profile" required value={form.profile} onChange={getValue} className={inputClass} />
          </label>
        </div>
        <p className="mt-4 text-sm text-slate-500">
          Want to change your password?{' '}
          <Link to="/forgot-password" className="font-semibold text-blue-600 hover:underline">Send a reset link</Link>
        </p>
        <button disabled={saving} className="mt-8 rounded-full bg-slate-900 px-8 py-3.5 text-sm font-semibold text-white hover:bg-blue-600 disabled:opacity-60">
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>

      <div className="rounded-3xl bg-white p-6 ring-1 ring-rose-100 sm:p-8">
        <h2 className="font-display text-2xl font-semibold text-rose-600">Delete Account</h2>
        <p className="mt-2 text-sm text-slate-500">This permanently deletes your account. This cannot be undone.</p>
        {confirmDelete ? (
          <div className="mt-6 flex gap-3">
            <button onClick={handleDelete} className="rounded-full bg-rose-600 px-6 py-3 text-sm font-semibold text-white hover:bg-rose-700">
              Yes, delete my account
            </button>
            <button onClick={() => setConfirmDelete(false)} className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              Cancel
            </button>
          </div>
        ) : (
          <button onClick={() => setConfirmDelete(true)} className="mt-6 rounded-full border border-rose-300 px-6 py-3 text-sm font-semibold text-rose-600 hover:bg-rose-50">
            Delete Account
          </button>
        )}
      </div>
    </div>
  )
}

const Profile = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = searchParams.get('tab') || 'overview'
  const navigate = useNavigate()
  const { user: authUser, isAdmin, setUser, logout } = useAuth()
  const [user, setProfile] = useState(authUser)
  const [error, setError] = useState('')

  // Fetch the latest profile from the API
  useEffect(() => {
    getUserProfile(authUser._id)
      .then(setProfile)
      .catch((err) => setError(getErrorMessage(err)))
  }, [authUser._id])

  const handleSaved = (updated) => {
    setProfile(updated)
    setUser(updated)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleDeleted = () => {
    logout()
    navigate('/')
  }

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : mockUser.memberSince

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="grid gap-8 lg:grid-cols-[17rem_1fr]">
        {/* Sidebar */}
        <aside className="space-y-6">
          <div className="rounded-3xl bg-white p-6 text-center ring-1 ring-slate-100">
            <Avatar user={user} className="mx-auto h-24 w-24 ring-4 ring-blue-50" />
            <h2 className="mt-4 font-display text-xl font-semibold text-slate-900">{user.name}</h2>
            <p className="text-sm text-slate-500">{user.email}</p>
            <p className="mt-3 inline-block rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold capitalize text-amber-700">
              {user.role === 'admin' ? 'Administrator' : 'Member'}
            </p>
          </div>
          {error && <p className="rounded-2xl bg-rose-50 p-4 text-sm text-rose-700">{error}</p>}
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
            {isAdmin && (
              <Link to="/admin" className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-blue-600 hover:bg-blue-50">
                <FiGrid className="h-4 w-4" /> Admin Dashboard
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-rose-600 hover:bg-rose-50"
            >
              <FiLogOut className="h-4 w-4" /> Logout
            </button>
          </nav>
        </aside>

        {/* Content */}
        <div className="space-y-8">
          {activeTab === 'overview' && (
            <>
              <div className="rounded-3xl bg-gradient-to-br from-slate-900 to-blue-900 p-8 text-white">
                <p className="text-sm text-blue-200">Welcome back,</p>
                <h1 className="mt-1 font-display text-3xl font-semibold">{user.name.split(' ')[0]} 👋</h1>
                <p className="mt-2 text-sm text-white/70">Member since {memberSince}</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  { icon: FiPackage, label: 'Total Orders', value: orders.length, color: 'bg-blue-50 text-blue-600' },
                  { icon: FiDollarSign, label: 'Total Spent', value: '$676.99', color: 'bg-emerald-50 text-emerald-600' },
                  { icon: FiHeart, label: 'Wishlist', value: 2, color: 'bg-rose-50 text-rose-600' },
                  { icon: FiShoppingBag, label: 'In Cart', value: 3, color: 'bg-amber-50 text-amber-600' },
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
                    {mockUser.address}
                    <br />
                    {mockUser.phone}
                  </p>
                  <button className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:underline">
                    <FiEdit2 className="h-3.5 w-3.5" /> Edit
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && <SettingsForm key={user.updatedAt ? 'fetched' : 'cached'} user={user} onSaved={handleSaved} onDelete={handleDeleted} />}
        </div>
      </div>
    </div>
  )
}

export default Profile
