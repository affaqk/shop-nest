import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiImage } from 'react-icons/fi'
import AuthLayout, { authInputClass } from '../components/AuthLayout'
import { useAuth } from '../context/auth'
import { getErrorMessage } from '../api'

const Register = () => {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [user, setUser] = useState({
    name : "",
    email : "",
    password : "",
    profile : ""
  })

  const getValue = (e) => {
    setUser({
      ...user,
      [e.target.name] : e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    setError("")
    try {
      await register(user)
      navigate("/")
    } catch (error) {
      setError(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }
  return (
    <AuthLayout
      title="Create account"
      subtitle="Join ShopNest and enjoy exclusive member benefits."
      image="https://picsum.photos/seed/registerside/900/1200"
      quote="Members get early access to sales, free shipping and personalised picks."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-blue-600 hover:underline">Sign in</Link>
        </>
      }
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        {error && <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">Full name</span>
          <div className="relative">
            <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input name="name" required placeholder="Jane Doe" className={authInputClass} value = {user.name} onChange = {getValue} />
          </div>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-slate-700">Email address</span>
          <div className="relative">
            <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input name="email" type="email" required placeholder="you@example.com" className={authInputClass} value = {user.email} onChange = {getValue}/>
          </div>
        </label>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">Password</span>
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                value = {user.password} onChange = {getValue}
                placeholder="Min. 8 characters"
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
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">Profile image URL</span>
            <div className="relative">
              <FiImage className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                name="profile"
                type="url"
                required
                placeholder="https://..."
                className={authInputClass}
                value = {user.profile} onChange = {getValue}
              />
            </div>
          </label>
        </div>
        <label className="flex items-start gap-2 text-sm text-slate-600">
          <input type="checkbox" required className="mt-0.5 h-4 w-4 rounded accent-blue-600" />
          <span>
            I agree to the <a href="#" className="font-medium text-blue-600 hover:underline">Terms of Service</a> and{' '}
            <a href="#" className="font-medium text-blue-600 hover:underline">Privacy Policy</a>
          </span>
        </label>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-slate-900 py-4 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:opacity-60"
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>
    </AuthLayout>
  )
}

export default Register
