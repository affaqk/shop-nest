import axios from 'axios'

// Single axios instance so every request sends the auth cookie
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: true,
})

// Pull a readable message out of an axios error
export const getErrorMessage = (error) =>
  error.response?.data?.message || error.response?.data?.error?.message || error.message || 'Something went wrong'

// ---------- Products ----------
export const getAllProducts = () => api.get('/product/get-all-products').then((res) => res.data.products || [])
export const getProduct = (id) => api.get(`/product/product-detail/${id}`).then((res) => res.data.product)
export const createProduct = (data) => api.post('/product/create-product', data).then((res) => res.data.product)
export const updateProduct = (id, data) => api.put(`/product/update-product/${id}`, data).then((res) => res.data.product)
export const deleteProduct = (id) => api.delete(`/product/delete-product/${id}`)

// ---------- Users ----------
export const registerUser = (data) => api.post('/user/register', data).then((res) => res.data.user)
export const loginUser = (data) => api.post('/user/login', data).then((res) => res.data.user)
export const getAllUsers = () => api.get('/user/all').then((res) => res.data.users || [])
export const getUserProfile = (id) => api.get(`/user/profile/${id}`).then((res) => res.data.user)
export const updateUser = (id, data) => api.put(`/user/update/${id}`, data).then((res) => res.data.user)
export const deleteUser = (id) => api.delete(`/user/delete/${id}`)
export const requestPasswordReset = (email) => api.post('/user/reset-password-request', { email }).then((res) => res.data)
export const resetPassword = (token, data) => api.post(`/user/reset-password/${token}`, data).then((res) => res.data.user)

export default api
