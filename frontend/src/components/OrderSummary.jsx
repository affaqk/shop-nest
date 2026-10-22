import { useShop } from '../context/ShopContext'

const OrderSummary = ({ children }) => {
  const { subtotal, discount, coupon, shipping, tax, total } = useShop()

  return (
    <div className="rounded-3xl bg-white p-6 ring-1 ring-slate-100 sm:p-8">
      <h2 className="font-display text-2xl font-semibold text-slate-900">Order Summary</h2>
      <dl className="mt-6 space-y-3 text-sm">
        <div className="flex justify-between">
          <dt className="text-slate-500">Subtotal</dt>
          <dd className="font-medium text-slate-900">${subtotal.toFixed(2)}</dd>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-emerald-600">
            <dt>Discount ({coupon.code})</dt>
            <dd className="font-medium">-${discount.toFixed(2)}</dd>
          </div>
        )}
        <div className="flex justify-between">
          <dt className="text-slate-500">Shipping</dt>
          <dd className="font-medium text-slate-900">{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-slate-500">Estimated Tax</dt>
          <dd className="font-medium text-slate-900">${tax.toFixed(2)}</dd>
        </div>
        <div className="flex justify-between border-t border-slate-200 pt-4 text-base">
          <dt className="font-semibold text-slate-900">Total</dt>
          <dd className="font-bold text-slate-900">${total.toFixed(2)}</dd>
        </div>
      </dl>
      {children}
    </div>
  )
}

export default OrderSummary
