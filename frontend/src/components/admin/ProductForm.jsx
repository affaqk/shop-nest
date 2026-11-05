import { useEffect, useState } from 'react'
import { FiUploadCloud } from 'react-icons/fi'
import { inputClass, primaryButton, secondaryButton } from './styles'

const emptyProduct = { title: '', description: '', price: '', category: '' }
const MAX_SIZE = 5 * 1024 * 1024

const ProductForm = ({ product, categories = [], onSubmit, onCancel, saving }) => {
  const [form, setForm] = useState(() =>
    product
      ? { title: product.title, description: product.description, price: product.price, category: product.category }
      : emptyProduct
  )
  const [file, setFile] = useState(null)
  const [fileError, setFileError] = useState('')
  const [preview, setPreview] = useState(product?.image || '')

  // Free the local preview of a picked file once it is replaced or the form closes
  useEffect(() => () => {
    if (preview.startsWith('blob:')) URL.revokeObjectURL(preview)
  }, [preview])

  const getValue = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleFile = (e) => {
    const picked = e.target.files[0]
    if (!picked) return
    if (picked.size > MAX_SIZE) {
      setFileError('Image must be 5MB or smaller')
      e.target.value = ''
      return
    }
    setFileError('')
    setFile(picked)
    setPreview(URL.createObjectURL(picked))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!product && !file) {
      setFileError('Please choose a product image')
      return
    }
    const data = new FormData()
    Object.entries(form).forEach(([key, value]) => data.append(key, value))
    // When editing, leaving the image alone keeps the current one
    if (file) data.append('image', file)
    onSubmit(data)
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
      <div>
        <span className="mb-1.5 block text-sm font-medium text-slate-700">Product Image</span>
        <label className="flex cursor-pointer items-center gap-4 rounded-2xl border-2 border-dashed border-slate-300 p-4 transition hover:border-blue-500 hover:bg-blue-50/40">
          {preview ? (
            <img src={preview} alt="Preview" className="h-24 w-24 shrink-0 rounded-xl object-cover ring-1 ring-slate-200" />
          ) : (
            <span className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
              <FiUploadCloud className="h-8 w-8" />
            </span>
          )}
          <span className="min-w-0 text-sm">
            <span className="block font-semibold text-blue-600">{preview ? 'Change image' : 'Upload an image'}</span>
            <span className="block truncate text-slate-500">{file ? file.name : 'JPG, PNG, WEBP or GIF, up to 5MB'}</span>
          </span>
          <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleFile} className="sr-only" />
        </label>
        {fileError && <p className="mt-1.5 text-sm text-rose-600">{fileError}</p>}
      </div>
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
