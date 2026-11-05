import { statusStyles } from '../orders'

const OrderStatus = ({ status }) => (
  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[status] || 'bg-slate-100 text-slate-700'}`}>{status}</span>
)

export default OrderStatus
