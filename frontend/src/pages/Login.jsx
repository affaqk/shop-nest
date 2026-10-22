import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'
import AuthLayout, { authInputClass } from '../components/AuthLayout'
import { login } from '../services/api'

const Login = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    const { token } = await login(Object.fromEntries(new FormData(e.target)))
    localStorage.setItem('token', token)
    navigate('/profile')
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your account to continue shopping."
      image="https://picsum.photos/seed/loginside/900/1200"
      quote="The best shopping experience I've had online. Fast, simple and beautiful."
      footer={
        <>
          Don&apos;t have an account?{' '}
          <Link to="/register" className="font-semibold text-blue-600 hover:underline">Create one</Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">Email address</span>
          <div className="relative">
            <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input name="email" type="email" required placeholder="you@example.com" className={authInputClass} />
          </div>
        </label>
        <label className="block">
          <span className="mb-1.5 flex justify-between text-sm font-medium text-slate-700">
            Password
            <a href="#" className="font-medium text-blue-600 hover:underline">Forgot password?</a>
          </span>
          <div className="relative">
            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="••••••••"
              className={authInputClass}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input type="checkbox" name="remember" className="h-4 w-4 rounded accent-blue-600" /> Remember me
        </label>
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-slate-900 py-4 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:opacity-70"
        >
          {submitting ? 'Signing in…' : 'Sign In'}
        </button>
      </form>
    </AuthLayout>
  )
}

export default Login
