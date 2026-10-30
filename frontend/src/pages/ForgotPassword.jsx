import { useState } from 'react'
import { Link } from 'react-router'
import { FiMail } from 'react-icons/fi'
import AuthLayout, { authInputClass } from '../components/AuthLayout'
import { requestPasswordReset, getErrorMessage } from '../api'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submitForm = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')
    try {
      const data = await requestPasswordReset(email)
      setMessage(data.message)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Forgot password"
      subtitle="Enter your email and we'll send you a link to reset your password."
      image="https://picsum.photos/seed/forgotside/900/1200"
      quote="Locked out? It happens to the best of us."
      footer={
        <>
          Remembered it?{' '}
          <Link to="/login" className="font-semibold text-blue-600 hover:underline">Back to sign in</Link>
        </>
      }
    >
      <form className="space-y-5" onSubmit={submitForm}>
        {message && <p className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">{message}</p>}
        {error && <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">Email address</span>
          <div className="relative">
            <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="email" required placeholder="you@example.com" className={authInputClass} value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
        </label>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-slate-900 py-4 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:opacity-60"
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>
    </AuthLayout>
  )
}

export default ForgotPassword
