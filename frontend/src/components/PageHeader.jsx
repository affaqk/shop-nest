import { Link } from 'react-router'
import { FiChevronRight } from 'react-icons/fi'

const PageHeader = ({ title, subtitle, crumbs = [] }) => (
  <section className="border-b border-slate-200 bg-gradient-to-br from-slate-100 via-white to-blue-50">
    <div className="mx-auto max-w-7xl px-4 py-12 sm:py-16">
      <nav className="mb-4 flex flex-wrap items-center gap-1.5 text-sm text-slate-500">
        <Link to="/" className="hover:text-blue-600">Home</Link>
        {crumbs.map((crumb) => (
          <span key={crumb.label} className="flex items-center gap-1.5">
            <FiChevronRight className="h-3.5 w-3.5" />
            {crumb.to ? (
              <Link to={crumb.to} className="hover:text-blue-600">{crumb.label}</Link>
            ) : (
              <span className="text-slate-800">{crumb.label}</span>
            )}
          </span>
        ))}
      </nav>
      <h1 className="font-display text-4xl font-semibold text-slate-900 sm:text-5xl">{title}</h1>
      {subtitle && <p className="mt-3 max-w-2xl text-slate-500">{subtitle}</p>}
    </div>
  </section>
)

export default PageHeader
