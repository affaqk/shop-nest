import { Link } from 'react-router'
import { FaGoogle, FaFacebookF, FaApple } from 'react-icons/fa6'

export const authInputClass =
  'w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100'

const AuthLayout = ({ title, subtitle, image, quote, children, footer }) => (
  <div className="mx-auto grid min-h-[calc(100vh-12rem)] max-w-7xl gap-0 px-4 py-12 lg:grid-cols-2">
    <div className="relative hidden overflow-hidden rounded-l-3xl lg:block">
      <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-blue-900/30" />
      <div className="relative flex h-full flex-col justify-between p-12 text-white">
        <Link to="/" className="font-display text-3xl font-bold">
          Shop<span className="text-blue-400">Nest</span>
        </Link>
        <div>
          <p className="font-display text-3xl font-medium leading-snug">“{quote}”</p>
          <p className="mt-4 text-sm text-white/70">— Join 50,000+ happy shoppers</p>
        </div>
      </div>
    </div>

    <div className="flex items-center justify-center rounded-3xl bg-white p-8 ring-1 ring-slate-100 sm:p-12 lg:rounded-l-none">
      <div className="w-full max-w-md">
        <h1 className="font-display text-4xl font-semibold text-slate-900">{title}</h1>
        <p className="mt-2 text-slate-500">{subtitle}</p>

        <div className="mt-8 grid grid-cols-3 gap-3">
          {[
            { icon: FaGoogle, label: 'Google' },
            { icon: FaFacebookF, label: 'Facebook' },
            { icon: FaApple, label: 'Apple' },
          ].map(({ icon: Icon, label }) => (
            <button
              key={label}
              type="button"
              aria-label={`Continue with ${label}`}
              className="flex items-center justify-center rounded-xl border border-slate-300 py-3 text-slate-700 transition hover:border-slate-900 hover:bg-slate-50"
            >
              <Icon className="h-5 w-5" />
            </button>
          ))}
        </div>

        <div className="my-8 flex items-center gap-4 text-xs uppercase tracking-wider text-slate-400">
          <span className="h-px flex-1 bg-slate-200" /> or continue with email <span className="h-px flex-1 bg-slate-200" />
        </div>

        {children}

        <p className="mt-8 text-center text-sm text-slate-500">{footer}</p>
      </div>
    </div>
  </div>
)

export default AuthLayout
