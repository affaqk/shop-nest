import { Link } from 'react-router'
import { FiArrowLeft } from 'react-icons/fi'

const NotFound = () => (
  <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-28 text-center">
    <p className="font-display text-8xl font-semibold text-blue-600">404</p>
    <h1 className="mt-4 font-display text-4xl font-semibold text-slate-900">Page not found</h1>
    <p className="mt-3 text-slate-500">Sorry, the page you are looking for doesn&apos;t exist or has been moved.</p>
    <Link
      to="/"
      className="mt-8 inline-flex items-center gap-2 rounded-full bg-slate-900 px-7 py-3.5 text-sm font-semibold text-white hover:bg-blue-600"
    >
      <FiArrowLeft /> Back to Home
    </Link>
  </div>
)

export default NotFound
