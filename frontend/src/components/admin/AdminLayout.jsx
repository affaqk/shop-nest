import { useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router'
import { FiGrid, FiBox, FiUsers, FiLogOut, FiMenu, FiX, FiExternalLink } from 'react-icons/fi'
import { useAuth } from '../../context/auth'
import Avatar from '../Avatar'

const links = [
  { to: '/admin', label: 'Dashboard', icon: FiGrid, end: true },
  { to: '/admin/products', label: 'Products', icon: FiBox },
  { to: '/admin/users', label: 'Users', icon: FiUsers },
]

const AdminLayout = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)

  // Close the mobile sidebar when the route changes
  const [prevPath, setPrevPath] = useState(location.pathname)
  if (location.pathname !== prevPath) {
    setPrevPath(location.pathname)
    setOpen(false)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const sidebar = (
    <div className="flex h-full flex-col bg-slate-900 text-slate-300">
      <Link to="/admin" className="px-6 py-6 font-display text-2xl font-bold text-white">
        Shop<span className="text-blue-400">Nest</span>
        <span className="ml-2 align-middle font-sans text-xs font-semibold uppercase tracking-wider text-slate-400">Admin</span>
      </Link>
      <nav className="flex-1 space-y-1 px-3">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                isActive ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <Icon className="h-4 w-4" /> {label}
          </NavLink>
        ))}
        <Link to="/" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium hover:bg-slate-800 hover:text-white">
          <FiExternalLink className="h-4 w-4" /> View Store
        </Link>
      </nav>
      <div className="border-t border-slate-800 p-4">
        <div className="flex items-center gap-3">
          <Avatar user={user} className="h-10 w-10" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">{user?.name}</p>
            <p className="truncate text-xs text-slate-400">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 py-2.5 text-sm font-medium hover:bg-rose-600 hover:text-white"
        >
          <FiLogOut className="h-4 w-4" /> Logout
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 lg:block">{sidebar}</aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/50" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-64">{sidebar}</div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-4 lg:hidden">
          <button onClick={() => setOpen(!open)} className="rounded-md p-2 hover:bg-slate-100" aria-label="Toggle menu">
            {open ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
          </button>
          <span className="font-display text-xl font-bold">Admin Panel</span>
        </header>
        <main className="flex-1 p-4 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
