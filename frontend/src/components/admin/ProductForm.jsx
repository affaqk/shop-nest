import { useState } from 'react'
import { inputClass, primaryButton, secondaryButton } from './styles'

const emptyProduct = { title: '', description: '', price: '', category: '', image: '' }

const ProductForm = ({ product, categories = [], onSubmit, onCancel, saving }) => {
  const [form, setForm] = useState(() =>
    product
      ? { title: product.title, description: product.description, price: product.price, category: product.category, image: product.image }
      : emptyProduct
  )

  const getValue = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({ ...form, price: Number(form.price) })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-slate-700">Title</span>
        <input name="title" required value={form.title} onChange={getValue} className={inputClass} />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-slate-700">Description</span>
        <textarea name="description" required rows={3} value={form.description} onChange={getValue} className={inputClass} />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">Price ($)</span>
          <input name="price" type="number" min="0" step="0.01" required value={form.price} onChange={getValue} className={inputClass} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">Category</span>
          <input name="category" list="product-categories" required value={form.category} onChange={getValue} className={inputClass} />
          <datalist id="product-categories">
            {categories.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </label>
      </div>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-slate-700">Image URL</span>
        <input name="image" type="url" required value={form.image} onChange={getValue} placeholder="https://..." className={inputClass} />
      </label>
      {form.image && <img src={form.image} alt="Preview" className="h-32 w-32 rounded-2xl object-cover ring-1 ring-slate-200" />}
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className={secondaryButton}>Cancel</button>
        <button type="submit" disabled={saving} className={primaryButton}>
          {saving ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
        </button>
      </div>
    </form>
  )
}

export default ProductForm
