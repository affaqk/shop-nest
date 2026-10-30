import { useEffect, useState } from 'react'
import { FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi'
import { getAllUsers, updateUser, deleteUser, getErrorMessage } from '../../api'
import { useAuth } from '../../context/auth'
import Modal from '../../components/admin/Modal'
import ConfirmDialog from '../../components/admin/ConfirmDialog'
import Avatar from '../../components/Avatar'
import { inputClass, primaryButton, secondaryButton, formatDate } from '../../components/admin/styles'

const UserForm = ({ user, onSubmit, onCancel, saving }) => {
  const [form, setForm] = useState({ name: user.name, email: user.email, profile: user.profile, role: user.role })
  const getValue = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit(form)
      }}
      className="space-y-4"
    >
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-slate-700">Name</span>
        <input name="name" required value={form.name} onChange={getValue} className={inputClass} />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-slate-700">Email</span>
        <input name="email" type="email" required value={form.email} onChange={getValue} className={inputClass} />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-slate-700">Profile Image URL</span>
        <input name="profile" required value={form.profile} onChange={getValue} className={inputClass} />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-slate-700">Role</span>
        <select name="role" value={form.role} onChange={getValue} className={inputClass}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </label>
      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className={secondaryButton}>Cancel</button>
        <button type="submit" disabled={saving} className={primaryButton}>{saving ? 'Saving...' : 'Save Changes'}</button>
      </div>
    </form>
  )
}

const Users = () => {
  const { user: currentUser, setUser } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [role, setRole] = useState('')
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    getAllUsers()
      .then(setUsers)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [])

  const visible = users.filter(
    (u) =>
      (!role || u.role === role) &&
      (!search || `${u.name} ${u.email}`.toLowerCase().includes(search.toLowerCase()))
  )

  const handleSave = async (data) => {
    setBusy(true)
    setError('')
    try {
      const updated = await updateUser(editing._id, data)
      setUsers(users.map((u) => (u._id === updated._id ? updated : u)))
      // Keep the signed-in admin's own details in sync
      if (updated._id === currentUser._id) setUser(updated)
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
      await deleteUser(deleting._id)
      setUsers(users.filter((u) => u._id !== deleting._id))
      setDeleting(null)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-slate-900">Users</h1>
        <p className="mt-1 text-sm text-slate-500">
          {users.length} registered users · {users.filter((u) => u.role === 'admin').length} admins
        </p>
      </div>

      {error && <p className="rounded-2xl bg-rose-50 p-4 text-sm text-rose-700">{error}</p>}

      <div className="flex flex-wrap gap-3 rounded-2xl bg-white p-4 ring-1 ring-slate-100">
        <div className="relative min-w-[14rem] flex-1">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or email..." className={`${inputClass} pl-11`} />
        </div>
        <select value={role} onChange={(e) => setRole(e.target.value)} className={`${inputClass} w-auto`}>
          <option value="">All roles</option>
          <option value="user">Users</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-3xl bg-white ring-1 ring-slate-100">
        <table className="w-full min-w-[40rem] text-left text-sm">
          <thead className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-6 py-4 font-semibold">User</th>
              <th className="px-6 py-4 font-semibold">Role</th>
              <th className="px-6 py-4 font-semibold">Joined</th>
              <th className="px-6 py-4 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {visible.map((u) => (
              <tr key={u._id} className="hover:bg-slate-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar user={u} />
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-900">
                        {u.name} {u._id === currentUser._id && <span className="text-xs font-normal text-slate-400">(you)</span>}
                      </p>
                      <p className="truncate text-xs text-slate-500">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                      u.role === 'admin' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-500">{formatDate(u.createdAt)}</td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setEditing(u)} aria-label="Edit" className="rounded-full p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-600">
                      <FiEdit2 />
                    </button>
                    {u._id !== currentUser._id && (
                      <button onClick={() => setDeleting(u)} aria-label="Delete" className="rounded-full p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-600">
                        <FiTrash2 />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!visible.length && (
          <p className="py-12 text-center text-sm text-slate-500">{loading ? 'Loading users...' : 'No users found.'}</p>
        )}
      </div>

      {editing && (
        <Modal title="Edit User" onClose={() => setEditing(null)}>
          <UserForm user={editing} onSubmit={handleSave} onCancel={() => setEditing(null)} saving={busy} />
        </Modal>
      )}

      {deleting && (
        <ConfirmDialog
          title="Delete user?"
          message={`${deleting.name} (${deleting.email}) will be permanently deleted.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleting(null)}
          busy={busy}
        />
      )}
    </div>
  )
}

export default Users
