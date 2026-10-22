// API service layer.
// Every page gets its data through these functions, so when your backend is ready
// you only need to change this file. Each function currently resolves mock data
// after a short delay to simulate a network request.
//
// Example of a real implementation:
//   export const getProducts = async (params) => {
//     const res = await fetch(`${BASE_URL}/products?${new URLSearchParams(params)}`)
//     if (!res.ok) throw new Error('Failed to fetch products')
//     return res.json()
//   }

import { categories, products, testimonials, user, orders } from '../data/mockData'

export const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const delay = (data, ms = 400) => new Promise((resolve) => setTimeout(() => resolve(data), ms))

// Products
export const getProducts = ({ category, search, sort, minPrice, maxPrice } = {}) => {
  let result = [...products]

  if (category) result = result.filter((p) => p.category === category)
  if (search) {
    const q = search.toLowerCase()
    result = result.filter((p) => p.name.toLowerCase().includes(q))
  }
  if (minPrice != null) result = result.filter((p) => p.price >= minPrice)
  if (maxPrice != null) result = result.filter((p) => p.price <= maxPrice)

  if (sort === 'price-asc') result.sort((a, b) => a.price - b.price)
  if (sort === 'price-desc') result.sort((a, b) => b.price - a.price)
  if (sort === 'rating') result.sort((a, b) => b.rating - a.rating)
  if (sort === 'newest') result.sort((a, b) => b.id - a.id)

  return delay(result)
}

export const getProductById = (id) => {
  const product = products.find((p) => p.id === Number(id))
  return product ? delay(product) : Promise.reject(new Error('Product not found'))
}

export const getRelatedProducts = (product, limit = 4) =>
  delay(products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, limit))

export const getFeaturedProducts = () => delay(products.slice(0, 8))

export const getCategories = () => delay(categories)

export const getTestimonials = () => delay(testimonials)

// Auth
export const login = ({ email }) => delay({ token: 'mock-token', user: { ...user, email } })

export const register = ({ name, email }) => delay({ token: 'mock-token', user: { ...user, name, email } })

// User
export const getProfile = () => delay(user)

export const getOrders = () => delay(orders)

// Orders / checkout
export const placeOrder = (order) => delay({ id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`, ...order }, 800)

// Misc
export const subscribeNewsletter = (email) => delay({ success: true, email })

export const sendContactMessage = (message) => delay({ success: true, ...message })
