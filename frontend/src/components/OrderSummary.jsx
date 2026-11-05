const money = (value) => `$${value.toFixed(2)}`

const OrderSummary = ({ totals, children }) => {
  return (
    <div className="rounded-3xl bg-white p-6 ring-1 ring-slate-100 sm:p-8">
      <h2 className="font-display text-2xl font-semibold text-slate-900">Order Summary</h2>
      <dl className="mt-6 space-y-3 text-sm">
        <div className="flex justify-between">
          <dt className="text-slate-500">Subtotal</dt>
          <dd className="font-medium text-slate-900">{money(totals.itemsPrice)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-slate-500">Shipping</dt>
          <dd className="font-medium text-slate-900">{totals.shippingPrice ? money(totals.shippingPrice) : 'Free'}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-slate-500">Estimated Tax</dt>
          <dd className="font-medium text-slate-900">{money(totals.taxPrice)}</dd>
        </div>
        <div className="flex justify-between border-t border-slate-200 pt-4 text-base">
          <dt className="font-semibold text-slate-900">Total</dt>
          <dd className="font-bold text-slate-900">{money(totals.totalPrice)}</dd>
        </div>
      </dl>
      {children}
    </div>
  )
}

export default OrderSummary
