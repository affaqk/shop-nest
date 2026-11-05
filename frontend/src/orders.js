// Keep in sync with ORDER_STATUSES in backend/models/orderModel.js
export const ORDER_STATUSES = ['Processing', 'Shipped', 'Delivered', 'Cancelled']

export const statusStyles = {
  Delivered: 'bg-emerald-50 text-emerald-700',
  Shipped: 'bg-blue-50 text-blue-700',
  Processing: 'bg-amber-50 text-amber-700',
  Cancelled: 'bg-rose-50 text-rose-700',
}

export const paymentLabels = { card: 'Card', paypal: 'PayPal', cod: 'Cash on Delivery' }

// Short, readable order number from the Mongo id, e.g. #A1B2C3D4
export const orderNumber = (order) => `#${order._id.slice(-8).toUpperCase()}`

export const itemCount = (order) => order.items.reduce((sum, item) => sum + item.quantity, 0)
