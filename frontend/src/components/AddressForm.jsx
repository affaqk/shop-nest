import { useState } from 'react'
import { COUNTRIES } from '../addresses'
import { inputClass, primaryButton, secondaryButton } from './admin/styles'

const Field = ({ label, className = '', ...props }) => (
  <label className={`block ${className}`}>
    <span className="mb-1.5 block text-sm font-medium text-slate-700">{label}</span>
    <input className={inputClass} {...props} />
  </label>
)

const AddressForm = ({ address, onSubmit, onCancel, saving }) => {
  const [form, setForm] = useState(address)
  const getValue = (e) => setForm({ ...form, [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit(form)
      }}
      className="space-y-4"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Label" name="label" value={form.label} onChange={getValue} placeholder="Home, Work..." className="sm:col-span-2" />
        <Field label="First Name" name="firstName" required value={form.firstName} onChange={getValue} />
        <Field label="Last Name" name="lastName" required value={form.lastName} onChange={getValue} />
        <Field label="Phone" name="phone" type="tel" required value={form.phone} onChange={getValue} className="sm:col-span-2" />
        <Field label="Street Address" name="address" required value={form.address} onChange={getValue} className="sm:col-span-2" />
        <Field label="City" name="city" required value={form.city} onChange={getValue} />
        <Field label="State / Province" name="state" required value={form.state} onChange={getValue} />
        <Field label="ZIP / Postal Code" name="zip" required value={form.zip} onChange={getValue} />
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">Country</span>
          <select name="country" value={form.country} onChange={getValue} className={inputClass}>
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>{c.name}</option>
            ))}
          </select>
        </label>
      </div>
      {!address.isDefault && (
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" name="isDefault" checked={Boolean(form.isDefault)} onChange={getValue} className="h-4 w-4 accent-blue-600" />
          Make this my default address
        </label>
      )}
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className={secondaryButton}>Cancel</button>
        <button type="submit" disabled={saving} className={primaryButton}>{saving ? 'Saving...' : 'Save Address'}</button>
      </div>
    </form>
  )
}

export default AddressForm
