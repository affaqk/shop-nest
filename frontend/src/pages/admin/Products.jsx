import { useEffect, useState } from 'react'
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi'
import { getAllProducts, createProduct, updateProduct, deleteProduct, getErrorMessage } from '../../api'
import Modal from '../../components/admin/Modal'
import ConfirmDialog from '../../components/admin/ConfirmDialog'
import ProductForm from '../../components/admin/ProductForm'
import { inputClass, primaryButton, formatDate } from '../../components/admin/styles'

const Products = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  // editing: null = closed, {} = new product, product object = edit
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    getAllProducts()
      .then(setProducts)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [])

  const categories = [...new Set(products.map((p) => p.category))].sort()

  const visible = products.filter(
    (p) =>
      (!category || p.category === category) &&
      (!search || p.title.toLowerCase().includes(search.toLowerCase()))
  )

  const handleSave = async (data) => {
    setBusy(true)
    setError('')
    try {
      if (editing._id) {
        const updated = await updateProduct(editing._id, data)
        setProducts(products.map((p) => (p._id === updated._id ? updated : p)))
      } else {
        const created = await createProduct(data)
        setProducts([created, ...products])
      }
      setEditing(null)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  const handleDelete = async () => {
    setBusy(true)
    setError('')
    try {
      await deleteProduct(deleting._id)
      setProducts(products.filter((p) => p._id !== deleting._id))
      setDeleting(null)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-slate-900">Products</h1>
          <p className="mt-1 text-sm text-slate-500">{products.length} products in your store</p>
        </div>
        <button onClick={() => setEditing({})} className={`flex items-center gap-2 ${primaryButton}`}>
          <FiPlus /> Add Product
        </button>
      </div>

      {error && <p className="rounded-2xl bg-rose-50 p-4 text-sm text-rose-700">{error}</p>}

      <div className="flex flex-wrap gap-3 rounded-2xl bg-white p-4 ring-1 ring-slate-100">
        <div className="relative min-w-[14rem] flex-1">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." className={`${inputClass} pl-11`} />
        </div>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className={`${inputClass} w-auto capitalize`}>
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto rounded-3xl bg-white ring-1 ring-slate-100">
        <table className="w-full min-w-[44rem] text-left text-sm">
          <thead className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-6 py-4 font-semibold">Product</th>
              <th className="px-6 py-4 font-semibold">Category</th>
              <th className="px-6 py-4 font-semibold">Price</th>
              <th className="px-6 py-4 font-semibold">Created</th>
              <th className="px-6 py-4 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {visible.map((p) => (
              <tr key={p._id} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img src={p.image} alt={p.title} className="h-12 w-12 shrink-0 rounded-xl object-cover" />
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-900">{p.title}</p>
                      <p className="line-clamp-1 max-w-xs text-xs text-slate-500">{p.description}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium capitalize text-slate-700">{p.category}</span>
                </td>
                <td className="px-6 py-4 font-semibold text-slate-900">${Number(p.price).toFixed(2)}</td>
                <td className="px-6 py-4 text-slate-500">{formatDate(p.createdAt)}</td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setEditing(p)} aria-label="Edit" className="rounded-full p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-600">
                      <FiEdit2 />
                    </button>
                    <button onClick={() => setDeleting(p)} aria-label="Delete" className="rounded-full p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-600">
                      <FiTrash2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!visible.length && (
          <p className="py-12 text-center text-sm text-slate-500">{loading ? 'Loading products...' : 'No products found.'}</p>
        )}
      </div>

      {editing && (
        <Modal title={editing._id ? 'Edit Product' : 'Add Product'} onClose={() => setEditing(null)}>
          <ProductForm
            product={editing._id ? editing : null}
            categories={categories}
            onSubmit={handleSave}
            onCancel={() => setEditing(null)}
            saving={busy}
          />
        </Modal>
      )}

      {deleting && (
        <ConfirmDialog
          title="Delete product?"
          message={`"${deleting.title}" will be permanently removed from your store.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleting(null)}
          busy={busy}
        />
      )}
    </div>
  )
}

export default Products
