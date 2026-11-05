import { paymentLabels } from '../orders'

const money = (value) => `$${Number(value).toFixed(2)}`

const OrderDetails = ({ order }) => {
  const a = order.shippingAddress

  return (
    <div className="space-y-6 text-sm">
      <ul className="divide-y divide-slate-100 rounded-2xl ring-1 ring-slate-100">
        {order.items.map((item) => (
          <li key={item.product} className="flex items-center gap-3 p-3">
            <img src={item.image} alt={item.title} className="h-12 w-12 shrink-0 rounded-lg object-cover" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-slate-900">{item.title}</p>
              <p className="text-xs text-slate-500">
                {item.quantity} × {money(item.price)}
              </p>
            </div>
            <p className="font-semibold text-slate-900">{money(item.price * item.quantity)}</p>
          </li>
        ))}
      </ul>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Shipping to</h3>
          <p className="leading-relaxed text-slate-700">
            {a.firstName} {a.lastName}
            <br />
            {a.address}
            <br />
            {a.city}, {a.state} {a.zip}, {a.country}
            <br />
            {a.phone} · {a.email}
          </p>
        </div>
        <dl className="space-y-1.5">
          <div className="flex justify-between">
            <dt className="text-slate-500">Payment</dt>
            <dd className="font-medium text-slate-900">{paymentLabels[order.paymentMethod] || order.paymentMethod}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-500">Subtotal</dt>
            <dd className="font-medium text-slate-900">{money(order.itemsPrice)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-500">Shipping</dt>
            <dd className="font-medium text-slate-900">{order.shippingPrice ? money(order.shippingPrice) : 'Free'}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-500">Tax</dt>
            <dd className="font-medium text-slate-900">{money(order.taxPrice)}</dd>
          </div>
          <div className="flex justify-between border-t border-slate-200 pt-2 text-base">
            <dt className="font-semibold text-slate-900">Total</dt>
            <dd className="font-bold text-slate-900">{money(order.totalPrice)}</dd>
          </div>
        </dl>
      </div>
    </div>
  )
}

export default OrderDetails
