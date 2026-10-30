import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { FiLock } from 'react-icons/fi'
import AuthLayout, { authInputClass } from '../components/AuthLayout'
import { resetPassword, getErrorMessage } from '../api'
import { useAuth } from '../context/auth'

const ResetPassword = () => {
  const { token } = useParams()
  const navigate = useNavigate()
  const { setUser } = useAuth()
  const [form, setForm] = useState({ newPassword: '', confirmNewPassword: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const getValue = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submitForm = async (e) => {
    e.preventDefault()
    if (form.newPassword !== form.confirmNewPassword) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    setError('')
    try {
      // The backend logs the user in after a successful reset
      const user = await resetPassword(token, form)
      setUser(user)
      navigate(user.role === 'admin' ? '/admin' : '/')
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Reset password"
      subtitle="Choose a new password for your account."
      image="https://picsum.photos/seed/resetside/900/1200"
      quote="A fresh start, one strong password away."
      footer={
        <>
          Link expired?{' '}
          <Link to="/forgot-password" className="font-semibold text-blue-600 hover:underline">Request a new one</Link>
        </>
      }
    >
      <form className="space-y-5" onSubmit={submitForm}>
        {error && <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
        {[
          { name: 'newPassword', label: 'New password' },
          { name: 'confirmNewPassword', label: 'Confirm new password' },
        ].map(({ name, label }) => (
          <label key={name} className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">{label}</span>
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input name={name} type="password" required minLength={6} placeholder="••••••••" className={authInputClass} value={form[name]} onChange={getValue} />
            </div>
          </label>
        ))}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-slate-900 py-4 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:opacity-60"
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </AuthLayout>
  )
}

export default ResetPassword
