import { useEffect, useState } from 'react'
import { FiEye, FiTrash2, FiSearch } from 'react-icons/fi'
import { getAllOrders, updateOrderStatus, deleteOrder, getErrorMessage } from '../../api'
import Modal from '../../components/admin/Modal'
import ConfirmDialog from '../../components/admin/ConfirmDialog'
import Avatar from '../../components/Avatar'
import OrderStatus from '../../components/OrderStatus'
import OrderDetails from '../../components/OrderDetails'
import { inputClass, formatDate } from '../../components/admin/styles'
import { ORDER_STATUSES, orderNumber, itemCount } from '../../orders'

// The customer may have deleted their account since ordering
const customerName = (order) => order.user?.name || `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`
const customerEmail = (order) => order.user?.email || order.shippingAddress.email

const StatusSelect = ({ order, onChange, disabled }) => (
  <select
    value={order.status}
    onChange={(e) => onChange(order, e.target.value)}
    disabled={disabled}
    aria-label={`Status for order ${orderNumber(order)}`}
    className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 outline-none focus:border-blue-500 disabled:opacity-60"
  >
    {ORDER_STATUSES.map((s) => (
      <option key={s} value={s}>{s}</option>
    ))}
  </select>
)

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [viewing, setViewing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [busy, setBusy] = useState(false)
  // Id of the order whose status is being saved
  const [updatingId, setUpdatingId] = useState(null)

  useEffect(() => {
    getAllOrders()
      .then(setOrders)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [])

  const visible = orders.filter(
    (o) =>
      (!status || o.status === status) &&
      (!search || `${orderNumber(o)} ${customerName(o)} ${customerEmail(o)}`.toLowerCase().includes(search.toLowerCase()))
  )

  const revenue = orders.filter((o) => o.status !== 'Cancelled').reduce((sum, o) => sum + o.totalPrice, 0)
  const countBy = (s) => orders.filter((o) => o.status === s).length

  const handleStatus = async (order, nextStatus) => {
    setUpdatingId(order._id)
    setError('')
    try {
      const updated = await updateOrderStatus(order._id, nextStatus)
      setOrders((current) => current.map((o) => (o._id === updated._id ? updated : o)))
      if (viewing?._id === updated._id) setViewing(updated)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setUpdatingId(null)
    }
  }

  const handleDelete = async () => {
    setBusy(true)
    setError('')
    try {
      await deleteOrder(deleting._id)
      setOrders(orders.filter((o) => o._id !== deleting._id))
      setDeleting(null)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  const stats = [
    { label: 'Total Orders', value: orders.length },
    { label: 'Revenue', value: `$${revenue.toFixed(2)}` },
    { label: 'Processing', value: countBy('Processing') },
    { label: 'Shipped', value: countBy('Shipped') },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-slate-900">Orders</h1>
        <p className="mt-1 text-sm text-slate-500">Track and update customer orders</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value }) => (
          <div key={label} className="rounded-2xl bg-white p-5 ring-1 ring-slate-100">
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
          </div>
        ))}
      </div>

      {error && <p className="rounded-2xl bg-rose-50 p-4 text-sm text-rose-700">{error}</p>}

      <div className="flex flex-wrap gap-3 rounded-2xl bg-white p-4 ring-1 ring-slate-100">
        <div className="relative min-w-[14rem] flex-1">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by order #, name or email..." className={`${inputClass} pl-11`} />
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className={`${inputClass} w-auto`}>
          <option value="">All statuses</option>
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto rounded-3xl bg-white ring-1 ring-slate-100">
        <table className="w-full min-w-[52rem] text-left text-sm">
          <thead className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-6 py-4 font-semibold">Order</th>
              <th className="px-6 py-4 font-semibold">Customer</th>
              <th className="px-6 py-4 font-semibold">Date</th>
              <th className="px-6 py-4 font-semibold">Items</th>
              <th className="px-6 py-4 font-semibold">Total</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {visible.map((o) => (
              <tr key={o._id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-semibold text-slate-900">{orderNumber(o)}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {o.user && <Avatar user={o.user} />}
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-900">{customerName(o)}</p>
                      <p className="truncate text-xs text-slate-500">{customerEmail(o)}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-500">{formatDate(o.createdAt)}</td>
                <td className="px-6 py-4 text-slate-500">{itemCount(o)}</td>
                <td className="px-6 py-4 font-semibold text-slate-900">${o.totalPrice.toFixed(2)}</td>
                <td className="px-6 py-4">
                  <StatusSelect order={o} onChange={handleStatus} disabled={updatingId === o._id} />
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setViewing(o)} aria-label="View" className="rounded-full p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-600">
                      <FiEye />
                    </button>
                    <button onClick={() => setDeleting(o)} aria-label="Delete" className="rounded-full p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-600">
                      <FiTrash2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!visible.length && (
          <p className="py-12 text-center text-sm text-slate-500">{loading ? 'Loading orders...' : 'No orders found.'}</p>
        )}
      </div>

      {viewing && (
        <Modal title={`Order ${orderNumber(viewing)}`} onClose={() => setViewing(null)}>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 text-sm">
            <div>
              <p className="font-semibold text-slate-900">{customerName(viewing)}</p>
              <p className="text-slate-500">Placed {formatDate(viewing.createdAt)}</p>
            </div>
            <div className="flex items-center gap-3">
              <OrderStatus status={viewing.status} />
              <StatusSelect order={viewing} onChange={handleStatus} disabled={updatingId === viewing._id} />
            </div>
          </div>
          <OrderDetails order={viewing} />
        </Modal>
      )}

      {deleting && (
        <ConfirmDialog
          title="Delete order?"
          message={`Order ${orderNumber(deleting)} from ${customerName(deleting)} will be permanently deleted.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleting(null)}
          busy={busy}
        />
      )}
    </div>
  )
}

export default Orders
